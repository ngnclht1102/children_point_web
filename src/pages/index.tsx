'use-client';
import { useState, useCallback, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getAuthToken, nonAuthorizedFetch } from '@/lib/api';
const Index = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState<any>({
    username: '',
    password: '',
    rememberMe: true,
    fullName: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const token = getAuthToken();
    if (token) window.location.href = '/child_dashboard';
  }, []);
  const validateForm = useCallback(() => {
    const newErrors: any = {};
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
    const newErrors: any = {};
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
    if (!formData.fullName) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await nonAuthorizedFetch('/api/public/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            response: { data: errorData },
            message: `Lỗi HTTP! trạng thái: ${response.status}`,
          };
        }
        const data = await response.json();
        console.log('Đăng nhập thành công:', data);
        // Lưu token vào localStorage
        if (data.token) {
          // Giả sử token nằm trong phản hồi dưới dạng data.token
          localStorage.setItem('authToken', data.token);
          // Tùy chọn, chuyển hướng người dùng hoặc thực hiện các hành động khác
          console.log('Token đã được lưu trong localStorage');
          // Ví dụ chuyển hướng:
          window.location.href = '/child_dashboard';
        } else {
          console.error('Không tìm thấy token trong phản hồi.');
          setErrors({
            ...errors,
            general: 'Đăng nhập thành công, nhưng không nhận được token.',
          });
        }
      } catch (error: any) {
        console.error('Lỗi đăng nhập:', error.response?.data || error.message);
        setErrors({
          ...errors,
          general:
            'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập của bạn.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      setIsLoading(true);
      try {
        const response = await nonAuthorizedFetch(
          '/api/public/v1/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
              fullName: formData.fullName,
            }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            response: { data: errorData },
            message: `Lỗi HTTP! trạng thái: ${response.status}`,
          };
        }
        const data = await response.json();
        console.log('Đăng ký thành công:', data);
        setShowSignup(false); // Chuyển về giao diện đăng nhập
        setFormData({ username: '', password: '', rememberMe: false } as any); // Đặt lại biểu mẫu
      } catch (error: any) {
        console.error('Lỗi đăng ký:', error.response?.data || error.message);
        setErrors({
          ...errors,
          general: 'Đăng ký thất bại. Vui lòng thử lại.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
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
                <div>
                  <label
                    htmlFor='username'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Tên người dùng
                  </label>
                  <div className='relative mt-1'>
                    <input
                      id='username'
                      name='username'
                      type='text'
                      autoComplete='username'
                      required
                      className={`block w-full appearance-none border px-3 py-2 ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder='Nhập tên người dùng của bạn'
                      value={formData.username}
                      onChange={handleChange}
                      aria-invalid={errors.username ? 'true' : 'false'}
                    />
                  </div>
                  {errors.username && (
                    <p className='mt-1 text-sm text-red-600' role='alert'>
                      {errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Mật khẩu
                  </label>
                  <div className='relative mt-1'>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='current-password'
                      required
                      className={`block w-full appearance-none border py-2 pl-3 pr-10 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder='Nhập mật khẩu của bạn'
                      value={formData.password}
                      onChange={handleChange}
                      aria-invalid={errors.password ? 'true' : 'false'}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-3'
                      aria-label={
                        showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash className='text-gray-400 hover:text-gray-600' />
                      ) : (
                        <FaEye className='text-gray-400 hover:text-gray-600' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='mt-1 text-sm text-red-600' role='alert'>
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <input
                      id='remember-me'
                      name='rememberMe'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor='remember-me'
                      className='ml-2 block text-sm text-gray-700'
                    >
                      Ghi nhớ tôi
                    </label>
                  </div>
                  <div className='text-sm'>
                    <button
                      type='button'
                      disabled
                      onClick={() => setShowSignup(!showSignup)}
                      className='font-medium text-gray-200 '
                    >
                      Đăng ký tài khoản mới
                    </button>
                  </div>
                </div>
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
                <div>
                  <label
                    htmlFor='fullName'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Họ và tên
                  </label>
                  <div className='mt-1'>
                    <input
                      id='fullName'
                      name='fullName'
                      type='text'
                      required
                      className={`block w-full appearance-none border px-3 py-2 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder='Nhập họ và tên của bạn'
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.fullName && (
                    <p className='mt-1 text-sm text-red-600' role='alert'>
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='register-password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Mật khẩu
                  </label>
                  <div className='relative mt-1'>
                    <input
                      id='register-password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='new-password'
                      required
                      className='block w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Tạo mật khẩu'
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-3'
                      aria-label={
                        showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash className='text-gray-400 hover:text-gray-600' />
                      ) : (
                        <FaEye className='text-gray-400 hover:text-gray-600' />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='confirm-password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className='relative mt-1'>
                    <input
                      id='confirm-password'
                      name='confirmPassword'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='new-password'
                      required
                      className='block w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Xác nhận mật khẩu của bạn'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-3'
                      aria-label={
                        showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash className='text-gray-400 hover:text-gray-600' />
                      ) : (
                        <FaEye className='text-gray-400 hover:text-gray-600' />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                Tạo Tài Khoản
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default Index;
