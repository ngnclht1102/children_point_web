/**
 * Service layer types
 */

import { ApiError } from './common.types';

/**
 * Generic service response
 */
export interface ServiceResponse<T> {
  data: T | null;
  error: ServiceError | null;
  success: boolean;
}

/**
 * Service error type
 */
export interface ServiceError extends ApiError {
  originalError?: unknown;
}

/**
 * Service configuration
 */
export interface ServiceConfig {
  baseUrl?: string;
  timeout?: number;
  retry?: number;
}
