import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, uploadPath, writeDatabase } from '@/lib/server/database';
import { badRequest, notFound, unauthorized } from '@/lib/server/http';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const database = await readDatabase(); const user = getAuthenticatedUser(request, database.users); if (!user) return unauthorized();
  const application = database.applications.find((item) => item.id === params.id && item.userId === user.id); if (!application) return notFound('Application not found.');
  const form = await request.formData(); const file = form.get('file'); const documentType = String(form.get('documentType') || 'other');
  if (!(file instanceof File)) return badRequest('Choose a document to upload.'); if (file.size > 5 * 1024 * 1024) return badRequest('Documents must be 5MB or smaller.');
  const school = database.schools.find((item) => item.id === application.schoolId);
  const formField = school?.applicationFields?.find((field) => field.id === documentType && field.type === 'file');
  const allowed = ['birth_certificate', 'passport_photo', 'school_report', 'transfer_document', 'other']; if (!allowed.includes(documentType) && !formField) return badRequest('Choose a valid document type.');
  const folder = path.join(uploadPath, 'applications', params.id); await mkdir(folder, { recursive: true }); const filename = `${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  await writeFile(path.join(folder, filename), Buffer.from(await file.arrayBuffer()));
  application.documents = [...(application.documents || []), { id: randomUUID(), type: allowed.includes(documentType) ? documentType as 'birth_certificate' | 'passport_photo' | 'school_report' | 'transfer_document' | 'other' : 'other', fieldId: formField?.id, url: `/uploads/applications/${params.id}/${filename}`, name: file.name, uploadedAt: new Date().toISOString() }]; application.updatedAt = new Date().toISOString(); await writeDatabase(database);
  return NextResponse.json(application);
}
