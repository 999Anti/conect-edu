import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, publicUser } from '@/lib/server/auth';
import { readDatabase, uploadPath, writeDatabase } from '@/lib/server/database';
import { badRequest, unauthorized } from '@/lib/server/http';

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '-');

export async function POST(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return badRequest('Choose a profile image to upload.');
  if (!file.type.startsWith('image/')) return badRequest('Profile pictures must be image files.');
  if (file.size > 2 * 1024 * 1024) return badRequest('Profile pictures must be 2MB or smaller.');

  const folder = path.join(uploadPath, 'profiles');
  await mkdir(folder, { recursive: true });
  const filename = `${user.id}-${randomUUID()}-${safeName(file.name)}`;
  await writeFile(path.join(folder, filename), Buffer.from(await file.arrayBuffer()));
  user.profilePicture = `/uploads/profiles/${filename}`;
  user.updatedAt = new Date().toISOString();
  await writeDatabase(database);
  return NextResponse.json(publicUser(user));
}
