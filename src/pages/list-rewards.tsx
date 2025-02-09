import Layout from '@/components/layout/Layout';
import { API_URL } from '@/constant/env';
import React, { useState, useCallback, useEffect } from 'react';
import { FiGift } from 'react-icons/fi';

const DEBUG_ON_PURECODEAI = false;
const ENV_DOMAIN = API_URL;
// const ENV_DOMAIN = "http://localhost:8081";

const mockRewards: any = [
  {
    id: 1,
    title: 'Bánh kẹo',
    requiredPoints: 50,
    createdAt: '2025-02-08T03:10:32.309154Z',
  },
  {
    id: 2,
    title: 'Đồ chơi xếp hình',
    requiredPoints: 150,
    createdAt: '2025-02-08T03:10:32.309154Z',
  },
];

const fetchRewards = async () => {
  try {
    const response = await fetch(ENV_DOMAIN + '/api/v1/rewards');
    if (!response.ok) return mockRewards;
    const data = await response.json();
    return data.length > 0 ? data : mockRewards;
  } catch (error) {
    console.error('Lỗi khi tải danh sách phần thưởng:', error);
  }
};

const redeemReward = async (rewardId: any) => {
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

const Rewards = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('gifts');

  const [rewards, setRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [loadingRewardsError, setLoadingRewardsError] = useState(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    if (DEBUG_ON_PURECODEAI) {
      setRewards(mockRewards);
      return;
    }
    const getRewardsFn = async () => {
      setLoadingRewards(true);
      try {
        const data = await fetchRewards();
        setRewards(data);
      } catch (err: any) {
        setLoadingRewardsError(err.message);
      } finally {
        setLoadingRewards(false);
      }
    };
    getRewardsFn();
  }, []);

  const toggleSidebar = useCallback(
    () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  const handleRedeem = async () => {
    if (!selectedReward) return;

    setIsRedeeming(true);
    const success = await redeemReward(selectedReward.id);

    if (success) {
      alert('Đổi phần thưởng thành công!');
      // Refresh rewards list
      const updatedRewards = rewards.filter(
        (r: any) => r.id !== selectedReward.id
      );
      setRewards(updatedRewards);
    } else {
      alert('Không thể đổi phần thưởng. Vui lòng thử lại sau!');
    }

    setIsRedeeming(false);
    setShowModal(false);
    setSelectedReward(null);
  };

  return (
    <Layout>
      <div className='p-6'>
        <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-6'>
          <div className='p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3'>
              <FiGift className='text-indigo-600' />
              Danh sách phần thưởng
            </h2>
          </div>
          <div className='p-4'>
            {loadingRewards ? (
              <div className='text-center py-4'>
                <p className='text-gray-500'>
                  Đang tải danh sách phần thưởng...
                </p>
              </div>
            ) : loadingRewardsError ? (
              <div className='text-center py-4'>
                <p className='text-red-500'>{loadingRewardsError}</p>
              </div>
            ) : rewards.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {rewards.map((item: any) => (
                  <div
                    key={item.id}
                    className={`${getRandomGradient()} p-4 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 relative overflow-hidden group h-full`}
                  >
                    <div className='absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-300'></div>
                    <div className='relative z-10 h-full flex flex-col justify-between'>
                      <div>
                        <div className='flex items-center justify-between mb-3'>
                          <span className='text-sm font-medium px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-indigo-700 shadow-sm border border-indigo-100'>
                            ID: {item.id}
                          </span>
                          <span className='text-green-600 font-bold px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm'>
                            {item.requiredPoints} điểm
                          </span>
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                          {item.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedReward(item);
                          setShowModal(true);
                        }}
                        className='w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                      >
                        <FiGift size={18} />
                        Đổi phần thưởng
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-4'>
                <p className='text-gray-500'>Không có phần thưởng nào</p>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4'>
              <h3 className='text-xl font-bold mb-4'>
                Xác nhận đổi phần thưởng
              </h3>
              <p className='mb-4'>Bạn có chắc muốn đổi phần thưởng này?</p>
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

export default Rewards;
