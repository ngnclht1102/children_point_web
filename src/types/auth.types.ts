/**
 * Authentication types
 */

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  token: string;
  user?: User;
}

/**
 * Auth token type
 */
export type AuthToken = string;

/**
 * User entity type
 */
export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  createdAt: string;
  updatedAt?: string;
  roles?: string[]; // User roles (e.g., ['PARENT', 'CHILD'])
}

/**
 * Request payload for creating a new child (parent adds child)
 */
export interface CreateChildRequest {
  username: string;
  password: string;
  fullName: string;
}

/**
 * Request payload for updating a child's profile
 */
export interface UpdateChildRequest {
  fullName: string;
  username?: string;
  password?: string;
}
