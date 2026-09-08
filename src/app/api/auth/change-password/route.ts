import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, hashPassword, verifyPassword } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, unauthorized } from '@/lib/server/http';

export async function POST(request: NextRequest) {
  const { currentPassword, newPassword } = await request.json() as { currentPassword?: string; newPassword?: string };
  if (!currentPassword || !newPassword) return badRequest('Enter your current password and a new password.');
  if (newPassword.length < 8) return badRequest('Use a new password with at least 8 characters.');
  if (currentPassword === newPassword) return badRequest('Choose a different password.');
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  if (!verifyPassword(currentPassword, user.passwordHash)) return badRequest('Your current password is incorrect.');
  user.passwordHash = hashPassword(newPassword);
  user.mustChangePassword = false;
  user.updatedAt = new Date().toISOString();
  await writeDatabase(database);
  return NextResponse.json({ message: 'Your password has been changed.' });
}
