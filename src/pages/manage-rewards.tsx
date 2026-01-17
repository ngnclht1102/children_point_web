import Layout from '@/components/layout/Layout';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FiGift, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
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
  getManagedRewards,
  createReward,
  updateReward,
  deleteReward,
} from '@/lib/services/rewards.service';
import { Reward, RewardRequest } from '@/types';
import { getGradientByIndex } from '@/lib/gradients';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import {
  getStoredUser,
  hasRole,
  getCurrentUser,
} from '@/lib/services/auth.service';

const ManageRewards = () => {
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [loadingRewardsError, setLoadingRewardsError] = useState<string | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RewardRequest>({
    title: '',
    requiredPoints: 0,
    description: '',
    userId: undefined,
    shareAcrossGroup: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isParent, setIsParent] = useState(false);

  // Check if user is PARENT
  useEffect(() => {
    const checkAuth = async () => {
      let user = getStoredUser();
      if (!user) {
        // Try to fetch user info
        const response = await getCurrentUser();
        if (response.success && response.data) {
          user = response.data;
        }
      }

      if (!user || !hasRole(user, 'PARENT')) {
        // Redirect to dashboard if not PARENT
        router.push('/child_dashboard');
        return;
      }

      setIsParent(true);
      setCheckingAuth(false);
      loadRewards();
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadRewards = useCallback(async () => {
    setLoadingRewards(true);
    setLoadingRewardsError(null);
    const response = await getManagedRewards();

    if (response.success && response.data) {
      setRewards(response.data);
    } else {
      setLoadingRewardsError(
        response.error?.message || 'Không thể tải danh sách phần thưởng'
      );
    }

    setLoadingRewards(false);
  }, []);

  const handleCreateClick = () => {
    setFormData({
      title: '',
      requiredPoints: 0,
      description: '',
      userId: undefined,
      shareAcrossGroup: true,
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleEditClick = (reward: Reward) => {
    setSelectedReward(reward);
    setFormData({
      title: reward.title,
      requiredPoints: reward.requiredPoints,
      description: reward.description || '',
      userId: undefined, // We don't have userId in Reward type, so leave it undefined
      shareAcrossGroup:
        reward.shareAcrossGroup !== undefined ? reward.shareAcrossGroup : true,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteClick = (reward: Reward) => {
    setSelectedReward(reward);
    setShowDeleteModal(true);
  };

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.requiredPoints || formData.requiredPoints <= 0) {
      errors.requiredPoints = 'Điểm yêu cầu phải lớn hơn 0';
    }

    // Validate shareAcrossGroup logic
    if (formData.shareAcrossGroup) {
      // If shared, userId must be null/undefined
      if (formData.userId !== undefined && formData.userId !== null) {
        errors.shareAcrossGroup =
          'Khi chia sẻ cho tất cả, không được chọn con cụ thể';
      }
    } else {
      // If not shared, userId is required
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
    const requestData: RewardRequest = {
      ...formData,
      userId: formData.shareAcrossGroup ? undefined : formData.userId,
      shareAcrossGroup: formData.shareAcrossGroup || false,
    };

    const response = await createReward(requestData);

    if (response.success && response.data) {
      alert('Tạo phần thưởng thành công!');
      setShowCreateModal(false);
      loadRewards();
    } else {
      alert(
        response.error?.message ||
          'Không thể tạo phần thưởng. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [formData, validateForm, loadRewards]);

  const handleSubmitEdit = useCallback(async () => {
    if (!selectedReward) {
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    const updateData: RewardRequest = {
      ...formData,
      userId: formData.shareAcrossGroup ? undefined : formData.userId,
      shareAcrossGroup: formData.shareAcrossGroup || false,
    };
    const response = await updateReward(selectedReward.id, updateData);

    if (response.success && response.data) {
      alert('Cập nhật phần thưởng thành công!');
      setShowEditModal(false);
      setSelectedReward(null);
      loadRewards();
    } else {
      alert(
        response.error?.message ||
          'Không thể cập nhật phần thưởng. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [selectedReward, formData, validateForm, loadRewards]);

  const handleDelete = useCallback(async () => {
    if (!selectedReward) return;

    setIsSubmitting(true);
    const response = await deleteReward(selectedReward.id);

    if (response.success) {
      alert('Xóa phần thưởng thành công!');
      setShowDeleteModal(false);
      setSelectedReward(null);
      loadRewards();
    } else {
      alert(
        response.error?.message ||
          'Không thể xóa phần thưởng. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [selectedReward, loadRewards]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      if (type === 'checkbox') {
        // If shareAcrossGroup is checked, clear userId
        if (name === 'shareAcrossGroup' && checked) {
          return {
            ...prev,
            shareAcrossGroup: checked,
            userId: undefined,
          };
        }
        // If shareAcrossGroup is unchecked, keep current userId or leave undefined
        if (name === 'shareAcrossGroup' && !checked) {
          return {
            ...prev,
            shareAcrossGroup: checked,
            // Keep existing userId if any, otherwise leave undefined
          };
        }
        return {
          ...prev,
          shareAcrossGroup: checked,
        };
      } else {
        return {
          ...prev,
          [name]: name === 'requiredPoints' ? parseInt(value) || 0 : value,
        };
      }
    });

    // Clear error when user starts typing
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
                title='Quản lý phần thưởng'
                icon={FiGift}
                gradientFrom='from-indigo-600'
                gradientTo='to-purple-600'
                iconColor='text-indigo-600'
              />
            </div>
            <button
              onClick={handleCreateClick}
              className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700'
            >
              <FiPlus size={20} />
              <span>Tạo phần thưởng mới</span>
            </button>
          </div>

          <div className='p-4'>
            {loadingRewards ? (
              <LoadingState message='Đang tải danh sách phần thưởng...' />
            ) : loadingRewardsError ? (
              <ErrorMessage message={loadingRewardsError} />
            ) : rewards.length > 0 ? (
              <div className='grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {rewards.map((reward) => (
                  <GradientCard
                    key={reward.id}
                    gradientClass={getGradientByIndex(reward.id)}
                    className='h-full'
                  >
                    <div className='flex h-full flex-col justify-between'>
                      <div>
                        <div className='mb-3 flex items-center justify-between'>
                          <span className='rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm'>
                            ID: {reward.id}
                          </span>
                          <PointsBadge
                            points={reward.requiredPoints}
                            variant='required'
                          />
                        </div>
                        <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                          {reward.title}
                        </h3>
                        {reward.description && (
                          <p className='text-sm text-gray-600'>
                            {reward.description}
                          </p>
                        )}
                      </div>
                      <div className='mt-4 flex gap-2'>
                        <button
                          onClick={() => handleEditClick(reward)}
                          className='flex flex-1 items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white/50 px-3 py-1.5 text-sm text-indigo-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                        >
                          <FiEdit2 size={16} />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick(reward)}
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
            ) : (
              <EmptyState message='Không có phần thưởng nào' />
            )}
          </div>
        </div>

        {/* Create Modal */}
        <FormModal
          isOpen={showCreateModal}
          title='Tạo phần thưởng mới'
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
              placeholder='Nhập tiêu đề phần thưởng'
            />
            <FormInput
              label='Điểm yêu cầu'
              name='requiredPoints'
              type='number'
              value={formData.requiredPoints.toString()}
              onChange={handleInputChange}
              error={formErrors.requiredPoints}
              required
              placeholder='Nhập số điểm yêu cầu'
            />
            <FormInput
              label='Mô tả (tùy chọn)'
              name='description'
              value={formData.description || ''}
              onChange={handleInputChange}
              error={formErrors.description}
              placeholder='Nhập mô tả phần thưởng'
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
                Phần thưởng này sẽ áp dụng cho tất cả các con của bạn.
              </div>
            )}
          </div>
        </FormModal>

        {/* Edit Modal */}
        <FormModal
          isOpen={showEditModal}
          title='Sửa phần thưởng'
          confirmText='Cập nhật'
          cancelText='Hủy'
          onConfirm={handleSubmitEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedReward(null);
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
              placeholder='Nhập tiêu đề phần thưởng'
            />
            <FormInput
              label='Điểm yêu cầu'
              name='requiredPoints'
              type='number'
              value={formData.requiredPoints.toString()}
              onChange={handleInputChange}
              error={formErrors.requiredPoints}
              required
              placeholder='Nhập số điểm yêu cầu'
            />
            <FormInput
              label='Mô tả (tùy chọn)'
              name='description'
              value={formData.description || ''}
              onChange={handleInputChange}
              error={formErrors.description}
              placeholder='Nhập mô tả phần thưởng'
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
                Phần thưởng này sẽ áp dụng cho tất cả các con của bạn.
              </div>
            )}
          </div>
        </FormModal>

        {/* Delete Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title='Xác nhận xóa phần thưởng'
          message={`Bạn có chắc muốn xóa phần thưởng "${selectedReward?.title}"? Hành động này không thể hoàn tác.`}
          confirmText='Xóa'
          cancelText='Hủy'
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedReward(null);
          }}
          isLoading={isSubmitting}
          variant='error'
        />
      </div>
    </Layout>
  );
};

export default ManageRewards;
