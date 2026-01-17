/**
 * Points types
 */

import { BaseEntity } from './common.types';
import { Challenge } from './challenge.types';
import { Reward } from './reward.types';
import { Violation } from './violation.types';

/**
 * Current points status
 */
export interface PointsStatus {
  currentPoints: number;
  todayEarnedPoints: number;
  allTimeUsedPoints: number;
}

/**
 * Points transaction type
 */
export type PointsType = 'earned' | 'deducted' | 'used';

/**
 * Points history entry
 */
export interface PointsHistory extends BaseEntity {
  points: number;
  reward?: Reward;
  note?: string;
  type: PointsType;
}

/**
 * Earned points history entry
 */
export interface EarnedPointsHistory extends BaseEntity {
  points: number;
  challenge: Challenge;
  note?: string;
}

/**
 * Violation points history entry (extends ViolationHistory from violation.types)
 */
export interface ViolationPointsHistory extends BaseEntity {
  points: number;
  violation: Violation;
  note?: string;
}
