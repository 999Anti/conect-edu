import { NextRequest, NextResponse } from 'next/server';
import { addAuditLog, readDatabase } from '@/lib/server/database';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { writeDatabase } from '@/lib/server/database';
import { forbidden, notFound, unauthorized } from '@/lib/server/http';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const database = await readDatabase();
  const school = database.schools.find((candidate) => candidate.id === params.id);
  return school ? NextResponse.json(school) : notFound('School not found.');
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (user.role !== 'school_admin' || user.schoolId !== params.id) return forbidden();
  const school = database.schools.find((candidate) => candidate.id === params.id);
  if (!school) return notFound('School not found.');
  const body = await request.json() as Record<string, unknown>;
  // Images, application forms, and resource files can only be changed through the
  // authenticated upload endpoint. This prevents arbitrary image URLs being shown.
  const editable = ['name', 'description', 'email', 'phone', 'address', 'state', 'city', 'area', 'website', 'curriculum', 'boardingOption', 'gender', 'facilities', 'programmes', 'admissionRequirements', 'admissionInstructions', 'applicationFields', 'branches'];
  for (const field of editable) if (field in body) Object.assign(school, { [field]: body[field] });
  school.updatedAt = new Date().toISOString();
  addAuditLog(database, { actorId: user.id, action: 'updated school profile', entityType: 'school', entityId: school.id, detail: school.name });
  await writeDatabase(database);
  return NextResponse.json(school);
}
