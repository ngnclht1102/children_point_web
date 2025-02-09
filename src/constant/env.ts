export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const API_URL = isLocal
  ? 'http://localhost:8081'
  : 'https://api.production.com';
export const showLogger = true;
