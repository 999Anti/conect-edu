'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Loading from '@components/ui/Loading';
import api from '@services/api';
import { AuditLog } from '@app-types/index';
import { useStore } from '@store/auth';

export default function ActivityPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter(); const [logs, setLogs] = useState<AuditLog[] | null>(null);
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/platform-login'); }, [isLoading, isAuthenticated, router, user?.role]);
  useEffect(() => { if (user?.role === 'conect_admin') api.get<AuditLog[]>('/platform/audit').then((response) => setLogs(response.data)); }, [user?.role]);
  if (!logs) return <main className="flex min-h-screen items-center justify-center"><Loading /></main>;
  return <AdminLayout title="Activity Log"><section className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-white shadow-sm">{logs.length === 0 ? <p className="p-6 text-secondary-600">No activity has been recorded yet.</p> : logs.map((log) => <div key={log.id} className="border-b p-5 last:border-0"><p className="font-semibold text-secondary-900">{log.action}</p><p className="mt-1 text-sm text-secondary-700">{log.detail}</p><p className="mt-2 text-xs text-secondary-500">{new Date(log.createdAt).toLocaleString()} | {log.entityType}</p></div>)}</section></AdminLayout>;
}
