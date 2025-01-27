import { decryptWithPrivateKey, signPss } from '../crytpo';
import { createClient } from '@/utils/supabase/server';
import { SettlementsResponse } from '@/types/KalshiAPI';

export const GetSettlementsRouteConstants = {
  method: 'GET',
  baseUrl: 'https://api.elections.kalshi.com',
  path: '/trade-api/v2/portfolio/settlements',
};
export const fetchNewSettlements = async (
  accessKey: string,
  encryptedPrivateKey: string,
  userId: string,
  lastTradesFetchedAt?: string,
) => {
  try {
    const privateKey = decryptWithPrivateKey(encryptedPrivateKey);
    if (!privateKey) {
      throw new Error('Failed to decrypt the private key');
    }
    const currentTime = new Date();
    const currentTimeMilliseconds = currentTime.getTime();
    const timestampStr = currentTimeMilliseconds.toString();

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
    const contents = [];

    const queryParams = new URLSearchParams();
    if (!!lastTradesFetchedAt) {
      queryParams.append('min_ts', Math.floor(new Date(lastTradesFetchedAt).getTime() / 1000) + '');
    }

    do {
      if (!!cursor) {
        queryParams.append('cursor', cursor);
      }

      const response = await fetch(
        GetSettlementsRouteConstants.baseUrl +
          GetSettlementsRouteConstants.path +
          (!!lastTradesFetchedAt || !!cursor ? '?' + queryParams.toString() : ''),
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

    return contents;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch settlements from the database:' + error);
  }
};
