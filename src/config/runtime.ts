const PRODUCTION_RESULT_API_ENDPOINT = '/api/submit-result';

declare global {
  interface Window {
    __CAREER_CITY_ENV__?: Record<string, unknown>;
  }
}

function parseBooleanFlag(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
}

function detectLocalRuntime(): boolean {
  if (typeof window === 'undefined') return false;
  const { protocol, hostname } = window.location;
  return protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

function readRuntimeOverrides(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  const metaResultApiEndpoint = window.document
    ?.querySelector?.('meta[name="career-city-result-api"]')
    ?.getAttribute('content');
  return {
    ...(window.__CAREER_CITY_ENV__ || {}),
    ...(metaResultApiEndpoint ? { resultApiEndpoint: metaResultApiEndpoint } : {}),
  };
}

function normalizeEndpoint(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

export const isLocalRuntime = detectLocalRuntime();

export const isResultSubmissionBypassed = (() => {
  const override = parseBooleanFlag(readRuntimeOverrides().bypassResultSubmission);
  return override ?? isLocalRuntime;
})();

export const resultApiEndpoint = normalizeEndpoint(
  readRuntimeOverrides().resultApiEndpoint,
  PRODUCTION_RESULT_API_ENDPOINT,
);
