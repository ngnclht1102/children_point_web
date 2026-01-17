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
  shareAcrossGroup?: boolean;
}

/**
 * Challenge creation/update request
 */
export interface ChallengeRequest {
  title: string;
  description: string;
  earnedPoints: number;
  userId?: number; // Required if shareAcrossGroup is false, must be null if shareAcrossGroup is true
  shareAcrossGroup?: boolean; // If true, applies to all children (userId must be null)
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
