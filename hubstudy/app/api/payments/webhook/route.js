import { NextResponse } from 'next/server';
import { markSubscriptionStatus } from '@/lib/plans';
import { parseWebhookEvent, verifyWebhookSignature } from '@/lib/payments';

export async function POST(request) {
  if (!verifyWebhookSignature(request.headers)) {
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const event = parseWebhookEvent(payload);

    if (!event.providerRef && !event.subscriptionId) {
      return NextResponse.json({ error: 'Evento inválido.' }, { status: 400 });
    }

    const subscriptionId = markSubscriptionStatus({
      providerRef: event.providerRef,
      subscriptionId: event.subscriptionId,
      status: event.status,
      expiresAt: event.expiresAt,
      lastPaymentAt: event.lastPaymentAt,
    });

    return NextResponse.json({ ok: true, subscriptionId });
  } catch (error) {
    console.error('PAYMENTS_WEBHOOK_ERROR', error);
    return NextResponse.json({ error: 'Erro ao processar webhook.' }, { status: 500 });
  }
}
