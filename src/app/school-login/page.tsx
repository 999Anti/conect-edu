'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Card, CardBody, CardHeader } from '@components/ui/Card';
import authService from '@services/auth';
import { useStore } from '@store/auth';

export default function SchoolLoginPage() {
  const router = useRouter(); const { setUser, setToken } = useStore();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(''); setLoading(true); try { const response = await authService.login({ email, password }); if (response.user.role !== 'school_admin') { setError('This sign-in is only for approved school administrators.'); return; } setUser(response.user); setToken(response.token); router.replace(response.user.mustChangePassword ? '/settings?required=1' : '/admin/dashboard'); } catch (reason: any) { setError(reason.response?.data?.message || 'Login failed. Check your issued school credentials.'); } finally { setLoading(false); } };
  return <><Header /><main className="flex min-h-screen items-center bg-secondary-50 py-12"><div className="container mx-auto max-w-md px-4"><Card><CardHeader><h1 className="text-2xl font-bold text-secondary-900">School Administrator Login</h1><p className="mt-1 text-sm text-secondary-600">For schools that have been approved and onboarded onto CONECT EDU.</p></CardHeader><CardBody>{error && <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}<form onSubmit={submit} className="space-y-4"><Input label="School admin email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /><Button type="submit" fullWidth isLoading={loading}>Sign in to school portal</Button></form><p className="mt-6 text-center text-sm text-secondary-600">New school? <Link href="/school-apply" className="font-semibold text-primary-600">Apply to list your school</Link>.</p><p className="mt-3 text-center text-sm text-secondary-600">Parent? <Link href="/login" className="font-semibold text-primary-600">Use parent login</Link>.</p></CardBody></Card></div></main><Footer /></>;
}
