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
  shareAcrossGroup?: boolean;
}

/**
 * Reward creation/update request
 */
export interface RewardRequest {
  title: string;
  requiredPoints: number;
  description?: string;
  userId?: number; // Required if shareAcrossGroup is false, must be null if shareAcrossGroup is true
  shareAcrossGroup?: boolean; // If true, applies to all children (userId must be null)
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
