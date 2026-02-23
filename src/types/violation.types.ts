/**
 * Violation types
 */

import { BaseEntity } from './common.types';

/**
 * Violation entity
 */
export interface Violation extends BaseEntity {
  title: string;
  description?: string;
  deductedPoints: number;
  shareAcrossGroup?: boolean;
  /** Child user id when violation is for one child; null when shared (shareAcrossGroup true) */
  userId?: number | null;
}

/**
 * Violation creation/update request
 */
export interface ViolationRequest {
  title: string;
  description?: string;
  deductedPoints: number;
  userId?: number; // Required if shareAcrossGroup is false, must be null if shareAcrossGroup is true
  shareAcrossGroup?: boolean; // If true, applies to all children (userId must be null)
}

/**
 * Report violation request
 */
export interface ReportViolationRequest {
  violationId: number;
  note?: string;
}

/**
 * Violation API response
 */
export interface ViolationResponse extends Violation {}

/**
 * Violation history entry
 */
export interface ViolationHistory extends BaseEntity {
  violation: Violation;
  note?: string;
  points: number;
}
