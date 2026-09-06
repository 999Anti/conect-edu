'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import Button from '@components/ui/Button';
import Select from '@components/ui/Select';
import Textarea from '@components/ui/Textarea';
import StatusBadge from '@components/ui/StatusBadge';
import applicationService from '@services/applications';
import { Application, ApplicationStatus } from '@app-types/index';
import { useStore } from '@store/auth';

const statuses: Array<{ value: ApplicationStatus; label: string }> = [
  { value: 'under_review', label: 'Under review' }, { value: 'shortlisted', label: 'Shortlist' },
  { value: 'assessment_scheduled', label: 'Assessment scheduled' }, { value: 'accepted', label: 'Accept candidate' }, { value: 'rejected', label: 'Reject candidate' },
];

export default function SchoolApplicationsPage() {
  const { user, isAuthenticated, isLoading } = useStore(); const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]); const [drafts, setDrafts] = useState<Record<string, { status: ApplicationStatus; assessmentDate: string; decisionNote: string }>>({}); const [message, setMessage] = useState('');
  const load = async () => { try { const data = await applicationService.getUserApplications(); setApplications(data); setDrafts(Object.fromEntries(data.map((item) => [item.id, { status: item.status, assessmentDate: item.assessmentDate?.slice(0, 16) || '', decisionNote: item.decisionNote || '' }]))); } catch { setMessage('Could not load applications.'); } };
  useEffect(() => { if (!isLoading && (!isAuthenticated || user?.role !== 'school_admin')) router.replace('/login'); }, [isLoading, isAuthenticated, user?.role, router]);
  useEffect(() => { if (user?.role === 'school_admin') void load(); }, [user?.role]);
  const change = (id: string, field: 'status' | 'assessmentDate' | 'decisionNote', value: string) => setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  const save = async (item: Application) => { const draft = drafts[item.id]; try { await applicationService.updateApplicationStatus(item.id, draft.status, { assessmentDate: draft.assessmentDate || undefined, decisionNote: draft.decisionNote || undefined }); setMessage(`${item.studentFirstName} ${item.studentLastName}'s application was updated.`); await load(); } catch (error: any) { setMessage(error.response?.data?.message || 'Could not update this application.'); } };
  return <AdminLayout title="Applications"><div className="mx-auto max-w-6xl space-y-5">{message && <p className="rounded-lg bg-primary-50 p-3 text-primary-900">{message}</p>}{applications.length === 0 ? <p className="rounded-xl bg-white p-6 text-secondary-600">No applications have reached your school yet.</p> : applications.map((item) => { const draft = drafts[item.id]; if (!draft) return null; const needsDate = ['shortlisted', 'accepted', 'assessment_scheduled'].includes(draft.status); return <section key={item.id} className="rounded-xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{item.studentFirstName} {item.studentLastName}</h2><p className="text-sm text-secondary-600">{item.applicationId} · Applying for {item.desiredClass}</p><p className="mt-2 text-sm text-secondary-700">Parent: {item.parentName} · {item.parentEmail} · {item.parentPhone}</p></div><StatusBadge status={item.status} /></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Select label="Decision" value={draft.status} onChange={(event) => change(item.id, 'status', event.target.value)} options={statuses} />{needsDate && <div><label className="mb-2 block text-sm font-medium text-secondary-900">Exam or assessment date</label><input type="datetime-local" value={draft.assessmentDate} onChange={(event) => change(item.id, 'assessmentDate', event.target.value)} className="w-full rounded-lg border-2 border-secondary-200 px-4 py-2" required /></div>}</div><Textarea className="mt-4" label="Note for the parent (optional)" value={draft.decisionNote} onChange={(event) => change(item.id, 'decisionNote', event.target.value)} rows={2} /><Button type="button" className="mt-4" onClick={() => save(item)}>Save decision</Button></section>; })}</div></AdminLayout>;
}
