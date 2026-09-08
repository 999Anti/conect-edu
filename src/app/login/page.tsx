'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Card, CardBody, CardHeader } from '@components/ui/Card';
import authService from '@services/auth';
import { useStore } from '@store/auth';

export default function Login() {
  const router = useRouter();
  const { setUser, setToken } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      setUser(response.user);
      setToken(response.token);

      if (response.user.role === 'school_admin') {
        router.push('/admin/dashboard');
      } else if (response.user.role === 'conect_admin') {
        router.push('/conect/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-secondary-50 py-12 flex items-center">
        <div className="container max-w-md mx-auto px-4">
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold text-secondary-900">Login</h1>
              <p className="text-secondary-600 text-sm mt-1">
                Welcome back to CONECT EDU
              </p>
            </CardHeader>

            <CardBody>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="mb-5 rounded-lg border border-primary-100 bg-primary-50 px-3 py-2 text-xs text-primary-700">
                Parents can log in here to manage their children&apos;s school applications.
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-secondary-200 rounded"
                    />
                    <span className="text-sm text-secondary-700">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">Forgot password?</Link>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  Login
                </Button>
              </form>

              <p className="text-center text-sm text-secondary-600 mt-6">
                Don&apos;t have a parent account?{' '}
                <Link href="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                  Register here
                </Link>
              </p>
              <p className="mt-3 text-center text-sm text-secondary-600">
                Platform administrator? <Link href="/platform-login" className="font-semibold text-primary-600 hover:text-primary-700">Use platform login</Link>.
              </p>
              <p className="mt-3 text-center text-sm text-secondary-600">
                School administrator? <Link href="/school-login" className="font-semibold text-primary-600 hover:text-primary-700">Use school login</Link>.
              </p>
            </CardBody>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
