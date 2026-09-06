import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase } from '@/lib/server/database';
import { forbidden, notFound, unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (user.role !== 'school_admin' || !user.schoolId) return forbidden();
  const school = database.schools.find((item) => item.id === user.schoolId);
  return school ? NextResponse.json(school) : notFound('Your school profile was not found.');
}
