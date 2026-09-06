import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, notFound, unauthorized } from '@/lib/server/http';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  const application = database.applications.find((candidate) => candidate.id === params.id && candidate.userId === user.id);
  if (!application) return notFound('Application not found.');
  if (application.paymentStatus !== 'successful') return badRequest('Payment is required before submitting this application.');
  application.status = 'submitted';
  application.submittedAt = new Date().toISOString();
  application.updatedAt = application.submittedAt;
  await writeDatabase(database);
  return NextResponse.json(application);
}

