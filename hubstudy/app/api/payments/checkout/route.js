import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import { assignPlan, getPlanById } from '@/lib/plans';
import { createCheckoutSession } from '@/lib/payments';

export async function POST(request) {
  const user = getUserFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const planId = Number(body.planId ?? body.plan_id);
    if (!planId) {
      return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 });
    }

    const plan = getPlanById(planId);
    if (!plan || plan.billing_cycle === 'free' || Number(plan.price) === 0) {
      return NextResponse.json({ error: 'Plano selecionado não requer checkout.' }, { status: 400 });
    }

    const checkout = await createCheckoutSession(plan, user, { source: 'checkout-endpoint' });
    assignPlan(user.id, plan.id, 'pending', { provider_ref: checkout.id });

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl, providerRef: checkout.id });
  } catch (error) {
    console.error('PAYMENTS_CHECKOUT_ERROR', error);
    return NextResponse.json({ error: 'Erro ao iniciar checkout.' }, { status: 500 });
  }
}
