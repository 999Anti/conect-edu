import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { addAuditLog, addNotification, readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, notFound, unauthorized } from '@/lib/server/http';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  const application = database.applications.find((candidate) => candidate.id === params.id && candidate.userId === user.id);
  if (!application) return notFound('Application not found.');
  if (application.paymentStatus !== 'successful') return badRequest('Payment is required before submitting this application.');
  const school = database.schools.find((item) => item.id === application.schoolId);
  if (!school?.applicationFields?.length) return badRequest('This school has not published an online application form yet.');
  const missingAnswer = school.applicationFields.find((field) => field.required && field.type !== 'file' && !application.customAnswers?.some((answer) => answer.questionId === field.id && answer.answer.trim()));
  if (missingAnswer) return badRequest(`Please complete: ${missingAnswer.label}.`);
  const missingDocument = school.applicationFields.find((field) => field.required && field.type === 'file' && !application.documents?.some((document) => document.fieldId === field.id));
  if (missingDocument) return badRequest(`Please upload: ${missingDocument.label}.`);
  application.status = 'submitted';
  application.submittedAt = new Date().toISOString();
  application.updatedAt = application.submittedAt;
  const schoolAdmins = database.users.filter((item) => item.role === 'school_admin' && item.schoolId === application.schoolId);
  schoolAdmins.forEach((admin) => addNotification(database, { userId: admin.id, title: 'New application', message: `${application.studentFirstName} ${application.studentLastName} submitted an application${application.branchName ? ` for ${application.branchName}` : ''}.` }));
  addAuditLog(database, { actorId: user.id, action: 'submitted application', entityType: 'application', entityId: application.id, detail: application.applicationId });
  await writeDatabase(database);
  return NextResponse.json(application);
}
