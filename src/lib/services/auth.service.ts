/**
 * Authentication service
 */

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ServiceResponse,
} from '@/types';
import { postUnauthorized } from '../api/http';
import { setAuthToken, removeAuthToken } from '../api/auth';
import { isAuthResponse } from '../type-guards';

/**
 * Login service
 */
export async function login(
  request: LoginRequest
): Promise<ServiceResponse<AuthResponse>> {
  try {
    const response = await postUnauthorized<AuthResponse, LoginRequest>(
      '/api/public/v1/auth/login',
      request
    );

    if (response.success && response.data) {
      if (isAuthResponse(response.data)) {
        setAuthToken(response.data.token);
        return {
          success: true,
          data: response.data,
          error: null,
        };
      }
    }

    return {
      success: false,
      data: null,
      error: response.error || {
        message: 'Invalid response format',
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Login failed',
        originalError: error,
      },
    };
  }
}

/**
 * Register service
 */
export async function register(
  request: RegisterRequest
): Promise<ServiceResponse<AuthResponse>> {
  try {
    const response = await postUnauthorized<AuthResponse, RegisterRequest>(
      '/api/public/v1/auth/register',
      request
    );

    if (response.success && response.data) {
      if (isAuthResponse(response.data)) {
        if (response.data.token) {
          setAuthToken(response.data.token);
        }
        return {
          success: true,
          data: response.data,
          error: null,
        };
      }
    }

    return {
      success: false,
      data: null,
      error: response.error || {
        message: 'Invalid response format',
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Registration failed',
        originalError: error,
      },
    };
  }
}

/**
 * Logout service
 */
export function logout(): void {
  removeAuthToken();
}
