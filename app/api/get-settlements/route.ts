import { decryptWithPrivateKey, signPss } from '@/lib/crytpo';
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
    const contents = await response.json();
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
