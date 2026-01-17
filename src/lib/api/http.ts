/**
 * Core HTTP helper functions with full type safety
 */

import { ApiResponse, RequestOptions, HttpMethod } from '@/types';
import { buildUrl, parseResponse, createTimeout } from './client';
import { createAuthorizedRequest, createUnauthorizedRequest } from './auth';

/**
 * Default request options
 */
const DEFAULT_OPTIONS: RequestOptions = {
  timeout: 30000, // 30 seconds
};

/**
 * Make HTTP request with full type safety
 */
async function request<TResponse>(
  method: HttpMethod,
  url: string,
  data?: unknown,
  options?: RequestOptions,
  requireAuth = true
): Promise<ApiResponse<TResponse>> {
  const fullUrl = buildUrl(url);
  const requestOptions = requireAuth
    ? createAuthorizedRequest()
    : createUnauthorizedRequest();

  // Merge options
  const mergedOptions: RequestInit = {
    ...requestOptions,
    method,
    ...options,
  };

  // Add body for POST, PUT, PATCH requests
  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    mergedOptions.body = JSON.stringify(data);
  }

  // Handle timeout
  let signal = options?.signal;
  if (options?.timeout && !signal) {
    signal = createTimeout(options.timeout);
  }
  if (signal) {
    mergedOptions.signal = signal;
  }

  try {
    const response = await fetch(fullUrl, mergedOptions);
    return await parseResponse<TResponse>(response, {
      parseJson: true,
      throwOnError: false,
    });
  } catch (error) {
    // Handle network errors or aborted requests
    const apiError = {
      message:
        error instanceof Error ? error.message : 'Network error occurred',
      details: error,
    };

    return {
      success: false,
      error: apiError,
    };
  }
}

/**
 * GET request helper
 */
export async function get<TResponse>(
  url: string,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>('GET', url, undefined, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

/**
 * POST request helper
 */
export async function post<TResponse, TRequest = unknown>(
  url: string,
  data?: TRequest,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>('POST', url, data, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

/**
 * PUT request helper
 */
export async function put<TResponse, TRequest = unknown>(
  url: string,
  data?: TRequest,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>('PUT', url, data, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

/**
 * PATCH request helper
 */
export async function patch<TResponse, TRequest = unknown>(
  url: string,
  data?: TRequest,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>('PATCH', url, data, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

/**
 * DELETE request helper
 */
export async function del<TResponse>(
  url: string,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>('DELETE', url, undefined, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

/**
 * Unauthorized GET request (for public endpoints)
 */
export async function getUnauthorized<TResponse>(
  url: string,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>(
    'GET',
    url,
    undefined,
    {
      ...DEFAULT_OPTIONS,
      ...options,
    },
    false
  );
}

/**
 * Unauthorized POST request (for public endpoints)
 */
export async function postUnauthorized<TResponse, TRequest = unknown>(
  url: string,
  data?: TRequest,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>(
    'POST',
    url,
    data,
    {
      ...DEFAULT_OPTIONS,
      ...options,
    },
    false
  );
}
