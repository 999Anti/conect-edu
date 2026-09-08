'use client';

import React, { useEffect, useState } from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Select from '@components/ui/Select';
import Loading from '@components/ui/Loading';
import api from '@services/api';
import { School } from '@app-types/index';

export default function ComparePage() {
  const [schools, setSchools] = useState<School[]>([]); const [first, setFirst] = useState(''); const [second, setSecond] = useState('');
  useEffect(() => { api.get<{ data: School[] }>('/schools', { params: { limit: 100 } }).then((response) => setSchools(response.data.data)); }, []);
  if (!schools.length) return <><Header /><main className="flex min-h-screen items-center justify-center"><Loading /></main><Footer /></>;
  const options = schools.map((school) => ({ value: school.id, label: school.name })); const selected = schools.filter((school) => school.id === first || school.id === second);
  const fields: Array<[string, (school: School) => string]> = [['Location', (school) => `${school.city}, ${school.state}`], ['Curriculum', (school) => school.curriculum.toUpperCase()], ['Boarding', (school) => school.boardingOption], ['Student body', (school) => school.gender], ['Facilities', (school) => school.facilities?.join(', ') || 'Not listed'], ['Rating', (school) => school.rating ? `${school.rating}/5` : 'Not rated']];
  return <><Header /><main className="min-h-screen bg-secondary-50 py-12"><div className="container mx-auto max-w-5xl px-4"><h1 className="text-3xl font-bold text-secondary-900">Compare schools</h1><p className="mt-2 text-secondary-600">Choose up to two schools to compare their key details.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><Select label="First school" value={first} onChange={(event) => setFirst(event.target.value)} options={options} /><Select label="Second school" value={second} onChange={(event) => setSecond(event.target.value)} options={options.filter((option) => option.value !== first)} /></div>{selected.length ? <section className="mt-8 overflow-hidden rounded-lg border border-secondary-200 bg-white"><div className="overflow-x-auto"><table><thead><tr><th>Detail</th>{selected.map((school) => <th key={school.id}>{school.name}</th>)}</tr></thead><tbody>{fields.map(([label, value]) => <tr key={label}><td className="font-semibold">{label}</td>{selected.map((school) => <td key={school.id} className="capitalize">{value(school)}</td>)}</tr>)}</tbody></table></div></section> : <p className="mt-8 rounded-lg border border-secondary-200 bg-white p-6 text-secondary-600">Select a school to begin comparing.</p>}</div></main><Footer /></>;
}

