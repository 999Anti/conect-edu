import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, forbidden, unauthorized } from '@/lib/server/http';

export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, string>;
  const required = ['schoolName', 'contactFirstName', 'contactLastName', 'contactEmail', 'contactPhone', 'address', 'state', 'city'];
  if (required.some((field) => !body[field]?.trim())) return badRequest('Please complete all required fields.');
  if (!/^\S+@\S+\.\S+$/.test(body.contactEmail)) return badRequest('Enter a valid contact email address.');
  const database = await readDatabase();
  const now = new Date().toISOString();
  const application = {
    id: randomUUID(), schoolName: body.schoolName.trim(), contactFirstName: body.contactFirstName.trim(),
    contactLastName: body.contactLastName.trim(), contactEmail: body.contactEmail.trim().toLowerCase(),
    contactPhone: body.contactPhone.trim(), address: body.address.trim(), state: body.state.trim(), city: body.city.trim(),
    website: body.website?.trim() || undefined, description: body.description?.trim() || undefined,
    status: 'pending' as const, createdAt: now,
  };
  database.schoolApplications.push(application);
  await writeDatabase(database);
  return NextResponse.json({ message: 'Your school application has been received.' }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (user.role !== 'conect_admin') return forbidden();
  return NextResponse.json(database.schoolApplications);
}
