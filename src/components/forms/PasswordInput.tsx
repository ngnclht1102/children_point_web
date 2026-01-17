/**
 * Password input component with show/hide toggle
 */

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FormFieldProps } from '@/types';
import { cn } from '@/lib/utils';

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className,
}: FormFieldProps & { className?: string }) {
  const [showPassword, setShowPassword] = useState(false);

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
      <div className={label ? 'relative mt-1' : 'relative'}>
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(
            'block w-full appearance-none rounded-lg border py-2 pl-3 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-500' : 'border-gray-300',
            disabled && 'cursor-not-allowed bg-gray-100 opacity-50'
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className='absolute inset-y-0 right-0 flex items-center pr-3'
          aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
        >
          {showPassword ? (
            <FaEyeSlash className='text-gray-400 hover:text-gray-600' />
          ) : (
            <FaEye className='text-gray-400 hover:text-gray-600' />
          )}
        </button>
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
