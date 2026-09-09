'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Textarea from '@components/ui/Textarea';
import { Card, CardBody } from '@components/ui/Card';
import Loading from '@components/ui/Loading';
import schoolService from '@services/schools';
import applicationService from '@services/applications';
import { School } from '@app-types/index';
import { useStore } from '@store/auth';

export default function ApplyPage({ params }: { params: { schoolId: string } }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useStore();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { schoolService.getSchoolById(params.schoolId).then(setSchool).catch(() => setSchool(null)).finally(() => setLoading(false)); }, [params.schoolId]);
  const setAnswer = (id: string, value: string) => setAnswers((current) => ({ ...current, [id]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!school?.applicationFields?.length) return;
    const missing = school.applicationFields.find((field) => field.required && (field.type === 'file' ? !files[field.id] : !answers[field.id]?.trim()));
    if (missing) { setError(`Please complete: ${missing.label}.`); return; }
    setError(''); setSubmitting(true);
    try {
      const application = await applicationService.createApplication({ schoolId: school.id, customAnswers: school.applicationFields.filter((field) => field.type !== 'file' && answers[field.id]?.trim()).map((field) => ({ questionId: field.id, question: field.label, answer: answers[field.id].trim() })) });
      for (const field of school.applicationFields.filter((item) => item.type === 'file')) if (files[field.id]) await applicationService.uploadDocument(application.id, files[field.id], field.id);
      await applicationService.submitApplication(application.id, {});
      router.push(`/applications/${application.id}`);
    } catch (requestError: any) { setError(requestError.response?.data?.message || 'Could not submit this application. Please try again.'); } finally { setSubmitting(false); }
  };

  if (loading || authLoading) return <><Header /><div className="flex min-h-screen items-center justify-center"><Loading /></div><Footer /></>;
  if (!school) return <><Header /><main className="min-h-screen bg-secondary-50 py-12"><div className="container mx-auto max-w-2xl px-4"><Card><CardBody><h1 className="text-xl font-bold text-secondary-900">School not found</h1><Link href="/schools"><Button className="mt-4">Browse schools</Button></Link></CardBody></Card></div></main><Footer /></>;
  if (!school.applicationFields?.length) return <><Header /><main className="min-h-screen bg-secondary-50 py-12"><div className="container mx-auto max-w-2xl px-4"><Card><CardBody><h1 className="text-2xl font-bold text-secondary-900">Application form coming soon</h1><p className="mt-3 text-secondary-600">{school.name} has not published its online application form yet.</p><Link href={`/schools/${school.id}`}><Button className="mt-5" variant="outline">Back to school profile</Button></Link></CardBody></Card></div></main><Footer /></>;

  return <><Header /><main className="min-h-screen bg-secondary-50 py-12"><div className="container mx-auto max-w-2xl px-4"><Card><CardBody className="p-6 sm:p-8"><h1 className="text-3xl font-bold text-secondary-900">Apply to {school.name}</h1><p className="mt-2 text-secondary-600">Complete the form created by this school. Required documents can be uploaded below.</p>{school.admissionInstructions && <p className="mt-5 whitespace-pre-line rounded-lg bg-secondary-100 p-4 text-secondary-700">{school.admissionInstructions}</p>}{error && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}<form className="mt-6 space-y-5" onSubmit={submit}>{school.applicationFields.map((field) => <div key={field.id}>{field.type === 'textarea' ? <Textarea label={field.label} value={answers[field.id] || ''} onChange={(event) => setAnswer(field.id, event.target.value)} required={field.required} rows={4} /> : field.type === 'select' ? <Select label={field.label} value={answers[field.id] || ''} onChange={(event) => setAnswer(field.id, event.target.value)} required={field.required} options={(field.options || []).map((option) => ({ value: option, label: option }))} /> : field.type === 'file' ? <label className="block text-sm font-medium text-secondary-900">{field.label}{field.required && <span className="ml-1 text-red-600">*</span>}<input className="mt-2 block w-full text-sm text-secondary-700" type="file" onChange={(event) => { const file = event.target.files?.[0]; if (file) setFiles((current) => ({ ...current, [field.id]: file })); }} /></label> : <Input label={field.label} type={field.type} value={answers[field.id] || ''} onChange={(event) => setAnswer(field.id, event.target.value)} required={field.required} />}</div>)}<Button type="submit" fullWidth isLoading={submitting}>Submit application</Button></form></CardBody></Card></div></main><Footer /></>;
}
