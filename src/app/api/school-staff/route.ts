import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, hashPassword, publicUser } from '@/lib/server/auth';
import { addAuditLog, readDatabase, StoredUser, writeDatabase } from '@/lib/server/database';
import { badRequest, forbidden, unauthorized } from '@/lib/server/http';

const canManageStaff = (user: StoredUser | undefined) => user?.role === 'school_admin' && !user.schoolPermission;

export async function GET(request: NextRequest) {
  const database = await readDatabase(); const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized(); if (!user.schoolId || user.role !== 'school_admin') return forbidden();
  return NextResponse.json(database.users.filter((item) => item.role === 'school_admin' && item.schoolId === user.schoolId).map(publicUser));
}

export async function POST(request: NextRequest) {
  const database = await readDatabase(); const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized(); if (!canManageStaff(user)) return forbidden();
  const body = await request.json() as { firstName?: string; lastName?: string; email?: string; password?: string; branchId?: string };
  if (!body.firstName?.trim() || !body.lastName?.trim() || !body.email?.trim() || !body.password) return badRequest('Name, email, and password are required.');
  if (!/^\S+@\S+\.\S+$/.test(body.email) || body.password.length < 8) return badRequest('Use a valid email and a password of at least 8 characters.');
  const email = body.email.trim().toLowerCase(); if (database.users.some((item) => item.email === email)) return badRequest('An account already exists for this email address.');
  const school = database.schools.find((item) => item.id === user.schoolId);
  if (!school) return badRequest('Your school account could not be found.');
  const branchId = school.branches?.length ? body.branchId : 'main';
  if (!branchId || (branchId !== 'main' && !school.branches?.some((branch) => branch.id === branchId))) return badRequest('Choose a valid school branch.');
  const branchStaff = database.users.filter((item) => item.role === 'school_admin' && item.schoolId === user.schoolId && item.schoolBranchId === branchId);
  if (branchStaff.length >= 5) return badRequest('This branch already has its maximum of five staff accounts.');
  const now = new Date().toISOString(); const staff: StoredUser = { id: randomUUID(), firstName: body.firstName.trim(), lastName: body.lastName.trim(), email, phone: '', role: 'school_admin', schoolId: user.schoolId, schoolBranchId: branchId, schoolPermission: 'admissions', mustChangePassword: true, isVerified: true, createdAt: now, updatedAt: now, passwordHash: hashPassword(body.password) };
  database.users.push(staff); addAuditLog(database, { actorId: user.id, action: 'created school admin officer account', entityType: 'user', entityId: staff.id, detail: staff.email }); await writeDatabase(database);
  return NextResponse.json(publicUser(staff), { status: 201 });
}
