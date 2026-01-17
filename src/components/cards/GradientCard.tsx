/**
 * Gradient card component with hover effects
 */

import React from 'react';
import { CardProps } from '@/types';
import { cn } from '@/lib/utils';
import { getGradientByIndex } from '@/lib/gradients';

interface GradientCardProps extends CardProps {
  gradientClass?: string;
}

export default function GradientCard({
  children,
  gradientClass,
  className,
  onClick,
}: GradientCardProps) {
  // Use provided gradient or fallback to a default (index 0)
  const gradient = gradientClass || getGradientByIndex(0);

  return (
    <div
      className={cn(
        gradient,
        'hover:scale-102 group relative h-full transform overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20'></div>
      <div className='relative z-10'>{children}</div>
    </div>
  );
}
