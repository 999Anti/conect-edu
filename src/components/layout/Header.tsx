'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@store/auth';
import Button from '@components/ui/Button';
import ThemeToggle from '@components/theme/ThemeToggle';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useStore();
  const dashboardHref = user?.role === 'school_admin' ? '/admin/dashboard' : user?.role === 'conect_admin' ? '/conect/dashboard' : '/dashboard';

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-secondary-200 dark:border-slate-700 sticky top-0 z-40">
      <nav className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl text-primary-600">
          CONECT
          <span className="text-secondary-900 dark:text-slate-100"> EDU</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/schools" className="text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">
            Find Schools
          </Link>
          <Link href="/compare" className="text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">
            Compare
          </Link>
          <Link href="/faq" className="text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">
            FAQ
          </Link>
          <Link href="/school-apply" className="text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">
            List Your School
          </Link>
          <Link href="/school-login" className="text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">
            School Login
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href={dashboardHref} className="text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">
                Dashboard
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
              <ThemeToggle />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-secondary-700 dark:text-slate-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-secondary-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="container px-4 py-4 space-y-4">
            <Link
              href="/schools"
              className="block text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsOpen(false)}
            >
              Find Schools
            </Link>
            <Link
              href="/compare"
              className="block text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsOpen(false)}
            >
              Compare
            </Link>
            <Link
              href="/faq"
              className="block text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <Link href="/school-apply" className="block text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setIsOpen(false)}>
              List Your School
            </Link>
            <Link href="/school-login" className="block text-secondary-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setIsOpen(false)}>
              School Login
            </Link>

            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="block text-secondary-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Button onClick={handleLogout} variant="outline" fullWidth>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
