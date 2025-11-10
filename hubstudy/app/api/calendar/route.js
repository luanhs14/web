import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { getUserFromCookies } from '../../../lib/auth';

const normalizeDate = (value) => new Date(value).toISOString().split('T')[0];

export async function GET() {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const tasks = db.prepare('SELECT id, title, due_date as date, status FROM tasks WHERE user_id = ?').all(user.id);
  const exams = db.prepare('SELECT id, title, exam_date as date, weight FROM exams WHERE user_id = ?').all(user.id);

  const calendar = {};
  tasks.forEach((task) => {
    const day = normalizeDate(task.date);
    if (!calendar[day]) calendar[day] = { tasks: [], exams: [] };
    calendar[day].tasks.push(task);
  });
  exams.forEach((exam) => {
    const day = normalizeDate(exam.date);
    if (!calendar[day]) calendar[day] = { tasks: [], exams: [] };
    calendar[day].exams.push(exam);
  });

  return NextResponse.json({ calendar });
}
