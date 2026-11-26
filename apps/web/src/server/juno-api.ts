export const secureSessionCookie = process.env.JUNO_ALLOW_INSECURE_LOCAL_COOKIE !== '1';
export const sessionCookie = secureSessionCookie ? '__Host-juno_session' : 'juno_session';

export function apiRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const api = process.env.JUNO_API_ORIGIN ?? 'http://127.0.0.1:3001';
  return fetch(new URL(`/api/${path}`, api), {
    ...init,
    cache: 'no-store',
    signal: init.signal ?? AbortSignal.timeout(7_000),
  });
}
