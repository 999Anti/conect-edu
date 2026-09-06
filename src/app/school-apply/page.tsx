'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Textarea from '@components/ui/Textarea';
import api from '@services/api';

const initialForm = { schoolName: '', contactFirstName: '', contactLastName: '', contactEmail: '', contactPhone: '', address: '', state: '', city: '', website: '', description: '' };

export default function SchoolApplyPage() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setState('submitting'); setMessage('');
    try { await api.post('/school-applications', form); setState('done'); }
    catch (error: any) { setState('error'); setMessage(error.response?.data?.message || 'We could not send your application. Please try again.'); }
  };
  return <><Header /><main className="min-h-screen bg-secondary-50 py-12"><div className="container mx-auto max-w-2xl px-4">
    <h1 className="text-3xl font-bold text-secondary-900">List your school on CONECT EDU</h1>
    <p className="mt-2 text-secondary-600">Apply to join. We review every school before creating its administrator login.</p>
    {state === 'done' ? <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-green-900"><h2 className="font-bold">Application received</h2><p className="mt-2">We will review your details and contact you using the email address provided. Your login is created only after approval.</p><Link className="mt-4 inline-block font-semibold underline" href="/">Return home</Link></div> :
      <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow-sm">
        {state === 'error' && <p className="rounded bg-red-50 p-3 text-sm text-red-800">{message}</p>}
        <Input label="School name" name="schoolName" value={form.schoolName} onChange={change} required />
        <div className="grid gap-4 sm:grid-cols-2"><Input label="Contact first name" name="contactFirstName" value={form.contactFirstName} onChange={change} required /><Input label="Contact last name" name="contactLastName" value={form.contactLastName} onChange={change} required /></div>
        <div className="grid gap-4 sm:grid-cols-2"><Input label="Work email" type="email" name="contactEmail" value={form.contactEmail} onChange={change} required /><Input label="Phone number" name="contactPhone" value={form.contactPhone} onChange={change} required /></div>
        <Textarea label="School address" name="address" value={form.address} onChange={change} rows={3} required />
        <div className="grid gap-4 sm:grid-cols-2"><Input label="State" name="state" value={form.state} onChange={change} required /><Input label="City" name="city" value={form.city} onChange={change} required /></div>
        <Input label="Website (optional)" type="url" name="website" value={form.website} onChange={change} />
        <Textarea label="Tell us about your school (optional)" name="description" value={form.description} onChange={change} rows={4} />
        <Button type="submit" fullWidth isLoading={state === 'submitting'}>Submit school application</Button>
      </form>}
  </div></main><Footer /></>;
}
