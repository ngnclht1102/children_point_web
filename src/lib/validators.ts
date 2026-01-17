/**
 * Runtime validation functions
 * Note: This is a basic implementation. For production, consider using Zod
 * for schema-based validation with type inference.
 */

import {
  LoginRequest,
  RegisterRequest,
  Challenge,
  Reward,
  Violation,
  PointsStatus,
} from '@/types';

/**
 * Validate login request
 */
export function validateLoginRequest(data: unknown): data is LoginRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'username' in data &&
    'password' in data &&
    typeof (data as LoginRequest).username === 'string' &&
    typeof (data as LoginRequest).password === 'string' &&
    (data as LoginRequest).username.length >= 3 &&
    (data as LoginRequest).password.length >= 6
  );
}

/**
 * Validate register request
 */
export function validateRegisterRequest(
  data: unknown
): data is RegisterRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'username' in data &&
    'password' in data &&
    'fullName' in data &&
    typeof (data as RegisterRequest).username === 'string' &&
    typeof (data as RegisterRequest).password === 'string' &&
    typeof (data as RegisterRequest).fullName === 'string' &&
    (data as RegisterRequest).username.length >= 3 &&
    (data as RegisterRequest).password.length >= 6 &&
    (data as RegisterRequest).fullName.length > 0
  );
}

/**
 * Validate challenge data
 */
export function validateChallenge(data: unknown): data is Challenge {
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
    typeof (data as Challenge).earnedPoints === 'number' &&
    (data as Challenge).title.length > 0 &&
    (data as Challenge).earnedPoints >= 0
  );
}

/**
 * Validate reward data
 */
export function validateReward(data: unknown): data is Reward {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'requiredPoints' in data &&
    typeof (data as Reward).id === 'number' &&
    typeof (data as Reward).title === 'string' &&
    typeof (data as Reward).requiredPoints === 'number' &&
    (data as Reward).title.length > 0 &&
    (data as Reward).requiredPoints >= 0
  );
}

/**
 * Validate violation data
 */
export function validateViolation(data: unknown): data is Violation {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'deductedPoints' in data &&
    typeof (data as Violation).id === 'number' &&
    typeof (data as Violation).title === 'string' &&
    typeof (data as Violation).deductedPoints === 'number' &&
    (data as Violation).title.length > 0 &&
    (data as Violation).deductedPoints >= 0
  );
}

/**
 * Validate points status
 */
export function validatePointsStatus(data: unknown): data is PointsStatus {
  return (
    typeof data === 'object' &&
    data !== null &&
    'currentPoints' in data &&
    'todayEarnedPoints' in data &&
    'allTimeUsedPoints' in data &&
    typeof (data as PointsStatus).currentPoints === 'number' &&
    typeof (data as PointsStatus).todayEarnedPoints === 'number' &&
    typeof (data as PointsStatus).allTimeUsedPoints === 'number' &&
    (data as PointsStatus).currentPoints >= 0 &&
    (data as PointsStatus).todayEarnedPoints >= 0 &&
    (data as PointsStatus).allTimeUsedPoints >= 0
  );
}

/**
 * Form validation helper
 */
export function validateFormField(
  value: unknown,
  rules: Array<{ type: string; value?: unknown; message: string }>
): string | null {
  if (value === null || value === undefined || value === '') {
    const requiredRule = rules.find((r) => r.type === 'required');
    if (requiredRule) {
      return requiredRule.message;
    }
  }

  if (typeof value === 'string') {
    const minLengthRule = rules.find((r) => r.type === 'minLength');
    if (minLengthRule && value.length < (minLengthRule.value as number)) {
      return minLengthRule.message;
    }

    const maxLengthRule = rules.find((r) => r.type === 'maxLength');
    if (maxLengthRule && value.length > (maxLengthRule.value as number)) {
      return maxLengthRule.message;
    }

    const patternRule = rules.find((r) => r.type === 'pattern');
    if (patternRule && patternRule.value instanceof RegExp) {
      if (!patternRule.value.test(value)) {
        return patternRule.message;
      }
    }
  }

  return null;
}
