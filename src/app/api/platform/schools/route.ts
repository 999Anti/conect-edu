import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase } from '@/lib/server/database';
import { forbidden, unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const database = await readDatabase(); const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized(); if (user.role !== 'conect_admin') return forbidden();
  return NextResponse.json(database.schools);
}
