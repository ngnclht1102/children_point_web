/**
 * Form input component with label and error handling
 */

import React from 'react';
import { FormFieldProps } from '@/types';
import { cn } from '@/lib/utils';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className,
}: FormFieldProps & { className?: string }) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className='block text-sm font-medium text-gray-700'
        >
          {label}
          {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <div className={label ? 'mt-1' : ''}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(
            'block w-full appearance-none rounded-lg border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-500' : 'border-gray-300',
            disabled && 'cursor-not-allowed bg-gray-100 opacity-50'
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className='mt-1 text-sm text-red-600'
          role='alert'
        >
          {error}
        </p>
      )}
    </div>
  );
}
