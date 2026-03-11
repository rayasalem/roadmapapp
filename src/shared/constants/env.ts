export type AppEnv = 'development' | 'staging' | 'production';

const rawEnv = (process.env.EXPO_PUBLIC_ENVIRONMENT as AppEnv | undefined) ?? 'development';
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;

/** Backend defaults */
const localDevApiUrl = 'http://localhost:4000';
const renderProdApiUrl = 'https://roadmapapp.onrender.com';

/**
 * Decide default API URL when EXPO_PUBLIC_API_URL is NOT set:
 * - If running in browser on localhost → use local backend on :4000
 * - Otherwise (Render / Vercel / any public host) → use Render backend URL
 */
function getDefaultApiUrl(env: AppEnv): string {
  // Try to detect browser host safely
  let hostname: string | null = null;
  try {
    // eslint-disable-next-line no-undef
    hostname = typeof window !== 'undefined' && window.location ? window.location.hostname : null;
  } catch {
    hostname = null;
  }

  const isLocalHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '10.0.2.2' || // Android emulator
    hostname === '::1';

  if (isLocalHost && env === 'development') {
    return localDevApiUrl;
  }

  // Any non-local host (Render, Vercel, etc.) falls back to Render backend
  return renderProdApiUrl;
}

const resolvedApiUrl =
  rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl.trim() !== ''
    ? rawApiUrl.trim()
    : getDefaultApiUrl(rawEnv);

/** Avoid throwing at build time so Vercel build succeeds; set EXPO_PUBLIC_API_URL in Vercel dashboard. */
const normalizedApiUrl = resolvedApiUrl.replace(/\/+$/, '');

export const APP_ENV: AppEnv = rawEnv;
export const API_BASE_URL: string = normalizedApiUrl;

