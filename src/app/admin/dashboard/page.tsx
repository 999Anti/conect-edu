'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import { Card, CardBody } from '@components/ui/Card';
import Button from '@components/ui/Button';
import StatusBadge from '@components/ui/StatusBadge';
import applicationService from '@services/applications';
import { Application } from '@app-types/index';
import { useStore } from '@store/auth';

export default function SchoolAdminDashboard() {
  const { user, isAuthenticated, isLoading } = useStore();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'school_admin')) router.replace('/login'); }, [isLoading, isAuthenticated, user?.role, router]);
  useEffect(() => { if (user?.role === 'school_admin') applicationService.getUserApplications().then(setApplications).catch(() => setApplications([])); }, [user?.role]);
  const stats = [
    ['Total applications', applications.length],
    ['Awaiting review', applications.filter((item) => ['submitted', 'payment_required', 'under_review'].includes(item.status)).length],
    ['Accepted', applications.filter((item) => item.status === 'accepted').length],
    ['Assessments set', applications.filter((item) => Boolean(item.assessmentDate)).length],
  ];
  return <AdminLayout title="School dashboard"><div className="space-y-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-secondary-900">Admissions overview</h2><p className="text-secondary-600">Review applications and keep families informed.</p></div><Link href="/admin/applications"><Button>Manage applications</Button></Link></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) => <Card key={String(label)}><CardBody><p className="text-sm text-secondary-600">{label}</p><p className="mt-2 text-3xl font-bold text-secondary-900">{value}</p></CardBody></Card>)}</div><Card><CardBody><div className="mb-5 flex items-center justify-between"><h3 className="font-bold text-secondary-900">Recent applications</h3><Link href="/admin/applications" className="text-sm font-semibold text-primary-600">View all</Link></div>{applications.length ? <div className="space-y-3">{applications.slice(0, 5).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary-100 pb-3"><div><p className="font-semibold">{item.studentFirstName} {item.studentLastName}</p><p className="text-sm text-secondary-600">{item.desiredClass} · {item.applicationId}</p></div><StatusBadge status={item.status} /></div>)}</div> : <p className="text-secondary-600">No applications yet.</p>}</CardBody></Card></div></AdminLayout>;
}
