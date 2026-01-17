'use client';
import { useState, useCallback, useEffect } from 'react';
import { getAuthToken } from '@/lib/api/auth';
import { login, register } from '@/lib/services/auth.service';
import { LoginRequest, RegisterRequest, FormErrors } from '@/types';
import FormInput from '@/components/forms/FormInput';
import PasswordInput from '@/components/forms/PasswordInput';
import CheckboxInput from '@/components/forms/CheckboxInput';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData extends LoginFormData {
  fullName: string;
  confirmPassword?: string;
}

const Index = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState<LoginFormData | RegisterFormData>({
    username: '',
    password: '',
    rememberMe: true,
    fullName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      window.location.href = '/child_dashboard';
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!formData.username) {
      newErrors.username = 'Tên người dùng là bắt buộc';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateRegisterForm = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!formData.username) {
      newErrors.username = 'Tên người dùng là bắt buộc';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!('fullName' in formData) || !formData.fullName) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }
    if (
      'confirmPassword' in formData &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrors({});

      const loginRequest: LoginRequest = {
        username: formData.username,
        password: formData.password,
      };

      const response = await login(loginRequest);

      if (response.success && response.data) {
        window.location.href = '/child_dashboard';
      } else {
        setErrors({
          general:
            response.error?.message ||
            'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập của bạn.',
        });
      }

      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      setIsLoading(true);
      setErrors({});

      const registerRequest: RegisterRequest = {
        username: formData.username,
        password: formData.password,
        fullName: 'fullName' in formData ? formData.fullName : '',
      };

      const response = await register(registerRequest);

      if (response.success) {
        setShowSignup(false);
        setFormData({
          username: '',
          password: '',
          rememberMe: false,
          fullName: '',
        });
        setErrors({});
      } else {
        setErrors({
          general:
            response.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
        });
      }

      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className='perspective-1000 flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='relative flex w-full justify-center gap-8'>
        {!showSignup && (
          <div
            className='rotate-y-0 w-full max-w-md translate-x-0 transform space-y-8 rounded-xl bg-white p-8 opacity-100 shadow-2xl transition-all duration-700 ease-in-out'
            id='signin-ui'
          >
            <div className='text-center'>
              <img
                src='https://images.unsplash.com/photo-1633409361618-c73427e4e206'
                alt='Logo Công Ty'
                className='mx-auto mb-4 h-12 w-auto'
              />
              <h2 className='mb-2 text-3xl font-bold text-gray-900'>
                Chào mừng trở lại
              </h2>
              <p className='text-gray-600'>
                Vui lòng đăng nhập vào tài khoản của bạn
              </p>
            </div>
            <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
              <div className='space-y-4'>
                <FormInput
                  label='Tên người dùng'
                  name='username'
                  type='text'
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  placeholder='Nhập tên người dùng của bạn'
                  required
                />
                <PasswordInput
                  label='Mật khẩu'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder='Nhập mật khẩu của bạn'
                  required
                />
                <div className='flex items-center justify-between'>
                  <CheckboxInput
                    label='Ghi nhớ tôi'
                    name='rememberMe'
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <div className='text-sm'>
                    <button
                      type='button'
                      disabled
                      onClick={() => setShowSignup(!showSignup)}
                      className='font-medium text-gray-200'
                    >
                      Đăng ký tài khoản mới
                    </button>
                  </div>
                </div>
                {errors.general && (
                  <p className='text-sm text-red-600' role='alert'>
                    {errors.general}
                  </p>
                )}
              </div>
              <button
                type='submit'
                disabled={isLoading}
                className='flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isLoading ? (
                  <svg
                    className='h-5 w-5 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>
          </div>
        )}
        {showSignup && (
          <div
            className='rotate-y-0 animate-slide-in-right w-full max-w-md translate-x-0 transform space-y-8 rounded-xl bg-white p-8 opacity-100 shadow-2xl transition-all duration-700 ease-in-out'
            id='signup-ui'
          >
            <div className='mb-6 flex items-center justify-between'>
              <button
                onClick={() => setShowSignup(false)}
                className='flex items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-gray-800'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                Quay lại Đăng nhập
              </button>
            </div>
            <div className='text-center'>
              <img
                src='https://images.unsplash.com/photo-1633409361618-c73427e4e206'
                alt='Logo Công Ty'
                className='mx-auto mb-4 h-12 w-auto'
              />
              <h2 className='mb-2 text-3xl font-bold text-gray-900'>
                Tạo Tài Khoản
              </h2>
              <p className='text-gray-600'>Đăng ký tài khoản mới</p>
            </div>
            <form onSubmit={handleRegisterSubmit} className='mt-8 space-y-6'>
              <div className='space-y-4'>
                <FormInput
                  label='Họ và tên'
                  name='fullName'
                  type='text'
                  value={'fullName' in formData ? formData.fullName : ''}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder='Nhập họ và tên của bạn'
                  required
                />
                <FormInput
                  label='Tên người dùng'
                  name='username'
                  type='text'
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  placeholder='Nhập tên người dùng của bạn'
                  required
                />
                <PasswordInput
                  label='Mật khẩu'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder='Tạo mật khẩu'
                  required
                />
                <PasswordInput
                  label='Xác nhận mật khẩu'
                  name='confirmPassword'
                  value={
                    'confirmPassword' in formData
                      ? formData.confirmPassword || ''
                      : ''
                  }
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder='Xác nhận mật khẩu của bạn'
                  required
                />
                {errors.general && (
                  <p className='text-sm text-red-600' role='alert'>
                    {errors.general}
                  </p>
                )}
              </div>
              <button
                type='submit'
                disabled={isLoading}
                className='flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isLoading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
