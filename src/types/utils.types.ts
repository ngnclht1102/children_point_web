/**
 * Type utility functions
 */

/**
 * Deep partial type - makes all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Required specific fields
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Optional specific fields
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Non-nullable type helper
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Extract promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;
