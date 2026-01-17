import Layout from '@/components/layout/Layout';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import SectionHeader from '@/components/layout/SectionHeader';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import ViolationListItem from '@/components/cards/ViolationListItem';
import {
  getViolations,
  reportViolation,
} from '@/lib/services/violations.service';
import { getGradientByIndex } from '@/lib/gradients';
import { Violation } from '@/types';

const Violations = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loadingViolations, setLoadingViolations] = useState(true);
  const [loadingViolationsError, setLoadingViolationsError] = useState<
    string | null
  >(null);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  // Generate stable gradients for each violation based on ID
  // Only recalculate when violations array changes
  const violationGradients = useMemo(() => {
    const gradientMap = new Map<number, string>();
    violations.forEach((violation) => {
      gradientMap.set(violation.id, getGradientByIndex(violation.id));
    });
    return gradientMap;
  }, [violations]);

  useEffect(() => {
    const getViolationsFn = async () => {
      setLoadingViolations(true);
      setLoadingViolationsError(null);
      const response = await getViolations();

      if (response.success && response.data) {
        setViolations(response.data);
      } else {
        setLoadingViolationsError(
          response.error?.message || 'Không thể tải danh sách vi phạm'
        );
      }

      setLoadingViolations(false);
    };
    getViolationsFn();
  }, []);

  const handleReport = useCallback(async () => {
    if (!selectedViolation) return;

    setIsReporting(true);
    const response = await reportViolation({
      violationId: selectedViolation.id,
    });

    if (response.success && response.data) {
      alert('Báo cáo vi phạm thành công!');
    } else {
      alert(
        response.error?.message ||
          'Không thể báo cáo vi phạm. Vui lòng thử lại sau!'
      );
    }

    setIsReporting(false);
    setShowModal(false);
    setSelectedViolation(null);
  }, [selectedViolation]);

  const handleOpenModal = useCallback((item: Violation) => {
    setSelectedViolation(item);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedViolation(null);
  }, []);

  // Memoize the violations list to prevent unnecessary re-renders
  const violationsList = useMemo(() => {
    return violations.map((item) => (
      <ViolationListItem
        key={item.id}
        violation={item}
        gradientClass={violationGradients.get(item.id) || getGradientByIndex(0)}
        onReport={handleOpenModal}
      />
    ));
  }, [violations, violationGradients, handleOpenModal]);

  return (
    <Layout>
      <div className='p-6'>
        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <SectionHeader
            title='Danh sách vi phạm'
            icon={FiAlertTriangle}
            gradientFrom='from-red-600'
            gradientTo='to-orange-600'
            iconColor='text-red-600'
          />
          <div className='p-4'>
            {loadingViolations ? (
              <LoadingState message='Đang tải danh sách vi phạm...' />
            ) : loadingViolationsError ? (
              <ErrorMessage message={loadingViolationsError} />
            ) : violations.length > 0 ? (
              <div className='grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {violationsList}
              </div>
            ) : (
              <EmptyState message='Không có vi phạm nào' />
            )}
          </div>
        </div>

        <ConfirmationModal
          isOpen={showModal}
          title='Xác nhận báo cáo vi phạm'
          message='Bạn có chắc muốn báo cáo vi phạm này?'
          confirmText='Xác nhận'
          cancelText='Hủy'
          onConfirm={handleReport}
          onCancel={handleCloseModal}
          isLoading={isReporting}
          variant='error'
        />
      </div>
    </Layout>
  );
};

export default Violations;
