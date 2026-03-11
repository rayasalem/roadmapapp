export type AppEnv = 'development' | 'staging' | 'production';

const rawEnv = (process.env.EXPO_PUBLIC_ENVIRONMENT as AppEnv | undefined) ?? 'development';
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;

/** In development, fallback to localhost:4000; in production, fallback to Render backend. */
const defaultDevApiUrl = 'http://localhost:4000';
const defaultProdApiUrl = 'https://roadmapapp.onrender.com';
const resolvedApiUrl =
  rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl.trim() !== ''
    ? rawApiUrl.trim()
    : rawEnv === 'development'
      ? defaultDevApiUrl
      : defaultProdApiUrl;

/** Avoid throwing at build time so Vercel build succeeds; set EXPO_PUBLIC_API_URL in Vercel dashboard. */
const normalizedApiUrl = resolvedApiUrl.replace(/\/+$/, '');

export const APP_ENV: AppEnv = rawEnv;
export const API_BASE_URL: string = normalizedApiUrl;

