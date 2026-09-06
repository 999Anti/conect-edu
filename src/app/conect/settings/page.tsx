'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import api from '@services/api';
import { useStore } from '@store/auth';

export default function PlatformSettingsPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [message, setMessage] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/login'); }, [isLoading, isAuthenticated, user?.role, router]);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setMessage(''); if (newPassword !== confirmPassword) { setMessage('The new passwords do not match.'); return; } setSaving(true); try { const response = await api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }); setMessage(response.data.message); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not change your password.'); } finally { setSaving(false); } };
  return <AdminLayout title="Settings"><section className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-secondary-900">Change your password</h2><p className="mt-2 text-sm text-secondary-600">Use a unique password with at least 12 characters. Do not reuse your previous password.</p>{message && <p className="mt-4 rounded-lg bg-primary-50 p-3 text-sm text-primary-900">{message}</p>}<form onSubmit={submit} className="mt-5 space-y-4"><Input label="Current password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /><Input label="New password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} helperText="At least 12 characters." required /><Input label="Confirm new password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /><Button type="submit" isLoading={saving}>Change password</Button></form></section></AdminLayout>;
}
