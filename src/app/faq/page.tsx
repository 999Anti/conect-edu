import React from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';

const questions = [
  ['Who can create a parent account?', 'A parent or legal guardian can create an account and manage applications for their child.'],
  ['Can my child apply independently?', 'No. Every application is created and managed by a parent or guardian account.'],
  ['How does a school join CONECT EDU?', 'A school submits its listing request. A platform administrator verifies the details and issues a school administrator login after approval.'],
  ['How do I pay an application fee?', 'After an application is created, the parent can begin payment from the application details page. Payment is confirmed through Paystack once configured.'],
  ['How will I receive admission updates?', 'Your parent dashboard and application timeline show the latest school decision and any assessment date or note.'],
];

export default function FaqPage() {
  return <><Header /><main className="min-h-screen bg-secondary-50 py-12"><div className="container mx-auto max-w-3xl px-4"><h1 className="text-3xl font-bold text-secondary-900">Frequently asked questions</h1><div className="mt-8 space-y-3">{questions.map(([question, answer]) => <details key={question} className="rounded-lg border border-secondary-200 bg-white p-5"><summary className="cursor-pointer font-semibold text-secondary-900">{question}</summary><p className="mt-3 text-secondary-600">{answer}</p></details>)}</div></div></main><Footer /></>;
}

