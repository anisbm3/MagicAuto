export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export async function adminFetch(path: string, options: RequestInit = {}) {
  let token = null;

  try {
    token = localStorage.getItem('admin_token');
  } catch (e) {
    console.warn('localStorage is disabled or unavailable');
  }

  if (!token) {
    token = (window as any).__ADMIN_TOKEN__;
  }

  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return fetch(apiUrl(path), {
    ...options,
    headers,
  });
}
