import Layout from '@/components/layout/Layout';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FiUserPlus, FiEdit2, FiUsers } from 'react-icons/fi';
import SectionHeader from '@/components/layout/SectionHeader';
import LoadingState from '@/components/state/LoadingState';
import ErrorMessage from '@/components/state/ErrorMessage';
import EmptyState from '@/components/state/EmptyState';
import FormModal from '@/components/modal/FormModal';
import FormInput from '@/components/forms/FormInput';
import PasswordInput from '@/components/forms/PasswordInput';
import {
  getChildren,
  createChild,
  updateChild,
} from '@/lib/services/parent.service';
import { User, CreateChildRequest, UpdateChildRequest } from '@/types';
import {
  getStoredUser,
  hasRole,
  getCurrentUser,
} from '@/lib/services/auth.service';

const ManageChildren = () => {
  const router = useRouter();
  const [children, setChildren] = useState<User[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState<CreateChildRequest>({
    username: '',
    password: '',
    fullName: '',
  });
  const [editForm, setEditForm] = useState<UpdateChildRequest>({
    fullName: '',
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [checkingAuth, setCheckingAuth] = useState(true);

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

      setCheckingAuth(false);
      loadChildren();
    };

    checkAuth();
  }, [router]);

  const loadChildren = useCallback(async () => {
    setLoadingChildren(true);
    setLoadingError(null);
    const response = await getChildren();

    if (response.success && response.data) {
      setChildren(response.data);
    } else {
      setLoadingError(response.error?.message || 'Không thể tải danh sách con');
    }
    setLoadingChildren(false);
  }, []);

  const handleCreateClick = () => {
    setCreateForm({ username: '', password: '', fullName: '' });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleEditClick = (child: User) => {
    setSelectedChild(child);
    setEditForm({
      fullName: child.fullName,
      username: child.username,
      password: '',
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const validateCreate = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!createForm.username?.trim()) {
      errors.username = 'Tên đăng nhập là bắt buộc';
    }
    if (!createForm.password?.trim()) {
      errors.password = 'Mật khẩu là bắt buộc';
    }
    if (!createForm.fullName?.trim()) {
      errors.fullName = 'Họ tên là bắt buộc';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [createForm]);

  const validateEdit = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!editForm.fullName?.trim()) {
      errors.fullName = 'Họ tên là bắt buộc';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [editForm]);

  const handleSubmitCreate = useCallback(async () => {
    if (!validateCreate()) return;

    setIsSubmitting(true);
    const response = await createChild({
      username: createForm.username.trim(),
      password: createForm.password,
      fullName: createForm.fullName.trim(),
    });

    if (response.success && response.data) {
      alert('Thêm con thành công!');
      setShowCreateModal(false);
      loadChildren();
    } else {
      alert(
        response.error?.message ||
          'Không thể thêm con. Vui lòng thử lại (kiểm tra tên đăng nhập đã tồn tại chưa).'
      );
    }
    setIsSubmitting(false);
  }, [createForm, validateCreate, loadChildren]);

  const handleSubmitEdit = useCallback(async () => {
    if (!selectedChild || !validateEdit()) return;

    setIsSubmitting(true);
    const payload: UpdateChildRequest = {
      fullName: editForm.fullName.trim(),
    };
    if (editForm.username?.trim()) {
      payload.username = editForm.username.trim();
    }
    if (editForm.password?.trim()) {
      payload.password = editForm.password;
    }

    const response = await updateChild(selectedChild.id, payload);

    if (response.success && response.data) {
      alert('Cập nhật thông tin con thành công!');
      setShowEditModal(false);
      setSelectedChild(null);
      loadChildren();
    } else {
      alert(response.error?.message || 'Không thể cập nhật. Vui lòng thử lại.');
    }
    setIsSubmitting(false);
  }, [selectedChild, editForm, validateEdit, loadChildren]);

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
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
                title='Quản lý con'
                icon={FiUsers}
                gradientFrom='from-indigo-600'
                gradientTo='to-purple-600'
                iconColor='text-indigo-600'
              />
            </div>
            <button
              onClick={handleCreateClick}
              className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700'
            >
              <FiUserPlus size={20} />
              <span>Thêm con</span>
            </button>
          </div>

          <div className='p-4'>
            {loadingChildren ? (
              <LoadingState message='Đang tải danh sách con...' />
            ) : loadingError ? (
              <ErrorMessage message={loadingError} />
            ) : children.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead>
                    <tr>
                      <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                        Họ tên
                      </th>
                      <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                        Tên đăng nhập
                      </th>
                      <th className='px-4 py-3 text-right text-sm font-medium text-gray-700'>
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {children.map((child) => (
                      <tr key={child.id} className='hover:bg-gray-50'>
                        <td className='px-4 py-3 text-sm text-gray-900'>
                          {child.fullName}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-600'>
                          {child.username}
                        </td>
                        <td className='px-4 py-3 text-right'>
                          <button
                            onClick={() => handleEditClick(child)}
                            className='inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm text-indigo-600 transition-colors hover:bg-indigo-50'
                          >
                            <FiEdit2 size={16} />
                            Sửa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message='Chưa có con nào. Nhấn "Thêm con" để tạo tài khoản con.' />
            )}
          </div>
        </div>

        {/* Create child modal */}
        <FormModal
          isOpen={showCreateModal}
          title='Thêm con'
          confirmText='Thêm'
          cancelText='Hủy'
          onConfirm={handleSubmitCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isSubmitting}
        >
          <div className='space-y-4'>
            <FormInput
              label='Tên đăng nhập (con dùng để đăng nhập)'
              name='username'
              value={createForm.username}
              onChange={handleCreateInputChange}
              error={formErrors.username}
              required
              placeholder='Nhập tên đăng nhập'
            />
            <PasswordInput
              label='Mật khẩu'
              name='password'
              value={createForm.password}
              onChange={handleCreateInputChange}
              error={formErrors.password}
              required
              placeholder='Nhập mật khẩu'
            />
            <FormInput
              label='Họ tên'
              name='fullName'
              value={createForm.fullName}
              onChange={handleCreateInputChange}
              error={formErrors.fullName}
              required
              placeholder='Nhập họ tên con'
            />
          </div>
        </FormModal>

        {/* Edit child modal */}
        <FormModal
          isOpen={showEditModal}
          title='Sửa thông tin con'
          confirmText='Cập nhật'
          cancelText='Hủy'
          onConfirm={handleSubmitEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedChild(null);
          }}
          isLoading={isSubmitting}
        >
          <div className='space-y-4'>
            <FormInput
              label='Họ tên'
              name='fullName'
              value={editForm.fullName}
              onChange={handleEditInputChange}
              error={formErrors.fullName}
              required
              placeholder='Nhập họ tên con'
            />
            <FormInput
              label='Tên đăng nhập (để trống nếu không đổi)'
              name='username'
              value={editForm.username ?? ''}
              onChange={handleEditInputChange}
              error={formErrors.username}
              placeholder='Nhập tên đăng nhập mới'
            />
            <PasswordInput
              label='Mật khẩu mới (để trống nếu không đổi)'
              name='password'
              value={editForm.password ?? ''}
              onChange={handleEditInputChange}
              error={formErrors.password}
              placeholder='Nhập mật khẩu mới'
            />
          </div>
        </FormModal>
      </div>
    </Layout>
  );
};

export default ManageChildren;
