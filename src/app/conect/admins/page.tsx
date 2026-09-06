'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const load = () => api.get<User[]>('/platform-admins').then((response) => setAdmins(response.data)).catch(() => setMessage('Could not load platform administrators.'));
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/login'); }, [isLoading, isAuthenticated, user?.role, router]);
  useEffect(() => { if (user?.role === 'conect_admin') load(); }, [user?.role]);
  const change = (event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setMessage(''); try { const response = await api.post<User>('/platform-admins', form); setAdmins((current) => [...current, response.data]); setForm(blank); setMessage(`${response.data.firstName} has been added. Share their login details securely.`); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not create this account.'); } finally { setSaving(false); } };
  return <AdminLayout title="Platform Admins"><div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2"><section className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Add platform admin</h2><p className="mt-2 text-sm text-secondary-600">Platform administrators can approve schools, create school logins, and add other platform administrators.</p>{message && <p className="mt-4 rounded-lg bg-primary-50 p-3 text-sm text-primary-900">{message}</p>}<form onSubmit={submit} className="mt-5 space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="First name" name="firstName" value={form.firstName} onChange={change} required /><Input label="Last name" name="lastName" value={form.lastName} onChange={change} required /></div><Input label="Email" type="email" name="email" value={form.email} onChange={change} required /><Input label="Phone (optional)" name="phone" value={form.phone} onChange={change} /><Input label="Temporary password" type="password" name="password" value={form.password} onChange={change} helperText="At least 12 characters. Send it securely." required /><Button type="submit" fullWidth isLoading={saving}>Create platform-admin login</Button></form></section><section className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Current platform admins</h2><div className="mt-5 space-y-3">{admins.map((admin) => <div key={admin.id} className="border-b border-secondary-100 pb-3"><p className="font-semibold">{admin.firstName} {admin.lastName}</p><p className="text-sm text-secondary-600">{admin.email}</p></div>)}{admins.length === 0 && <p className="text-secondary-600">No administrators found.</p>}</div></section></div></AdminLayout>;
}
