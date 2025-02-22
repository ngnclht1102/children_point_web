import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  FiHome,
  FiMenu,
  FiX,
  FiFlag,
  FiTrendingUp,
  FiGift,
  FiRefreshCw,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi';
import useMediaQuery from '@/hooks/media-query';

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
    disabled: false,
    icon: <FiAlertCircle size={24} />,
    label: 'Danh sách vi phạm',
    id: 'violations',
    route: '/list-violations', // Route for violations list
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

  useEffect(() => {
    const handleRouteChange = async () => {
      // Check if the current route matches any of the menu items
      const menuItem = menuItems.find((item) => item.route === router.pathname);

      if (menuItem) {
        setActiveTab(menuItem.id);
      }
    };

    // Call the function when the component mounts and whenever the route changes
    handleRouteChange();

    // Listen for route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      // Clean up the event listener when the component unmounts
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.pathname, setActiveTab]);

  const handleNavigation = useCallback(
    (id: any, route: any) => {
      router.push(`${route}`);
    },
    [setActiveTab, router]
  );

  // Check if it's a mobile device
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile]);

  return (
    <aside
      className={`${
        !sidebarOpen && 'h-screen w-16'
      } bg-white shadow-lg transition-all duration-300`}
    >
      <div className='flex items-center justify-between p-4'>
        {/*<img*/}
        {/*  src='https://images.unsplash.com/photo-1599305445671-ac291c95aaa9'*/}
        {/*  alt='Logo'*/}
        {/*  className={`${*/}
        {/*    sidebarOpen ? 'w-32' : 'w-10'*/}
        {/*  } transition-all duration-300`}*/}
        {/*/>*/}
        <button
          onClick={toggleSidebar}
          className='rounded-lg p-2 hover:bg-gray-100'
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
            className={`flex w-full items-center p-4 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600'
            } ${
              !sidebarOpen && 'justify-center'
            } transition-colors hover:bg-indigo-50
            ${item.disabled && 'cursor-not-allowed opacity-50'}`}
          >
            {item.icon}
            {sidebarOpen && <span className='ml-4'>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};
