/**
 * Common types and utilities used across the application
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
  message?: string;
}

/**
 * Standardized error type for API responses
 */
export interface ApiError {
  code?: string | number;
  message: string;
  details?: unknown;
  statusCode?: number;
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Paginated response type
 */
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt?: string;
}
