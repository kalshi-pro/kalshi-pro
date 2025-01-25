import { decryptWithPrivateKey, signPss } from '@/lib/crytpo';
import { OrdersResponse } from '@/types/KalshiAPI';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const GetFillsRouteConstants = {
  method: 'GET',
  baseUrl: 'https://api.elections.kalshi.com',
  path: '/trade-api/v2/portfolio/fills',
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
    const lastFillsFetchedAt = publicMetadata.last_fills_fetched_at as string | undefined | null;

    const msgString = timestampStr + GetFillsRouteConstants.method + GetFillsRouteConstants.path;

    const signature = signPss(privateKey, msgString);

    if (!signature) {
      throw new Error('Failed to sign the message');
    }
    const headers = new Headers();
    headers.set('KALSHI-ACCESS-KEY', accessKey);
    headers.set('KALSHI-ACCESS-SIGNATURE', signature);
    headers.set('KALSHI-ACCESS-TIMESTAMP', timestampStr);
    headers.set('Content-Type', 'application/json');

    // build query params
    const queryParams = new URLSearchParams();
    if (!!lastFillsFetchedAt) {
      queryParams.append('min_ts', lastFillsFetchedAt);
    }
    const cursor = '';
    const latestTimestamp = '';
    const contents = [];

    // do {
    const response = await fetch(
      GetFillsRouteConstants.baseUrl +
        GetFillsRouteConstants.path +
        (!!lastFillsFetchedAt ? '?' + queryParams.toString() : ''),
      {
        method: GetFillsRouteConstants.method,
        headers,
      },
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const json = await response.json();
    // cursor = json.cursor;
    contents.push(...json.fills);
    // } while (cursor !== '');
    // contents.sort(
    //   (a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime(),
    // );
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
