import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/auth';
import { readDatabase, writeDatabase } from '@/lib/server/database';
import { badRequest, notFound, unauthorized } from '@/lib/server/http';

export async function POST(request: NextRequest) {
  const database = await readDatabase();
  const user = getAuthenticatedUser(request, database.users);
  if (!user) return unauthorized();
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey) {
    return NextResponse.json({ error: 'payment_not_configured', message: 'Payment is not configured yet. Add PAYSTACK_SECRET_KEY to enable live payments.', statusCode: 503 }, { status: 503 });
  }
  const { applicationId, email } = await request.json() as { applicationId?: string; email?: string };
  const application = database.applications.find((candidate) => candidate.id === applicationId && candidate.userId === user.id);
  if (!application) return notFound('Application not found.');
  if (!email) return badRequest('An email address is required for payment.');
  if (application.paymentStatus === 'successful') return badRequest('This application has already been paid for.');
  const reference = `CEPAY-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const payment = {
    id: randomUUID(),
    transactionId: reference,
    userId: user.id,
    schoolId: application.schoolId,
    applicationId: application.id,
    amount: application.applicationFee,
    processingFee: application.processingFee,
    schoolCommissionDue: Math.round(application.applicationFee * 0.1),
    schoolCommissionStatus: 'not_due' as const,
    status: 'pending' as const,
    paymentMethod: 'card' as const,
    reference,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  database.payments.push(payment);
  application.transactionId = reference;
  application.updatedAt = payment.updatedAt;
  await writeDatabase(database);

  const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${paystackSecretKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amount: application.totalAmount * 100, reference, metadata: { applicationId: application.id, userId: user.id } }),
  });
  const result = await paystackResponse.json() as { status: boolean; message: string; data?: { authorization_url: string; access_code: string; reference: string } };
  if (!paystackResponse.ok || !result.status || !result.data) return NextResponse.json({ error: 'payment_initialization_failed', message: result.message || 'Unable to initialize payment.', statusCode: 502 }, { status: 502 });
  return NextResponse.json(result.data);
}
