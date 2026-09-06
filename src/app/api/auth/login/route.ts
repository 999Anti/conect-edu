import { NextRequest, NextResponse } from 'next/server';
import { createToken, publicUser, verifyPassword } from '@/lib/server/auth';
import { readDatabase } from '@/lib/server/database';
import { badRequest, unauthorized } from '@/lib/server/http';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json() as { email?: string; password?: string };
  if (!email || !password) return badRequest('Email and password are required.');
  const database = await readDatabase();
  const user = database.users.find((candidate) => candidate.email === email.trim().toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) return unauthorized();
  return NextResponse.json({ user: publicUser(user), token: createToken(user.id) });
}

