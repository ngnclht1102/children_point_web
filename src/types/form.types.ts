/**
 * Form types
 */

/**
 * Generic form data type
 */
export type FormData = Record<string, unknown>;

/**
 * Form validation errors
 */
export type FormErrors = Record<string, string>;

/**
 * Form field configuration
 */
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'checkbox' | 'textarea';
  required?: boolean;
  placeholder?: string;
  validation?: ValidationRule[];
}

/**
 * Validation rule type
 */
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: number | string | RegExp;
  message: string;
  validator?: (value: unknown) => boolean;
}
