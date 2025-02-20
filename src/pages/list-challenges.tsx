import React, { useEffect, useState } from 'react';
import { FiFlag, FiTrendingUp } from 'react-icons/fi';

import Layout from '@/components/layout/Layout';

import { API_URL } from '@/constant/env';

const DEBUG_ON_PURECODEAI = false;
// const ENV_DOMAIN = 'http://localhost:8081';
const ENV_DOMAIN = API_URL;

const mockChallenges: any = [
  {
    id: 1,
    title: 'Ăn 2 lá rau',
    description: 'Hoàn thành việc ăn 2 lá rau xanh.',
    earnedPoints: 15,
    createdAt: '2025-02-08T09:29:49.131104Z',
  },
  {
    id: 2,
    title: 'Ăn canh',
    description: 'Hoàn thành bát canh trong bữa ăn.',
    earnedPoints: 20,
    createdAt: '2025-02-08T09:29:49.131104Z',
  },
  {
    id: 3,
    title: 'Đi ngủ trưa',
    description: 'Đi ngủ trưa đúng giờ và đủ giấc.',
    earnedPoints: 25,
    createdAt: '2025-02-08T09:29:49.131104Z',
  },
  {
    id: 4,
    title: 'Đọc 1 trang sách',
    description: 'Đọc hết 1 trang sách bất kỳ.',
    earnedPoints: 10,
    createdAt: '2025-02-08T09:29:49.131104Z',
  },
  {
    id: 5,
    title: 'Đi chơi với bạn bè',
    description: 'Đi chơi với bạn bè trong ngày.',
    earnedPoints: 10,
    createdAt: '2025-02-08T09:29:49.131104Z',
  },
];

const fetchChallenges = async () => {
  try {
    const response = await fetch(ENV_DOMAIN + '/api/v1/challenges');
    if (!response.ok) return mockChallenges;
    const data = await response.json();
    return data.length > 0 ? data : mockChallenges;
  } catch (error) {
    console.error('Lỗi khi tải lịch sử điểm kiếm được:', error);
  }
};

const finishChallenge = async (challengeId: number) => {
  try {
    const response = await fetch(
      ENV_DOMAIN + '/api/v1/challenges/finish?challengeId=' + challengeId,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error finishing challenge:', error);
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

const Challenges = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('challenge-list');

  const [challenges, setChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingChallengesError, setLoadingChallengesError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (DEBUG_ON_PURECODEAI) {
      setChallenges(mockChallenges);
      return;
    }
    const getChallengesFn = async () => {
      setLoadingChallenges(true);
      try {
        const data = await fetchChallenges();
        setChallenges(data);
      } catch (err: any) {
        setLoadingChallengesError(err.message);
      } finally {
        setLoadingChallenges(false);
      }
    };
    getChallengesFn();
  }, []);

  const handleFinish = async () => {
    if (!selectedChallenge) return;

    setIsFinishing(true);
    const success = await finishChallenge(selectedChallenge.id);

    if (success) {
      alert('Thử thách hoàn thành thành công!');
      // Refresh challenges list
      const updatedChallenges = challenges.filter(
        (c: any) => c.id !== selectedChallenge.id
      );
      setChallenges(updatedChallenges);
    } else {
      alert('Không thể hoàn thành thử thách. Vui lòng thử lại sau!');
    }

    setIsFinishing(false);
    setShowModal(false);
    setSelectedChallenge(null);
  };

  return (
    <Layout>
      <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
        <div className='border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100 p-6'>
          <h2 className='flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent'>
            <FiTrendingUp className='text-indigo-600' />
            Danh sách thử thách
          </h2>
        </div>
        <div className='p-4'>
          {loadingChallenges ? (
            <div className='py-4 text-center'>
              <p className='text-gray-500'>
                Đang tải lịch sử điểm kiếm được...
              </p>
            </div>
          ) : loadingChallengesError ? (
            <div className='py-4 text-center'>
              <p className='text-red-500'>{loadingChallengesError}</p>
            </div>
          ) : challenges.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {challenges.map((item) => (
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
                          +{item.earnedPoints} điểm
                        </span>
                      </div>
                      <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                        {item.title}
                      </h3>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 backdrop-blur-sm'>
                        <div className='h-2 w-2 animate-pulse rounded-full bg-purple-400'></div>
                        <span className='text-sm font-medium'>
                          Nội dung thử thách:
                        </span>
                        <span className='text-sm text-gray-600'>
                          {item.description}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 backdrop-blur-sm'>
                        <div className='h-2 w-2 animate-pulse rounded-full bg-blue-400'></div>
                        <span className='text-sm font-medium'>
                          Hoàn thành sẽ kiếm được:
                        </span>
                        <span className='text-sm text-gray-600'>
                          {item.earnedPoints}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedChallenge(item);
                        setShowModal(true);
                      }}
                      className='ml-auto mt-4 flex w-full items-center justify-center gap-2 self-start rounded-lg border border-indigo-200 bg-white/50 px-4 py-1.5 text-sm text-indigo-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                    >
                      <FiFlag className='h-4 w-4' />
                      Hoàn thành thử thách
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-4 text-center'>
              <p className='text-gray-500'>
                Không có điểm nào được kiếm hôm nay
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='mx-4 w-full max-w-md rounded-xl bg-white p-6'>
            <h3 className='mb-4 text-xl font-bold'>
              Xác nhận hoàn thành thử thách
            </h3>
            <p className='mb-4'>
              Bạn có chắc là mình đã hoàn thành thử thách này?
            </p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={() => setShowModal(false)}
                className='rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200'
              >
                Hủy
              </button>
              <button
                onClick={handleFinish}
                disabled={isFinishing}
                className='rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50'
              >
                {isFinishing ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Challenges;
