import { NextRequest, NextResponse } from 'next/server';
import { ApplicationStatus } from '@app-types/index';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, forbidden, notFound, unauthorized } from '@/lib/server/http';

const validStatuses: ApplicationStatus[] = ['draft', 'payment_required', 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'assessment_scheduled', 'accepted', 'rejected', 'withdrawn'];

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  const application = database.applications.find((candidate) => candidate.id === params.id);
  if (!application) return notFound('Application not found.');
  const canManage = user.role === 'conect_admin' || (user.role === 'school_admin' && application.schoolId === (user as { schoolId?: string }).schoolId);
  if (!canManage) return forbidden();
  const { status } = await request.json() as { status?: ApplicationStatus };
  if (!status || !validStatuses.includes(status)) return badRequest('A valid application status is required.');
  application.status = status;
  application.updatedAt = new Date().toISOString();
  await writeDatabase(database);
  return NextResponse.json(application);
}

