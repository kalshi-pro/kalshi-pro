import { decryptWithPrivateKey, signPss } from '@/lib/crytpo';
import { SettlementsResponse } from '@/types/KalshiAPI';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export const GetSettlementsRouteConstants = {
  method: 'GET',
  baseUrl: 'https://api.elections.kalshi.com',
  path: '/trade-api/v2/portfolio/settlements',
};

export async function POST(request: Request) {
  const { accessKey, encryptedPrivateKey } = await request.json();
  if (!accessKey || !encryptedPrivateKey) {
    return NextResponse.json({ error: 'Missing access key or private key' }, { status: 400 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const privateKey = decryptWithPrivateKey(encryptedPrivateKey);
    if (!privateKey) {
      throw new Error('Failed to decrypt the private key');
    }
    const currentTime = new Date();
    const currentTimeMilliseconds = currentTime.getTime();
    const timestampStr = currentTimeMilliseconds.toString();
    const user = await client.users.getUser(userId);
    const publicMetadata = user.publicMetadata;
    const lastSettlementsFetchedAt = publicMetadata.last_settlements_fetched_at as
      | string
      | undefined
      | null;

    const msgString =
      timestampStr + GetSettlementsRouteConstants.method + GetSettlementsRouteConstants.path;

    const signature = signPss(privateKey, msgString);

    if (!signature) {
      throw new Error('Failed to sign the message');
    }
    const headers = new Headers();
    headers.set('KALSHI-ACCESS-KEY', accessKey);
    headers.set('KALSHI-ACCESS-SIGNATURE', signature);
    headers.set('KALSHI-ACCESS-TIMESTAMP', timestampStr);
    headers.set('Content-Type', 'application/json');

    let cursor = '';
    let latestTimestamp = '';
    const contents = [];

    const queryParams = new URLSearchParams();
    if (!!lastSettlementsFetchedAt) {
      queryParams.append(
        'min_ts',
        Math.floor(new Date(lastSettlementsFetchedAt).getTime() / 1000) + '',
      );
    }

    do {
      if (!!cursor) {
        queryParams.append('cursor', cursor);
      }

      const response = await fetch(
        GetSettlementsRouteConstants.baseUrl +
          GetSettlementsRouteConstants.path +
          (!!lastSettlementsFetchedAt || !!cursor ? '?' + queryParams.toString() : ''),
        {
          method: GetSettlementsRouteConstants.method,
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const json = (await response.json()) as SettlementsResponse;
      cursor = json.cursor;
      contents.push(...json.settlements);
    } while (cursor !== '');

    contents.sort(
      (a, b) => new Date(b.settled_time).getTime() - new Date(a.settled_time).getTime(),
    );
    latestTimestamp = contents[0].settled_time;

    const supabase = await createClient();

    const { error } = await supabase.from('settlements').upsert(
      contents.map((settlement) => ({
        ...settlement,
        user_id: userId,
        key: `${userId}_${settlement.settled_time}_${settlement.ticker}`,
      })),
    );
    if (error) {
      throw new Error('Failed to upsert settlements into the database:' + error.message);
    }

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        last_settlements_fetched_at: latestTimestamp,
      },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
