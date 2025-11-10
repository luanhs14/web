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
  const tasks = db
    .prepare(
      `SELECT tasks.*, subjects.name as subject_name, subjects.color as subject_color
       FROM tasks
       LEFT JOIN subjects ON subjects.id = tasks.subject_id AND subjects.user_id = tasks.user_id
       WHERE tasks.user_id = ?
       ORDER BY datetime(due_date) ASC`
    )
    .all(user.id);
  return NextResponse.json({ tasks });
}

export async function POST(request) {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  try {
    const { title, subjectId, dueDate, status } = await request.json();
    if (!title || !dueDate) {
      return NextResponse.json({ error: 'Informe título e data.' }, { status: 400 });
    }
    let normalizedSubjectId = null;
    try {
      normalizedSubjectId = validateSubjectOwnership(subjectId, user.id);
    } catch (validationError) {
      return NextResponse.json({ error: 'Matéria inválida ou não pertence ao usuário.' }, { status: 400 });
    }
    const stmt = db.prepare('INSERT INTO tasks (user_id, subject_id, title, due_date, status) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(user.id, normalizedSubjectId, title.trim(), dueDate, status ?? 'pending');
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ task });
  } catch (error) {
    console.error('TASK_CREATE_ERROR', error);
    return NextResponse.json({ error: 'Erro ao salvar tarefa.' }, { status: 500 });
  }
}
