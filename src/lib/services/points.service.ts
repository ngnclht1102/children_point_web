/**
 * Points service
 */

import { PointsStatus, ServiceResponse } from '@/types';
import { get } from '../api/http';
import { isPointsStatus } from '../type-guards';

/**
 * Get points status
 */
export async function getPointsStatus(): Promise<
  ServiceResponse<PointsStatus>
> {
  try {
    const response = await get<PointsStatus>('/api/v1/points/status');

    if (response.success && response.data) {
      if (isPointsStatus(response.data)) {
        return {
          success: true,
          data: response.data,
          error: null,
        };
      }
    }

    // Return default values if response is invalid
    const defaultStatus: PointsStatus = {
      currentPoints: 0,
      todayEarnedPoints: 0,
      allTimeUsedPoints: 0,
    };

    return {
      success: false,
      data: defaultStatus,
      error: response.error || {
        message: 'Failed to fetch points status',
      },
    };
  } catch (error) {
    const defaultStatus: PointsStatus = {
      currentPoints: 0,
      todayEarnedPoints: 0,
      allTimeUsedPoints: 0,
    };

    return {
      success: false,
      data: defaultStatus,
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch points status',
        originalError: error,
      },
    };
  }
}
