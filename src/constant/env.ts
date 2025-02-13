export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

console.log('isProd', isProd);
export const API_URL = isLocal
  ? 'http://localhost:8081'
  : 'https://api.tichdiemhocsinh.com/api';
export const showLogger = true;
