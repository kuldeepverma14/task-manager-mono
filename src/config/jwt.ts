import 'dotenv/config';

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'strong_access_secret_0987654321',
  REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET || 'strong_refresh_secret_1234567890',
  EXPIRE: process.env.JWT_EXPIRE || '15m',
  REFRESH_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '7d'
};
