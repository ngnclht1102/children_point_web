import Layout from '@/components/layout/Layout';
import { API_URL } from '@/constant/env';
import React, { useState, useCallback, useEffect } from 'react';
import { FiGift } from 'react-icons/fi';
import { fetchRewards, redeemReward } from '@/lib/api';

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
        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <div className='border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100 p-6'>
            <h2 className='flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent'>
              <FiGift className='text-indigo-600' />
              Danh sách phần thưởng
            </h2>
          </div>
          <div className='p-4'>
            {loadingRewards ? (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>
                  Đang tải danh sách phần thưởng...
                </p>
              </div>
            ) : loadingRewardsError ? (
              <div className='py-4 text-center'>
                <p className='text-red-500'>{loadingRewardsError}</p>
              </div>
            ) : rewards.length > 0 ? (
              <div className='grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {rewards.map((item: any) => (
                  <div
                    key={item.id}
                    className={`${getRandomGradient()} hover:scale-102 group relative h-full transform overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20'></div>
                    <div className='relative z-10 flex h-full flex-col justify-between'>
                      <div>
                        <div className='mb-3 flex items-center justify-between'>
                          <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                            ID: {item.id}
                          </span>
                          <span className='rounded-full bg-white/50 px-3 py-1 font-bold text-green-600 backdrop-blur-sm'>
                            {item.requiredPoints} điểm
                          </span>
                        </div>
                        <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                          {item.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedReward(item);
                          setShowModal(true);
                        }}
                        className='ml-auto mt-4 flex w-full items-center justify-center gap-2 self-start rounded-lg border border-indigo-200 bg-white/50 px-4 py-1.5 text-sm text-indigo-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                      >
                        <FiGift className='h-4 w-4' />
                        Đổi phần thưởng
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-4 text-center'>
                <p className='text-gray-500'>Không có phần thưởng nào</p>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='mx-4 w-full max-w-md rounded-xl bg-white p-6'>
              <h3 className='mb-4 text-xl font-bold'>
                Xác nhận đổi phần thưởng
              </h3>
              <p className='mb-4'>Bạn có chắc muốn đổi phần thưởng này?</p>
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

export default Rewards;
