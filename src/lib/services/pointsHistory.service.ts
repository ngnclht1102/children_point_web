/**
 * Points history service
 */

import { PointsHistory, EarnedPointsHistory, ServiceResponse } from '@/types';
import { get } from '../api/http';
import {
  isPointsHistoryArray,
  isEarnedPointsHistoryArray,
} from '../type-guards';

/**
 * Get points history (rewarded today)
 */
export async function getPointsHistory(): Promise<
  ServiceResponse<PointsHistory[]>
> {
  try {
    const response = await get<PointsHistory[]>(
      '/api/v1/points-history/rewarded/today'
    );

    if (response.success && response.data) {
      if (isPointsHistoryArray(response.data)) {
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
        message: 'Failed to fetch points history',
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
            : 'Failed to fetch points history',
        originalError: error,
      },
    };
  }
}

/**
 * Get earned points history (today)
 */
export async function getEarnedPointsHistory(): Promise<
  ServiceResponse<EarnedPointsHistory[]>
> {
  try {
    const response = await get<EarnedPointsHistory[]>(
      '/api/v1/points-history/earned/today'
    );

    if (response.success && response.data) {
      if (isEarnedPointsHistoryArray(response.data)) {
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
        message: 'Failed to fetch earned points history',
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
            : 'Failed to fetch earned points history',
        originalError: error,
      },
    };
  }
}
