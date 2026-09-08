'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@store/auth';
import {
  BarChart3, Building2, FileText, LayoutDashboard, LogOut, Menu, PanelLeftClose,
  PanelLeftOpen, Settings, ShieldCheck, Users, WalletCards, X,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useStore();
  const pathname = usePathname();
  const isSchoolAdmin = user?.role === 'school_admin';
  const menuItems = isSchoolAdmin
    ? [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Applications', href: '/admin/applications', icon: FileText },
        { label: 'School profile', href: '/admin/school-profile', icon: Building2 },
        { label: 'Staff', href: '/admin/staff', icon: Users },
      ]
    : [
        { label: 'Dashboard', href: '/conect/dashboard', icon: LayoutDashboard },
        { label: 'School approvals', href: '/conect/schools', icon: Building2 },
        { label: 'Users', href: '/conect/users', icon: Users },
        { label: 'Applications', href: '/conect/applications', icon: FileText },
        { label: 'Payments', href: '/conect/payments', icon: WalletCards },
        { label: 'Reports', href: '/conect/reports', icon: BarChart3 },
        { label: 'Activity log', href: '/conect/activity', icon: ShieldCheck },
        { label: 'Platform admins', href: '/conect/admins', icon: ShieldCheck },
        { label: 'Settings', href: '/conect/settings', icon: Settings },
      ];
  const closeMobile = () => setIsMobileOpen(false);
  const handleLogout = () => { logout(); window.location.assign('/'); };
  const sidebarWidth = isCollapsed ? 'md:w-[76px]' : 'md:w-64';

  return (
    <div className="min-h-screen bg-secondary-50">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-secondary-900 text-white transition-[width,transform] duration-200 ${sidebarWidth} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex h-[89px] items-center border-b border-secondary-800 px-4">
          <Link href="/" className={`min-w-0 overflow-hidden ${isCollapsed ? 'md:hidden' : ''}`} onClick={closeMobile}>
            <p className="whitespace-nowrap text-xl font-bold text-primary-400">CONECT <span className="text-white">EDU</span></p>
            <p className="mt-1 whitespace-nowrap text-sm text-secondary-400">{isSchoolAdmin ? 'School Admin' : 'Platform Admin'}</p>
          </Link>
          <Building2 className={`mx-auto text-primary-400 ${isCollapsed ? 'hidden md:block' : 'hidden'}`} size={25} aria-hidden="true" />
          <button type="button" className="ml-auto p-2 text-secondary-300 hover:text-white md:hidden" onClick={closeMobile} aria-label="Close navigation"><X size={21} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menuItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} title={isCollapsed ? label : undefined} onClick={closeMobile} className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${active ? 'bg-primary-600 text-white' : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'} ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} className="shrink-0" /><span className={isCollapsed ? 'md:hidden' : ''}>{label}</span>
            </Link>;
          })}
        </nav>
        <div className="border-t border-secondary-800 p-3">
          <button type="button" title={isCollapsed ? 'Log out' : undefined} onClick={handleLogout} className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-secondary-300 hover:bg-red-700 hover:text-white ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}><LogOut size={20} className="shrink-0" /><span className={isCollapsed ? 'md:hidden' : ''}>Log out</span></button>
        </div>
      </aside>
      {isMobileOpen && <button type="button" aria-label="Close navigation overlay" onClick={closeMobile} className="fixed inset-0 z-30 bg-black/40 md:hidden" />}
      <div className={`min-h-screen transition-[margin] duration-200 ${isCollapsed ? 'md:ml-[76px]' : 'md:ml-64'}`}>
        <header className="sticky top-0 z-20 flex h-[89px] items-center justify-between border-b border-secondary-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3"><button type="button" aria-label="Open navigation" className="p-2 text-secondary-700 md:hidden" onClick={() => setIsMobileOpen(true)}><Menu size={23} /></button><button type="button" aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'} className="hidden rounded-md p-2 text-secondary-600 hover:bg-secondary-100 md:block" onClick={() => setIsCollapsed((value) => !value)}>{isCollapsed ? <PanelLeftOpen size={21} /> : <PanelLeftClose size={21} />}</button><h1 className="truncate text-xl font-bold text-secondary-900 sm:text-2xl">{title}</h1></div>
          <p className="hidden text-sm text-secondary-600 sm:block">Welcome, {user?.firstName}</p>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
