'use-client';

import Layout from '@/components/layout/Layout';
import React, { useState, useEffect } from 'react';
import { FiFlag, FiAlertTriangle, FiGift } from 'react-icons/fi';
import {
  fetchEarnedPointsHistory,
  fetchOnYourHand,
  fetchPointsHistory,
  fetchPointsStatus,
  fetchTodayViolations,
  redeemReward,
} from '@/lib/api';

const gradientClasses = [
  'bg-gradient-to-r from-rose-100 via-pink-100 to-purple-100',
  'bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100',
  'bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100',
  'bg-gradient-to-r from-emerald-100 via-green-100 to-lime-100',
  'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100',
];

const getRandomGradient = () => {
  return gradientClasses[Math.floor(Math.random() * gradientClasses.length)];
};

const ChildDashboardLayout = () => {
  const [onYourHandGift, setOnYourHandGift] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [earnedPointsHistory, setEarnedPointsHistory] = useState([]);
  const [loadingEarned, setLoadingEarned] = useState(true);
  const [earnedError, setEarnedError] = useState(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const [pointsStatus, setPointsStatus] = useState({
    currentPoints: 0,
    todayEarnedPoints: 0,
    allTimeUsedPoints: 0,
  });

  const [violationsHistory, setViolationsHistory] = useState([]);
  const [loadingViolations, setLoadingViolations] = useState(true);
  const [violationsError, setViolationsError] = useState(null);

  useEffect(() => {
    const getViolationsHistory = async () => {
      setLoadingViolations(true);
      try {
        const data = await fetchTodayViolations();
        setViolationsHistory(data);
      } catch (err: any) {
        setViolationsError(err.message);
      } finally {
        setLoadingViolations(false);
      }
    };
    getViolationsHistory();
  }, []);

  useEffect(() => {
    const getActivities = async () => {
      setLoading(true);
      try {
        const data = await fetchOnYourHand();
        setOnYourHandGift(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getActivities();
  }, []);

  useEffect(() => {
    const getPointsHistory = async () => {
      setLoadingHistory(true);
      try {
        const data = await fetchPointsHistory();
        setPointsHistory(data);
      } catch (err: any) {
        setHistoryError(err.message);
      } finally {
        setLoadingHistory(false);
      }
    };
    getPointsHistory();
  }, []);

  useEffect(() => {
    const getEarnedPointsHistory = async () => {
      setLoadingEarned(true);
      try {
        const data = await fetchEarnedPointsHistory();
        setEarnedPointsHistory(data);
      } catch (err: any) {
        setEarnedError(err.message);
      } finally {
        setLoadingEarned(false);
      }
    };
    getEarnedPointsHistory();
  }, []);

  useEffect(() => {
    const getPointsStatus = async () => {
      try {
        const data = await fetchPointsStatus();
        setPointsStatus(data);
      } catch (err: any) {
        console.error('Error fetching points status:', err);
      }
    };
    getPointsStatus();
  }, []);

  const handleRedeem = async () => {
    if (!selectedReward) return;

    setIsRedeeming(true);
    const success = await redeemReward(selectedReward.id as unknown as number);

    if (success) {
      // Reload data after successful redeem
      const [pointsData] = await Promise.all([fetchPointsHistory()]);

      setPointsHistory(pointsData);
      alert('Đổi quà thành công!');
    } else {
      alert('Đổi quà không thành công. Vui lòng thử lại sau!');
    }

    setIsRedeeming(false);
    setShowModal(false);
    setSelectedReward(null);
  };
  return (
    <Layout>
      <div className='p-6'>
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {[
            {
              label: 'Tổng điểm hiện có',
              value: pointsStatus?.currentPoints || 0,
            },
            {
              label: 'Kiếm được hôm nay',
              value: pointsStatus?.todayEarnedPoints || 0,
            },
          ].map((stat, index) => (
            <div key={index} className='rounded-xl bg-white p-6 shadow-sm'>
              <h3 className='text-sm font-medium text-gray-500'>
                {stat.label}
              </h3>
              <p className='mt-2 text-3xl font-bold'>
                {stat.value.toLocaleString()}
              </p>
              <div className='mt-4 h-32 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-500/5'></div>
            </div>
          ))}
        </div>

        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <div className='border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100 p-6'>
            <h2 className='flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent'>
              <FiFlag className='text-indigo-600' />
              Thử thách được hoàn thành hôm nay
            </h2>
          </div>
          <div className='space-y-4 p-4'>
            {loadingEarned ? (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>
                  Đang tải thử thách được hoàn thành hôm nay...
                </p>
              </div>
            ) : earnedError ? (
              <div className='py-4 text-center'>
                <p className='text-red-500'>{earnedError}</p>
              </div>
            ) : earnedPointsHistory?.length > 0 ? (
              earnedPointsHistory?.map((item: any) => (
                <div
                  key={item.id}
                  className={`${getRandomGradient()} hover:scale-102 group relative transform overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20'></div>
                  <div className='relative z-10'>
                    <div className='mb-3 flex items-center justify-between'>
                      <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                        ID: {item.id}
                      </span>
                      <span className='rounded-full bg-white/50 px-3 py-1 font-bold text-green-600 backdrop-blur-sm'>
                        +{item.points} điểm
                      </span>
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
                </div>
              ))
            ) : (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>
                  Chưa có thử thách nào hoàn thành, bé hãy cố gắng hoàn thành
                  thử thách và tích điểm nhé
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <div className='border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100 p-6'>
            <h2 className='flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent'>
              <FiGift className='text-indigo-600' />
              Quà đã đổi hôm nay
            </h2>
          </div>
          <div className='space-y-4 p-4'>
            {loadingHistory ? (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>Đang tải lịch sử điểm...</p>
              </div>
            ) : historyError ? (
              <div className='py-4 text-center'>
                <p className='text-red-500'>{historyError}</p>
              </div>
            ) : pointsHistory?.length > 0 ? (
              pointsHistory?.map((item: any) => (
                <div
                  key={item.id}
                  className={`${getRandomGradient()} hover:scale-102 group relative transform overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20'></div>
                  <div className='relative z-10'>
                    <div className='mb-3 flex items-center justify-between'>
                      <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                        ID: {item.id}
                      </span>
                      <span className='rounded-full bg-white/50 px-3 py-1 font-bold text-red-600 backdrop-blur-sm'>
                        -{item.points} điểm
                      </span>
                    </div>
                    <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                      {item?.reward?.title}
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
                </div>
              ))
            ) : (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>
                  Bé chưa đổi được món quà nào hôm nay, bé hãy cố gắng tích điểm
                  nhé...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <div className='border-b border-gray-200 bg-gradient-to-r from-red-100 to-orange-100 p-6'>
            <h2 className='flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent'>
              <FiAlertTriangle className='text-red-600' />
              Vi phạm hôm nay
            </h2>
          </div>
          <div className='space-y-4 p-4'>
            {loadingViolations ? (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>Đang tải lịch sử vi phạm...</p>
              </div>
            ) : violationsError ? (
              <div className='py-4 text-center'>
                <p className='text-red-500'>{violationsError}</p>
              </div>
            ) : violationsHistory?.length > 0 ? (
              violationsHistory?.map((item: any) => (
                <div
                  key={item.id}
                  className={`${getRandomGradient()} hover:scale-102 group relative transform overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20'></div>
                  <div className='relative z-10'>
                    <div className='mb-3 flex items-center justify-between'>
                      <span className='rounded-full border border-red-100 bg-white/50 px-3 py-1 text-sm font-medium text-red-700 shadow-sm backdrop-blur-sm'>
                        ID: {item.id}
                      </span>
                      <span className='rounded-full bg-white/50 px-3 py-1 font-bold text-red-600 backdrop-blur-sm'>
                        {item.points} điểm
                      </span>
                    </div>
                    <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                      {item?.violation?.title}
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
                </div>
              ))
            ) : (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>
                  Hôm nay bé chưa vi phạm lỗi nào, hãy tiếp tục giữ vững phong
                  độ nhé!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='overflow-hidden rounded-xl bg-white shadow-sm'>
          <div className='border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100 p-6'>
            <h2 className='flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent'>
              <FiGift className='text-indigo-600' />
              Quà trong tầm tay bé
            </h2>
          </div>
          <div className='p-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {onYourHandGift && onYourHandGift.length > 0 ? (
                onYourHandGift.map((row: any) => (
                  <div
                    key={row.id}
                    className={`${getRandomGradient()} hover:scale-102 group relative h-full transform overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20'></div>
                    <div className='relative z-10 flex h-full flex-col justify-between'>
                      <div>
                        <div className='mb-3 flex items-center justify-between'>
                          <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                            ID: {row.id}
                          </span>
                          <span className='rounded-full bg-white/50 px-3 py-1 font-bold text-green-600 backdrop-blur-sm'>
                            {row.requiredPoints} điểm
                          </span>
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
                  </div>
                ))
              ) : (
                <div className='py-4 text-center'>
                  <p className='text-gray-500'>
                    Chưa có món quà nào bé có thể đổi, cố gắng tích điểm nhiều
                    lên nhé bé...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='mx-4 w-full max-w-md rounded-xl bg-white p-6'>
              <h3 className='mb-4 text-xl font-bold'>Xác nhận đổi quà</h3>
              <p className='mb-4'>
                Bé có chắc chắn muốn đổi {selectedReward?.title} với{' '}
                {selectedReward?.requiredPoints} điểm?
              </p>
              <div className='flex justify-end gap-4'>
                <button
                  onClick={() => setShowModal(false)}
                  className='rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200'
                >
                  Hủy
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                  className='rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50'
                >
                  {isRedeeming ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChildDashboardLayout;
