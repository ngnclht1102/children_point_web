/**
 * Checkbox input component with label
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxInputProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export default function CheckboxInput({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className,
}: CheckboxInputProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <input
        id={name}
        name={name}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
      />
      <label
        htmlFor={name}
        className={cn(
          'ml-2 block text-sm text-gray-700',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        {label}
      </label>
    </div>
  );
}
