/**
 * Type guard functions for runtime type checking
 */

import {
  ApiError,
  AuthResponse,
  Challenge,
  Reward,
  Violation,
  PointsStatus,
  User,
  EarnedPointsHistory,
  PointsHistory,
  ViolationHistory,
} from '@/types';

/**
 * Check if value is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

/**
 * Check if value is an AuthResponse
 */
export function isAuthResponse(data: unknown): data is AuthResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'token' in data &&
    typeof (data as AuthResponse).token === 'string'
  );
}

/**
 * Check if value is a Challenge
 */
export function isChallenge(data: unknown): data is Challenge {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'description' in data &&
    'earnedPoints' in data &&
    typeof (data as Challenge).id === 'number' &&
    typeof (data as Challenge).title === 'string' &&
    typeof (data as Challenge).description === 'string' &&
    typeof (data as Challenge).earnedPoints === 'number'
  );
}

/**
 * Check if value is an array of Challenges
 */
export function isChallengeArray(data: unknown): data is Challenge[] {
  return Array.isArray(data) && data.every(isChallenge);
}

/**
 * Check if value is a Reward
 */
export function isReward(data: unknown): data is Reward {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'requiredPoints' in data &&
    typeof (data as Reward).id === 'number' &&
    typeof (data as Reward).title === 'string' &&
    typeof (data as Reward).requiredPoints === 'number'
  );
}

/**
 * Check if value is an array of Rewards
 */
export function isRewardArray(data: unknown): data is Reward[] {
  return Array.isArray(data) && data.every(isReward);
}

/**
 * Check if value is a Violation
 */
export function isViolation(data: unknown): data is Violation {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'deductedPoints' in data &&
    typeof (data as Violation).id === 'number' &&
    typeof (data as Violation).title === 'string' &&
    typeof (data as Violation).deductedPoints === 'number'
  );
}

/**
 * Check if value is an array of Violations
 */
export function isViolationArray(data: unknown): data is Violation[] {
  return Array.isArray(data) && data.every(isViolation);
}

/**
 * Check if value is a PointsStatus
 */
export function isPointsStatus(data: unknown): data is PointsStatus {
  return (
    typeof data === 'object' &&
    data !== null &&
    'currentPoints' in data &&
    'todayEarnedPoints' in data &&
    'allTimeUsedPoints' in data &&
    typeof (data as PointsStatus).currentPoints === 'number' &&
    typeof (data as PointsStatus).todayEarnedPoints === 'number' &&
    typeof (data as PointsStatus).allTimeUsedPoints === 'number'
  );
}

/**
 * Check if value is a User
 */
export function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'username' in data &&
    'fullName' in data &&
    typeof (data as User).id === 'number' &&
    typeof (data as User).username === 'string' &&
    typeof (data as User).fullName === 'string'
  );
}

/**
 * Check if value is an EarnedPointsHistory
 */
export function isEarnedPointsHistory(
  data: unknown
): data is EarnedPointsHistory {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'points' in data &&
    'challenge' in data &&
    typeof (data as EarnedPointsHistory).id === 'number' &&
    typeof (data as EarnedPointsHistory).points === 'number' &&
    isChallenge((data as EarnedPointsHistory).challenge)
  );
}

/**
 * Check if value is an array of EarnedPointsHistory
 */
export function isEarnedPointsHistoryArray(
  data: unknown
): data is EarnedPointsHistory[] {
  return Array.isArray(data) && data.every(isEarnedPointsHistory);
}

/**
 * Check if value is a PointsHistory
 */
export function isPointsHistory(data: unknown): data is PointsHistory {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'points' in data &&
    'type' in data &&
    typeof (data as PointsHistory).id === 'number' &&
    typeof (data as PointsHistory).points === 'number' &&
    typeof (data as PointsHistory).type === 'string'
  );
}

/**
 * Check if value is an array of PointsHistory
 */
export function isPointsHistoryArray(data: unknown): data is PointsHistory[] {
  return Array.isArray(data) && data.every(isPointsHistory);
}

/**
 * Check if value is a ViolationHistory
 */
export function isViolationHistory(data: unknown): data is ViolationHistory {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'points' in data &&
    'violation' in data &&
    typeof (data as ViolationHistory).id === 'number' &&
    typeof (data as ViolationHistory).points === 'number' &&
    isViolation((data as ViolationHistory).violation)
  );
}

/**
 * Check if value is an array of ViolationHistory
 */
export function isViolationHistoryArray(
  data: unknown
): data is ViolationHistory[] {
  return Array.isArray(data) && data.every(isViolationHistory);
}
