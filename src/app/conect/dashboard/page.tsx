'use client';

import React, { useEffect } from 'react';
import { useStore } from '@store/auth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@components/layout/AdminLayout';
import { Card, CardBody } from '@components/ui/Card';

export default function ConectAdminDashboard() {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'conect_admin') {
      router.push('/login');
    }
  }, [isAuthenticated, user?.role, router]);

  const stats = [
    { label: 'Total Schools', value: '324', icon: '🏫' },
    { label: 'Active Users', value: '12,543', icon: '👥' },
    { label: 'Total Applications', value: '45,230', icon: '📋' },
    { label: 'Monthly Revenue', value: '₦5.2M', icon: '💰' },
  ];

  return (
    <AdminLayout title="Platform Analytics">
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardBody className="h-80">
              <h3 className="font-bold text-secondary-900 mb-4">Platform Growth</h3>
              <div className="h-full flex items-center justify-center">
                <p className="text-secondary-600">Chart coming soon</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="h-80">
              <h3 className="font-bold text-secondary-900 mb-4">User Distribution</h3>
              <div className="h-full flex items-center justify-center">
                <p className="text-secondary-600">Chart coming soon</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="h-80">
              <h3 className="font-bold text-secondary-900 mb-4">Applications Trend</h3>
              <div className="h-full flex items-center justify-center">
                <p className="text-secondary-600">Chart coming soon</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="h-80">
              <h3 className="font-bold text-secondary-900 mb-4">Revenue Breakdown</h3>
              <div className="h-full flex items-center justify-center">
                <p className="text-secondary-600">Chart coming soon</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Pending Verifications */}
        <Card>
          <CardBody>
            <h3 className="font-bold text-secondary-900 mb-4">Pending School Verifications</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-secondary-200">
                    <th className="text-left py-3 px-4 font-semibold">School</th>
                    <th className="text-left py-3 px-4 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-secondary-200 hover:bg-secondary-50">
                    <td className="py-3 px-4 font-semibold">Excellence Academy</td>
                    <td className="py-3 px-4">Lagos</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Pending</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                        onClick={() => window.location.href = '/conect/schools'}
                      >
                        Review
                      </button>
                    </td>
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
