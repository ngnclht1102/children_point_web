import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  FiHome,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiMoreVertical,
  FiFlag,
  FiTrendingUp,
  FiGift,
  FiRefreshCw,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi';

const menuItems = [
  {
    disabled: false,
    icon: <FiHome size={24} />,
    label: 'Tình hình hiện tại',
    id: 'dashboard',
    route: '/', // Route for the dashboard
  },
  {
    disabled: false,
    icon: <FiFlag size={24} />,
    label: 'Danh sách thử thách',
    id: 'challenge-list',
    route: '/list-challenges', // Route for the challenge list
  },
  {
    disabled: true,
    icon: <FiTrendingUp size={24} />,
    label: 'Lịch sử tích điểm',
    id: 'point-history',
    route: '/points/history', // Route for point history
  },
  {
    disabled: false,
    icon: <FiGift size={24} />,
    label: 'Danh sách phần thưởng',
    id: 'gifts',
    route: '/list-rewards', // Route for the gifts list
  },
  {
    disabled: true,
    icon: <FiRefreshCw size={24} />,
    label: 'Lịch sử đổi quà',
    id: 'redeem-history',
    route: '/redeem/history', // Route for redeem history
  },
  {
    disabled: true,
    icon: <FiAlertCircle size={24} />,
    label: 'Danh sách vi phạm',
    id: 'violations',
    route: '/violations', // Route for violations list
  },
  {
    disabled: true,
    icon: <FiClock size={24} />,
    label: 'Lịch sử vi phạm',
    id: 'violation-history',
    route: '/violations/history', // Route for violation history
  },
];

export const Sidebar = ({
  setActiveTab,
  sidebarOpen,
  toggleSidebar,
  activeTab,
}: any) => {
  const router = useRouter();

  const handleNavigation = useCallback(
    (id: any, route: any) => {
      setActiveTab(id);
      router.push(`${route}`);
    },
    [setActiveTab, router]
  );

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 bg-white shadow-lg`}
    >
      <div className='p-4 flex items-center justify-between'>
        <img
          src='https://images.unsplash.com/photo-1599305445671-ac291c95aaa9'
          alt='Logo'
          className={`${
            sidebarOpen ? 'w-32' : 'w-10'
          } transition-all duration-300`}
        />
        <button
          onClick={toggleSidebar}
          className='p-2 rounded-lg hover:bg-gray-100'
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <nav className='mt-8'>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              !item.disabled && handleNavigation(item.id, item.route)
            }
            className={`w-full flex items-center p-4 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600'
            } ${
              !sidebarOpen && 'justify-center'
            } hover:bg-indigo-50 transition-colors
            ${item.disabled && 'opacity-50 cursor-not-allowed'}`}
          >
            {item.icon}
            {sidebarOpen && <span className='ml-4'>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};
