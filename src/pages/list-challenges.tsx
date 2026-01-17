import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FiTrendingUp } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/layout/SectionHeader';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import ChallengeListItem from '@/components/cards/ChallengeListItem';
import {
  getChallenges,
  finishChallenge,
} from '@/lib/services/challenges.service';
import { getGradientByIndex } from '@/lib/gradients';
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

  // Generate stable gradients for each challenge based on ID
  // Only recalculate when challenges array changes
  const challengeGradients = useMemo(() => {
    const gradientMap = new Map<number, string>();
    challenges.forEach((challenge) => {
      gradientMap.set(challenge.id, getGradientByIndex(challenge.id));
    });
    return gradientMap;
  }, [challenges]);

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

  const handleFinish = useCallback(async () => {
    if (!selectedChallenge) return;

    setIsFinishing(true);
    const response = await finishChallenge({
      challengeId: selectedChallenge.id,
    });

    if (response.success && response.data) {
      alert('Thử thách hoàn thành thành công!');
      // Refresh challenges list
      setChallenges((prev) =>
        prev.filter((c) => c.id !== selectedChallenge.id)
      );
    } else {
      alert(
        response.error?.message ||
          'Không thể hoàn thành thử thách. Vui lòng thử lại sau!'
      );
    }

    setIsFinishing(false);
    setShowModal(false);
    setSelectedChallenge(null);
  }, [selectedChallenge]);

  const handleOpenModal = useCallback((item: Challenge) => {
    setSelectedChallenge(item);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedChallenge(null);
  }, []);

  // Memoize the challenges list to prevent unnecessary re-renders
  const challengesList = useMemo(() => {
    return challenges.map((item) => (
      <ChallengeListItem
        key={item.id}
        challenge={item}
        gradientClass={challengeGradients.get(item.id) || getGradientByIndex(0)}
        onFinish={handleOpenModal}
      />
    ));
  }, [challenges, challengeGradients, handleOpenModal]);

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
              {challengesList}
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
        onCancel={handleCloseModal}
        isLoading={isFinishing}
      />
    </Layout>
  );
};

export default Challenges;
