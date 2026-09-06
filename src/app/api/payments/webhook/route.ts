import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/server/database';

export async function POST(request: NextRequest) {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get('x-paystack-signature');
  if (!paystackSecretKey || !signature) return new NextResponse(null, { status: 401 });
  const body = await request.text();
  const expected = createHmac('sha512', paystackSecretKey).update(body).digest('hex');
  if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return new NextResponse(null, { status: 401 });
  const event = JSON.parse(body) as { event?: string; data?: { reference?: string } };
  if (event.event !== 'charge.success' || !event.data?.reference) return NextResponse.json({ received: true });
  const database = await readDatabase();
  const payment = database.payments.find((candidate) => candidate.reference === event.data?.reference);
  if (!payment || payment.status === 'successful') return NextResponse.json({ received: true });
  const now = new Date().toISOString();
  payment.status = 'successful';
  payment.updatedAt = now;
  const application = database.applications.find((candidate) => candidate.id === payment.applicationId);
  if (application) {
    application.paymentStatus = 'successful';
    application.status = 'submitted';
    application.submittedAt = application.submittedAt || now;
    application.updatedAt = now;
  }
  await writeDatabase(database);
  return NextResponse.json({ received: true });
}

