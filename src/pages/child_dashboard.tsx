'use client';

import Layout from '@/components/layout/Layout';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiFlag, FiAlertTriangle, FiGift } from 'react-icons/fi';
import SectionHeader from '@/components/layout/SectionHeader';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import StatsCard from '@/components/dashboard/StatsCard';
import RewardListItem from '@/components/cards/RewardListItem';
import EarnedPointsHistoryItem from '@/components/cards/EarnedPointsHistoryItem';
import PointsHistoryItem from '@/components/cards/PointsHistoryItem';
import ViolationHistoryItem from '@/components/cards/ViolationHistoryItem';
import { getPointsStatus } from '@/lib/services/points.service';
import {
  getEarnedPointsHistory,
  getPointsHistory,
} from '@/lib/services/pointsHistory.service';
import { getTodayViolations } from '@/lib/services/violations.service';
import {
  getRewardsInYourHand,
  redeemReward,
} from '@/lib/services/rewards.service';
import { getGradientByIndex } from '@/lib/gradients';
import {
  PointsStatus,
  EarnedPointsHistory,
  PointsHistory,
  ViolationHistory,
  Reward,
} from '@/types';

const ChildDashboardLayout = () => {
  const [onYourHandGift, setOnYourHandGift] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [earnedPointsHistory, setEarnedPointsHistory] = useState<
    EarnedPointsHistory[]
  >([]);
  const [loadingEarned, setLoadingEarned] = useState(true);
  const [earnedError, setEarnedError] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const [pointsStatus, setPointsStatus] = useState<PointsStatus>({
    currentPoints: 0,
    todayEarnedPoints: 0,
    allTimeUsedPoints: 0,
  });

  const [violationsHistory, setViolationsHistory] = useState<
    ViolationHistory[]
  >([]);
  const [loadingViolations, setLoadingViolations] = useState(true);
  const [violationsError, setViolationsError] = useState<string | null>(null);

  // Generate stable gradients for each data set based on ID
  const earnedPointsGradients = useMemo(() => {
    const gradientMap = new Map<number, string>();
    earnedPointsHistory.forEach((item) => {
      gradientMap.set(item.id, getGradientByIndex(item.id));
    });
    return gradientMap;
  }, [earnedPointsHistory]);

  const pointsHistoryGradients = useMemo(() => {
    const gradientMap = new Map<number, string>();
    pointsHistory.forEach((item) => {
      gradientMap.set(item.id, getGradientByIndex(item.id));
    });
    return gradientMap;
  }, [pointsHistory]);

  const violationsHistoryGradients = useMemo(() => {
    const gradientMap = new Map<number, string>();
    violationsHistory.forEach((item) => {
      gradientMap.set(item.id, getGradientByIndex(item.id));
    });
    return gradientMap;
  }, [violationsHistory]);

  const rewardsGradients = useMemo(() => {
    const gradientMap = new Map<number, string>();
    onYourHandGift.forEach((reward) => {
      gradientMap.set(reward.id, getGradientByIndex(reward.id));
    });
    return gradientMap;
  }, [onYourHandGift]);

  useEffect(() => {
    const getViolationsHistory = async () => {
      setLoadingViolations(true);
      setViolationsError(null);
      const response = await getTodayViolations();

      if (response.success && response.data) {
        setViolationsHistory(response.data);
      } else {
        setViolationsError(
          response.error?.message || 'Không thể tải lịch sử vi phạm'
        );
      }

      setLoadingViolations(false);
    };
    getViolationsHistory();
  }, []);

  useEffect(() => {
    const getActivities = async () => {
      setLoading(true);
      setError(null);
      const response = await getRewardsInYourHand();

      if (response.success && response.data) {
        setOnYourHandGift(response.data);
      } else {
        setError(response.error?.message || 'Không thể tải quà trong tầm tay');
      }

      setLoading(false);
    };
    getActivities();
  }, []);

  useEffect(() => {
    const getPointsHistoryFn = async () => {
      setLoadingHistory(true);
      setHistoryError(null);
      const response = await getPointsHistory();

      if (response.success && response.data) {
        setPointsHistory(response.data);
      } else {
        setHistoryError(
          response.error?.message || 'Không thể tải lịch sử điểm'
        );
      }

      setLoadingHistory(false);
    };
    getPointsHistoryFn();
  }, []);

  useEffect(() => {
    const getEarnedPointsHistoryFn = async () => {
      setLoadingEarned(true);
      setEarnedError(null);
      const response = await getEarnedPointsHistory();

      if (response.success && response.data) {
        setEarnedPointsHistory(response.data);
      } else {
        setEarnedError(
          response.error?.message ||
            'Không thể tải thử thách được hoàn thành hôm nay'
        );
      }

      setLoadingEarned(false);
    };
    getEarnedPointsHistoryFn();
  }, []);

  useEffect(() => {
    const getPointsStatusFn = async () => {
      const response = await getPointsStatus();

      if (response.success && response.data) {
        setPointsStatus(response.data);
      }
    };
    getPointsStatusFn();
  }, []);

  const handleRedeem = useCallback(async () => {
    if (!selectedReward) return;

    setIsRedeeming(true);
    const response = await redeemReward({
      rewardId: selectedReward.id,
    });

    if (response.success && response.data) {
      // Reload data after successful redeem
      const pointsResponse = await getPointsHistory();
      if (pointsResponse.success && pointsResponse.data) {
        setPointsHistory(pointsResponse.data);
      }

      alert('Đổi quà thành công!');
    } else {
      alert(
        response.error?.message ||
          'Đổi quà không thành công. Vui lòng thử lại sau!'
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

  // Memoize all lists to prevent unnecessary re-renders
  const earnedPointsList = useMemo(() => {
    return earnedPointsHistory.map((item) => (
      <EarnedPointsHistoryItem
        key={item.id}
        item={item}
        gradientClass={
          earnedPointsGradients.get(item.id) || getGradientByIndex(0)
        }
      />
    ));
  }, [earnedPointsHistory, earnedPointsGradients]);

  const pointsHistoryList = useMemo(() => {
    return pointsHistory.map((item) => (
      <PointsHistoryItem
        key={item.id}
        item={item}
        gradientClass={
          pointsHistoryGradients.get(item.id) || getGradientByIndex(0)
        }
      />
    ));
  }, [pointsHistory, pointsHistoryGradients]);

  const violationsHistoryList = useMemo(() => {
    return violationsHistory.map((item) => (
      <ViolationHistoryItem
        key={item.id}
        item={item}
        gradientClass={
          violationsHistoryGradients.get(item.id) || getGradientByIndex(0)
        }
      />
    ));
  }, [violationsHistory, violationsHistoryGradients]);

  const rewardsList = useMemo(() => {
    return onYourHandGift.map((row) => (
      <RewardListItem
        key={row.id}
        reward={row}
        gradientClass={rewardsGradients.get(row.id) || getGradientByIndex(0)}
        onRedeem={handleOpenModal}
      />
    ));
  }, [onYourHandGift, rewardsGradients, handleOpenModal]);

  return (
    <Layout>
      <div className='p-6'>
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
          <StatsCard
            label='Tổng điểm hiện có'
            value={pointsStatus.currentPoints}
          />
          <StatsCard
            label='Kiếm được hôm nay'
            value={pointsStatus.todayEarnedPoints}
          />
        </div>

        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <SectionHeader
            title='Thử thách được hoàn thành hôm nay'
            icon={FiFlag}
            gradientFrom='from-indigo-600'
            gradientTo='to-purple-600'
            iconColor='text-indigo-600'
          />
          <div className='space-y-4 p-4'>
            {loadingEarned ? (
              <LoadingState message='Đang tải thử thách được hoàn thành hôm nay...' />
            ) : earnedError ? (
              <ErrorMessage message={earnedError} />
            ) : earnedPointsHistory.length > 0 ? (
              earnedPointsList
            ) : (
              <EmptyState message='Chưa có thử thách nào hoàn thành, bé hãy cố gắng hoàn thành thử thách và tích điểm nhé' />
            )}
          </div>
        </div>

        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <SectionHeader
            title='Quà đã đổi hôm nay'
            icon={FiGift}
            gradientFrom='from-indigo-600'
            gradientTo='to-purple-600'
            iconColor='text-indigo-600'
          />
          <div className='space-y-4 p-4'>
            {loadingHistory ? (
              <LoadingState message='Đang tải lịch sử điểm...' />
            ) : historyError ? (
              <ErrorMessage message={historyError} />
            ) : pointsHistory.length > 0 ? (
              pointsHistoryList
            ) : (
              <EmptyState message='Bé chưa đổi được món quà nào hôm nay, bé hãy cố gắng tích điểm nhé...' />
            )}
          </div>
        </div>

        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <SectionHeader
            title='Vi phạm hôm nay'
            icon={FiAlertTriangle}
            gradientFrom='from-red-600'
            gradientTo='to-orange-600'
            iconColor='text-red-600'
          />
          <div className='space-y-4 p-4'>
            {loadingViolations ? (
              <LoadingState message='Đang tải lịch sử vi phạm...' />
            ) : violationsError ? (
              <ErrorMessage message={violationsError} />
            ) : violationsHistory.length > 0 ? (
              violationsHistoryList
            ) : (
              <EmptyState message='Hôm nay bé chưa vi phạm lỗi nào, hãy tiếp tục giữ vững phong độ nhé!' />
            )}
          </div>
        </div>

        <div className='overflow-hidden rounded-xl bg-white shadow-sm'>
          <SectionHeader
            title='Quà trong tầm tay bé'
            icon={FiGift}
            gradientFrom='from-indigo-600'
            gradientTo='to-purple-600'
            iconColor='text-indigo-600'
          />
          <div className='p-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {loading ? (
                <LoadingState message='Đang tải quà trong tầm tay...' />
              ) : error ? (
                <ErrorMessage message={error} />
              ) : onYourHandGift.length > 0 ? (
                rewardsList
              ) : (
                <EmptyState message='Chưa có món quà nào bé có thể đổi, cố gắng tích điểm nhiều lên nhé bé...' />
              )}
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showModal}
          title='Xác nhận đổi quà'
          message={`Bé có chắc chắn muốn đổi ${selectedReward?.title} với ${selectedReward?.requiredPoints} điểm?`}
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

export default ChildDashboardLayout;
