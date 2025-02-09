import Layout from '@/components/layout/Layout';
import { API_URL } from '@/constant/env';
import React, { useState, useEffect } from 'react';
import { FiTrendingUp } from 'react-icons/fi';

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
      <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-6'>
        <div className='p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-purple-100'>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3'>
            <FiTrendingUp className='text-indigo-600' />
            Danh sách thử thách
          </h2>
        </div>
        <div className='p-4'>
          {loadingChallenges ? (
            <div className='text-center py-4'>
              <p className='text-gray-500'>
                Đang tải lịch sử điểm kiếm được...
              </p>
            </div>
          ) : loadingChallengesError ? (
            <div className='text-center py-4'>
              <p className='text-red-500'>{loadingChallengesError}</p>
            </div>
          ) : challenges.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {challenges.map((item: any) => (
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
                          +{item.earnedPoints} điểm
                        </span>
                      </div>
                      <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                        {item.title}
                      </h3>
                      <p className='text-gray-600 mb-4'>{item.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedChallenge(item);
                        setShowModal(true);
                      }}
                      className='w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                      Hoàn thành thử thách
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-4'>
              <p className='text-gray-500'>
                Không có điểm nào được kiếm hôm nay
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4'>
            <h3 className='text-xl font-bold mb-4'>
              Xác nhận hoàn thành thử thách
            </h3>
            <p className='mb-4'>
              Bạn có chắc là mình đã hoàn thành thử thách này?
            </p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors'
              >
                Hủy
              </button>
              <button
                onClick={handleFinish}
                disabled={isFinishing}
                className='px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50'
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
