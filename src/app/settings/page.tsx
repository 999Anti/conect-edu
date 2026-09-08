'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import AdminLayout from '@components/layout/AdminLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import api from '@services/api';
import { applyThemePreference, ThemePreference } from '@components/theme/ThemeManager';
import { useStore } from '@store/auth';

function SettingsContent() {
  const { user, setUser } = useStore(); const router = useRouter(); const searchParams = useSearchParams();
  const [theme, setTheme] = useState<ThemePreference>('system'); const [emailUpdates, setEmailUpdates] = useState(true); const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [message, setMessage] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { setTheme((localStorage.getItem('conect-theme') as ThemePreference | null) || 'system'); setEmailUpdates(localStorage.getItem('conect-email-updates') !== 'false'); }, []);
  const changeTheme = (next: ThemePreference) => { setTheme(next); localStorage.setItem('conect-theme', next); applyThemePreference(next); window.dispatchEvent(new Event('conect-theme-change')); };
  const submitPassword = async (event: React.FormEvent) => { event.preventDefault(); setMessage(''); if (newPassword !== confirmPassword) { setMessage('The new passwords do not match.'); return; } setSaving(true); try { const response = await api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }); setMessage(response.data.message); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); if (user) setUser({ ...user, mustChangePassword: false }); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not change your password.'); } finally { setSaving(false); } };
  const savePreferences = () => { localStorage.setItem('conect-email-updates', String(emailUpdates)); setMessage('Your preferences have been saved.'); };
  return <div className="mx-auto max-w-3xl space-y-6">{(searchParams.get('required') === '1' || user?.mustChangePassword) && <p className="rounded-lg border border-warning/30 bg-yellow-50 p-4 text-sm text-secondary-900">For security, change the temporary password before continuing.</p>} {message && <p className="rounded-lg bg-primary-50 p-3 text-sm text-primary-900">{message}</p>}
    <section className="rounded-lg bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Appearance</h2><p className="mt-1 text-sm text-secondary-600">Choose how CONECT EDU looks on this device.</p><div className="mt-5 max-w-sm"><Select label="Colour mode" value={theme} onChange={(event) => changeTheme(event.target.value as ThemePreference)} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'Use system setting' }]} /></div></section>
    <section className="rounded-lg bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Notifications</h2><label className="mt-5 flex items-center gap-3 text-sm text-secondary-800"><input type="checkbox" checked={emailUpdates} onChange={(event) => setEmailUpdates(event.target.checked)} /> Receive email updates when email delivery is enabled.</label><Button className="mt-5" variant="outline" onClick={savePreferences}>Save notification preference</Button></section>
    <section className="rounded-lg bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Password and security</h2><p className="mt-1 text-sm text-secondary-600">Use a unique password with at least 8 characters.</p><form onSubmit={submitPassword} className="mt-5 space-y-4"><Input label="Current password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /><Input label="New password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} helperText="At least 8 characters." required /><Input label="Confirm new password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /><Button type="submit" isLoading={saving}>Change password</Button></form></section>
  </div>;
}

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter();
  useEffect(() => { if (!isLoading && !isAuthenticated) router.replace('/login'); }, [isLoading, isAuthenticated, router]);
  if (isLoading || !user) return null;
  if (user.role === 'parent') return <><Header /><main className="min-h-screen bg-secondary-50 py-10"><SettingsContent /></main><Footer /></>;
  return <AdminLayout title="Settings"><SettingsContent /></AdminLayout>;
}
