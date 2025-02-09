import Layout from '@/components/layout/Layout';
import { API_URL } from '@/constant/env';
import React, { useState, useEffect } from 'react';
import { FiMoreVertical, FiTrendingUp, FiGift } from 'react-icons/fi';

const DEBUG_ON_PURECODEAI = false;
const ENV_DOMAIN = API_URL;
// const ENV_DOMAIN = 'http://localhost:8081';

// Mock data definitions
const mockOnYourHandGift: any = [
  {
    id: 1,
    title: 'Bánh kẹo',
    requiredPoints: 50,
    createdAt: '2025-02-08T03:10:32.309154Z',
  },
  {
    id: 3,
    title: 'Bút màu',
    requiredPoints: 70,
    createdAt: '2025-02-08T03:10:32.309154Z',
  },
  {
    id: 4,
    title: 'Truyện tranh',
    requiredPoints: 100,
    createdAt: '2025-02-08T03:10:32.309154Z',
  },
  {
    id: 10,
    title: 'Thú nhồi bông',
    requiredPoints: 90,
    createdAt: '2025-02-08T03:10:32.309154Z',
  },
  {
    id: 16,
    title: 'Chơi game 30 phút',
    requiredPoints: 90,
    createdAt: '2025-02-08T10:15:00.458132Z',
  },
];

const mockPointsHistory: any = [
  {
    id: 9,
    points: 50,
    note: 'Redeemed reward - Name: Bánh kẹo, Price: 50',
    type: 'deduct',
    createdAt: '2025-02-09T12:53:56.748Z',
    challenge: null,
    reward: {
      id: 1,
      title: 'Bánh kẹo',
      requiredPoints: 50,
      createdAt: '2025-02-08T03:10:32.309154Z',
    },
  },
  {
    id: 10,
    points: 70,
    note: 'Redeemed reward - Name: Bút màu, Price: 70',
    type: 'deduct',
    createdAt: '2025-02-09T12:55:00.089Z',
    challenge: null,
    reward: {
      id: 3,
      title: 'Bút màu',
      requiredPoints: 70,
      createdAt: '2025-02-08T03:10:32.309154Z',
    },
  },
];

const mockEarnedPointsHistory: any = [
  {
    id: 1,
    points: 55,
    note: 'Challenge completed: Học thuộc lòng một bài thơ',
    type: 'add',
    createdAt: '2025-02-09T10:09:52.120832Z',
    challenge: {
      id: 25,
      title: 'Học thuộc lòng một bài thơ',
      description: 'Thuộc lòng và đọc trôi chảy một bài thơ.',
      earnedPoints: 55,
      createdAt: '2025-02-08T09:29:49.131104Z',
    },
    reward: null,
  },
  {
    id: 2,
    points: 70,
    note: 'Challenge completed: Chạy bộ 1 km',
    type: 'add',
    createdAt: '2025-02-09T10:12:14.517Z',
    challenge: {
      id: 20,
      title: 'Chạy bộ 1 km',
      description: 'Thực hiện chạy bộ hoàn thành quãng đường 1 km.',
      earnedPoints: 70,
      createdAt: '2025-02-08T09:29:49.131104Z',
    },
    reward: null,
  },
];

const mockStats: any = {
  currentPoints: 15,
  todayEarnedPoints: 125,
  allTimeUsedPoints: 210,
};

const fetchActivities = async () => {
  try {
    const response = await fetch(ENV_DOMAIN + '/api/v1/rewards/in-your-hand');
    if (!response.ok) return mockOnYourHandGift;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi tải hoạt động:', error);
  }
};

const fetchPointsHistory = async () => {
  try {
    const response = await fetch(
      ENV_DOMAIN + '/api/v1/points-history/deduced/today'
    );
    if (!response.ok) return mockPointsHistory;
    const data = await response.json();
    return data.length > 0 ? data : mockPointsHistory;
  } catch (error) {
    console.error('Lỗi khi tải lịch sử điểm:', error);
  }
};

const fetchEarnedPointsHistory = async () => {
  try {
    const response = await fetch(
      ENV_DOMAIN + '/api/v1/points-history/earned/today'
    );
    if (!response.ok) return mockEarnedPointsHistory;
    const data = await response.json();
    return data.length > 0 ? data : mockEarnedPointsHistory;
  } catch (error) {
    console.error('Lỗi khi tải lịch sử điểm kiếm được:', error);
  }
};

