/**
 * Violation list item component
 */

import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import { Violation } from '@/types';

interface ViolationListItemProps {
  violation: Violation;
  gradientClass: string;
  onReport: (violation: Violation) => void;
}

export default function ViolationListItem({
  violation,
  gradientClass,
  onReport,
}: ViolationListItemProps) {
  return (
    <GradientCard gradientClass={gradientClass} className='h-full'>
      <div className='flex h-full flex-col justify-between'>
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <span className='rounded-full border border-red-100 bg-white/50 px-3 py-1 text-sm font-medium text-red-700 shadow-sm backdrop-blur-sm'>
              ID: {violation.id}
            </span>
            <PointsBadge points={violation.deductedPoints} variant='deducted' />
          </div>
          <h3 className='mb-3 text-lg font-semibold text-gray-800'>
            {violation.title}
          </h3>
        </div>
        <button
          onClick={() => onReport(violation)}
          className='ml-auto mt-4 flex w-full items-center justify-center gap-2 self-start rounded-lg border border-red-200 bg-white/50 px-4 py-1.5 text-sm text-red-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
        >
          <FiAlertTriangle className='h-4 w-4' />
          Báo cáo vi phạm
        </button>
      </div>
    </GradientCard>
  );
}
