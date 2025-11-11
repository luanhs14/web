import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../../../lib/db';
import { signToken, setAuthCookie } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.toString().toLowerCase().trim();
    const password = body.password?.toString() ?? '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Informe e-mail e senha.' }, { status: 400 });
    }

    const user = db
      .prepare('SELECT id, name, email, password, role, plan_id, plan_status FROM users WHERE email = ?')
      .get(email);
    if (!user) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    }

    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });
    setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan_id: user.plan_id,
        plan_status: user.plan_status,
      },
    });
  } catch (error) {
    console.error('LOGIN_ERROR', error);
    return NextResponse.json({ error: 'Erro ao entrar.' }, { status: 500 });
  }
}
