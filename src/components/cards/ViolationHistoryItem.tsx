/**
 * Violation history item component
 */

import React from 'react';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import { ViolationHistory } from '@/types';

interface ViolationHistoryItemProps {
  item: ViolationHistory;
  gradientClass: string;
}

export default function ViolationHistoryItem({
  item,
  gradientClass,
}: ViolationHistoryItemProps) {
  return (
    <GradientCard gradientClass={gradientClass}>
      <div>
        <div className='mb-3 flex items-center justify-between'>
          <span className='rounded-full border border-red-100 bg-white/50 px-3 py-1 text-sm font-medium text-red-700 shadow-sm backdrop-blur-sm'>
            ID: {item.id}
          </span>
          <PointsBadge points={item.points} variant='deducted' />
        </div>
        <h3 className='mb-3 text-lg font-semibold text-gray-800'>
          {item.violation.title}
        </h3>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 backdrop-blur-sm'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-purple-400'></div>
            <span className='text-sm font-medium'>Ghi chú:</span>
            <span className='text-sm text-gray-600'>{item.note}</span>
          </div>
          <div className='flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 backdrop-blur-sm'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-blue-400'></div>
            <span className='text-sm font-medium'>Thời gian:</span>
            <span className='text-sm text-gray-600'>
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </GradientCard>
  );
}
