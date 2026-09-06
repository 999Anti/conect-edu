'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import api from '@services/api';
import { SchoolApplication } from '@app-types/index';
import { useStore } from '@store/auth';

export default function SchoolApprovalsPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter();
  const [applications, setApplications] = useState<SchoolApplication[]>([]); const [passwords, setPasswords] = useState<Record<string, string>>({}); const [message, setMessage] = useState('');
  const load = () => api.get<SchoolApplication[]>('/school-applications').then((response) => setApplications(response.data)).catch(() => setMessage('Could not load school applications.'));
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/login'); }, [isLoading, isAuthenticated, user?.role, router]);
  useEffect(() => { if (user?.role === 'conect_admin') load(); }, [user?.role]);
  const approve = async (application: SchoolApplication) => { setMessage(''); try { const response = await api.post(`/school-applications/${application.id}/approve`, { password: passwords[application.id] }); setMessage(`${application.schoolName} approved. Send ${response.data.admin.email} the temporary password through a secure channel.`); load(); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not approve this school.'); } };
  return <AdminLayout title="School approvals"><div className="mx-auto max-w-5xl space-y-5">{message && <p className="rounded-lg bg-primary-50 p-3 text-primary-900">{message}</p>}<p className="text-secondary-600">Approve an application only after you have verified the school. Approval creates one linked school-admin login.</p>{applications.filter((item) => item.status === 'pending').map((application) => <section key={application.id} className="rounded-xl bg-white p-6 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-bold">{application.schoolName}</h2><p className="text-secondary-600">{application.city}, {application.state} · {application.contactFirstName} {application.contactLastName}</p><p className="text-sm text-secondary-600">{application.contactEmail} · {application.contactPhone}</p></div><span className="h-fit rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900">Pending review</span></div>{application.description && <p className="mt-4 text-secondary-700">{application.description}</p>}<div className="mt-5 flex max-w-md flex-col gap-3 sm:flex-row"><Input label="Temporary password" type="password" value={passwords[application.id] || ''} onChange={(event) => setPasswords((current) => ({ ...current, [application.id]: event.target.value }))} helperText="At least 8 characters. Share it securely with the school." /><Button type="button" className="mt-auto" onClick={() => approve(application)}>Approve & create login</Button></div></section>)}{applications.filter((item) => item.status === 'pending').length === 0 && <p className="rounded-xl bg-white p-6 text-secondary-600">There are no pending school applications.</p>}</div></AdminLayout>;
}
