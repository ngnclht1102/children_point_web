/**
 * Challenge types
 */

import { BaseEntity } from './common.types';

/**
 * Challenge entity
 */
export interface Challenge extends BaseEntity {
  title: string;
  description: string;
  earnedPoints: number;
}

/**
 * Challenge creation/update request
 */
export interface ChallengeRequest {
  title: string;
  description: string;
  earnedPoints: number;
}

/**
 * Finish challenge request
 */
export interface FinishChallengeRequest {
  challengeId: number;
  note?: string;
}

/**
 * Challenge API response
 */
export interface ChallengeResponse extends Challenge {}
