/**
 * Authentication utilities for API requests
 */

const AUTH_TOKEN_KEY = 'authToken';

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

/**
 * Create authorized request configuration
 */
export function createAuthorizedRequest(options?: RequestInit): RequestInit {
  const authToken = getAuthToken();
  const headers = new Headers(options?.headers);

  // Set default Content-Type if not present
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add Authorization header if token exists
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  return {
    ...options,
    headers,
  };
}

/**
 * Create unauthorized request configuration
 */
export function createUnauthorizedRequest(options?: RequestInit): RequestInit {
  const headers = new Headers(options?.headers);

  // Set default Content-Type if not present
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return {
    ...options,
    headers,
  };
}
