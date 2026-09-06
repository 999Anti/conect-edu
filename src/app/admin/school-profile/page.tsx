'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Textarea from '@components/ui/Textarea';
import Select from '@components/ui/Select';
import api from '@services/api';
import { School } from '@app-types/index';
import { useStore } from '@store/auth';

const list = (value?: string[]) => value?.join('\n') || '';
const lines = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean);

export default function SchoolProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useStore(); const router = useRouter();
  const [school, setSchool] = useState<School | null>(null); const [saving, setSaving] = useState(false); const [notice, setNotice] = useState('');
  useEffect(() => { if (!authLoading && (!isAuthenticated || user?.role !== 'school_admin')) router.replace('/login'); }, [authLoading, isAuthenticated, user?.role, router]);
  useEffect(() => { if (user?.role === 'school_admin') api.get<School>('/schools/me').then((response) => setSchool(response.data)).catch(() => router.replace('/admin/dashboard')); }, [user?.role, router]);
  const update = (field: keyof School, value: string) => setSchool((current) => current ? { ...current, [field]: value } : current);
  const save = async (event: React.FormEvent) => { event.preventDefault(); if (!school) return; setSaving(true); setNotice(''); try { const response = await api.patch<School>(`/schools/${school.id}`, school); setSchool(response.data); setNotice('Your public school profile has been saved.'); } catch (error: any) { setNotice(error.response?.data?.message || 'Could not save your changes.'); } finally { setSaving(false); } };
  if (!school) return <AdminLayout title="School Profile"><p>Loading your school profile…</p></AdminLayout>;
  return <AdminLayout title="School Profile"><form onSubmit={save} className="mx-auto max-w-4xl space-y-6">
    {notice && <p className="rounded-lg bg-primary-50 p-3 text-sm text-primary-800">{notice}</p>}
    <section className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Public profile</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><Input label="School name" value={school.name} onChange={(e) => update('name', e.target.value)} required /><Input label="Public email" type="email" value={school.email} onChange={(e) => update('email', e.target.value)} required /><Input label="Phone" value={school.phone} onChange={(e) => update('phone', e.target.value)} required /><Input label="Website" type="url" value={school.website || ''} onChange={(e) => update('website', e.target.value)} /><Input label="Logo image URL" type="url" value={school.logo || ''} onChange={(e) => update('logo', e.target.value)} helperText="Use an image hosted online." /><Input label="Cover image URL" type="url" value={school.coverImage || ''} onChange={(e) => update('coverImage', e.target.value)} /></div><Textarea className="mt-4" label="About your school" value={school.description || ''} onChange={(e) => update('description', e.target.value)} rows={5} /><Textarea className="mt-4" label="Address" value={school.address} onChange={(e) => update('address', e.target.value)} rows={2} /></section>
    <section className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Learning and admissions</h2><div className="mt-5 grid gap-4 md:grid-cols-3"><Select label="Curriculum" value={school.curriculum} onChange={(e) => update('curriculum', e.target.value)} options={['nigerian','igcse','ib','mixed'].map((value) => ({ value, label: value.toUpperCase() }))} /><Select label="Boarding" value={school.boardingOption} onChange={(e) => update('boardingOption', e.target.value)} options={['day','boarding','mixed'].map((value) => ({ value, label: value }))} /><Select label="Student gender" value={school.gender} onChange={(e) => update('gender', e.target.value)} options={['male','female','mixed'].map((value) => ({ value, label: value }))} /></div><Textarea className="mt-4" label="Programmes or classes" value={list(school.programmes)} onChange={(e) => setSchool({ ...school, programmes: lines(e.target.value) })} helperText="One programme or class per line." rows={4} /><Textarea className="mt-4" label="Admission requirements" value={list(school.admissionRequirements)} onChange={(e) => setSchool({ ...school, admissionRequirements: lines(e.target.value) })} helperText="One requirement per line. Parents see this on your school page." rows={5} /><Textarea className="mt-4" label="Application instructions" value={school.admissionInstructions || ''} onChange={(e) => update('admissionInstructions', e.target.value)} rows={4} /></section>
    <section className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Facilities and photos</h2><Textarea className="mt-4" label="Facilities" value={list(school.facilities)} onChange={(e) => setSchool({ ...school, facilities: lines(e.target.value) })} helperText="One facility per line." rows={4} /><Textarea className="mt-4" label="Gallery image URLs" value={list(school.gallery)} onChange={(e) => setSchool({ ...school, gallery: lines(e.target.value) })} helperText="One public image URL per line." rows={4} /></section>
    <Button type="submit" isLoading={saving}>Save public profile</Button>
  </form></AdminLayout>;
}
