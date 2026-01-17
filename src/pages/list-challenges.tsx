import React, { useEffect, useState } from 'react';
import { FiFlag, FiTrendingUp } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/layout/SectionHeader';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import {
  getChallenges,
  finishChallenge,
} from '@/lib/services/challenges.service';
import { getRandomGradient } from '@/lib/gradients';
import { Challenge } from '@/types';

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingChallengesError, setLoadingChallengesError] = useState<
    string | null
  >(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const getChallengesFn = async () => {
      setLoadingChallenges(true);
      setLoadingChallengesError(null);
      const response = await getChallenges();

      if (response.success && response.data) {
        setChallenges(response.data);
      } else {
        setLoadingChallengesError(
          response.error?.message || 'Không thể tải danh sách thử thách'
        );
      }

      setLoadingChallenges(false);
    };
    getChallengesFn();
  }, []);

  const handleFinish = async () => {
    if (!selectedChallenge) return;

    setIsFinishing(true);
    const response = await finishChallenge({
      challengeId: selectedChallenge.id,
    });

    if (response.success && response.data) {
      alert('Thử thách hoàn thành thành công!');
      // Refresh challenges list
      const updatedChallenges = challenges.filter(
        (c) => c.id !== selectedChallenge.id
      );
      setChallenges(updatedChallenges);
    } else {
      alert(
        response.error?.message ||
          'Không thể hoàn thành thử thách. Vui lòng thử lại sau!'
      );
    }

    setIsFinishing(false);
    setShowModal(false);
    setSelectedChallenge(null);
  };

  return (
    <Layout>
      <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
        <SectionHeader
          title='Danh sách thử thách'
          icon={FiTrendingUp}
          gradientFrom='from-indigo-600'
          gradientTo='to-purple-600'
          iconColor='text-indigo-600'
        />
        <div className='p-4'>
          {loadingChallenges ? (
            <LoadingState message='Đang tải lịch sử điểm kiếm được...' />
          ) : loadingChallengesError ? (
            <ErrorMessage message={loadingChallengesError} />
          ) : challenges.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {challenges.map((item) => (
                <GradientCard
                  key={item.id}
                  gradientClass={getRandomGradient()}
                  className='h-full'
                >
                  <div className='flex h-full flex-col justify-between'>
                    <div>
                      <div className='mb-3 flex items-center justify-between'>
                        <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                          ID: {item.id}
                        </span>
                        <PointsBadge
                          points={item.earnedPoints}
                          variant='earned'
                        />
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
                </GradientCard>
              ))}
            </div>
          ) : (
            <EmptyState message='Chưa có thử thách nào được tạo, hãy nói ba mẹ tạo thử thách nhé' />
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        title='Xác nhận hoàn thành thử thách'
        message='Bạn có chắc là mình đã hoàn thành thử thách này?'
        confirmText='Xác nhận'
        cancelText='Hủy'
        onConfirm={handleFinish}
        onCancel={() => {
          setShowModal(false);
          setSelectedChallenge(null);
        }}
        isLoading={isFinishing}
      />
    </Layout>
  );
};

export default Challenges;
