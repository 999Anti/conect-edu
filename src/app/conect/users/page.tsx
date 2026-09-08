'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Loading from '@components/ui/Loading';
import api from '@services/api';
import { User } from '@app-types/index';
import { useStore } from '@store/auth';

export default function PlatformUsersPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter();
  const [users, setUsers] = useState<User[]>([]); const [search, setSearch] = useState(''); const [role, setRole] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'conect_admin')) router.replace('/platform-login'); }, [isLoading, isAuthenticated, router, user?.role]);
  useEffect(() => { if (user?.role !== 'conect_admin') return; setLoading(true); api.get<User[]>('/platform/users', { params: { search, role } }).then((response) => setUsers(response.data)).finally(() => setLoading(false)); }, [search, role, user?.role]);
  if (isLoading) return <main className="flex min-h-screen items-center justify-center"><Loading /></main>;
  return <AdminLayout title="Users"><div className="mx-auto max-w-7xl"><div className="mb-6 grid gap-4 md:grid-cols-[1fr_220px]"><Input aria-label="Search users" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} /><Select aria-label="Filter users by role" value={role} onChange={(event) => setRole(event.target.value)} options={[{ value: 'parent', label: 'Parents' }, { value: 'school_admin', label: 'School admins' }, { value: 'conect_admin', label: 'Platform admins' }]} /></div><section className="overflow-hidden rounded-lg border border-secondary-200 bg-white"><div className="overflow-x-auto"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>{loading ? <tr><td colSpan={4} className="py-10 text-center text-secondary-600">Loading users...</td></tr> : users.length ? users.map((item) => <tr key={item.id}><td className="font-medium">{item.firstName} {item.lastName}</td><td>{item.email}</td><td className="capitalize">{item.role.replace('_', ' ')}</td><td>{new Date(item.createdAt).toLocaleDateString()}</td></tr>) : <tr><td colSpan={4} className="py-10 text-center text-secondary-600">No users match these filters.</td></tr>}</tbody></table></div></section></div></AdminLayout>;
}
