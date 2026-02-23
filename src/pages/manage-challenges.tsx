import Layout from '@/components/layout/Layout';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { FiFlag, FiPlus, FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi';
import SectionHeader from '@/components/layout/SectionHeader';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import FormModal from '@/components/modal/FormModal';
import FormInput from '@/components/forms/FormInput';
import CheckboxInput from '@/components/forms/CheckboxInput';
import ChildSelectInput from '@/components/forms/ChildSelectInput';
import {
  getManagedChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from '@/lib/services/challenges.service';
import { getChildren } from '@/lib/services/parent.service';
import { Challenge, ChallengeRequest, User } from '@/types';
import { getGradientByIndex } from '@/lib/gradients';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import {
  getStoredUser,
  hasRole,
  getCurrentUser,
} from '@/lib/services/auth.service';

type ChildFilterValue = 'all' | 'shared' | number;

const ManageChallenges = () => {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingChallengesError, setLoadingChallengesError] = useState<
    string | null
  >(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ChallengeRequest>({
    title: '',
    description: '',
    earnedPoints: 0,
    userId: undefined,
    shareAcrossGroup: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isParent, setIsParent] = useState(false);
  const [children, setChildren] = useState<User[]>([]);
  const [childFilter, setChildFilter] = useState<ChildFilterValue>('all');

  useEffect(() => {
    const checkAuth = async () => {
      let user = getStoredUser();
      if (!user) {
        const response = await getCurrentUser();
        if (response.success && response.data) {
          user = response.data;
        }
      }

      if (!user || !hasRole(user, 'PARENT')) {
        router.push('/child_dashboard');
        return;
      }

      setIsParent(true);
      setCheckingAuth(false);
      loadChallenges();
      const childrenRes = await getChildren();
      if (childrenRes.success && childrenRes.data) {
        setChildren(childrenRes.data);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const filteredChallenges = useMemo(() => {
    if (childFilter === 'all') return challenges;
    if (childFilter === 'shared') {
      return challenges.filter(
        (c) =>
          c.shareAcrossGroup && (c.userId == null || c.userId === undefined)
      );
    }
    return challenges.filter(
      (c) =>
        c.userId === childFilter ||
        (c.shareAcrossGroup && (c.userId == null || c.userId === undefined))
    );
  }, [challenges, childFilter]);

  const loadChallenges = useCallback(async () => {
    setLoadingChallenges(true);
    setLoadingChallengesError(null);
    const response = await getManagedChallenges();

    if (response.success && response.data) {
      setChallenges(response.data);
    } else {
      setLoadingChallengesError(
        response.error?.message || 'Không thể tải danh sách thử thách'
      );
    }

    setLoadingChallenges(false);
  }, []);

  const handleCreateClick = () => {
    setFormData({
      title: '',
      description: '',
      earnedPoints: 0,
      userId: undefined,
      shareAcrossGroup: true,
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleEditClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description || '',
      earnedPoints: challenge.earnedPoints,
      userId: undefined,
      shareAcrossGroup:
        challenge.shareAcrossGroup !== undefined
          ? challenge.shareAcrossGroup
          : true,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowDeleteModal(true);
  };

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Tiêu đề là bắt buộc';
    }

    if (formData.earnedPoints == null || formData.earnedPoints <= 0) {
      errors.earnedPoints = 'Điểm thưởng phải lớn hơn 0';
    }

    if (formData.shareAcrossGroup) {
      if (formData.userId !== undefined && formData.userId !== null) {
        errors.shareAcrossGroup =
          'Khi chia sẻ cho tất cả, không được chọn con cụ thể';
      }
    } else {
      if (!formData.userId) {
        errors.userId = 'Vui lòng chọn con hoặc chọn "Chia sẻ cho tất cả"';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmitCreate = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const requestData: ChallengeRequest = {
      ...formData,
      userId: formData.shareAcrossGroup ? undefined : formData.userId,
      shareAcrossGroup: formData.shareAcrossGroup || false,
    };

    const response = await createChallenge(requestData);

    if (response.success && response.data) {
      alert('Tạo thử thách thành công!');
      setShowCreateModal(false);
      loadChallenges();
    } else {
      alert(
        response.error?.message ||
          'Không thể tạo thử thách. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [formData, validateForm, loadChallenges]);

  const handleSubmitEdit = useCallback(async () => {
    if (!selectedChallenge) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    const updateData: ChallengeRequest = {
      ...formData,
      userId: formData.shareAcrossGroup ? undefined : formData.userId,
      shareAcrossGroup: formData.shareAcrossGroup || false,
    };
    const response = await updateChallenge(selectedChallenge.id, updateData);

    if (response.success && response.data) {
      alert('Cập nhật thử thách thành công!');
      setShowEditModal(false);
      setSelectedChallenge(null);
      loadChallenges();
    } else {
      alert(
        response.error?.message ||
          'Không thể cập nhật thử thách. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [selectedChallenge, formData, validateForm, loadChallenges]);

  const handleDelete = useCallback(async () => {
    if (!selectedChallenge) return;

    setIsSubmitting(true);
    const response = await deleteChallenge(selectedChallenge.id);

    if (response.success) {
      alert('Xóa thử thách thành công!');
      setShowDeleteModal(false);
      setSelectedChallenge(null);
      loadChallenges();
    } else {
      alert(
        response.error?.message ||
          'Không thể xóa thử thách. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [selectedChallenge, loadChallenges]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      if (type === 'checkbox') {
        if (name === 'shareAcrossGroup' && checked) {
          return { ...prev, shareAcrossGroup: checked, userId: undefined };
        }
        if (name === 'shareAcrossGroup' && !checked) {
          return { ...prev, shareAcrossGroup: checked };
        }
        return { ...prev, shareAcrossGroup: checked };
      }
      return {
        ...prev,
        [name]: name === 'earnedPoints' ? parseInt(value, 10) || 0 : value,
      };
    });

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (checkingAuth) {
    return (
      <Layout>
        <div className='p-6'>
          <LoadingState message='Đang kiểm tra quyền truy cập...' />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='p-6'>
        <div className='mb-6 overflow-hidden rounded-xl bg-white shadow-sm'>
          <div className='flex items-center justify-between p-4'>
            <div className='flex-1'>
              <SectionHeader
                title='Quản lý thử thách'
                icon={FiFlag}
                gradientFrom='from-emerald-600'
                gradientTo='to-teal-600'
                iconColor='text-emerald-600'
              />
            </div>
            <button
              onClick={handleCreateClick}
              className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700'
            >
              <FiPlus size={20} />
              <span>Tạo thử thách mới</span>
            </button>
          </div>

          <div className='p-4'>
            {loadingChallenges ? (
              <LoadingState message='Đang tải danh sách thử thách...' />
            ) : loadingChallengesError ? (
              <ErrorMessage message={loadingChallengesError} />
            ) : challenges.length > 0 ? (
              <>
                <div className='mb-4 flex flex-wrap items-center gap-3'>
                  <span className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                    <FiFilter size={18} />
                    Lọc theo con:
                  </span>
                  <select
                    value={
                      childFilter === 'all'
                        ? 'all'
                        : childFilter === 'shared'
                        ? 'shared'
                        : String(childFilter)
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === 'all') setChildFilter('all');
                      else if (v === 'shared') setChildFilter('shared');
                      else setChildFilter(Number(v));
                    }}
                    className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
                  >
                    <option value='all'>Tất cả</option>
                    <option value='shared'>Chia sẻ cho tất cả</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.fullName}
                      </option>
                    ))}
                  </select>
                  {childFilter !== 'all' && (
                    <span className='text-sm text-gray-500'>
                      ({filteredChallenges.length} thử thách)
                    </span>
                  )}
                </div>
                {filteredChallenges.length === 0 ? (
                  <EmptyState
                    message={
                      childFilter === 'all'
                        ? 'Không có thử thách nào'
                        : 'Không có thử thách nào với bộ lọc này. Thử chọn "Tất cả".'
                    }
                  />
                ) : (
                  <div className='grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                    {filteredChallenges.map((challenge) => (
                      <GradientCard
                        key={challenge.id}
                        gradientClass={getGradientByIndex(challenge.id)}
                        className='h-full'
                      >
                        <div className='flex h-full flex-col justify-between'>
                          <div>
                            <div className='mb-3 flex items-center justify-between'>
                              <span className='rounded-full border border-emerald-100 bg-white/50 px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur-sm'>
                                ID: {challenge.id}
                              </span>
                              <PointsBadge
                                points={challenge.earnedPoints}
                                variant='earned'
                              />
                            </div>
                            <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                              {challenge.title}
                            </h3>
                            {challenge.description && (
                              <p className='text-sm text-gray-600'>
                                {challenge.description}
                              </p>
                            )}
                          </div>
                          <div className='mt-4 flex gap-2'>
                            <button
                              onClick={() => handleEditClick(challenge)}
                              className='flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white/50 px-3 py-1.5 text-sm text-emerald-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                            >
                              <FiEdit2 size={16} />
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(challenge)}
                              className='flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white/50 px-3 py-1.5 text-sm text-red-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                            >
                              <FiTrash2 size={16} />
                              Xóa
                            </button>
                          </div>
                        </div>
                      </GradientCard>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <EmptyState message='Không có thử thách nào' />
            )}
          </div>
        </div>

        {/* Create Modal */}
        <FormModal
          isOpen={showCreateModal}
          title='Tạo thử thách mới'
          confirmText='Tạo'
          cancelText='Hủy'
          onConfirm={handleSubmitCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isSubmitting}
        >
          <div className='space-y-4'>
            <FormInput
              label='Tiêu đề'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              error={formErrors.title}
              required
              placeholder='Nhập tiêu đề thử thách'
            />
            <FormInput
              label='Điểm thưởng'
              name='earnedPoints'
              type='number'
              value={formData.earnedPoints.toString()}
              onChange={handleInputChange}
              error={formErrors.earnedPoints}
              required
              placeholder='Nhập số điểm khi hoàn thành'
            />
            <FormInput
              label='Mô tả (tùy chọn)'
              name='description'
              value={formData.description || ''}
              onChange={handleInputChange}
              error={formErrors.description}
              placeholder='Nhập mô tả thử thách'
            />
            <CheckboxInput
              label='Chia sẻ cho tất cả các con (áp dụng cho tất cả thay vì một con cụ thể)'
              name='shareAcrossGroup'
              checked={formData.shareAcrossGroup || false}
              onChange={handleInputChange}
            />
            {formErrors.shareAcrossGroup && (
              <p className='text-sm text-red-600'>
                {formErrors.shareAcrossGroup}
              </p>
            )}
            {!formData.shareAcrossGroup && (
              <ChildSelectInput
                label='Chọn con'
                name='userId'
                value={formData.userId}
                onChange={(userId) => {
                  setFormData((prev) => ({ ...prev, userId }));
                  if (formErrors.userId) {
                    setFormErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.userId;
                      return newErrors;
                    });
                  }
                }}
                error={formErrors.userId}
                required
                isParent={isParent}
              />
            )}
            {formData.shareAcrossGroup && (
              <div className='rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-700'>
                Thử thách này sẽ áp dụng cho tất cả các con của bạn.
              </div>
            )}
          </div>
        </FormModal>

        {/* Edit Modal */}
        <FormModal
          isOpen={showEditModal}
          title='Sửa thử thách'
          confirmText='Cập nhật'
          cancelText='Hủy'
          onConfirm={handleSubmitEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedChallenge(null);
          }}
          isLoading={isSubmitting}
        >
          <div className='space-y-4'>
            <FormInput
              label='Tiêu đề'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              error={formErrors.title}
              required
              placeholder='Nhập tiêu đề thử thách'
            />
            <FormInput
              label='Điểm thưởng'
              name='earnedPoints'
              type='number'
              value={formData.earnedPoints.toString()}
              onChange={handleInputChange}
              error={formErrors.earnedPoints}
              required
              placeholder='Nhập số điểm khi hoàn thành'
            />
            <FormInput
              label='Mô tả (tùy chọn)'
              name='description'
              value={formData.description || ''}
              onChange={handleInputChange}
              error={formErrors.description}
              placeholder='Nhập mô tả thử thách'
            />
            <CheckboxInput
              label='Chia sẻ cho tất cả các con (áp dụng cho tất cả thay vì một con cụ thể)'
              name='shareAcrossGroup'
              checked={formData.shareAcrossGroup || false}
              onChange={handleInputChange}
            />
            {formErrors.shareAcrossGroup && (
              <p className='text-sm text-red-600'>
                {formErrors.shareAcrossGroup}
              </p>
            )}
            {!formData.shareAcrossGroup && (
              <ChildSelectInput
                label='Chọn con'
                name='userId'
                value={formData.userId}
                onChange={(userId) => {
                  setFormData((prev) => ({ ...prev, userId }));
                  if (formErrors.userId) {
                    setFormErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.userId;
                      return newErrors;
                    });
                  }
                }}
                error={formErrors.userId}
                required
                isParent={isParent}
              />
            )}
            {formData.shareAcrossGroup && (
              <div className='rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-700'>
                Thử thách này sẽ áp dụng cho tất cả các con của bạn.
              </div>
            )}
          </div>
        </FormModal>

        {/* Delete Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title='Xác nhận xóa thử thách'
          message={`Bạn có chắc muốn xóa thử thách "${selectedChallenge?.title}"? Hành động này không thể hoàn tác.`}
          confirmText='Xóa'
          cancelText='Hủy'
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedChallenge(null);
          }}
          isLoading={isSubmitting}
          variant='error'
        />
      </div>
    </Layout>
  );
};

export default ManageChallenges;
