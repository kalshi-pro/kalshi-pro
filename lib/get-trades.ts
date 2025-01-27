import { generateEncryptedPayload } from './crytpo';

export const getTrades = async (accessKey: string, privateKey: string) => {
  if (!accessKey || !privateKey) {
    throw new Error('Access key or private key is missing');
  }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      ? process.env.NEXT_PUBLIC_API_BASE_URL
      : 'http://localhost:3000';
    const encryptedPrivateKey = generateEncryptedPayload(privateKey);
    const res = await fetch(baseUrl + '/api/get-trades', {
      method: 'POST',
      body: JSON.stringify({
        accessKey,
        encryptedPrivateKey,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.trades;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch trades: ' + error);
  }
};
