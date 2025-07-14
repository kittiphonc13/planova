'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth, AuthGuard } from '@/lib/auth/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
  };
  
  // Navigation items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Nutrition', href: '/dashboard/nutrition' },
    { name: 'Workouts', href: '/dashboard/workouts' },
    { name: 'Profile', href: '/dashboard/profile' },
  ];
  
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
              <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                Planova
              </Link>
            </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <h1 className="text-lg font-medium text-gray-900">
              {navItems.find((item) => item.href === pathname)?.name || 'Dashboard'}
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                type="button"
                className="rounded-full bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              
              {/* User menu */}
              <Link href="/dashboard/profile" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">U</span>
                </div>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
    </AuthGuard>
  );
}
