import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase } from '@/lib/server/database';
import { unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  return NextResponse.json(database.payments.filter((payment) => payment.userId === user.id));
}

