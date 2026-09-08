import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase } from '@/lib/server/database';
import { forbidden, unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (user.role !== 'conect_admin') return forbidden();

  const paidPayments = database.payments.filter((payment) => payment.status === 'successful');
  const revenue = paidPayments.reduce((total, payment) => total + payment.amount + payment.processingFee, 0);
  const usersByRole = {
    parents: database.users.filter((item) => item.role === 'parent').length,
    schoolAdmins: database.users.filter((item) => item.role === 'school_admin').length,
    platformAdmins: database.users.filter((item) => item.role === 'conect_admin').length,
  };
  const applicationsByStatus = Object.entries(database.applications.reduce<Record<string, number>>((counts, application) => {
    counts[application.status] = (counts[application.status] || 0) + 1;
    return counts;
  }, {}));
  const recentApplications = [...database.applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const recentPayments = [...paidPayments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);

  return NextResponse.json({
    stats: {
      schools: database.schools.length,
      users: database.users.length,
      applications: database.applications.length,
      revenue,
      pendingSchoolApplications: database.schoolApplications.filter((item) => item.status === 'pending').length,
    },
    usersByRole,
    applicationsByStatus,
    recentApplications,
    recentPayments,
  });
}
