import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { assignPlan, getPlanById } from '@/lib/plans';

export async function GET() {
  const admin = requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  try {
    const users = db.prepare(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.plan_id,
        u.plan_status,
        u.created_at,
        p.name AS plan_name,
        p.billing_cycle AS plan_billing_cycle,
        p.price AS plan_price,
        COUNT(DISTINCT subj.id) as subject_count,
        COUNT(DISTINCT t.id) as task_count,
        COUNT(DISTINCT e.id) as exam_count,
        (
          SELECT expires_at
          FROM subscriptions subs
          WHERE subs.user_id = u.id
          ORDER BY datetime(subs.started_at) DESC
          LIMIT 1
        ) AS subscription_expires_at
      FROM users u
      LEFT JOIN plans p ON p.id = u.plan_id
      LEFT JOIN subjects subj ON subj.user_id = u.id
      LEFT JOIN tasks t ON t.user_id = u.id
      LEFT JOIN exams e ON e.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  try {
    const { name, email, password, role, planId, planStatus } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userRole = role || 'user';

    const info = db
      .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run(name, email, passwordHash, userRole);

    const newUserId = info.lastInsertRowid;
    let plan = planId ? getPlanById(Number(planId)) : null;
    if (!plan) {
      plan =
        db.prepare("SELECT * FROM plans WHERE name = 'Free'").get() ??
        db.prepare('SELECT * FROM plans WHERE active = 1 ORDER BY price ASC LIMIT 1').get() ??
        null;
    }

    if (plan) {
      const desiredStatus = planStatus ?? (plan.billing_cycle === 'free' || plan.price === 0 ? 'active' : 'pending');
      try {
        assignPlan(newUserId, plan.id, desiredStatus);
      } catch (planError) {
        console.error('ADMIN_CREATE_ASSIGN_PLAN_ERROR', planError);
        return NextResponse.json({ error: 'Não foi possível vincular o plano escolhido.' }, { status: 500 });
      }
    }

    const newUser = db
      .prepare('SELECT id, name, email, role, plan_id, plan_status, created_at FROM users WHERE id = ?')
      .get(newUserId);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.message.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}
