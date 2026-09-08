'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import AdminLayout from '@components/layout/AdminLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import api from '@services/api';
import { User } from '@app-types/index';
import { useStore } from '@store/auth';

const blank = { firstName: '', lastName: '', email: '', phone: '', password: '' };

export default function PlatformAdminsPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter();
  const [admins, setAdmins] = useState<User[]>([]); const [form, setForm] = useState(blank); const [message, setMessage] = useState(''); const [saving, setSaving] = useState(false);
  const canManage = user?.canManageAdmins !== false;
  const load = () => api.get<User[]>('/platform-admins').then((response) => setAdmins(response.data)).catch(() => setMessage('Could not load platform administrators.'));
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/platform-login'); }, [isLoading, isAuthenticated, user?.role, router]);
  useEffect(() => { if (user?.role === 'conect_admin') load(); }, [user?.role]);
  const change = (event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setMessage(''); try { const response = await api.post<User>('/platform-admins', form); setAdmins((current) => [...current, response.data]); setForm(blank); setMessage(`${response.data.firstName} has been added without account-management access.`); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not create this account.'); } finally { setSaving(false); } };
  const setPrivilege = async (admin: User, value: boolean) => { setMessage(''); try { const response = await api.patch<User>('/platform-admins', { id: admin.id, canManageAdmins: value }); setAdmins((current) => current.map((item) => item.id === admin.id ? response.data : item)); setMessage(`${admin.firstName}'s account-management access was ${value ? 'granted' : 'revoked'}.`); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not update this permission.'); } };
  return <AdminLayout title="Platform admins"><div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">{canManage ? <section className="rounded-lg border border-secondary-200 bg-white p-6"><h2 className="text-xl font-bold">Create platform admin</h2><p className="mt-2 text-sm text-secondary-600">New admins can monitor platform activity, schools, applications, payments, and reports. They cannot create accounts until you grant access.</p><form onSubmit={submit} className="mt-5 space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="First name" name="firstName" value={form.firstName} onChange={change} required /><Input label="Last name" name="lastName" value={form.lastName} onChange={change} required /></div><Input label="Email" type="email" name="email" value={form.email} onChange={change} required /><Input label="Phone (optional)" name="phone" value={form.phone} onChange={change} /><Input label="Temporary password" type="password" name="password" value={form.password} onChange={change} helperText="At least 12 characters. Share it securely." required /><Button type="submit" fullWidth isLoading={saving}>Create admin</Button></form></section> : <section className="rounded-lg border border-secondary-200 bg-white p-6"><ShieldCheck className="text-primary-600" size={28} /><h2 className="mt-4 text-xl font-bold">Read-only administration access</h2><p className="mt-2 text-sm text-secondary-600">You can monitor all platform activity. Only an account owner can create platform administrators or change account-management access.</p></section>}<section className="rounded-lg border border-secondary-200 bg-white p-6"><h2 className="text-xl font-bold">Current platform admins</h2>{message && <p className="mt-4 rounded-md bg-primary-50 p-3 text-sm text-primary-900">{message}</p>}<div className="mt-5 space-y-4">{admins.map((admin) => <div key={admin.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary-100 pb-4"><div><p className="font-semibold">{admin.firstName} {admin.lastName}</p><p className="text-sm text-secondary-600">{admin.email}</p><p className="mt-1 text-xs font-medium text-secondary-500">{admin.canManageAdmins ? 'Can manage admin accounts' : 'Monitoring access only'}</p></div>{canManage && admin.id !== user?.id && <Button variant={admin.canManageAdmins ? 'outline' : 'primary'} size="sm" onClick={() => setPrivilege(admin, !admin.canManageAdmins)}>{admin.canManageAdmins ? 'Remove account access' : 'Grant account access'}</Button>}</div>)}{admins.length === 0 && <p className="text-secondary-600">No administrators found.</p>}</div></section></div></AdminLayout>;
}
