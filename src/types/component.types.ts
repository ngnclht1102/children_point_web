/**
 * Component prop types
 */

import { ReactNode } from 'react';

/**
 * Base component props
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Form field props
 */
export interface FormFieldProps {
  label?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

/**
 * Modal component props
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

/**
 * Card component props
 */
export interface CardProps extends BaseComponentProps {
  onClick?: () => void;
  gradientClass?: string;
}
