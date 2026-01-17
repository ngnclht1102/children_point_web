/**
 * Child select input component for forms
 */

import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiUser } from 'react-icons/fi';
import { getChildren } from '@/lib/services/parent.service';
import { User } from '@/types';
import LoadingState from '@/components/state/LoadingState';
import { cn } from '@/lib/utils';

interface ChildSelectInputProps {
  label: string;
  name: string;
  value?: number; // userId
  onChange: (userId: number | undefined) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  isParent?: boolean;
}

export default function ChildSelectInput({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className,
  isParent = true,
}: ChildSelectInputProps) {
  const [children, setChildren] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isParent) {
      loadChildren();
    }
  }, [isParent]);

  const loadChildren = async () => {
    setLoading(true);
    const response = await getChildren();
    if (response.success && response.data) {
      setChildren(response.data);
    }
    setLoading(false);
  };

  const selectedChild = children.find((child) => child.id === value);

  const handleSelectChild = (child: User) => {
    onChange(child.id);
    setIsOpen(false);
  };

  if (!isParent) {
    return null;
  }

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className='block text-sm font-medium text-gray-700'
        >
          {label}
          {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <div className={label ? 'mt-1' : ''}>
        {loading ? (
          <div className='flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2'>
            <LoadingState message='Đang tải...' />
          </div>
        ) : (
          <div className='relative'>
            <button
              type='button'
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              className={cn(
                'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
                error
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400',
                disabled && 'cursor-not-allowed bg-gray-100 opacity-50'
              )}
            >
              <div className='flex items-center gap-2'>
                <FiUser size={18} className='text-gray-400' />
                <span
                  className={selectedChild ? 'text-gray-900' : 'text-gray-500'}
                >
                  {selectedChild
                    ? selectedChild.fullName || selectedChild.username
                    : 'Chọn con'}
                </span>
              </div>
              <FiChevronDown
                size={18}
                className={cn(
                  'text-gray-400 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            {isOpen && !disabled && (
              <>
                <div
                  className='fixed inset-0 z-10'
                  onClick={() => setIsOpen(false)}
                />
                <div className='absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg'>
                  <div className='max-h-60 overflow-y-auto'>
                    {children.length === 0 ? (
                      <div className='px-4 py-2 text-sm text-gray-500'>
                        Không có con nào
                      </div>
                    ) : (
                      children.map((child) => (
                        <button
                          key={child.id}
                          type='button'
                          onClick={() => handleSelectChild(child)}
                          className={cn(
                            'w-full px-4 py-2 text-left text-sm transition-colors',
                            selectedChild?.id === child.id
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          <div className='font-medium'>{child.fullName}</div>
                          <div className='text-xs text-gray-500'>
                            {child.username}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className='mt-1 text-sm text-red-600' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
