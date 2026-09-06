import { NextRequest, NextResponse } from 'next/server';
import { readDatabase } from '@/lib/server/database';
import { notFound } from '@/lib/server/http';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const database = await readDatabase();
  const school = database.schools.find((candidate) => candidate.id === params.id);
  return school ? NextResponse.json(school) : notFound('School not found.');
}

