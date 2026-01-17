/**
 * HTTP and API types
 */

/**
 * HTTP method union type
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * HTTP status code types
 */
export type StatusCode =
  | 200
  | 201
  | 204
  | 400
  | 401
  | 403
  | 404
  | 500
  | 502
  | 503;

/**
 * HTTP request options
 */
export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  signal?: AbortSignal;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

/**
 * Request configuration
 */
export interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers?: HeadersInit;
  body?: unknown;
  options?: RequestOptions;
}

/**
 * Response configuration
 */
export interface ResponseConfig {
  parseJson?: boolean;
  throwOnError?: boolean;
}
