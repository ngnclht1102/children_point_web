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
}

/**
 * Violation creation/update request
 */
export interface ViolationRequest {
  title: string;
  description?: string;
  deductedPoints: number;
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
