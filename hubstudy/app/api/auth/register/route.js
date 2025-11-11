import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db, { ensureUserGoalColumn } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import { assignPlan, getPlanById } from '@/lib/plans';

const sanitize = (value) => value?.toString().trim() ?? '';

export async function POST(request) {
  try {
    const body = await request.json();
    const name = sanitize(body.name);
    const email = sanitize(body.email).toLowerCase();
    const password = sanitize(body.password);
    const goal = sanitize(body.goal);
    const requestedPlanId = body.planId ?? body.plan_id ?? null;

    if (!name || !email || !password || !goal) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
    }

    const passwordHasLetter = /[A-Za-z]/.test(password);
    const passwordHasNumber = /\d/.test(password);
    if (password.length < 8 || !passwordHasLetter || !passwordHasNumber) {
      return NextResponse.json(
        { error: 'Senha deve ter ao menos 8 caracteres, com letras e números.' },
        { status: 400 }
      );
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    ensureUserGoalColumn();
    const insertUser = () =>
      db.prepare('INSERT INTO users (name, email, password, role, goal) VALUES (?, ?, ?, ?, ?)').run(
        name,
        email,
        hash,
        'user',
        goal
      );

    let result;
    try {
      result = insertUser();
    } catch (error) {
      if (error.message.includes('no column named goal')) {
        ensureUserGoalColumn();
        result = insertUser();
      } else {
        throw error;
      }
    }
    const user = { id: result.lastInsertRowid, name, email, role: 'user', goal };

    const planCandidateId = requestedPlanId ? Number(requestedPlanId) : null;
    let plan = planCandidateId ? getPlanById(planCandidateId) : null;
    if (!plan || plan.active === 0) {
      plan = db.prepare('SELECT * FROM plans WHERE active = 1 ORDER BY price ASC LIMIT 1').get();
    }

    if (!plan) {
      return NextResponse.json({ error: 'Plano indisponível.' }, { status: 400 });
    }

    const planStatus = plan.billing_cycle === 'free' || plan.price === 0 ? 'active' : 'pending';
    try {
      assignPlan(user.id, plan.id, planStatus);
    } catch (planError) {
      console.error('REGISTER_ASSIGN_PLAN_ERROR', planError);
      return NextResponse.json({ error: 'Falha ao vincular plano ao usuário.' }, { status: 500 });
    }

    const token = signToken(user);
    setAuthCookie(token);

    return NextResponse.json({
      user: { ...user, plan_id: plan.id, plan_status: planStatus },
      plan: { id: plan.id, name: plan.name, billing_cycle: plan.billing_cycle, price: plan.price, status: planStatus },
      requiresPayment: planStatus === 'pending',
    });
  } catch (error) {
    console.error('REGISTER_ERROR', error);
    return NextResponse.json({ error: 'Erro ao cadastrar.' }, { status: 500 });
  }
}
