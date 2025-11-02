import { useAppSelector } from '@/hooks/useAppSelector';

import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { UserRole } from '@/types';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ResponsiveSharedLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role } = useAppSelector((state) => state.userSlice);
  const isAdmin = [UserRole.Admin].includes(role);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <main className='flex w-full min-h-screen bg-background'>
      {/* Sidebar for large screens (admin only) */}
      {isAdmin && (
        <aside className='hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-[270px] bg-white shadow-md border-r border-light-100 z-50'>
          <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
        </aside>
      )}
      {/* Overlay for sidebar on small screens when open or non-admin on large */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40'
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar drawer: for admin on small screens, for user on all screens */}
      <aside
        className={`fixed top-0 bottom-0 z-50 bg-white shadow-md w-[270px] transform transition-transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isAdmin ? 'lg:hidden' : ''}`}
      >
        <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content area */}
      <div
        className={`flex flex-col flex-1 min-h-screen
           ${isAdmin ? 'lg:ml-[270px]' : ''} `}
      >
        {/* Navbar: for admin only shows on small screens; for user always shows */}
        <Navbar isAdmin={isAdmin} toggleSidebar={setSidebarOpen} />
        {/* Scrollable content */}
        <section
          className={`flex-1 overflow-y-auto py-4 sm:py-6 px-4 sm:px-6 
            ${!isAdmin ? 'md:px-10 lg:px-20' : ''} `}
        >
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default ResponsiveSharedLayout;
