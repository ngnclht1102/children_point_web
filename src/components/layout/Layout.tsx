import { Sidebar } from '@/components/sidebar/Sidebar';
import * as React from 'react';
import { useState } from 'react';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('challenge-list');
  const toggleSidebar = React.useCallback(
    () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  // Put Header or Footer Here
  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className='flex-1 overflow-y-auto'>
        <header className='bg-white shadow-sm'>
          <div className='flex items-center justify-between px-6 py-4'>
            <div className='flex items-center gap-4'>
              <button
                className='p-2 rounded-lg hover:bg-gray-100 lg:hidden'
                onClick={toggleSidebar}
              >
                <FiMenu size={24} />
              </button>
              <div className='relative'>
                <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Tìm kiếm...'
                  className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <button className='p-2 rounded-lg hover:bg-gray-100 relative'>
                <FiBell size={24} />
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              </button>
              <img
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
                alt='Profile'
                className='w-10 h-10 rounded-full'
              />
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
