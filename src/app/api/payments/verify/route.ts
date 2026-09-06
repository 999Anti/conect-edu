import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, notFound, unauthorized } from '@/lib/server/http';

export async function POST(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  const { reference } = await request.json() as { reference?: string };
  if (!reference) return badRequest('A payment reference is required.');
  const payment = database.payments.find((candidate) => candidate.reference === reference && candidate.userId === user.id);
  if (!payment) return notFound('Payment not found.');
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey) return NextResponse.json({ error: 'payment_not_configured', message: 'Payment is not configured yet.', statusCode: 503 }, { status: 503 });
  const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${paystackSecretKey}` } });
  const result = await paystackResponse.json() as { status: boolean; message: string; data?: { status: string; amount: number; paid_at: string; reference: string } };
  if (!paystackResponse.ok || !result.status || !result.data) return NextResponse.json({ error: 'payment_verification_failed', message: result.message || 'Unable to verify payment.', statusCode: 502 }, { status: 502 });
  if (result.data.status === 'success') {
    payment.status = 'successful';
    payment.updatedAt = new Date().toISOString();
    const application = database.applications.find((candidate) => candidate.id === payment.applicationId);
    if (application) {
      application.paymentStatus = 'successful';
      application.status = 'submitted';
      application.submittedAt = application.submittedAt || payment.updatedAt;
      application.updatedAt = payment.updatedAt;
    }
    await writeDatabase(database);
  }
  return NextResponse.json(result);
}