const redeemReward = async (rewardId: number) => {
  try {
    const response = await fetch(
      ENV_DOMAIN + '/api/v1/rewards/redeem?reward_id=' + rewardId,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return false;
  }
};

const fetchPointsStatus = async () => {
  try {
    const response = await fetch(ENV_DOMAIN + '/api/v1/points/status');
    if (!response.ok) return mockStats;
    return await response.json();
  } catch (error) {
    console.error('Error fetching points status:', error);
  }
};

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

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
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

  useEffect(() => {
    if (DEBUG_ON_PURECODEAI) {
      setOnYourHandGift(mockOnYourHandGift);
      return;
    }

    const getActivities = async () => {
      setLoading(true);
      try {
        const data = await fetchActivities();
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
    if (DEBUG_ON_PURECODEAI) {
      setPointsHistory(mockPointsHistory);
      return;
    }

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
    if (DEBUG_ON_PURECODEAI) {
      setEarnedPointsHistory(mockEarnedPointsHistory);
      return;
    }

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
    if (DEBUG_ON_PURECODEAI) {
      setPointsStatus(mockStats);
      return;
    }

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
      const [pointsData, onYourHandGiftData] = await Promise.all([
        fetchPointsHistory(),
        fetchActivities(),
      ]);

      setPointsHistory(pointsData);
      setOnYourHandGift(onYourHandGiftData);
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          {[
            { label: 'Tổng điểm', value: pointsStatus.currentPoints },
            { label: 'Đã dùng', value: pointsStatus.allTimeUsedPoints },
            {
              label: 'Kiếm được hôm nay',
              value: pointsStatus.todayEarnedPoints,
            },
          ].map((stat, index) => (
            <div key={index} className='bg-white rounded-xl shadow-sm p-6'>
              <h3 className='text-gray-500 text-sm font-medium'>
                {stat.label}
              </h3>
              <p className='text-3xl font-bold mt-2'>
                {stat.value.toLocaleString()}
              </p>
              <div className='mt-4 h-32 bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 rounded-lg'></div>
            </div>
          ))}
        </div>

        <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-6'>
          <div className='p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3'>
              <FiTrendingUp className='text-indigo-600' />
              Thử thách được hoàn thành hôm nay
            </h2>
          </div>
          <div className='p-4 space-y-4'>
            {loadingEarned ? (
              <div className='text-center py-4'>
                <p className='text-gray-500'>
                  Đang tải lịch sử điểm kiếm được...
                </p>
              </div>
            ) : earnedError ? (
              <div className='text-center py-4'>
                <p className='text-red-500'>{earnedError}</p>
              </div>
            ) : earnedPointsHistory.length > 0 ? (
              earnedPointsHistory.map((item: any) => (
                <div
                  key={item.id}
                  className={`${getRandomGradient()} p-4 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 relative overflow-hidden group`}
                >
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-300'></div>
                  <div className='relative z-10'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-sm font-medium px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-indigo-700 shadow-sm border border-indigo-100'>
                        ID: {item.id}
                      </span>
                      <span className='text-green-600 font-bold px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm'>
                        +{item.points} điểm
                      </span>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                      {item.challenge.title}
                    </h3>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-1.5'>
                        <div className='w-2 h-2 rounded-full bg-purple-400 animate-pulse'></div>
                        <span className='text-sm font-medium'>Ghi chú:</span>
                        <span className='text-sm text-gray-600'>
                          {item.note}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-1.5'>
                        <div className='w-2 h-2 rounded-full bg-blue-400 animate-pulse'></div>
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
              <div className='text-center py-4'>
                <p className='text-gray-500'>
                  Không có điểm nào được kiếm hôm nay
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-6'>
          <div className='p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3'>
              <FiGift className='text-indigo-600' />
              Quà đã đổi hôm nay
            </h2>
          </div>
          <div className='p-4 space-y-4'>
            {loadingHistory ? (
              <div className='text-center py-4'>
                <p className='text-gray-500'>Đang tải lịch sử điểm...</p>
              </div>
            ) : historyError ? (
              <div className='text-center py-4'>
                <p className='text-red-500'>{historyError}</p>
              </div>
            ) : pointsHistory.length > 0 ? (
              pointsHistory.map((item: any) => (
                <div
                  key={item.id}
                  className={`${getRandomGradient()} p-4 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 relative overflow-hidden group`}
                >
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-300'></div>
                  <div className='relative z-10'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-sm font-medium px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-indigo-700 shadow-sm border border-indigo-100'>
                        ID: {item.id}
                      </span>
                      <span className='text-red-600 font-bold px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm'>
                        -{item.points} điểm
                      </span>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                      {item.reward.title}
                    </h3>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-1.5'>
                        <div className='w-2 h-2 rounded-full bg-purple-400 animate-pulse'></div>
                        <span className='text-sm font-medium'>Ghi chú:</span>
                        <span className='text-sm text-gray-600'>
                          {item.note}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-1.5'>
                        <div className='w-2 h-2 rounded-full bg-blue-400 animate-pulse'></div>
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
              <div className='text-center py-4'>
                <p className='text-gray-500'>
                  Không có điểm nào được dùng hôm nay
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3'>
              <FiGift className='text-indigo-600' />
              Quà trong tầm tay bạn
            </h2>
          </div>
          <div className='p-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {onYourHandGift &&
                onYourHandGift.map((row: any) => (
                  <div
                    key={row.id}
                    className={`${getRandomGradient()} p-4 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 relative overflow-hidden group h-full`}
                  >
                    <div className='absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-300'></div>
                    <div className='relative z-10 flex flex-col h-full'>
                      <div className='flex items-center justify-between mb-3'>
                        <span className='text-sm font-medium px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-indigo-700 shadow-sm border border-indigo-100'>
                          ID: {row.id}
                        </span>
                        <button className='p-1.5 rounded-full hover:bg-white/50 transition-colors'>
                          <FiMoreVertical size={18} className='text-gray-600' />
                        </button>
                      </div>
                      <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3'>
                        <FiGift className='text-purple-500 text-xl' />
                        {row.title}
                      </h3>
                      <div className='mt-auto space-y-2'>
                        <div className='flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-1.5'>
                          <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></div>
                          <span className='text-sm font-medium'>Points:</span>
                          <span className='text-sm text-purple-600 font-bold'>
                            {row.requiredPoints}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-1.5'>
                          <div className='w-2 h-2 rounded-full bg-blue-400 animate-pulse'></div>
                          <span className='text-sm font-medium'>Created:</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedReward(row);
                            setShowModal(true);
                          }}
                          className='w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                        >
                          <FiGift size={18} />
                          Đổi phần thưởng
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {showModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4'>
              <h3 className='text-xl font-bold mb-4'>Xác nhận đổi quà</h3>
              <p className='mb-4'>
                Bạn có chắc chắn muốn đổi {selectedReward?.title} với{' '}
                {selectedReward?.requiredPoints} điểm?
              </p>
              <div className='flex justify-end gap-4'>
                <button
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors'
                >
                  Hủy
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                  className='px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50'
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

export default DashboardLayout;
