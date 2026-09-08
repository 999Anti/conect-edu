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
  if (user.role !== 'parent') return badRequest('Only parent accounts can create applications.');
  const body = await request.json() as Record<string, unknown>;
  const fields = body as Record<string, string>;
  const missing = requiredFields.find((field) => typeof fields[field] !== 'string' || !fields[field].trim());
  if (missing) return badRequest(`Please provide ${missing}.`);
  const school = database.schools.find((candidate) => candidate.id === fields.schoolId);
  if (!school) return badRequest('The selected school is unavailable.');
  const branch = fields.branchId ? school.branches?.find((item) => item.id === fields.branchId) : undefined;
  if (school.branches?.length && !branch) return badRequest('Please select one of this school\'s branches.');
  if (fields.branchId && !branch) return badRequest('The selected branch is unavailable.');
  if (branch?.applicationDeadline && new Date(branch.applicationDeadline).getTime() < Date.now()) return badRequest('Applications are closed for the selected branch.');
  if (branch?.capacity !== undefined) {
    const activeApplications = database.applications.filter((item) => item.schoolId === school.id && item.branchId === branch.id && item.status !== 'rejected' && item.status !== 'withdrawn').length;
    if (activeApplications >= branch.capacity) return badRequest('The selected branch has reached its application capacity.');
  }
  const customAnswers = Array.isArray(body.customAnswers)
    ? (body.customAnswers as Array<{ questionId: string; question: string; answer: string }>).filter(
      (item) => item.questionId && item.question && item.answer?.trim()
    )
    : [];
  const missingQuestion = school.applicationQuestions?.find(
    (question) => question.required && !customAnswers.some(
      (answer) => answer.questionId === question.id && answer.answer.trim()
    )
  );
  if (missingQuestion) return badRequest(`Please answer: ${missingQuestion.question}`);
  const now = new Date().toISOString();
  const application = {
    id: randomUUID(),
    applicationId: `CE-${new Date().getFullYear()}-${String(database.applications.length + 1).padStart(6, '0')}`,
    userId: user.id,
    schoolId: fields.schoolId,
    branchId: branch?.id,
    branchName: branch?.name,
    status: 'payment_required' as const,
    desiredClass: fields.desiredClass.trim(),
    studentFirstName: fields.studentFirstName.trim(),
    studentLastName: fields.studentLastName.trim(),
    studentDOB: fields.studentDOB,
    studentGender: fields.studentGender === 'female' ? 'female' as const : 'male' as const,
    studentNationality: fields.studentNationality.trim(),
    currentSchool: fields.currentSchool.trim(),
    currentClass: fields.currentClass.trim(),
    parentName: fields.parentName.trim(),
    parentEmail: fields.parentEmail.trim().toLowerCase(),
    parentPhone: fields.parentPhone.trim(),
    parentAddress: fields.parentAddress.trim(),
    documents: [],
    customAnswers,
    paymentStatus: 'pending' as const,
    applicationFee: branch?.applicationFee ?? 5000,
    processingFee: branch?.processingFee ?? 250,
    totalAmount: (branch?.applicationFee ?? 5000) + (branch?.processingFee ?? 250),
    createdAt: now,
    updatedAt: now,
  };
  database.applications.push(application);
  school.applicationCount = (school.applicationCount || 0) + 1;
  await writeDatabase(database);
  return NextResponse.json(application, { status: 201 });
}
