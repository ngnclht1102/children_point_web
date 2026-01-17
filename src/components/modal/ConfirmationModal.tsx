/**
 * Confirmation modal component
 */

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

type ModalVariant = 'default' | 'error';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: ModalVariant;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'default',
}: ConfirmationModalProps) {
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

  const variantStyles = {
    default: {
      button: 'bg-indigo-600 hover:bg-indigo-700',
      title: 'text-gray-900',
    },
    error: {
      button: 'bg-red-600 hover:bg-red-700',
      title: 'text-red-900',
    },
  };

  const styles = variantStyles[variant];

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
      aria-describedby='modal-description'
    >
      <div className='mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg'>
        <h3
          id='modal-title'
          className={cn('mb-4 text-xl font-bold', styles.title)}
        >
          {title}
        </h3>
        <p id='modal-description' className='mb-4 text-gray-700'>
          {message}
        </p>
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
              'rounded-lg px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              styles.button
            )}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
