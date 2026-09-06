import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, publicUser } from '@/lib/server/auth';
import { readDatabase } from '@/lib/server/database';
import { unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  return user ? NextResponse.json(publicUser(user)) : unauthorized();
}

