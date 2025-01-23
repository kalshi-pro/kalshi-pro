import crypto from 'crypto';
import { JSEncrypt } from 'jsencrypt';

export const generateEncryptedPayload = (payload: string) => {
  const asymmetricPublicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!.replace(/\\/g, '\n');
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(asymmetricPublicKey);
  // Determine the maximum chunk size (key size in bytes minus padding overhead)
  const keySizeBytes = 2048 / 8; // Adjust according to your key size (e.g., 2048-bit = 256 bytes)
  const paddingOverhead = 11; // Typical for PKCS#1 v1.5 padding
  const maxChunkSize = keySizeBytes - paddingOverhead;
  const chunks: string[] = [];
  for (let i = 0; i < payload.length; i += maxChunkSize) {
    const chunk = payload.slice(i, i + maxChunkSize);
    const encryptedChunk = encrypt.encrypt(chunk);
    if (!encryptedChunk) {
      throw new Error('Encryption failed for a chunk.');
    }
    chunks.push(encryptedChunk);
  }

  // Join encrypted chunks with a delimiter (e.g., "::")
  return chunks.join('::');
};

export const decryptWithPrivateKey = (message: string) => {
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!.replace(/\\/g, '\n');
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  const chunks = message.split('::');
  const decryptedChunks: string[] = [];
  for (const chunk of chunks) {
    const decryptedChunk = decrypt.decrypt(chunk);
    if (!decryptedChunk) {
      throw new Error('Decryption failed for a chunk.');
    }
    decryptedChunks.push(decryptedChunk);
  }
  return decryptedChunks.join('');
};

export const signPss = (privateKeyString: string, text: string) => {
  const key = crypto.createPrivateKey({
    key: privateKeyString,
    format: 'pem',
  });
  try {
    const signature = crypto.sign('sha256', Buffer.from(text, 'utf-8'), {
      key,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
    });
    return signature.toString('base64');
  } catch (e) {
    console.error(e);
  }
};
