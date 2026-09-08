import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, uploadPath, writeDatabase } from '@/lib/server/database';
import { badRequest, forbidden, notFound, unauthorized } from '@/lib/server/http';

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '-');

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const database = await readDatabase(); const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (user.role !== 'school_admin' || user.schoolId !== params.id) return forbidden();
  const school = database.schools.find((item) => item.id === params.id); if (!school) return notFound('School not found.');
  const form = await request.formData(); const file = form.get('file'); const kind = form.get('kind');
  if (!(file instanceof File) || !['gallery', 'document', 'logo', 'cover'].includes(String(kind))) return badRequest('Choose a file and upload type.');
  if (file.size > 5 * 1024 * 1024) return badRequest('Files must be 5MB or smaller.');
  const isImage = file.type.startsWith('image/');
  if ((kind === 'gallery' || kind === 'logo' || kind === 'cover') && !isImage) return badRequest('This upload must be an image.');
  const folder = path.join(uploadPath, params.id); await mkdir(folder, { recursive: true });
  const filename = `${randomUUID()}-${safeName(file.name)}`; await writeFile(path.join(folder, filename), Buffer.from(await file.arrayBuffer()));
  const url = `/uploads/${params.id}/${filename}`;
  if (kind === 'logo') school.logo = url; else if (kind === 'cover') school.coverImage = url; else if (kind === 'gallery') school.gallery = [...(school.gallery || []), url]; else school.admissionDocuments = [...(school.admissionDocuments || []), { name: file.name, url }];
  school.updatedAt = new Date().toISOString(); await writeDatabase(database);
  return NextResponse.json(school);
}
