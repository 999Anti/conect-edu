'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@store/auth';
import { useRouter } from 'next/navigation';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import { Card, CardBody, CardHeader } from '@components/ui/Card';
import Button from '@components/ui/Button';
import StatusBadge from '@components/ui/StatusBadge';
import Loading from '@components/ui/Loading';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import applicationService from '@services/applications';
import { Application } from '@app-types/index';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useStore();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchApplications();
  }, [isAuthenticated, isAuthLoading, router]);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getUserApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-secondary-50 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-secondary-900 mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-lg text-secondary-600">
              Manage your school applications and admission journey
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-secondary-600 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {applications.length}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-secondary-600 text-sm">Submitted</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {applications.filter(a => a.status !== 'draft').length}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-secondary-600 text-sm">Under Review</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {applications.filter(a => a.status === 'under_review').length}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-secondary-600 text-sm">Action Required</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {applications.filter(a => a.status === 'payment_required').length}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Applications Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">My Applications</h2>
              <Link href="/schools">
                <Button>New Application</Button>
              </Link>
            </div>

            {applications.length === 0 ? (
              <Card>
                <CardBody className="py-12 text-center">
                  <FileText size={48} className="mx-auto text-secondary-300 mb-4" />
                  <p className="text-secondary-600 text-lg mb-4">No applications yet</p>
                  <p className="text-secondary-500 mb-6">
                    Start by finding and applying to your preferred schools
                  </p>
                  <Link href="/schools">
                    <Button>Browse Schools</Button>
                  </Link>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map(application => (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow">
                    <CardBody className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-secondary-900 mb-2">
                          Application ID: {application.applicationId}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                          <span>Class: {application.desiredClass}</span>
                          <span>Submitted: {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <StatusBadge status={application.status} />
                        <Link href={`/applications/${application.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/schools">
                <Button variant="outline" fullWidth className="text-left py-4">
                  Explore Schools
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="outline" fullWidth className="text-left py-4">
                  Update Profile
                </Button>
              </Link>
              <Link href="/dashboard/documents">
                <Button variant="outline" fullWidth className="text-left py-4">
                  Manage Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
