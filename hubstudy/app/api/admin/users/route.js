import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

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
        u.created_at,
        COUNT(DISTINCT s.id) as subject_count,
        COUNT(DISTINCT t.id) as task_count,
        COUNT(DISTINCT e.id) as exam_count
      FROM users u
      LEFT JOIN subjects s ON s.user_id = u.id
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
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userRole = role || 'user';

    const info = db
      .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run(name, email, passwordHash, userRole);

    const newUser = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(info.lastInsertRowid);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.message.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}
