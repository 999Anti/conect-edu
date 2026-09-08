import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, publicUser } from '@/lib/server/auth';
import { readDatabase } from '@/lib/server/database';
import { forbidden, unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (user.role !== 'conect_admin') return forbidden();
  const query = (request.nextUrl.searchParams.get('search') || '').trim().toLowerCase();
  const role = request.nextUrl.searchParams.get('role');
  const users = database.users
    .filter((item) => !role || item.role === role)
    .filter((item) => !query || `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase().includes(query))
    .map(publicUser);
  return NextResponse.json(users);
}

