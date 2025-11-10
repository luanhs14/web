import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { getUserFromCookies } from '../../../lib/auth';

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

export async function GET() {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const exams = db
    .prepare(
      `SELECT exams.*, subjects.name as subject_name, subjects.color as subject_color
       FROM exams
       LEFT JOIN subjects ON subjects.id = exams.subject_id AND subjects.user_id = exams.user_id
       WHERE exams.user_id = ?
       ORDER BY datetime(exam_date) ASC`
    )
    .all(user.id);
  return NextResponse.json({ exams });
}

export async function POST(request) {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  try {
    const { title, examDate, subjectId, weight } = await request.json();
    if (!title || !examDate) {
      return NextResponse.json({ error: 'Informe título e data da prova.' }, { status: 400 });
    }
    let normalizedSubjectId = null;
    try {
      normalizedSubjectId = validateSubjectOwnership(subjectId, user.id);
    } catch (validationError) {
      return NextResponse.json({ error: 'Matéria inválida ou não pertence ao usuário.' }, { status: 400 });
    }
    const stmt = db.prepare('INSERT INTO exams (user_id, subject_id, title, exam_date, weight) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(user.id, normalizedSubjectId, title.trim(), examDate, weight ?? 1);
    const exam = db.prepare('SELECT * FROM exams WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ exam });
  } catch (error) {
    console.error('EXAM_CREATE_ERROR', error);
    return NextResponse.json({ error: 'Erro ao salvar prova.' }, { status: 500 });
  }
}
