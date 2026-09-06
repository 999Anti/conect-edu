'use client';

import React, { useEffect } from 'react';
import { useStore } from '@store/auth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import { Card, CardBody } from '@components/ui/Card';

export default function SchoolAdminDashboard() {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'school_admin') {
      router.push('/login');
    }
  }, [isAuthenticated, user?.role, router]);

  const stats = [
    { label: 'Total Applications', value: '143', icon: '📋' },
    { label: 'New This Month', value: '32', icon: '📈' },
    { label: 'Under Review', value: '18', icon: '⏳' },
    { label: 'Shortlisted', value: '25', icon: '✓' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardBody className="flex items-center gap-4">
                <div className="text-4xl">{stat.icon}</div>
                <div>
                  <p className="text-secondary-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardBody className="h-80">
              <h3 className="font-bold text-secondary-900 mb-4">Applications Over Time</h3>
              <div className="h-full flex items-center justify-center">
                <p className="text-secondary-600">Chart coming soon</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="h-80">
              <h3 className="font-bold text-secondary-900 mb-4">Applications by Status</h3>
              <div className="h-full flex items-center justify-center">
                <p className="text-secondary-600">Chart coming soon</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardBody>
            <h3 className="font-bold text-secondary-900 mb-4">Recent Applications</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-secondary-200">
                    <th className="text-left py-3 px-4 font-semibold">Applicant</th>
                    <th className="text-left py-3 px-4 font-semibold">Class</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-secondary-200 hover:bg-secondary-50">
                    <td className="py-3 px-4">John Doe</td>
                    <td className="py-3 px-4">JSS1</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Submitted</span>
                    </td>
                    <td className="py-3 px-4">Today</td>
                  </tr>
                  <tr className="border-b border-secondary-200 hover:bg-secondary-50">
                    <td className="py-3 px-4">Jane Smith</td>
                    <td className="py-3 px-4">SS1</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Under Review</span>
                    </td>
                    <td className="py-3 px-4">2 days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
