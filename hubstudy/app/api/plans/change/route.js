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
      return NextResponse.json({ error: 'Informe um plano válido.' }, { status: 400 });
    }

    const plan = getPlanById(planId);
    if (!plan || plan.active === 0) {
      return NextResponse.json({ error: 'Plano não encontrado.' }, { status: 404 });
    }

    if (user.plan_id === plan.id && user.plan_status !== 'pending') {
      return NextResponse.json({ success: true, message: 'Plano já está aplicado.' });
    }

    const isPaidPlan = plan.billing_cycle !== 'free' && Number(plan.price) > 0;

    if (isPaidPlan) {
      const checkout = await createCheckoutSession(plan, user, { source: 'dashboard-change' });
      assignPlan(user.id, plan.id, 'pending', { provider_ref: checkout.id });
      return NextResponse.json({ redirectUrl: checkout.checkoutUrl, subscriptionStatus: 'pending' });
    }

    assignPlan(user.id, plan.id, 'active');
    return NextResponse.json({ success: true, subscriptionStatus: 'active' });
  } catch (error) {
    console.error('API_PLAN_CHANGE_ERROR', error);
    return NextResponse.json({ error: 'Não foi possível atualizar o plano.' }, { status: 500 });
  }
}
