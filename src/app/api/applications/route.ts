import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, unauthorized } from '@/lib/server/http';

const requiredFields = ['schoolId', 'desiredClass', 'studentFirstName', 'studentLastName', 'studentDOB', 'studentGender', 'studentNationality', 'currentSchool', 'currentClass', 'parentName', 'parentEmail', 'parentPhone', 'parentAddress'] as const;

export async function GET(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  const applications = user.role === 'conect_admin'
    ? database.applications
    : user.role === 'school_admin'
      ? database.applications.filter((application) => application.schoolId === (user as { schoolId?: string }).schoolId)
      : database.applications.filter((application) => application.userId === user.id);
  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (!['parent', 'student'].includes(user.role)) return badRequest('Only parent and student accounts can create applications.');
  const body = await request.json() as Record<string, string>;
  const missing = requiredFields.find((field) => !body[field]?.trim());
  if (missing) return badRequest(`Please provide ${missing}.`);
  if (!database.schools.some((school) => school.id === body.schoolId)) return badRequest('The selected school is unavailable.');
  const now = new Date().toISOString();
  const application = {
    id: randomUUID(),
    applicationId: `CE-${new Date().getFullYear()}-${String(database.applications.length + 1).padStart(6, '0')}`,
    userId: user.id,
    schoolId: body.schoolId,
    status: 'payment_required' as const,
    desiredClass: body.desiredClass.trim(),
    studentFirstName: body.studentFirstName.trim(),
    studentLastName: body.studentLastName.trim(),
    studentDOB: body.studentDOB,
    studentGender: body.studentGender === 'female' ? 'female' as const : 'male' as const,
    studentNationality: body.studentNationality.trim(),
    currentSchool: body.currentSchool.trim(),
    currentClass: body.currentClass.trim(),
    parentName: body.parentName.trim(),
    parentEmail: body.parentEmail.trim().toLowerCase(),
    parentPhone: body.parentPhone.trim(),
    parentAddress: body.parentAddress.trim(),
    documents: [],
    paymentStatus: 'pending' as const,
    applicationFee: 5000,
    processingFee: 250,
    totalAmount: 5250,
    createdAt: now,
    updatedAt: now,
  };
  database.applications.push(application);
  const school = database.schools.find((candidate) => candidate.id === application.schoolId);
  if (school) school.applicationCount = (school.applicationCount || 0) + 1;
  await writeDatabase(database);
  return NextResponse.json(application, { status: 201 });
}

