/**
 * Empty state component
 */

import React from 'react';
import { BaseComponentProps } from '@/types';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends BaseComponentProps {
  message: string;
}

export default function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn('py-4 text-center', className)}
      role='status'
      aria-live='polite'
    >
      <p className='text-gray-500'>{message}</p>
    </div>
  );
}
