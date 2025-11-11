import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromCookies } from '@/lib/auth';
import { getUserPlan } from '@/lib/plans';

export async function GET() {
  const user = getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const now = new Date();
  const todayISO = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAheadISO = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString();

  const subjects = db.prepare('SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
  const tasks = db
    .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY datetime(due_date) ASC LIMIT 20')
    .all(user.id);
  const exams = db.prepare('SELECT * FROM exams WHERE user_id = ? ORDER BY datetime(exam_date) ASC LIMIT 20').all(user.id);

  const pendingTasks = db
    .prepare('SELECT COUNT(*) as total FROM tasks WHERE user_id = ? AND status != ?')
    .get(user.id, 'done').total;
  const upcomingWeek = db
    .prepare('SELECT COUNT(*) as total FROM exams WHERE user_id = ? AND exam_date >= ? AND exam_date <= ?')
    .get(user.id, todayISO, weekAheadISO).total;

  const plan = getUserPlan(user.id);

  return NextResponse.json({
    subjects,
    tasks,
    exams,
    metrics: {
      totalSubjects: subjects.length,
      pendingTasks,
      upcomingExams: upcomingWeek,
    },
    plan,
  });
}
