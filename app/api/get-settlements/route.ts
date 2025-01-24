import { decryptWithPrivateKey, signPss } from '@/lib/crytpo';
import { SettlementsResponse } from '@/types/KalshiAPI';
import { NextResponse } from 'next/server';

export const GetSettlementsRouteConstants = {
  method: 'GET',
  baseUrl: 'https://api.elections.kalshi.com',
  path: '/trade-api/v2/portfolio/settlements',
};

export async function POST(request: Request) {
  const { accessKey, encryptedPrivateKey } = await request.json();

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
    let latestTimestamp = '';
    const contents = [];
    do {
      const response = await fetch(
        GetSettlementsRouteConstants.baseUrl + GetSettlementsRouteConstants.path,
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
    // sort
    contents.sort(
      (a, b) => new Date(b.settled_time).getTime() - new Date(a.settled_time).getTime(),
    );
    // store result and timestamp in a database]

    latestTimestamp = contents[0].settled_time;
    console.log(contents, latestTimestamp);
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
