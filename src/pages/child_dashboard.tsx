'use client';

import Layout from '@/components/layout/Layout';
import React, { useState, useEffect } from 'react';
import { FiFlag, FiAlertTriangle, FiGift } from 'react-icons/fi';
import SectionHeader from '@/components/layout/SectionHeader';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import StatsCard from '@/components/dashboard/StatsCard';
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
import { getRandomGradient } from '@/lib/gradients';
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

  const handleRedeem = async () => {
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
  };

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
              earnedPointsHistory.map((item) => (
                <GradientCard key={item.id} gradientClass={getRandomGradient()}>
                  <div>
                    <div className='mb-3 flex items-center justify-between'>
                      <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                        ID: {item.id}
                      </span>
                      <PointsBadge points={item.points} variant='earned' />
                    </div>
                    <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                      {item.challenge.title}
                    </h3>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 backdrop-blur-sm'>
                        <div className='h-2 w-2 animate-pulse rounded-full bg-purple-400'></div>
                        <span className='text-sm font-medium'>Ghi chú:</span>
                        <span className='text-sm text-gray-600'>
                          {item.note}
                        </span>
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
              ))
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
              pointsHistory.map((item) => (
                <GradientCard key={item.id} gradientClass={getRandomGradient()}>
                  <div>
                    <div className='mb-3 flex items-center justify-between'>
                      <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                        ID: {item.id}
                      </span>
                      <PointsBadge points={item.points} variant='deducted' />
                    </div>
                    <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                      {item.reward?.title}
                    </h3>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 backdrop-blur-sm'>
                        <div className='h-2 w-2 animate-pulse rounded-full bg-purple-400'></div>
                        <span className='text-sm font-medium'>Ghi chú:</span>
                        <span className='text-sm text-gray-600'>
                          {item.note}
                        </span>
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
              ))
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
              violationsHistory.map((item) => (
                <GradientCard key={item.id} gradientClass={getRandomGradient()}>
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
                        <span className='text-sm text-gray-600'>
                          {item.note}
                        </span>
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
              ))
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
                onYourHandGift.map((row) => (
                  <GradientCard
                    key={row.id}
                    gradientClass={getRandomGradient()}
                    className='h-full'
                  >
                    <div className='flex h-full flex-col justify-between'>
                      <div>
                        <div className='mb-3 flex items-center justify-between'>
                          <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                            ID: {row.id}
                          </span>
                          <PointsBadge
                            points={row.requiredPoints}
                            variant='required'
                          />
                        </div>
                        <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                          {row.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedReward(row);
                          setShowModal(true);
                        }}
                        className='ml-auto mt-4 flex w-full items-center justify-center gap-2 self-start rounded-lg border border-indigo-200 bg-white/50 px-4 py-1.5 text-sm text-indigo-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                      >
                        <FiGift className='h-4 w-4' />
                        Đổi phần thưởng
                      </button>
                    </div>
                  </GradientCard>
                ))
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
          onCancel={() => {
            setShowModal(false);
            setSelectedReward(null);
          }}
          isLoading={isRedeeming}
        />
      </div>
    </Layout>
  );
};

export default ChildDashboardLayout;
