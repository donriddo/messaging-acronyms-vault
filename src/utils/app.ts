import config from 'config';
import crypto from 'crypto';

export function generateApiKey(authorEmail) {
  const secretKey = config.get('secretKey');
  return crypto.createHmac('sha512', secretKey)
    .update(this.email)
    .digest('hex');
}
