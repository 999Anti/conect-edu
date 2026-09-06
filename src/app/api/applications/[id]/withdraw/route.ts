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
  if (['accepted', 'rejected', 'withdrawn'].includes(application.status)) return badRequest('This application can no longer be withdrawn.');
  application.status = 'withdrawn';
  application.updatedAt = new Date().toISOString();
  await writeDatabase(database);
  return NextResponse.json(application);
}

