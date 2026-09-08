import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createToken, hashPassword, publicUser } from '@/lib/server/auth';
import { readDatabase, StoredUser, writeDatabase } from '@/lib/server/database';
import { badRequest } from '@/lib/server/http';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, password, phone, role } = body as Record<string, string>;
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password || !phone?.trim()) return badRequest('Please complete all required fields.');
  if (role !== 'parent') return badRequest('Only parent accounts can self-register.');
  if (!/^\S+@\S+\.\S+$/.test(email)) return badRequest('Enter a valid email address.');
  if (password.length < 8) return badRequest('Password must be at least 8 characters.');
  const database = await readDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  if (database.users.some((user) => user.email === normalizedEmail)) return badRequest('An account already exists for this email address.');
  const now = new Date().toISOString();
  const user: StoredUser = { id: randomUUID(), firstName: firstName.trim(), lastName: lastName.trim(), email: normalizedEmail, phone: phone.trim(), role: 'parent', isVerified: false, createdAt: now, updatedAt: now, passwordHash: hashPassword(password) };
  database.users.push(user);
  await writeDatabase(database);
  return NextResponse.json({ user: publicUser(user), token: createToken(user.id) }, { status: 201 });
}
