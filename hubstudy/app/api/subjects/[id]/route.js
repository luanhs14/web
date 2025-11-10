import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { getUserFromCookies } from '../../../../lib/auth';

export async function PATCH(request, { params }) {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });

  try {
    const body = await request.json();
    db.prepare(
      'UPDATE subjects SET name = COALESCE(?, name), color = COALESCE(?, color), target_hours = COALESCE(?, target_hours) WHERE id = ? AND user_id = ?'
    ).run(body.name, body.color, body.targetHours, id, user.id);
    const subject = db.prepare('SELECT * FROM subjects WHERE id = ? AND user_id = ?').get(id, user.id);
    return NextResponse.json({ subject });
  } catch (error) {
    console.error('SUBJECT_UPDATE_ERROR', error);
    return NextResponse.json({ error: 'Erro ao atualizar matéria.' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });

  db.prepare('DELETE FROM subjects WHERE id = ? AND user_id = ?').run(id, user.id);
  return NextResponse.json({ ok: true });
}
