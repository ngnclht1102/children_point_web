/**
 * Form modal component
 */

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FormModalProps {
  isOpen: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function FormModal({
  isOpen,
  title,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  isLoading = false,
  children,
}: FormModalProps) {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onCancel();
        }
      }}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      <div className='mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg'>
        <h3 id='modal-title' className='mb-4 text-xl font-bold text-gray-900'>
          {title}
        </h3>
        <div className='mb-4'>{children}</div>
        <div className='flex justify-end gap-4'>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className='rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
