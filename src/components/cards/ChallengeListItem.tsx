/**
 * Challenge list item component
 */

import React from 'react';
import { FiFlag } from 'react-icons/fi';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import { Challenge } from '@/types';

interface ChallengeListItemProps {
  challenge: Challenge;
  gradientClass: string;
  onFinish: (challenge: Challenge) => void;
}

export default function ChallengeListItem({
  challenge,
  gradientClass,
  onFinish,
}: ChallengeListItemProps) {
  return (
    <GradientCard gradientClass={gradientClass} className='h-full'>
      <div className='flex h-full flex-col justify-between'>
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
              ID: {challenge.id}
            </span>
            <PointsBadge points={challenge.earnedPoints} variant='earned' />
          </div>
          <h3 className='mb-3 text-lg font-semibold text-gray-800'>
            {challenge.title}
          </h3>
        </div>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 backdrop-blur-sm'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-purple-400'></div>
            <span className='text-sm font-medium'>Nội dung thử thách:</span>
            <span className='text-sm text-gray-600'>
              {challenge.description}
            </span>
          </div>
          <div className='flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 backdrop-blur-sm'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-blue-400'></div>
            <span className='text-sm font-medium'>
              Hoàn thành sẽ kiếm được:
            </span>
            <span className='text-sm text-gray-600'>
              {challenge.earnedPoints}
            </span>
          </div>
        </div>
        <button
          onClick={() => onFinish(challenge)}
          className='ml-auto mt-4 flex w-full items-center justify-center gap-2 self-start rounded-lg border border-indigo-200 bg-white/50 px-4 py-1.5 text-sm text-indigo-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
        >
          <FiFlag className='h-4 w-4' />
          Hoàn thành thử thách
        </button>
      </div>
    </GradientCard>
  );
}
