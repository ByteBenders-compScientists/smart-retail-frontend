import { API_BASE_URL } from '@/lib/constants';

type RequestInitWithAuth = RequestInit & {
  token?: string | null;
};

/**
 * Base fetch client for API calls.
 * Uses credentials: 'include' for cookie-based auth (cross-origin if backend allows).
 * Optionally sends Authorization: Bearer <token> when token is provided.
 */
export async function api<T>(
  path: string,
  options: RequestInitWithAuth = {}
): Promise<T> {
  const { token, ...init } = options;
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({})) as { message?: string; error?: string };
    const message =
      errBody?.message ?? errBody?.error ?? `Request failed: ${res.status}`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
