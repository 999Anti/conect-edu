'use client';

import { useEffect } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

export const applyThemePreference = (preference: ThemePreference) => {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
  document.documentElement.dataset.theme = preference;
};

export default function ThemeManager() {
  useEffect(() => {
    const preference = (localStorage.getItem('conect-theme') as ThemePreference | null) || 'system';
    applyThemePreference(preference);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => { if ((localStorage.getItem('conect-theme') || 'system') === 'system') applyThemePreference('system'); };
    const onThemeChange = () => applyThemePreference((localStorage.getItem('conect-theme') as ThemePreference | null) || 'system');
    media.addEventListener('change', onSystemChange); window.addEventListener('conect-theme-change', onThemeChange);
    return () => { media.removeEventListener('change', onSystemChange); window.removeEventListener('conect-theme-change', onThemeChange); };
  }, []);
  return null;
}
