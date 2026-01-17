/**
 * Statistics card component for dashboard
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: number | string;
  className?: string;
}

export default function StatsCard({ label, value, className }: StatsCardProps) {
  const formattedValue =
    typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div className={cn('rounded-xl bg-white p-6 shadow-sm', className)}>
      <h3 className='text-sm font-medium text-gray-500'>{label}</h3>
      <p className='mt-2 text-3xl font-bold text-gray-900'>{formattedValue}</p>
      <div className='mt-4 h-32 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-500/5'></div>
    </div>
  );
}
