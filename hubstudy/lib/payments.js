const buildBaseUrl = () => process.env.APP_URL ?? 'http://localhost:3000';

export async function createCheckoutSession(plan, user, metadata = {}) {
  const fakeId = `chk_${Date.now()}`;
  const checkoutUrl = `${buildBaseUrl()}/checkout?plan=${plan.id}&user=${user.id}&session=${fakeId}`;

  return {
    id: fakeId,
    provider: 'mock',
    checkoutUrl,
    amount: plan.price,
    currency: 'BRL',
    metadata: {
      planId: plan.id,
      userId: user.id,
      ...metadata,
    },
  };
}

export function verifyWebhookSignature(headers) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) return true;
  const signature = headers.get('x-hubstudy-signature');
  return signature === secret;
}

export function parseWebhookEvent(payload = {}) {
  return {
    providerRef: payload.providerRef ?? payload.id ?? null,
    subscriptionId: payload.subscriptionId ?? null,
    status: payload.status ?? 'active',
    planId: payload.planId ?? payload?.metadata?.planId ?? null,
    userId: payload.userId ?? payload?.metadata?.userId ?? null,
    expiresAt: payload.expiresAt ?? null,
    lastPaymentAt: payload.paidAt ?? payload.lastPaymentAt ?? null,
  };
}

const paymentsClient = {
  createCheckoutSession,
  verifyWebhookSignature,
  parseWebhookEvent,
};

export default paymentsClient;
