import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { getUserFromCookies } from '../../../../lib/auth';

const validateSubjectOwnership = (subjectId, userId) => {
  if (subjectId === undefined || subjectId === null || subjectId === '') {
    return null;
  }
  const parsedId = Number(subjectId);
  if (!Number.isInteger(parsedId)) {
    throw new Error('INVALID_SUBJECT');
  }
  const subject = db.prepare('SELECT id FROM subjects WHERE id = ? AND user_id = ?').get(parsedId, userId);
  if (!subject) {
    throw new Error('SUBJECT_NOT_FOUND');
  }
  return parsedId;
};

export async function PATCH(request, { params }) {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  try {
    const body = await request.json();
    let normalizedSubjectId = undefined;
    if (Object.prototype.hasOwnProperty.call(body, 'subjectId')) {
      try {
        normalizedSubjectId = validateSubjectOwnership(body.subjectId, user.id);
      } catch (validationError) {
        return NextResponse.json({ error: 'Matéria inválida ou não pertence ao usuário.' }, { status: 400 });
      }
    }
    db.prepare(
      'UPDATE exams SET title = COALESCE(?, title), subject_id = COALESCE(?, subject_id), exam_date = COALESCE(?, exam_date), weight = COALESCE(?, weight) WHERE id = ? AND user_id = ?'
    ).run(body.title, normalizedSubjectId, body.examDate, body.weight, id, user.id);
    const exam = db.prepare('SELECT * FROM exams WHERE id = ? AND user_id = ?').get(id, user.id);
    return NextResponse.json({ exam });
  } catch (error) {
    console.error('EXAM_UPDATE_ERROR', error);
    return NextResponse.json({ error: 'Erro ao atualizar prova.' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  db.prepare('DELETE FROM exams WHERE id = ? AND user_id = ?').run(id, user.id);
  return NextResponse.json({ ok: true });
}
