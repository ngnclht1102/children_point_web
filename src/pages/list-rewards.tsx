import Layout from '@/components/layout/Layout';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiGift } from 'react-icons/fi';
import SectionHeader from '@/components/layout/SectionHeader';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import RewardListItem from '@/components/cards/RewardListItem';
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

  // Memoize the rewards list to prevent unnecessary re-renders
  const rewardsList = useMemo(() => {
    return rewards.map((item) => (
      <RewardListItem
        key={item.id}
        reward={item}
        gradientClass={rewardGradients.get(item.id) || getGradientByIndex(0)}
        onRedeem={handleOpenModal}
      />
    ));
  }, [rewards, rewardGradients, handleOpenModal]);

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
                {rewardsList}
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
