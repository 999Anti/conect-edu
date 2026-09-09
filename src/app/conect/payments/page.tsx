'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Loading from '@components/ui/Loading';
import api from '@services/api';
import { Payment } from '@app-types/index';
import { useStore } from '@store/auth';

const money = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);

export default function PlatformPaymentsPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter(); const [payments, setPayments] = useState<Payment[]>([]);
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/platform-login'); }, [isLoading, isAuthenticated, router, user?.role]);
  useEffect(() => { if (user?.role === 'conect_admin') api.get<Payment[]>('/payments/history').then((response) => setPayments(response.data)); }, [user?.role]);
  if (isLoading) return <main className="flex min-h-screen items-center justify-center"><Loading /></main>;
  const collected = payments.filter((item) => item.status === 'successful').reduce((sum, item) => sum + item.amount + item.processingFee, 0);
  const schoolCommissionDue = payments.filter((item) => item.status === 'successful').reduce((sum, item) => sum + (item.schoolCommissionDue || 0), 0);
  return <AdminLayout title="Payments"><div className="mx-auto max-w-7xl space-y-6"><section className="grid gap-4 sm:grid-cols-3"><div className="rounded-lg border border-secondary-200 bg-white p-5"><p className="text-sm text-secondary-600">Collected from parents</p><p className="mt-1 text-3xl font-bold">{money(collected)}</p></div><div className="rounded-lg border border-secondary-200 bg-white p-5"><p className="text-sm text-secondary-600">School commission due (10%)</p><p className="mt-1 text-3xl font-bold">{money(schoolCommissionDue)}</p></div><div className="rounded-lg border border-secondary-200 bg-white p-5"><p className="text-sm text-secondary-600">Transactions</p><p className="mt-1 text-3xl font-bold">{payments.length}</p></div></section><section className="overflow-hidden rounded-lg border border-secondary-200 bg-white"><div className="overflow-x-auto"><table><thead><tr><th>Reference</th><th>Application</th><th>Parent paid</th><th>School commission</th><th>Status</th><th>Date</th></tr></thead><tbody>{payments.length ? payments.map((item) => <tr key={item.id}><td className="font-mono text-xs">{item.reference}</td><td>{item.applicationId}</td><td>{money(item.amount + item.processingFee)}</td><td>{item.schoolCommissionDue ? `${money(item.schoolCommissionDue)} (${item.schoolCommissionStatus || 'due'})` : '—'}</td><td className="capitalize">{item.status}</td><td>{new Date(item.createdAt).toLocaleDateString()}</td></tr>) : <tr><td colSpan={6} className="py-10 text-center text-secondary-600">No payment records yet.</td></tr>}</tbody></table></div></section></div></AdminLayout>;
}
