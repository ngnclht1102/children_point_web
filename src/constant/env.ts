export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const API_URL = isLocal
  ? 'http://localhost:8081'
  : 'http://children-point.ap-southeast-1.elasticbeanstalk.com:8081';
export const showLogger = true;
