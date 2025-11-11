import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { getPlansWithUsage } from '@/lib/plans';

export async function GET() {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  try {
    const plans = getPlansWithUsage();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('ADMIN_PLANS_LIST_ERROR', error);
    return NextResponse.json({ error: 'Erro ao listar planos.' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const name = body.name?.toString().trim();
    const billingCycle = body.billing_cycle ?? body.billingCycle;
    const price = Number(body.price ?? 0);
    const active = body.active === false ? 0 : 1;
    const features = Array.isArray(body.features)
      ? body.features
      : (body.features ?? body.features_json ?? '')
          .toString()
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);

    if (!name || !billingCycle) {
      return NextResponse.json({ error: 'Nome e ciclo de cobrança são obrigatórios.' }, { status: 400 });
    }

    const stmt = db.prepare(
      `INSERT INTO plans (name, price, billing_cycle, features_json, active)
       VALUES (?, ?, ?, ?, ?)`
    );

    const result = stmt.run(name, price, billingCycle, JSON.stringify(features), active);
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('ADMIN_PLANS_CREATE_ERROR', error);
    if (error.message.includes('UNIQUE')) {
      return NextResponse.json({ error: 'Já existe um plano com este nome.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao criar plano.' }, { status: 500 });
  }
}
