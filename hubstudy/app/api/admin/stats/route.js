import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalSubjects = db.prepare('SELECT COUNT(*) as count FROM subjects').get().count;
    const totalTasks = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
    const totalExams = db.prepare('SELECT COUNT(*) as count FROM exams').get().count;

    const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin').count;
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('user').count;

    const recentUsers = db.prepare(`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    return NextResponse.json({
      stats: {
        totalUsers,
        totalSubjects,
        totalTasks,
        totalExams,
        adminCount,
        userCount,
      },
      recentUsers,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
