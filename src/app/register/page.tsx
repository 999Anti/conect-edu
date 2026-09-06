'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import { Card, CardBody, CardHeader } from '@components/ui/Card';
import authService from '@services/auth';
import { useStore } from '@store/auth';

export default function Register() {
  const router = useRouter();
  const { setUser, setToken } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'parent',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role as 'student' | 'parent',
      });

      setUser(response.user);
      setToken(response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              <h1 className="text-2xl font-bold text-secondary-900">Create Parent/Student Account</h1>
              <p className="text-secondary-600 text-sm mt-1">
                Only parents and students can register instantly for school applications.
              </p>
            </CardHeader>

            <CardBody>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                School admins and platform staff accounts are created by the platform team and are not available for self-registration.
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="I am a"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={[
                    { value: 'parent', label: 'Parent' },
                    { value: 'student', label: 'Student' },
                  ]}
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              </form>

              <p className="text-center text-sm text-secondary-600 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                  Login
                </Link>
              </p>
            </CardBody>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
