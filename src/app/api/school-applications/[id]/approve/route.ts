import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, hashPassword } from '@/lib/server/auth';
import { readDatabase, StoredUser, writeDatabase } from '@/lib/server/database';
import { badRequest, forbidden, notFound, unauthorized } from '@/lib/server/http';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json() as { password?: string };
  if (!body.password || body.password.length < 8) return badRequest('Set a temporary password of at least 8 characters.');
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (user.role !== 'conect_admin') return forbidden();
  const application = database.schoolApplications.find((item) => item.id === params.id);
  if (!application) return notFound('School application not found.');
  if (application.status !== 'pending') return badRequest('This school application has already been reviewed.');
  if (database.users.some((item) => item.email === application.contactEmail)) return badRequest('This contact email already has an account.');
  const baseId = slugify(application.schoolName) || randomUUID();
  const schoolId = database.schools.some((school) => school.id === baseId) ? `${baseId}-${Date.now()}` : baseId;
  const now = new Date().toISOString();
  database.schools.push({
    id: schoolId, name: application.schoolName, email: application.contactEmail, phone: application.contactPhone,
    address: application.address, state: application.state, city: application.city, schoolType: 'private',
    curriculum: 'nigerian', boardingOption: 'day', gender: 'mixed', description: application.description,
    website: application.website, facilities: [], programmes: [], admissionRequirements: [], gallery: [],
    verified: true, verificationStatus: 'verified', applicationCount: 0, createdAt: now, updatedAt: now,
  });
  const admin: StoredUser = {
    id: randomUUID(), firstName: application.contactFirstName, lastName: application.contactLastName,
    email: application.contactEmail, phone: application.contactPhone, role: 'school_admin', schoolId, mustChangePassword: true,
    isVerified: true, createdAt: now, updatedAt: now, passwordHash: hashPassword(body.password),
  };
  database.users.push(admin);
  application.status = 'approved';
  application.reviewedAt = now;
  await writeDatabase(database);
  return NextResponse.json({ schoolId, admin: { email: admin.email, name: `${admin.firstName} ${admin.lastName}` } }, { status: 201 });
}
