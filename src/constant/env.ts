export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

// API URL from environment variable, with fallback
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (isLocal ? 'http://localhost:1968' : 'https://service.tichdiemhocsinh.com');

// Logger visibility from environment variable, with fallback
export const showLogger =
  process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ||
  process.env.NEXT_PUBLIC_SHOW_LOGGER === undefined;

if (showLogger) {
  console.log('Environment:', {
    isProd,
    isLocal,
    API_URL,
    showLogger,
  });
}
