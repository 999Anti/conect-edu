'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Card, CardBody, CardHeader } from '@components/ui/Card';
import authService from '@services/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setLoading(true); setMessage(''); try { await authService.forgotPassword(email); setMessage('If this email has an account, reset instructions will be sent when email delivery is enabled.'); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not process this request.'); } finally { setLoading(false); } };
  return <><Header /><main className="flex min-h-screen items-center bg-secondary-50 py-12"><div className="container mx-auto max-w-md px-4"><Card><CardHeader><h1 className="text-2xl font-bold">Reset password</h1><p className="mt-1 text-sm text-secondary-600">Enter the email linked to your account.</p></CardHeader><CardBody>{message && <p className="mb-5 rounded-md bg-primary-50 p-3 text-sm text-primary-900">{message}</p>}<form onSubmit={submit} className="space-y-4"><Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><Button type="submit" fullWidth isLoading={loading}>Request reset instructions</Button></form><p className="mt-6 text-center text-sm text-secondary-600"><Link className="font-semibold text-primary-600" href="/login">Back to login</Link></p></CardBody></Card></div></main><Footer /></>;
}
