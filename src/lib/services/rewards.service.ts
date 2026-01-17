/**
 * Rewards service
 */

import { Reward, RedeemRewardRequest, ServiceResponse } from '@/types';
import { get, post } from '../api/http';
import { isRewardArray } from '../type-guards';

/**
 * Get all rewards
 */
export async function getRewards(): Promise<ServiceResponse<Reward[]>> {
  try {
    const response = await get<Reward[]>('/api/v1/rewards');

    if (response.success && response.data) {
      if (isRewardArray(response.data)) {
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
        message: 'Failed to fetch rewards',
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to fetch rewards',
        originalError: error,
      },
    };
  }
}

/**
 * Get rewards in your hand (affordable rewards)
 */
export async function getRewardsInYourHand(): Promise<
  ServiceResponse<Reward[]>
> {
  try {
    const response = await get<Reward[]>('/api/v1/rewards/in-your-hand');

    if (response.success && response.data) {
      if (isRewardArray(response.data)) {
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
        message: 'Failed to fetch rewards in your hand',
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
            : 'Failed to fetch rewards in your hand',
        originalError: error,
      },
    };
  }
}

/**
 * Redeem a reward
 */
export async function redeemReward(
  request: RedeemRewardRequest
): Promise<ServiceResponse<boolean>> {
  try {
    const response = await post<unknown, RedeemRewardRequest>(
      `/api/v1/rewards/redeem?reward_id=${request.rewardId}`,
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
          error instanceof Error ? error.message : 'Failed to redeem reward',
        originalError: error,
      },
    };
  }
}
