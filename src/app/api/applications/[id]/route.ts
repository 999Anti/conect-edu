import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@app-types/index';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { forbidden, notFound, unauthorized } from '@/lib/server/http';

async function findAuthorizedApplication(request: NextRequest, id: string) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return { database, user: null, application: null };
  const application = database.applications.find((candidate) => candidate.id === id) || null;
  if (!application) return { database, user, application: null };
  const hasAccess = user.role === 'conect_admin' || application.userId === user.id || (user.role === 'school_admin' && application.schoolId === (user as { schoolId?: string }).schoolId);
  return { database, user, application: hasAccess ? application : null };
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await findAuthorizedApplication(request, params.id);
  if (!result.user) return unauthorized();
  return result.application ? NextResponse.json(result.application) : notFound('Application not found.');
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await findAuthorizedApplication(request, params.id);
  if (!result.user) return unauthorized();
  if (!result.application) return notFound('Application not found.');
  if (result.application.userId !== result.user.id) return forbidden();
  const changes = await request.json() as Partial<Application>;
  const permitted = ['desiredClass', 'currentSchool', 'currentClass', 'parentName', 'parentEmail', 'parentPhone', 'parentAddress'] as const;
  for (const field of permitted) if (typeof changes[field] === 'string') result.application[field] = changes[field] as never;
  result.application.updatedAt = new Date().toISOString();
  await writeDatabase(result.database);
  return NextResponse.json(result.application);
}

