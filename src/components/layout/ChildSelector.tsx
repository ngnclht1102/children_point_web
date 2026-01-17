/**
 * Child selector dropdown for PARENT users
 */

import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiUser } from 'react-icons/fi';
import { useSelectedChild } from '@/lib/context/SelectedChildContext';
import { getChildren } from '@/lib/services/parent.service';
import { User } from '@/types';
import LoadingState from '@/components/state/LoadingState';

export default function ChildSelector() {
  const { selectedChild, setSelectedChild, isParent } = useSelectedChild();
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
      // Auto-select first child if none selected
      if (!selectedChild && response.data.length > 0) {
        setSelectedChild(response.data[0]);
      }
    }
    setLoading(false);
  };

  const handleSelectChild = (child: User) => {
    setSelectedChild(child);
    setIsOpen(false);
  };

  if (!isParent) {
    return null;
  }

  if (loading) {
    return (
      <div className='flex items-center gap-2'>
        <LoadingState message='' />
      </div>
    );
  }

  if (children.length === 0) {
    return <div className='text-sm text-gray-500'>Không có con nào</div>;
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
      >
        <FiUser size={18} />
        <span>
          {selectedChild
            ? selectedChild.fullName || selectedChild.username
            : 'Chọn con'}
        </span>
        <FiChevronDown
          size={18}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />
          <div className='absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg'>
            <div className='max-h-60 overflow-y-auto'>
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleSelectChild(child)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    selectedChild?.id === child.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className='font-medium'>{child.fullName}</div>
                  <div className='text-xs text-gray-500'>{child.username}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
