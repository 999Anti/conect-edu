'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import AdminLayout from '@components/layout/AdminLayout';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import api from '@services/api';
import { Application, Payment, School, User } from '@app-types/index';
import { useStore } from '@store/auth';

type ReportData = { users: User[]; applications: Application[]; payments: Payment[]; schools: School[] };
const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
const download = (name: string, columns: string[], rows: unknown[][]) => { const csv = [columns, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url); };

export default function ReportsPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter(); const [data, setData] = useState<ReportData | null>(null);
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/platform-login'); }, [isLoading, isAuthenticated, router, user?.role]);
  useEffect(() => { if (user?.role === 'conect_admin') Promise.all([api.get<User[]>('/platform/users'), api.get<Application[]>('/applications'), api.get<Payment[]>('/payments/history'), api.get<{ data: School[] }>('/schools', { params: { limit: 100 } })]).then(([users, applications, payments, schools]) => setData({ users: users.data, applications: applications.data, payments: payments.data, schools: schools.data.data })); }, [user?.role]);
  if (isLoading || !data) return <main className="flex min-h-screen items-center justify-center"><Loading /></main>;
  const reports = [
    { title: 'Users', description: `${data.users.length} registered accounts`, run: () => download('conect-edu-users.csv', ['Name', 'Email', 'Role', 'Joined'], data.users.map((item) => [`${item.firstName} ${item.lastName}`, item.email, item.role, item.createdAt])) },
    { title: 'Applications', description: `${data.applications.length} admission applications`, run: () => download('conect-edu-applications.csv', ['Reference', 'Applicant', 'Class', 'Status', 'Payment status', 'Created'], data.applications.map((item) => [item.applicationId, `${item.studentFirstName} ${item.studentLastName}`, item.desiredClass, item.status, item.paymentStatus, item.createdAt])) },
    { title: 'Payments', description: `${data.payments.length} transaction records`, run: () => download('conect-edu-payments.csv', ['Reference', 'Application', 'Amount', 'Processing fee', 'Status', 'Date'], data.payments.map((item) => [item.reference, item.applicationId, item.amount, item.processingFee, item.status, item.createdAt])) },
    { title: 'Schools', description: `${data.schools.length} listed schools`, run: () => download('conect-edu-schools.csv', ['School', 'City', 'State', 'Curriculum', 'Boarding', 'Verified'], data.schools.map((item) => [item.name, item.city, item.state, item.curriculum, item.boardingOption, item.verified])) },
  ];
  return <AdminLayout title="Reports"><div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">{reports.map((report) => <section key={report.title} className="flex min-h-44 flex-col justify-between rounded-lg border border-secondary-200 bg-white p-6"><div><h2 className="text-lg font-bold">{report.title} export</h2><p className="mt-2 text-sm text-secondary-600">{report.description}</p></div><Button className="mt-6 self-start" variant="outline" onClick={report.run}><Download size={17} /> Download CSV</Button></section>)}</div></AdminLayout>;
}
