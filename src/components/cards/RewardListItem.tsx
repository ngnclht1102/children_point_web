/**
 * Reward list item component
 */

import React from 'react';
import { FiGift } from 'react-icons/fi';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import { Reward } from '@/types';

interface RewardListItemProps {
  reward: Reward;
  gradientClass: string;
  onRedeem: (reward: Reward) => void;
}

export default function RewardListItem({
  reward,
  gradientClass,
  onRedeem,
}: RewardListItemProps) {
  return (
    <GradientCard gradientClass={gradientClass} className='h-full'>
      <div className='flex h-full flex-col justify-between'>
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
              ID: {reward.id}
            </span>
            <PointsBadge points={reward.requiredPoints} variant='required' />
          </div>
          <h3 className='mb-3 text-lg font-semibold text-gray-800'>
            {reward.title}
          </h3>
        </div>
        <button
          onClick={() => onRedeem(reward)}
          className='ml-auto mt-4 flex w-full items-center justify-center gap-2 self-start rounded-lg border border-indigo-200 bg-white/50 px-4 py-1.5 text-sm text-indigo-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
        >
          <FiGift className='h-4 w-4' />
          Đổi phần thưởng
        </button>
      </div>
    </GradientCard>
  );
}
