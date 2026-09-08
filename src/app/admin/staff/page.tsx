'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import api from '@services/api';
import { User } from '@app-types/index';
import { useStore } from '@store/auth';

export default function StaffPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter(); const [staff, setStaff] = useState<User[]>([]); const [message, setMessage] = useState(''); const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', permission: 'admissions' });
  const load = () => api.get<User[]>('/school-staff').then((response) => setStaff(response.data)).catch(() => setMessage('Could not load staff accounts.'));
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'school_admin')) router.replace('/school-login'); }, [isLoading, isAuthenticated, user?.role, router]);
  useEffect(() => { if (user?.role === 'school_admin') load(); }, [user?.role]);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); try { await api.post('/school-staff', form); setForm({ firstName: '', lastName: '', email: '', password: '', permission: 'admissions' }); setMessage('Staff account created.'); load(); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not create staff account.'); } };
  const canManage = user?.schoolPermission !== 'admissions' && user?.schoolPermission !== 'finance';
  return <AdminLayout title="School Staff"><div className="mx-auto max-w-5xl space-y-6">{message && <p className="rounded-lg bg-primary-50 p-3 text-sm text-primary-900">{message}</p>}{canManage && <form onSubmit={submit} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm md:grid-cols-2"><h2 className="md:col-span-2 text-xl font-bold">Add staff account</h2><Input label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /><Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /><Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><Input label="Temporary password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} helperText="At least 12 characters." required /><Select label="Access" value={form.permission} onChange={(e) => setForm({ ...form, permission: e.target.value })} options={[{ value: 'admissions', label: 'Admissions officer' }, { value: 'finance', label: 'Finance officer' }, { value: 'full', label: 'School manager' }]} /><Button type="submit" className="self-end">Create staff account</Button></form>}<section className="overflow-hidden rounded-lg bg-white shadow-sm"><div className="border-b p-5"><h2 className="text-xl font-bold">Your staff</h2></div>{staff.map((item) => <div key={item.id} className="flex flex-wrap justify-between gap-2 border-b p-5 last:border-0"><div><p className="font-semibold">{item.firstName} {item.lastName}</p><p className="text-sm text-secondary-600">{item.email}</p></div><p className="capitalize text-sm text-secondary-700">{item.schoolPermission || 'full'} access</p></div>)}</section></div></AdminLayout>;
}
