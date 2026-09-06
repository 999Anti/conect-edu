'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@store/auth';
import { Menu, X, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const menuItems = user?.role === 'school_admin' 
    ? [
        { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
        { label: 'Applications', href: '/admin/applications', icon: '📋' },
        { label: 'Students', href: '/admin/students', icon: '👥' },
        { label: 'School Profile', href: '/admin/school-profile', icon: '🏫' },
        { label: 'Programs', href: '/admin/programs', icon: '📚' },
        { label: 'Requirements', href: '/admin/requirements', icon: '✓' },
        { label: 'Tours', href: '/admin/tours', icon: '🎫' },
        { label: 'Messages', href: '/admin/messages', icon: '💬' },
        { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
      ]
    : [
        { label: 'Platform Admins', href: '/conect/admins', icon: 'Admin' },
        { label: 'Dashboard', href: '/conect/dashboard', icon: '📊' },
        { label: 'Schools', href: '/conect/schools', icon: '🏫' },
        { label: 'Users', href: '/conect/users', icon: '👥' },
        { label: 'Applications', href: '/conect/applications', icon: '📋' },
        { label: 'Payments', href: '/conect/payments', icon: '💰' },
        { label: 'Reports', href: '/conect/reports', icon: '📈' },
        { label: 'Settings', href: '/conect/settings', icon: '⚙️' },
      ];

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen bg-secondary-900 text-white w-64 z-40 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-secondary-800">
          <Link href="/" className="font-bold text-xl">
            CONECT <span className="text-primary-400">EDU</span>
          </Link>
          <p className="text-secondary-400 text-sm mt-1">
            {user?.role === 'school_admin' ? 'School Admin' : 'Platform Admin'}
          </p>
        </div>

        {/* Menu */}
        <nav className="p-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary-800 transition-colors text-secondary-300 hover:text-white"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-secondary-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-secondary-300 hover:text-white"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Close Button (Mobile) */}
        <button
          className="absolute top-4 right-4 md:hidden text-white"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-secondary-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-secondary-600">
              Welcome, {user?.firstName}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
