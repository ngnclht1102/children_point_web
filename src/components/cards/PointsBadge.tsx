/**
 * Points badge component
 */

import React from 'react';
import { cn } from '@/lib/utils';

type PointsBadgeVariant = 'earned' | 'deducted' | 'required';

interface PointsBadgeProps {
  points: number;
  variant: PointsBadgeVariant;
  className?: string;
}

export default function PointsBadge({
  points,
  variant,
  className,
}: PointsBadgeProps) {
  const variantStyles = {
    earned: 'text-green-600',
    deducted: 'text-red-600',
    required: 'text-indigo-600',
  };

  const prefix = variant === 'deducted' ? '-' : variant === 'earned' ? '+' : '';

  return (
    <span
      className={cn(
        'rounded-full bg-white/50 px-3 py-1 font-bold backdrop-blur-sm',
        variantStyles[variant],
        className
      )}
    >
      {prefix}
      {points} điểm
    </span>
  );
}
