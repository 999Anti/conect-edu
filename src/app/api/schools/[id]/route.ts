import { NextRequest, NextResponse } from 'next/server';
import { addAuditLog, readDatabase } from '@/lib/server/database';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { writeDatabase } from '@/lib/server/database';
import { forbidden, notFound, unauthorized } from '@/lib/server/http';
import { badRequest } from '@/lib/server/http';

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
  if ('admissionFormFee' in body && (typeof body.admissionFormFee !== 'number' || body.admissionFormFee < 30000)) return badRequest('Admission form fees must be at least ₦30,000.');
  if (Array.isArray(body.branches)) {
    const seen = new Set<string>();
    for (const branch of body.branches as Array<{ name?: string; city?: string; state?: string }>) {
      if (!branch.name?.trim() || !branch.city?.trim() || !branch.state?.trim()) return badRequest('Every branch needs a name, city, and state.');
      const key = `${branch.name.trim()}|${branch.city.trim()}|${branch.state.trim()}`.toLowerCase();
      if (seen.has(key)) return badRequest('Duplicate branches are not allowed.');
      seen.add(key);
    }
  }
  // Images, application forms, and resource files can only be changed through the
  // authenticated upload endpoint. This prevents arbitrary image URLs being shown.
  const editable = ['name', 'description', 'email', 'phone', 'address', 'state', 'city', 'area', 'website', 'annualTuitionFee', 'admissionFormFee', 'curriculum', 'boardingOption', 'gender', 'facilities', 'programmes', 'admissionRequirements', 'admissionInstructions', 'applicationFields', 'branches'];
  for (const field of editable) if (field in body) Object.assign(school, { [field]: body[field] });
  school.updatedAt = new Date().toISOString();
  addAuditLog(database, { actorId: user.id, action: 'updated school profile', entityType: 'school', entityId: school.id, detail: school.name });
  await writeDatabase(database);
  return NextResponse.json(school);
}
