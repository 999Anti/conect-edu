'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Select from '@components/ui/Select';
import StatusBadge from '@components/ui/StatusBadge';
import Loading from '@components/ui/Loading';
import applicationService from '@services/applications';
import { Application, ApplicationStatus } from '@app-types/index';
import { useStore } from '@store/auth';

const statuses: ApplicationStatus[] = ['payment_required', 'submitted', 'under_review', 'shortlisted', 'assessment_scheduled', 'accepted', 'rejected', 'withdrawn'];

export default function PlatformApplicationsPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]); const [filter, setFilter] = useState(''); const [message, setMessage] = useState('');
  const load = () => applicationService.getUserApplications().then(setApplications).catch(() => setMessage('Could not load applications.'));
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/platform-login'); }, [isLoading, isAuthenticated, router, user?.role]);
  useEffect(() => { if (user?.role === 'conect_admin') load(); }, [user?.role]);
  const update = async (id: string, status: ApplicationStatus) => { try { await applicationService.updateApplicationStatus(id, status); setMessage('Application status updated.'); load(); } catch { setMessage('Could not update this application.'); } };
  if (isLoading) return <main className="flex min-h-screen items-center justify-center"><Loading /></main>;
  const visible = applications.filter((item) => !filter || item.status === filter);
  const options = statuses.map((status) => ({ value: status, label: status.replace(/_/g, ' ') }));
  return <AdminLayout title="Applications"><div className="mx-auto max-w-7xl space-y-5">{message && <p className="rounded-md bg-primary-50 p-3 text-sm text-primary-900">{message}</p>}<div className="max-w-xs"><Select label="Filter by status" value={filter} onChange={(event) => setFilter(event.target.value)} options={options} /></div><section className="overflow-hidden rounded-lg border border-secondary-200 bg-white"><div className="overflow-x-auto"><table><thead><tr><th>Applicant</th><th>Reference</th><th>Class</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead><tbody>{visible.length ? visible.map((item) => <tr key={item.id}><td><p className="font-medium">{item.studentFirstName} {item.studentLastName}</p><p className="text-xs text-secondary-600">{item.parentEmail}</p></td><td>{item.applicationId}</td><td>{item.desiredClass}</td><td className="capitalize">{item.paymentStatus}</td><td><StatusBadge status={item.status} /></td><td className="min-w-[190px]"><Select aria-label={`Change status for ${item.applicationId}`} value={item.status} onChange={(event) => update(item.id, event.target.value as ApplicationStatus)} options={options} /></td></tr>) : <tr><td colSpan={6} className="py-10 text-center text-secondary-600">No applications match this status.</td></tr>}</tbody></table></div></section></div></AdminLayout>;
}
