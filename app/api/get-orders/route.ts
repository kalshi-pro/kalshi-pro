import { decryptWithPrivateKey, signPss } from '@/lib/crytpo';
import { NextResponse } from 'next/server';

export const GetOrdersRouteConstants = {
  method: 'GET',
  baseUrl: 'https://api.elections.kalshi.com',
  path: '/trade-api/v2/portfolio/orders',
};

export async function POST(request: Request) {
  const { accessKey, encryptedPrivateKey, status } = await request.json();

  try {
    const privateKey = decryptWithPrivateKey(encryptedPrivateKey);
    if (!privateKey) {
      throw new Error('Failed to decrypt the private key');
    }
    const currentTime = new Date();
    const currentTimeMilliseconds = currentTime.getTime();
    const timestampStr = currentTimeMilliseconds.toString();

    const msgString = timestampStr + GetOrdersRouteConstants.method + GetOrdersRouteConstants.path;

    const signature = signPss(privateKey, msgString);

    if (!signature) {
      throw new Error('Failed to sign the message');
    }
    const headers = new Headers();
    headers.set('KALSHI-ACCESS-KEY', accessKey);
    headers.set('KALSHI-ACCESS-SIGNATURE', signature);
    headers.set('KALSHI-ACCESS-TIMESTAMP', timestampStr);
    headers.set('Content-Type', 'application/json');
    console.log(
      GetOrdersRouteConstants.baseUrl +
        GetOrdersRouteConstants.path +
        (!!status ? '?status=' + status : ''),
    );

    const response = await fetch(
      GetOrdersRouteConstants.baseUrl +
        GetOrdersRouteConstants.path +
        (!!status ? '?status=' + status : ''),
      {
        method: GetOrdersRouteConstants.method,
        headers,
      },
    );
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const contents = await response.json();
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
