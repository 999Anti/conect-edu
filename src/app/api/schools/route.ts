import { NextRequest, NextResponse } from 'next/server';
import { readDatabase } from '@/lib/server/database';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = (searchParams.get('search') || '').trim().toLowerCase();
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 12)));
  const database = await readDatabase();
  const fields = ['state', 'city', 'curriculum', 'boardingOption', 'gender', 'schoolType'] as const;
  const filtered = database.schools.filter((school) => {
    if (!school.verified || school.verificationStatus !== 'verified') return false;
    if (query && !`${school.name} ${school.city} ${school.state} ${school.description}`.toLowerCase().includes(query)) return false;
    return fields.every((field) => !searchParams.get(field) || school[field] === searchParams.get(field));
  });
  return NextResponse.json({ data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, limit, totalPages: Math.max(1, Math.ceil(filtered.length / limit)) });
}
