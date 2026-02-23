import Layout from '@/components/layout/Layout';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  FiAlertCircle,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFilter,
} from 'react-icons/fi';
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
  getManagedViolations,
  createViolation,
  updateViolation,
  deleteViolation,
} from '@/lib/services/violations.service';
import { getChildren } from '@/lib/services/parent.service';
import { Violation, ViolationRequest, User } from '@/types';
import { getGradientByIndex } from '@/lib/gradients';
import GradientCard from '@/components/cards/GradientCard';
import PointsBadge from '@/components/cards/PointsBadge';
import {
  getStoredUser,
  hasRole,
  getCurrentUser,
} from '@/lib/services/auth.service';

type ChildFilterValue = 'all' | 'shared' | number;

const ManageViolations = () => {
  const router = useRouter();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loadingViolations, setLoadingViolations] = useState(true);
  const [loadingViolationsError, setLoadingViolationsError] = useState<
    string | null
  >(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ViolationRequest>({
    title: '',
    deductedPoints: 0,
    description: '',
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
      loadViolations();
      const childrenRes = await getChildren();
      if (childrenRes.success && childrenRes.data) {
        setChildren(childrenRes.data);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const filteredViolations = useMemo(() => {
    if (childFilter === 'all') return violations;
    if (childFilter === 'shared') {
      return violations.filter(
        (v) =>
          v.shareAcrossGroup && (v.userId == null || v.userId === undefined)
      );
    }
    return violations.filter(
      (v) =>
        v.userId === childFilter ||
        (v.shareAcrossGroup && (v.userId == null || v.userId === undefined))
    );
  }, [violations, childFilter]);

  const loadViolations = useCallback(async () => {
    setLoadingViolations(true);
    setLoadingViolationsError(null);
    const response = await getManagedViolations();

    if (response.success && response.data) {
      setViolations(response.data);
    } else {
      setLoadingViolationsError(
        response.error?.message || 'Không thể tải danh sách vi phạm'
      );
    }

    setLoadingViolations(false);
  }, []);

  const handleCreateClick = () => {
    setFormData({
      title: '',
      deductedPoints: 0,
      description: '',
      userId: undefined,
      shareAcrossGroup: true,
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleEditClick = (violation: Violation) => {
    setSelectedViolation(violation);
    setFormData({
      title: violation.title,
      deductedPoints: violation.deductedPoints,
      description: violation.description || '',
      userId: undefined,
      shareAcrossGroup:
        violation.shareAcrossGroup !== undefined
          ? violation.shareAcrossGroup
          : true,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteClick = (violation: Violation) => {
    setSelectedViolation(violation);
    setShowDeleteModal(true);
  };

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Tiêu đề là bắt buộc';
    }

    if (formData.deductedPoints == null || formData.deductedPoints <= 0) {
      errors.deductedPoints = 'Điểm trừ phải lớn hơn 0';
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
    const requestData: ViolationRequest = {
      ...formData,
      userId: formData.shareAcrossGroup ? undefined : formData.userId,
      shareAcrossGroup: formData.shareAcrossGroup || false,
    };

    const response = await createViolation(requestData);

    if (response.success && response.data) {
      alert('Tạo vi phạm thành công!');
      setShowCreateModal(false);
      loadViolations();
    } else {
      alert(
        response.error?.message ||
          'Không thể tạo vi phạm. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [formData, validateForm, loadViolations]);

  const handleSubmitEdit = useCallback(async () => {
    if (!selectedViolation) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    const updateData: ViolationRequest = {
      ...formData,
      userId: formData.shareAcrossGroup ? undefined : formData.userId,
      shareAcrossGroup: formData.shareAcrossGroup || false,
    };
    const response = await updateViolation(selectedViolation.id, updateData);

    if (response.success && response.data) {
      alert('Cập nhật vi phạm thành công!');
      setShowEditModal(false);
      setSelectedViolation(null);
      loadViolations();
    } else {
      alert(
        response.error?.message ||
          'Không thể cập nhật vi phạm. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [selectedViolation, formData, validateForm, loadViolations]);

  const handleDelete = useCallback(async () => {
    if (!selectedViolation) return;

    setIsSubmitting(true);
    const response = await deleteViolation(selectedViolation.id);

    if (response.success) {
      alert('Xóa vi phạm thành công!');
      setShowDeleteModal(false);
      setSelectedViolation(null);
      loadViolations();
    } else {
      alert(
        response.error?.message ||
          'Không thể xóa vi phạm. Vui lòng thử lại sau!'
      );
    }

    setIsSubmitting(false);
  }, [selectedViolation, loadViolations]);

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
        [name]: name === 'deductedPoints' ? parseInt(value, 10) || 0 : value,
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
                title='Quản lý vi phạm'
                icon={FiAlertCircle}
                gradientFrom='from-red-600'
                gradientTo='to-orange-600'
                iconColor='text-red-600'
              />
            </div>
            <button
              onClick={handleCreateClick}
              className='flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700'
            >
              <FiPlus size={20} />
              <span>Tạo vi phạm mới</span>
            </button>
          </div>

          <div className='p-4'>
            {loadingViolations ? (
              <LoadingState message='Đang tải danh sách vi phạm...' />
            ) : loadingViolationsError ? (
              <ErrorMessage message={loadingViolationsError} />
            ) : violations.length > 0 ? (
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
                    className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'
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
                      ({filteredViolations.length} vi phạm)
                    </span>
                  )}
                </div>
                {filteredViolations.length === 0 ? (
                  <EmptyState
                    message={
                      childFilter === 'all'
                        ? 'Không có vi phạm nào'
                        : 'Không có vi phạm nào với bộ lọc này. Thử chọn "Tất cả".'
                    }
                  />
                ) : (
                  <div className='grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                    {filteredViolations.map((violation) => (
                      <GradientCard
                        key={violation.id}
                        gradientClass={getGradientByIndex(violation.id)}
                        className='h-full'
                      >
                        <div className='flex h-full flex-col justify-between'>
                          <div>
                            <div className='mb-3 flex items-center justify-between'>
                              <span className='rounded-full border border-red-100 bg-white/50 px-3 py-1 text-sm font-medium text-red-700 shadow-sm backdrop-blur-sm'>
                                ID: {violation.id}
                              </span>
                              <PointsBadge
                                points={violation.deductedPoints}
                                variant='deducted'
                              />
                            </div>
                            <h3 className='mb-3 text-lg font-semibold text-gray-800'>
                              {violation.title}
                            </h3>
                            {violation.description && (
                              <p className='text-sm text-gray-600'>
                                {violation.description}
                              </p>
                            )}
                          </div>
                          <div className='mt-4 flex gap-2'>
                            <button
                              onClick={() => handleEditClick(violation)}
                              className='flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white/50 px-3 py-1.5 text-sm text-red-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md'
                            >
                              <FiEdit2 size={16} />
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(violation)}
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
              <EmptyState message='Không có vi phạm nào' />
            )}
          </div>
        </div>

        {/* Create Modal */}
        <FormModal
          isOpen={showCreateModal}
          title='Tạo vi phạm mới'
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
              placeholder='Nhập tiêu đề vi phạm'
            />
            <FormInput
              label='Điểm trừ'
              name='deductedPoints'
              type='number'
              value={formData.deductedPoints.toString()}
              onChange={handleInputChange}
              error={formErrors.deductedPoints}
              required
              placeholder='Nhập số điểm trừ'
            />
            <FormInput
              label='Mô tả (tùy chọn)'
              name='description'
              value={formData.description || ''}
              onChange={handleInputChange}
              error={formErrors.description}
              placeholder='Nhập mô tả vi phạm'
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
                Vi phạm này sẽ áp dụng cho tất cả các con của bạn.
              </div>
            )}
          </div>
        </FormModal>

        {/* Edit Modal */}
        <FormModal
          isOpen={showEditModal}
          title='Sửa vi phạm'
          confirmText='Cập nhật'
          cancelText='Hủy'
          onConfirm={handleSubmitEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedViolation(null);
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
              placeholder='Nhập tiêu đề vi phạm'
            />
            <FormInput
              label='Điểm trừ'
              name='deductedPoints'
              type='number'
              value={formData.deductedPoints.toString()}
              onChange={handleInputChange}
              error={formErrors.deductedPoints}
              required
              placeholder='Nhập số điểm trừ'
            />
            <FormInput
              label='Mô tả (tùy chọn)'
              name='description'
              value={formData.description || ''}
              onChange={handleInputChange}
              error={formErrors.description}
              placeholder='Nhập mô tả vi phạm'
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
                Vi phạm này sẽ áp dụng cho tất cả các con của bạn.
              </div>
            )}
          </div>
        </FormModal>

        {/* Delete Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title='Xác nhận xóa vi phạm'
          message={`Bạn có chắc muốn xóa vi phạm "${selectedViolation?.title}"? Hành động này không thể hoàn tác.`}
          confirmText='Xóa'
          cancelText='Hủy'
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedViolation(null);
          }}
          isLoading={isSubmitting}
          variant='error'
        />
      </div>
    </Layout>
  );
};

export default ManageViolations;
