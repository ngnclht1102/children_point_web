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
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateRegisterForm = useCallback(() => {
    const newErrors: any = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
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
            message: `HTTP error! status: ${response.status}`,
          };
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Store token in localStorage
        if (data.token) {
          // Assuming the token is in the response as data.token
          localStorage.setItem('authToken', data.token);
          // Optionally, redirect the user or perform other actions
          console.log('Token stored in localStorage');
          // Example redirect:
          window.location.href = '/child_dashboard';
        } else {
          console.error('Token not found in response.');
          setErrors({
            ...errors,
            general: 'Login successful, but token not received.',
          });
        }
      } catch (error: any) {
        console.error('Login error:', error.response?.data || error.message);
        setErrors({
          ...errors,
          general: 'Login failed. Please check your credentials.',
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
            message: `HTTP error! status: ${response.status}`,
          };
        }

        const data = await response.json();
        console.log('Registration successful:', data);
        setShowSignup(false); // Switch back to login view
        setFormData({ username: '', password: '', rememberMe: false } as any); // Reset form
      } catch (error: any) {
        console.error(
          'Registration error:',
          error.response?.data || error.message
        );
        setErrors({
          ...errors,
          general: 'Registration failed. Please try again.',
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
                alt='Company Logo'
                className='mx-auto mb-4 h-12 w-auto'
              />
              <h2 className='mb-2 text-3xl font-bold text-gray-900'>
                Welcome back
              </h2>
              <p className='text-gray-600'>Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='username'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Username
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
                      placeholder='Enter your username'
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
                    Password
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
                      placeholder='Enter your password'
                      value={formData.password}
                      onChange={handleChange}
                      aria-invalid={errors.password ? 'true' : 'false'}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-3'
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
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
                      Remember me
                    </label>
                  </div>

                  <div className='text-sm'>
                    <button
                      type='button'
                      disabled
                      onClick={() => setShowSignup(!showSignup)}
                      className='font-medium text-gray-200 '
                    >
                      Register new account
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
                  'Sign in'
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
                Back to Login
              </button>
            </div>

            <div className='text-center'>
              <img
                src='https://images.unsplash.com/photo-1633409361618-c73427e4e206'
                alt='Company Logo'
                className='mx-auto mb-4 h-12 w-auto'
              />
              <h2 className='mb-2 text-3xl font-bold text-gray-900'>
                Create Account
              </h2>
              <p className='text-gray-600'>Register for a new account</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className='mt-8 space-y-6'>
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='fullName'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Full Name
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
                      placeholder='Enter your full name'
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
                    Password
                  </label>
                  <div className='relative mt-1'>
                    <input
                      id='register-password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='new-password'
                      required
                      className='block w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Create a password'
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-3'
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
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
                    Confirm Password
                  </label>
                  <div className='relative mt-1'>
                    <input
                      id='confirm-password'
                      name='confirmPassword'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='new-password'
                      required
                      className='block w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Confirm your password'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-3'
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
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
                Create Account
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
