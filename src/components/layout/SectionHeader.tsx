/**
 * Section header component with icon and gradient text
 */

import React from 'react';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  icon: IconType;
  gradientFrom?: string;
  gradientTo?: string;
  iconColor?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  icon: Icon,
  gradientFrom = 'from-indigo-600',
  gradientTo = 'to-purple-600',
  iconColor = 'text-indigo-600',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100 p-6',
        className
      )}
    >
      <h2
        className={cn(
          'flex items-center gap-3 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent',
          gradientFrom,
          gradientTo
        )}
      >
        <Icon className={iconColor} />
        {title}
      </h2>
    </div>
  );
}
