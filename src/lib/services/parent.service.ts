/**
 * Parent service
 */

import {
  User,
  ServiceResponse,
  CreateChildRequest,
  UpdateChildRequest,
} from '@/types';
import { get, post, put } from '../api/http';

/**
 * Get all children for the authenticated parent
 */
export async function getChildren(): Promise<ServiceResponse<User[]>> {
  try {
    const response = await get<User[]>('/api/v1/parent/children');

    return {
      success: response.success,
      data: response.data || null,
      error: response.error || null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to fetch children',
        originalError: error,
      },
    };
  }
}

/**
 * Create a new child (new user with CHILD role linked to parent)
 */
export async function createChild(
  payload: CreateChildRequest
): Promise<ServiceResponse<User>> {
  try {
    const response = await post<User, CreateChildRequest>(
      '/api/v1/parent/children',
      payload
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
          error instanceof Error ? error.message : 'Failed to create child',
        originalError: error,
      },
    };
  }
}

/**
 * Update a child's profile (fullName; optionally username and password)
 */
export async function updateChild(
  childId: number,
  payload: UpdateChildRequest
): Promise<ServiceResponse<User>> {
  try {
    const response = await put<User, UpdateChildRequest>(
      `/api/v1/parent/children/${childId}`,
      payload
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
          error instanceof Error ? error.message : 'Failed to update child',
        originalError: error,
      },
    };
  }
}
