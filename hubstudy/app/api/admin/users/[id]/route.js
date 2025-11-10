import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const admin = requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Construir query dinâmica baseada nos campos fornecidos
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }

    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }

    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }

    if (password !== undefined && password.trim() !== '') {
      const passwordHash = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(passwordHash);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 });
    }

    values.push(id);

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const updatedUser = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(id);

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    if (error.message.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  const { id } = params;

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Não permitir deletar o próprio usuário admin
    if (user.id === admin.id) {
      return NextResponse.json({ error: 'Você não pode deletar sua própria conta' }, { status: 400 });
    }

    // Não permitir deletar outros admins
    if (user.role === 'admin') {
      return NextResponse.json({ error: 'Não é possível deletar outro administrador' }, { status: 400 });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 });
  }
}
