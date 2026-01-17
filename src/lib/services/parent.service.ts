/**
 * Parent service
 */

import { User, ServiceResponse } from '@/types';
import { get } from '../api/http';

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
