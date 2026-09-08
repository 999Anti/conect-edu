import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, hashPassword, publicUser } from '@/lib/server/auth';
import { readDatabase, StoredUser, writeDatabase } from '@/lib/server/database';
import { badRequest, forbidden, unauthorized } from '@/lib/server/http';

async function requirePlatformAdmin(request: NextRequest) {
  const database = await readDatabase();
  return { database, user: getAuthenticatedUser(request, database.users) };
}

export async function GET(request: NextRequest) {
  const { database, user } = await requirePlatformAdmin(request);
  if (!user) return unauthorized();
  if (user.role !== 'conect_admin') return forbidden();
  return NextResponse.json(database.users.filter((item) => item.role === 'conect_admin').map(publicUser));
}

export async function POST(request: NextRequest) {
  const { database, user } = await requirePlatformAdmin(request);
  if (!user) return unauthorized();
  if (user.role !== 'conect_admin') return forbidden();
  if (!user.canManageAdmins) return forbidden();
  const body = await request.json() as { firstName?: string; lastName?: string; email?: string; phone?: string; password?: string };
  if (!body.firstName?.trim() || !body.lastName?.trim() || !body.email?.trim() || !body.password) return badRequest('Name, email, and password are required.');
  if (!/^\S+@\S+\.\S+$/.test(body.email)) return badRequest('Enter a valid email address.');
  if (body.password.length < 12) return badRequest('Use a password with at least 12 characters.');
  const email = body.email.trim().toLowerCase();
  if (database.users.some((item) => item.email === email)) return badRequest('An account already exists for this email address.');
  const now = new Date().toISOString();
  const admin: StoredUser = { id: randomUUID(), firstName: body.firstName.trim(), lastName: body.lastName.trim(), email, phone: body.phone?.trim() || '', role: 'conect_admin', canManageAdmins: false, isVerified: true, createdAt: now, updatedAt: now, passwordHash: hashPassword(body.password) };
  database.users.push(admin);
  await writeDatabase(database);
  return NextResponse.json(publicUser(admin), { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { database, user } = await requirePlatformAdmin(request);
  if (!user) return unauthorized();
  if (user.role !== 'conect_admin' || !user.canManageAdmins) return forbidden();
  const { id, canManageAdmins } = await request.json() as { id?: string; canManageAdmins?: boolean };
  const admin = database.users.find((item) => item.id === id && item.role === 'conect_admin');
  if (!admin || typeof canManageAdmins !== 'boolean') return badRequest('Choose a valid platform administrator and permission.');
  admin.canManageAdmins = canManageAdmins;
  admin.updatedAt = new Date().toISOString();
  await writeDatabase(database);
  return NextResponse.json(publicUser(admin));
}
