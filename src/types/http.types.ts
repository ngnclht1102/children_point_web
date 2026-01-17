/**
 * HTTP helper types
 */

import { RequestOptions, RequestConfig, ResponseConfig } from './api.types';
import { ApiResponse, ApiError } from './common.types';

/**
 * Generic HTTP client type
 */
export interface HttpClient<T = unknown> {
  get<TResponse = T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<TResponse>>;
  post<TResponse = T, TRequest = unknown>(
    url: string,
    data?: TRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<TResponse>>;
  put<TResponse = T, TRequest = unknown>(
    url: string,
    data?: TRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<TResponse>>;
  delete<TResponse = T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<TResponse>>;
}

/**
 * Request interceptor type
 */
export type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;

/**
 * Response interceptor type
 */
export type ResponseInterceptor = <T>(
  response: Response,
  config: RequestConfig
) => ApiResponse<T> | Promise<ApiResponse<T>>;

/**
 * Error handler type
 */
export type ErrorHandler = (error: ApiError | Error) => void | Promise<void>;
