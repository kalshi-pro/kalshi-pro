import { decryptWithPrivateKey, signPss } from '../crytpo';
import { createClient } from '@/utils/supabase/server';
import { Fill } from '@/types/KalshiAPI';
export const GetFillsRouteConstants = {
  method: 'GET',
  baseUrl: 'https://api.elections.kalshi.com',
  path: '/trade-api/v2/portfolio/fills',
};

export const fetchNewFills = async (
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
    if (!!lastTradesFetchedAt) {
      queryParams.append('min_ts', Math.floor(new Date(lastTradesFetchedAt).getTime() / 1000) + '');
    }
    let cursor = '';
    const contents = [];

    do {
      const response = await fetch(
        GetFillsRouteConstants.baseUrl +
          GetFillsRouteConstants.path +
          (!!lastTradesFetchedAt ? '?' + queryParams.toString() : ''),
        {
          method: GetFillsRouteConstants.method,
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const json = await response.json();
      cursor = json.cursor;
      contents.push(...json.fills);
    } while (cursor !== '');
    contents.sort(
      (a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime(),
    );

    const supabase = await createClient();
    const { error } = await supabase.from('fills').upsert(
      contents.map((fill: Fill) => ({
        ...fill,
        user_id: userId,
        key: `${userId}_${fill.created_time}_${fill.trade_id}`,
      })),
    );
    if (error) {
      throw new Error('Failed to upsert fills into the database:' + error.message);
    }

    return contents;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch fills from the database:' + error);
  }
};
