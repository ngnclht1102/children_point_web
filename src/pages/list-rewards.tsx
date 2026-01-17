import Layout from '@/components/layout/Layout';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiGift } from 'react-icons/fi';
import SectionHeader from '@/components/layout/SectionHeader';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import { getRewards, redeemReward } from '@/lib/services/rewards.service';
import { getGradientByIndex } from '@/lib/gradients';
import { Reward } from '@/types';

const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [loadingRewardsError, setLoadingRewardsError] = useState<string | null>(
    null
  );
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Generate stable gradients for each reward based on ID
  // Only recalculate when rewards array changes
  const rewardGradients = useMemo(() => {
    const gradientMap = new Map<number, string>();
    rewards.forEach((reward) => {
      gradientMap.set(reward.id, getGradientByIndex(reward.id));
    });
    return gradientMap;
  }, [rewards]);

  useEffect(() => {
    const getRewardsFn = async () => {
      setLoadingRewards(true);
      setLoadingRewardsError(null);
      const response = await getRewards();

      if (response.success && response.data) {
        setRewards(response.data);
      } else {
        setLoadingRewardsError(
          response.error?.message || 'Không thể tải danh sách phần thưởng'
        );
      }

      setLoadingRewards(false);
    };
    getRewardsFn();
  }, []);

  const handleRedeem = useCallback(async () => {
    if (!selectedReward) return;

    setIsRedeeming(true);
    const response = await redeemReward({
      rewardId: selectedReward.id,
    });

    if (response.success && response.data) {
      alert('Đổi phần thưởng thành công!');
    } else {
      alert(
        response.error?.message ||
          'Không thể đổi phần thưởng. Vui lòng thử lại sau!'
      );
    }

    setIsRedeeming(false);
    setShowModal(false);
    setSelectedReward(null);
  }, [selectedReward]);

  const handleOpenModal = useCallback((item: Reward) => {
    setSelectedReward(item);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedReward(null);
  }, []);

  return (
    <Layout>
      <div className='p-6'>
        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <SectionHeader
            title='Danh sách phần thưởng'
            icon={FiGift}
            gradientFrom='from-indigo-600'
            gradientTo='to-purple-600'
            iconColor='text-indigo-600'
          />
          <div className='p-4'>
            {loadingRewards ? (
              <LoadingState message='Đang tải danh sách phần thưởng...' />
            ) : loadingRewardsError ? (
              <ErrorMessage message={loadingRewardsError} />
            ) : rewards.length > 0 ? (
              <div className='grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {rewards.map((item) => (
                  <GradientCard
                    key={item.id}
                    gradientClass={
                      rewardGradients.get(item.id) || getGradientByIndex(0)
                    }
                    className='h-full'
                  >
                    <div className='flex h-full flex-col justify-between'>
                      <div>
                        <div className='mb-3 flex items-center justify-between'>
                          <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                            ID: {item.id}
                          </span>
                          <PointsBadge
                            points={item.requiredPoints}
                            variant='required'
                          />
                        </div>
                        <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                          {item.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleOpenModal(item)}
                        className='ml-auto mt-4 flex w-full items-center justify-center gap-2 self-start rounded-lg border border-indigo-200 bg-white/50 px-4 py-1.5 text-sm text-indigo-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                      >
                        <FiGift className='h-4 w-4' />
                        Đổi phần thưởng
                      </button>
                    </div>
                  </GradientCard>
                ))}
              </div>
            ) : (
              <EmptyState message='Không có phần thưởng nào' />
            )}
          </div>
        </div>

        <ConfirmationModal
          isOpen={showModal}
          title='Xác nhận đổi phần thưởng'
          message='Bạn có chắc muốn đổi phần thưởng này?'
          confirmText='Xác nhận'
          cancelText='Hủy'
          onConfirm={handleRedeem}
          onCancel={handleCloseModal}
          isLoading={isRedeeming}
        />
      </div>
    </Layout>
  );
};

export default Rewards;
