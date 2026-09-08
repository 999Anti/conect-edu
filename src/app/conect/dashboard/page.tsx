'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, FileText, Users, WalletCards } from 'lucide-react';
import AdminLayout from '@components/layout/AdminLayout';
import { Card, CardBody } from '@components/ui/Card';
import Loading from '@components/ui/Loading';
import StatusBadge from '@components/ui/StatusBadge';
import api from '@services/api';
import { Application, Payment } from '@app-types/index';
import { useStore } from '@store/auth';

type Overview = {
  stats: { schools: number; users: number; applications: number; revenue: number; pendingSchoolApplications: number };
  usersByRole: Record<string, number>;
  applicationsByStatus: Array<[string, number]>;
  recentApplications: Application[];
  recentPayments: Payment[];
};

const naira = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);

export default function ConectAdminDashboard() {
  const { user, isAuthenticated, isLoading } = useStore();
  const router = useRouter();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/platform-login'); }, [isAuthenticated, isLoading, router, user?.role]);
  useEffect(() => { if (user?.role === 'conect_admin') api.get<Overview>('/platform/overview').then((response) => setOverview(response.data)).catch(() => setError('Could not load platform analytics.')); }, [user?.role]);
  if (isLoading || !isAuthenticated || user?.role !== 'conect_admin' || !overview) return <main className="flex min-h-screen items-center justify-center bg-secondary-50"><Loading /></main>;
  const totals = [
    { label: 'Total schools', value: overview.stats.schools, icon: Building2, href: '/conect/schools', color: 'text-primary-600 bg-primary-50' },
    { label: 'Active users', value: overview.stats.users, icon: Users, href: '/conect/users', color: 'text-blue-600 bg-blue-50' },
    { label: 'Applications', value: overview.stats.applications, icon: FileText, href: '/conect/applications', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Collected revenue', value: naira(overview.stats.revenue), icon: WalletCards, href: '/conect/payments', color: 'text-amber-600 bg-amber-50' },
  ];
  const roleTotal = Object.values(overview.usersByRole).reduce((sum, value) => sum + value, 0) || 1;
  const applicationMax = Math.max(...overview.applicationsByStatus.map(([, value]) => value), 1);
  return <AdminLayout title="Platform analytics"><div className="mx-auto max-w-7xl space-y-6">{error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{totals.map(({ label, value, icon: Icon, href, color }) => <Link key={label} href={href}><Card className="h-full transition-shadow hover:shadow-md"><CardBody className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-md ${color}`}><Icon size={22} /></span><div><p className="text-sm text-secondary-600">{label}</p><p className="mt-1 text-2xl font-bold text-secondary-900">{value}</p></div></CardBody></Card></Link>)}</div>
    <div className="grid gap-6 lg:grid-cols-2"><Card><CardBody><h2 className="text-lg font-bold">Applications by status</h2><div className="mt-6 space-y-4">{overview.applicationsByStatus.length ? overview.applicationsByStatus.map(([status, count]) => <div key={status}><div className="mb-1 flex justify-between text-sm"><span className="capitalize text-secondary-700">{status.replace(/_/g, ' ')}</span><span className="font-semibold">{count}</span></div><div className="h-2 rounded-full bg-secondary-100"><div className="h-2 rounded-full bg-primary-600" style={{ width: `${(count / applicationMax) * 100}%` }} /></div></div>) : <p className="py-12 text-center text-secondary-600">No applications yet.</p>}</div></CardBody></Card><Card><CardBody><h2 className="text-lg font-bold">User distribution</h2><div className="mt-6 space-y-4">{Object.entries(overview.usersByRole).map(([role, count]) => <div key={role}><div className="mb-1 flex justify-between text-sm"><span className="capitalize text-secondary-700">{role.replace(/([A-Z])/g, ' $1')}</span><span className="font-semibold">{count}</span></div><div className="h-2 rounded-full bg-secondary-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${(count / roleTotal) * 100}%` }} /></div></div>)}</div></CardBody></Card></div>
    <div className="grid gap-6 lg:grid-cols-2"><Card><CardBody><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Recent applications</h2><Link href="/conect/applications" className="text-sm font-semibold text-primary-600">View all</Link></div><div className="mt-4 space-y-3">{overview.recentApplications.length ? overview.recentApplications.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border-b border-secondary-100 pb-3"><div><p className="font-medium">{item.studentFirstName} {item.studentLastName}</p><p className="text-sm text-secondary-600">{item.applicationId} · {item.desiredClass}</p></div><StatusBadge status={item.status} /></div>) : <p className="py-6 text-secondary-600">No applications yet.</p>}</div></CardBody></Card><Card><CardBody><div className="flex items-center justify-between"><h2 className="text-lg font-bold">School approvals</h2><Link href="/conect/schools" className="text-sm font-semibold text-primary-600">Review</Link></div><p className="mt-6 text-4xl font-bold text-secondary-900">{overview.stats.pendingSchoolApplications}</p><p className="mt-1 text-sm text-secondary-600">schools awaiting verification</p><Link href="/conect/schools" className="mt-6 inline-block text-sm font-semibold text-primary-600">Open approval queue</Link></CardBody></Card></div>
  </div></AdminLayout>;
}
