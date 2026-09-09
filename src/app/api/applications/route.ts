import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, unauthorized } from '@/lib/server/http';

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
  if (user.role !== 'parent') return badRequest('Only parent accounts can submit applications.');
  const body = await request.json() as { schoolId?: string; customAnswers?: Array<{ questionId?: string; question?: string; answer?: string }> };
  if (!body.schoolId) return badRequest('Choose a school.');
  const school = database.schools.find((item) => item.id === body.schoolId);
  if (!school) return badRequest('The selected school is unavailable.');
  if (!school.applicationFields?.length) return badRequest('This school has not published an online application form yet.');
  const customAnswers = (body.customAnswers || []).filter((answer) => answer.questionId && answer.question && answer.answer?.trim()).map((answer) => ({ questionId: answer.questionId!, question: answer.question!, answer: answer.answer!.trim() }));
  const missingAnswer = school.applicationFields.find((field) => field.required && field.type !== 'file' && !customAnswers.some((answer) => answer.questionId === field.id));
  if (missingAnswer) return badRequest(`Please complete: ${missingAnswer.label}.`);
  const now = new Date().toISOString();
  const application = {
    id: randomUUID(), applicationId: `CE-${new Date().getFullYear()}-${String(database.applications.length + 1).padStart(6, '0')}`,
    userId: user.id, schoolId: school.id, status: 'draft' as const,
    desiredClass: '', studentFirstName: '', studentLastName: '', studentDOB: '', studentGender: 'male' as const, studentNationality: '', currentSchool: '', currentClass: '', parentName: '', parentEmail: user.email, parentPhone: '', parentAddress: '',
    documents: [], customAnswers, paymentStatus: 'pending' as const, applicationFee: 0, processingFee: 0, totalAmount: 0, createdAt: now, updatedAt: now,
  };
  database.applications.push(application);
  await writeDatabase(database);
  return NextResponse.json(application, { status: 201 });
}
