/**
 * Challenges service
 */

import {
  Challenge,
  ChallengeRequest,
  FinishChallengeRequest,
  ServiceResponse,
} from '@/types';
import { get, post, put, del } from '../api/http';
import { isChallengeArray, isChallenge } from '../type-guards';

/**
 * Get all challenges
 */
export async function getChallenges(): Promise<ServiceResponse<Challenge[]>> {
  try {
    const response = await get<Challenge[]>('/api/v1/challenges');

    if (response.success && response.data) {
      if (isChallengeArray(response.data)) {
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
        message: 'Failed to fetch challenges',
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to fetch challenges',
        originalError: error,
      },
    };
  }
}

/**
 * Finish a challenge
 */
export async function finishChallenge(
  request: FinishChallengeRequest
): Promise<ServiceResponse<boolean>> {
  try {
    const response = await post<unknown, FinishChallengeRequest>(
      `/api/v1/challenges/finish?challengeId=${request.challengeId}`,
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
          error instanceof Error ? error.message : 'Failed to finish challenge',
        originalError: error,
      },
    };
  }
}

/**
 * Get all challenges managed by parent (for their children)
 */
export async function getManagedChallenges(): Promise<
  ServiceResponse<Challenge[]>
> {
  try {
    const response = await get<Challenge[]>('/api/v1/challenges/manage');

    if (response.success && response.data) {
      if (isChallengeArray(response.data)) {
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
        message: 'Failed to fetch managed challenges',
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
            : 'Failed to fetch managed challenges',
        originalError: error,
      },
    };
  }
}

/**
 * Create a new challenge (parent)
 */
export async function createChallenge(
  request: ChallengeRequest
): Promise<ServiceResponse<Challenge>> {
  try {
    const response = await post<Challenge, ChallengeRequest>(
      '/api/v1/challenges',
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
          error instanceof Error ? error.message : 'Failed to create challenge',
        originalError: error,
      },
    };
  }
}

/**
 * Update a challenge (parent)
 */
export async function updateChallenge(
  id: number,
  request: ChallengeRequest
): Promise<ServiceResponse<Challenge>> {
  try {
    const response = await put<Challenge, ChallengeRequest>(
      `/api/v1/challenges/${id}`,
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
          error instanceof Error ? error.message : 'Failed to update challenge',
        originalError: error,
      },
    };
  }
}

/**
 * Delete a challenge (parent)
 */
export async function deleteChallenge(
  id: number
): Promise<ServiceResponse<boolean>> {
  try {
    const response = await del<unknown>(`/api/v1/challenges/${id}`);

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
          error instanceof Error ? error.message : 'Failed to delete challenge',
        originalError: error,
      },
    };
  }
}

/**
 * Get a single challenge by ID (parent)
 */
export async function getChallengeById(
  id: number
): Promise<ServiceResponse<Challenge>> {
  try {
    const response = await get<Challenge>(`/api/v1/challenges/${id}`);

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
          error instanceof Error ? error.message : 'Failed to fetch challenge',
        originalError: error,
      },
    };
  }
}
