import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const parseFeatures = (input) => {
  if (!input) return null;
  if (Array.isArray(input)) return input.filter(Boolean);
  return input
    .toString()
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
};

export async function PATCH(request, { params }) {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  const { id } = params;

  try {
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(id);
    if (!plan) {
      return NextResponse.json({ error: 'Plano não encontrado.' }, { status: 404 });
    }

    const body = await request.json();
    const updates = [];
    const values = [];

    if (body.name !== undefined) {
      updates.push('name = ?');
      values.push(body.name.toString().trim());
    }

    if (body.price !== undefined) {
      updates.push('price = ?');
      values.push(Number(body.price));
    }

    if (body.billing_cycle !== undefined || body.billingCycle !== undefined) {
      updates.push('billing_cycle = ?');
      values.push((body.billing_cycle ?? body.billingCycle).toString());
    }

    if (body.features !== undefined || body.features_json !== undefined) {
      updates.push('features_json = ?');
      values.push(JSON.stringify(parseFeatures(body.features ?? body.features_json) ?? []));
    }

    if (body.active !== undefined) {
      updates.push('active = ?');
      values.push(body.active ? 1 : 0);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar.' }, { status: 400 });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    values.push(id);
    db.prepare(`UPDATE plans SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    const updatedPlan = db.prepare('SELECT * FROM plans WHERE id = ?').get(id);

    return NextResponse.json({ plan: updatedPlan });
  } catch (error) {
    console.error('ADMIN_PLANS_UPDATE_ERROR', error);
    return NextResponse.json({ error: 'Erro ao atualizar plano.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  const { id } = params;

  try {
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(id);
    if (!plan) {
      return NextResponse.json({ error: 'Plano não encontrado.' }, { status: 404 });
    }

    db.prepare('UPDATE plans SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ADMIN_PLANS_DELETE_ERROR', error);
    return NextResponse.json({ error: 'Erro ao excluir plano.' }, { status: 500 });
  }
}
