/**
 * Error message component
 */

import React from 'react';
import { BaseComponentProps } from '@/types';
import { cn } from '@/lib/utils';

interface ErrorMessageProps extends BaseComponentProps {
  message: string;
}

export default function ErrorMessage({
  message,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn('py-4 text-center', className)}
      role='alert'
      aria-live='assertive'
    >
      <p className='text-red-500'>{message}</p>
    </div>
  );
}
