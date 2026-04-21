import crypto from 'crypto';

/**
 * Generate HMAC signature for ACRCloud API
 */
export function generateSignature(accessKey, accessSecret, timestamp) {
  const stringToSign = [
    'POST',
    '/v1/identify',
    accessKey,
    'audio',
    '1',
    timestamp,
  ].join('\n');
  
  const signature = crypto
    .createHmac('sha1', accessSecret)
    .update(Buffer.from(stringToSign, 'utf-8'))
    .digest()
    .toString('base64');
  
  return signature;
}
