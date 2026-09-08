'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyThemePreference, ThemePreference } from './ThemeManager';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('conect-theme') as ThemePreference | null;
    applyTheme(savedTheme || 'system');
  }, []);

  const applyTheme = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    localStorage.setItem('conect-theme', nextTheme);
    applyThemePreference(nextTheme);
    window.dispatchEvent(new Event('conect-theme-change'));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-secondary-200 bg-white text-secondary-700 shadow-sm transition hover:border-primary-200 hover:text-primary-600 dark:border-secondary-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:text-primary-400"
      aria-label="Toggle color mode"
      title="Toggle color mode"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
