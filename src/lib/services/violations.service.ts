/**
 * Violations service
 */

import {
  Violation,
  ViolationHistory,
  ReportViolationRequest,
  ViolationRequest,
  ServiceResponse,
} from '@/types';
import { get, post, put, del } from '../api/http';
import { isViolationArray, isViolationHistoryArray } from '../type-guards';

/**
 * Get all violations
 */
export async function getViolations(): Promise<ServiceResponse<Violation[]>> {
  try {
    const response = await get<Violation[]>('/api/v1/violations');

    if (response.success && response.data) {
      if (isViolationArray(response.data)) {
        return {
          success: true,
          data: response.data,
          error: null,
        };
      }
    }

    return {
      success: false,
      data: null,
      error: response.error || {
        message: 'Failed to fetch violations',
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to fetch violations',
        originalError: error,
      },
    };
  }
}

/**
 * Get today's violations
 */
export async function getTodayViolations(): Promise<
  ServiceResponse<ViolationHistory[]>
> {
  try {
    const response = await get<ViolationHistory[]>(
      '/api/v1/points-history/violations/today'
    );

    if (response.success && response.data) {
      if (isViolationHistoryArray(response.data)) {
        return {
          success: true,
          data: response.data,
          error: null,
        };
      }
    }

    return {
      success: false,
      data: null,
      error: response.error || {
        message: "Failed to fetch today's violations",
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch today's violations",
        originalError: error,
      },
    };
  }
}

/**
 * Report a violation
 */
export async function reportViolation(
  request: ReportViolationRequest
): Promise<ServiceResponse<boolean>> {
  try {
    const response = await post<unknown, ReportViolationRequest>(
      '/api/v1/violations/apply',
      request
    );

    return {
      success: response.success,
      data: response.success,
      error: response.error || null,
    };
  } catch (error) {
    return {
      success: false,
      data: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to report violation',
        originalError: error,
      },
    };
  }
}

/**
 * Get all violations managed by parent (for their children)
 */
export async function getManagedViolations(): Promise<
  ServiceResponse<Violation[]>
> {
  try {
    const response = await get<Violation[]>('/api/v1/violations/manage');

    if (response.success && response.data) {
      if (isViolationArray(response.data)) {
        return {
          success: true,
          data: response.data,
          error: null,
        };
      }
    }

    return {
      success: false,
      data: null,
      error: response.error || {
        message: 'Failed to fetch managed violations',
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch managed violations',
        originalError: error,
      },
    };
  }
}

/**
 * Create a new violation (parent)
 */
export async function createViolation(
  request: ViolationRequest
): Promise<ServiceResponse<Violation>> {
  try {
    const response = await post<Violation, ViolationRequest>(
      '/api/v1/violations',
      request
    );

    return {
      success: response.success,
      data: response.data ?? null,
      error: response.error ?? null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to create violation',
        originalError: error,
      },
    };
  }
}

/**
 * Update a violation (parent)
 */
export async function updateViolation(
  id: number,
  request: ViolationRequest
): Promise<ServiceResponse<Violation>> {
  try {
    const response = await put<Violation, ViolationRequest>(
      `/api/v1/violations/${id}`,
      request
    );

    return {
      success: response.success,
      data: response.data ?? null,
      error: response.error ?? null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to update violation',
        originalError: error,
      },
    };
  }
}

/**
 * Delete a violation (parent)
 */
export async function deleteViolation(
  id: number
): Promise<ServiceResponse<boolean>> {
  try {
    const response = await del<unknown>(`/api/v1/violations/${id}`);

    return {
      success: response.success,
      data: response.success,
      error: response.error ?? null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to delete violation',
        originalError: error,
      },
    };
  }
}

/**
 * Get a single violation by ID (parent)
 */
export async function getViolationById(
  id: number
): Promise<ServiceResponse<Violation>> {
  try {
    const response = await get<Violation>(`/api/v1/violations/${id}`);

    return {
      success: response.success,
      data: response.data ?? null,
      error: response.error ?? null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to fetch violation',
        originalError: error,
      },
    };
  }
}
