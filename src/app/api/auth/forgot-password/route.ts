import { NextRequest, NextResponse } from 'next/server';
import { readDatabase } from '@/lib/server/database';
import { badRequest } from '@/lib/server/http';

export async function POST(request: NextRequest) {
  const { email } = await request.json() as { email?: string };
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return badRequest('Enter a valid email address.');
  await readDatabase();
  return NextResponse.json({ message: 'If an account exists for this email, password reset instructions will be sent once email delivery is configured.' });
}
