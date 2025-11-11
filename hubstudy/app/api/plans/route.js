import { NextResponse } from 'next/server';
import { getActivePlans } from '@/lib/plans';

export async function GET() {
  try {
    const plans = getActivePlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('API_PLANS_LIST_ERROR', error);
    return NextResponse.json({ error: 'Erro ao carregar planos.' }, { status: 500 });
  }
}
