import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db, { ensureUserGoalColumn } from '../../../../lib/db';
import { signToken, setAuthCookie } from '../../../../lib/auth';

const sanitize = (value) => value?.toString().trim() ?? '';

export async function POST(request) {
  try {
    const body = await request.json();
    const name = sanitize(body.name);
    const email = sanitize(body.email).toLowerCase();
    const password = sanitize(body.password);
    const goal = sanitize(body.goal);

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
    const token = signToken(user);
    setAuthCookie(token);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('REGISTER_ERROR', error);
    return NextResponse.json({ error: 'Erro ao cadastrar.' }, { status: 500 });
  }
}
