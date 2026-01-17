/**
 * API client configuration
 */

import { API_URL } from '@/constant/env';
import { RequestConfig, ResponseConfig } from '@/types';
import { ApiResponse, ApiError } from '@/types';

/**
 * Get base URL for API requests
 */
export function getBaseUrl(): string {
  return API_URL;
}

/**
 * Build full URL from path
 */
export function buildUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Default error handler
 */
export function defaultErrorHandler(error: ApiError | Error): void {
  console.error('API Error:', error);
}

/**
 * Parse response based on configuration
 */
export async function parseResponse<T>(
  response: Response,
  config?: ResponseConfig
): Promise<ApiResponse<T>> {
  const parseJson = config?.parseJson !== false;

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    let errorDetails: unknown = null;

    try {
      if (parseJson) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData;
      }
    } catch {
      // If JSON parsing fails, use default error message
    }

    const apiError: ApiError = {
      message: errorMessage,
      statusCode: response.status,
      details: errorDetails,
    };

    if (config?.throwOnError) {
      throw apiError;
    }

    return {
      success: false,
      error: apiError,
    };
  }

  try {
    if (parseJson) {
      const data = await response.json();
      return {
        success: true,
        data: data as T,
      };
    }

    // For non-JSON responses
    const text = await response.text();
    return {
      success: true,
      data: text as unknown as T,
    };
  } catch (error) {
    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : 'Failed to parse response',
      details: error,
    };

    if (config?.throwOnError) {
      throw apiError;
    }

    return {
      success: false,
      error: apiError,
    };
  }
}

/**
 * Create request timeout
 */
export function createTimeout(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}
