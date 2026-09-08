import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { addAuditLog, readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, forbidden, notFound, unauthorized } from '@/lib/server/http';

async function requireOwner(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return { database, user: null, response: unauthorized() };
  if (user.role !== 'conect_admin' || !user.canManageAdmins) return { database, user, response: forbidden() };
  return { database, user, response: null };
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { database, user, response } = await requireOwner(request); if (response || !user) return response!;
  const school = database.schools.find((item) => item.id === params.id); if (!school) return notFound('School not found.');
  const { action, reason } = await request.json() as { action?: 'flag' | 'restore'; reason?: string };
  if (!action || !['flag', 'restore'].includes(action)) return badRequest('Choose whether to flag or restore this school.');
  school.verificationStatus = action === 'flag' ? 'suspended' : 'verified'; school.verified = action === 'restore'; school.updatedAt = new Date().toISOString();
  addAuditLog(database, { actorId: user.id, action: action === 'flag' ? 'flagged school' : 'restored school', entityType: 'school', entityId: school.id, detail: `${school.name}${reason?.trim() ? `: ${reason.trim()}` : ''}` });
  await writeDatabase(database); return NextResponse.json(school);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { database, user, response } = await requireOwner(request); if (response || !user) return response!;
  const school = database.schools.find((item) => item.id === params.id); if (!school) return notFound('School not found.');
  database.schools = database.schools.filter((item) => item.id !== school.id);
  database.users = database.users.filter((item) => !(item.role === 'school_admin' && item.schoolId === school.id));
  const removedApplicationIds = new Set(database.applications.filter((item) => item.schoolId === school.id).map((item) => item.id));
  database.applications = database.applications.filter((item) => item.schoolId !== school.id);
  database.payments = database.payments.filter((item) => !removedApplicationIds.has(item.applicationId));
  addAuditLog(database, { actorId: user.id, action: 'removed school', entityType: 'school', entityId: school.id, detail: school.name });
  await writeDatabase(database); return NextResponse.json({ message: `${school.name} has been removed from the platform.` });
}
