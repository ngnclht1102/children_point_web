/**
 * Challenges service
 */

import { Challenge, FinishChallengeRequest, ServiceResponse } from '@/types';
import { get, post } from '../api/http';
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
