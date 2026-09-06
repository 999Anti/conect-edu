'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import { Card, CardBody, CardHeader } from '@components/ui/Card';
import StatusBadge from '@components/ui/StatusBadge';
import Badge from '@components/ui/Badge';
import Loading from '@components/ui/Loading';
import { useStore } from '@store/auth';
import { Download, CheckCircle2, Clock, FileText } from 'lucide-react';
import applicationService from '@services/applications';
import { Application } from '@app-types/index';
import paymentService from '@services/payments';
import Button from '@components/ui/Button';

export default function ApplicationDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useStore();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchApplication();
  }, [isAuthenticated, isAuthLoading, router]);

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getApplicationById(params.id);
      setApplication(data);
    } catch (error) {
      console.error('Failed to fetch application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const beginPayment = async () => {
    if (!application) return;
    setPaymentError('');
    setIsPaying(true);
    try {
      const payment = await paymentService.initializePayment({
        applicationId: application.id,
        amount: application.totalAmount,
        email: application.parentEmail,
      });
      window.location.assign(payment.authorization_url);
    } catch (error: any) {
      setPaymentError(error.response?.data?.message || 'Unable to start payment. Please try again.');
      setIsPaying(false);
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

  if (!application) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p>Application not found</p>
        </div>
        <Footer />
      </>
    );
  }

  const timeline = [
    { status: 'submitted', label: 'Application Submitted', completed: true, date: application.submittedAt },
    { status: 'documents_verified', label: 'Documents Verified', completed: application.status !== 'submitted', date: null },
    { status: 'under_review', label: 'Under Review', completed: ['under_review', 'shortlisted', 'interview_scheduled', 'accepted'].includes(application.status), date: null },
    { status: 'interview_scheduled', label: 'Interview Scheduled', completed: ['interview_scheduled', 'assessment_scheduled', 'accepted'].includes(application.status), date: null },
    { status: 'decision', label: 'Admission Decision', completed: ['accepted', 'rejected'].includes(application.status), date: null },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-secondary-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                  Application {application.applicationId}
                </h1>
                <p className="text-secondary-600">
                  Submitted on {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <StatusBadge status={application.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Summary */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-secondary-900">Application Summary</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-secondary-600 text-sm">Applicant</p>
                      <p className="font-semibold text-secondary-900">
                        {application.studentFirstName} {application.studentLastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600 text-sm">Desired Class</p>
                      <p className="font-semibold text-secondary-900">
                        {application.desiredClass}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600 text-sm">Current School</p>
                      <p className="font-semibold text-secondary-900">
                        {application.currentSchool}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600 text-sm">Current Class</p>
                      <p className="font-semibold text-secondary-900">
                        {application.currentClass}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-secondary-900">Submitted Documents</h2>
                </CardHeader>
                <CardBody>
                  {application.documents && application.documents.length > 0 ? (
                    <div className="space-y-3">
                      {application.documents.map(doc => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-primary-600" />
                            <div>
                              <p className="font-semibold text-secondary-900">{doc.name}</p>
                              <p className="text-sm text-secondary-600">{doc.type}</p>
                            </div>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Download size={20} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-600">No documents uploaded yet</p>
                  )}
                </CardBody>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-secondary-900">Application Timeline</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {timeline.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.completed
                                ? 'bg-green-100 text-green-600'
                                : 'bg-secondary-100 text-secondary-600'
                            }`}
                          >
                            <CheckCircle2 size={20} />
                          </div>
                          {index < timeline.length - 1 && (
                            <div
                              className={`w-0.5 h-12 ${
                                item.completed ? 'bg-green-300' : 'bg-secondary-200'
                              }`}
                            />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-semibold text-secondary-900">{item.label}</p>
                          {item.date && (
                            <p className="text-sm text-secondary-600">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Status */}
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-secondary-900">Payment Status</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div>
                    <p className="text-secondary-600 text-sm">Application Fee</p>
                    <p className="font-bold text-lg">₦{application.applicationFee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-secondary-600 text-sm">Processing Fee</p>
                    <p className="font-bold text-lg">₦{application.processingFee.toLocaleString()}</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-secondary-600 text-sm">Total Amount</p>
                    <p className="font-bold text-lg text-primary-600">
                      ₦{application.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={
                    application.paymentStatus === 'successful' ? 'success' :
                    application.paymentStatus === 'pending' ? 'warning' : 'error'
                  }>
                    {application.paymentStatus.charAt(0).toUpperCase() + application.paymentStatus.slice(1)}
                  </Badge>
                  {application.paymentStatus === 'pending' && application.status !== 'withdrawn' && (
                    <Button fullWidth onClick={beginPayment} isLoading={isPaying}>
                      Pay Application Fee
                    </Button>
                  )}
                  {paymentError && <p className="text-sm text-red-700">{paymentError}</p>}
                </CardBody>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-secondary-900">Contact Information</h3>
                </CardHeader>
                <CardBody className="space-y-3 text-sm">
                  <div>
                    <p className="text-secondary-600">Parent/Guardian</p>
                    <p className="font-semibold">{application.parentName}</p>
                  </div>
                  <div>
                    <p className="text-secondary-600">Email</p>
                    <p className="font-semibold">{application.parentEmail}</p>
                  </div>
                  <div>
                    <p className="text-secondary-600">Phone</p>
                    <p className="font-semibold">{application.parentPhone}</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
