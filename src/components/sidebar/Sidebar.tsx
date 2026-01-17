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
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';
import useMediaQuery from '@/hooks/media-query';
import { getStoredUser, hasRole } from '@/lib/services/auth.service';

// Menu items configuration (without JSX to avoid hydration issues)
const getMenuItems = () => [
  {
    disabled: false,
    iconComponent: FiHome,
    label: 'Tình hình hiện tại',
    id: 'dashboard',
    route: '/child_dashboard',
    childOnly: true, // Hide for PARENT users
  },
  {
    disabled: false,
    iconComponent: FiFlag,
    label: 'Danh sách thử thách',
    id: 'challenge-list',
    route: '/list-challenges',
    childOnly: true, // Hide for PARENT users
  },
  {
    disabled: true,
    iconComponent: FiTrendingUp,
    label: 'Lịch sử tích điểm',
    id: 'point-history',
    route: '/points/history',
    childOnly: true, // Hide for PARENT users
  },
  {
    disabled: false,
    iconComponent: FiGift,
    label: 'Danh sách phần thưởng',
    id: 'gifts',
    route: '/list-rewards',
    childOnly: true, // Hide for PARENT users
  },
  {
    disabled: false,
    iconComponent: FiSettings,
    label: 'Quản lý phần thưởng',
    id: 'manage-rewards',
    route: '/manage-rewards',
    parentOnly: true, // Only show for PARENT users
  },
  {
    disabled: true,
    iconComponent: FiRefreshCw,
    label: 'Lịch sử đổi quà',
    id: 'redeem-history',
    route: '/redeem/history',
    childOnly: true, // Hide for PARENT users
  },
  {
    disabled: false,
    iconComponent: FiAlertCircle,
    label: 'Danh sách vi phạm',
    id: 'violations',
    route: '/list-violations',
    childOnly: true, // Hide for PARENT users
  },
  {
    disabled: true,
    iconComponent: FiClock,
    label: 'Lịch sử vi phạm',
    id: 'violation-history',
    route: '/violations/history',
    childOnly: true, // Hide for PARENT users
  },
  {
    disabled: false,
    iconComponent: FiLogOut,
    label: 'Đăng xuất',
    id: 'logout',
    // Logout is available for all users
  },
];

export const Sidebar = ({
  setActiveTab,
  sidebarOpen,
  toggleSidebar,
  activeTab,
}: any) => {
  const router = useRouter();
  const [user, setUser] = useState(getStoredUser());
  const [mounted, setMounted] = useState(false);
  const isParent = hasRole(user, 'PARENT');

  // Only check user role after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
    // Try to get user if not already loaded
    if (!user) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, [user]);

  const menuItems = getMenuItems();

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
  }, [router.pathname, setActiveTab, menuItems]);

  const handleNavigation = useCallback(
    (id: any, route: any) => {
      router.push(`${route}`);
    },
    [setActiveTab, router]
  );

  // Handle logout functionality
  const handleLogout = useCallback(() => {
    // Clear all local storage
    localStorage.clear();
    // Redirect to the home page
    router.push('/');
  }, [router]);

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
        {menuItems.map((item) => {
          // Only apply role-based filtering after component has mounted to avoid hydration mismatch
          if (mounted) {
            // Hide parent-only items if user is not a parent
            if ((item as any).parentOnly && !isParent) {
              return null;
            }
            // Hide child-only items if user is a parent
            if ((item as any).childOnly && isParent) {
              return null;
            }
          }
          // During SSR and initial render, show all items to ensure hydration matches
          // After mount, items will be filtered based on role

          const IconComponent = (item as any).iconComponent;
          const icon = IconComponent ? <IconComponent size={24} /> : null;

          // Render logout button differently since it doesn't have a route
          if (item.id === 'logout') {
            return (
              <button
                key={item.id}
                onClick={handleLogout}
                className={`flex w-full items-center p-4  ${
                  !sidebarOpen && 'justify-center'
                } transition-colors hover:bg-red-50`}
              >
                {icon}
                {sidebarOpen && <span className='ml-4'>{item.label}</span>}
              </button>
            );
          }

          // Render regular menu items
          return (
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
              {icon}
              {sidebarOpen && <span className='ml-4'>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
