import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) { const database = await readDatabase(); const user = getAuthenticatedUser(request, database.users); if (!user) return unauthorized(); return NextResponse.json(database.notifications.filter((item) => item.userId === user.id)); }
export async function PATCH(request: NextRequest) { const database = await readDatabase(); const user = getAuthenticatedUser(request, database.users); if (!user) return unauthorized(); const { id } = await request.json() as { id?: string }; database.notifications.filter((item) => item.userId === user.id && (!id || item.id === id)).forEach((item) => { item.read = true; }); await writeDatabase(database); return NextResponse.json({ message: 'Notifications updated.' }); }
