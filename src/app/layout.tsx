import type { Metadata } from 'next';
import './globals.css';
import AuthHydrator from '@components/auth/AuthHydrator';

export const metadata: Metadata = {
  title: 'CONECT EDU - School Admissions Platform',
  description: 'Find the right school. Apply with ease. Discover Nigeria\'s leading private secondary schools and apply online.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-secondary-900">
        <AuthHydrator />
        {children}
      </body>
    </html>
  );
}
