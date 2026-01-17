/**
 * Reward types
 */

import { BaseEntity } from './common.types';

/**
 * Reward entity
 */
export interface Reward extends BaseEntity {
  title: string;
  requiredPoints: number;
  description?: string;
}

/**
 * Reward creation/update request
 */
export interface RewardRequest {
  title: string;
  requiredPoints: number;
  description?: string;
}

/**
 * Redeem reward request
 */
export interface RedeemRewardRequest {
  rewardId: number;
  note?: string;
}

/**
 * Reward API response
 */
export interface RewardResponse extends Reward {}
