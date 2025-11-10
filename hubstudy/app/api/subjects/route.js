import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { getUserFromCookies } from '../../../lib/auth';

export async function GET() {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const subjects = db.prepare('SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
  return NextResponse.json({ subjects });
}

export async function POST(request) {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  try {
    const { name, color, targetHours } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Informe o nome da matéria.' }, { status: 400 });
    }
    const stmt = db.prepare(
      'INSERT INTO subjects (user_id, name, color, target_hours) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(user.id, name.trim(), color ?? '#3D5AFE', targetHours ?? 4);
    const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ subject });
  } catch (error) {
    console.error('SUBJECT_CREATE_ERROR', error);
    return NextResponse.json({ error: 'Erro ao salvar matéria.' }, { status: 500 });
  }
}
