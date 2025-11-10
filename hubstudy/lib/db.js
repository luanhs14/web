import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'hubstudy.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const ensureGoalColumn = () => {
  const tableInfo = db.prepare('PRAGMA table_info(users)').all();
  const hasGoalColumn = tableInfo.some((col) => col.name === 'goal');
  if (!hasGoalColumn) {
    db.prepare('ALTER TABLE users ADD COLUMN goal TEXT').run();
  }
};

const bootstrap = () => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      goal TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();

  // Migrações simples
  const tableInfo = db.prepare('PRAGMA table_info(users)').all();
  const hasRoleColumn = tableInfo.some((col) => col.name === 'role');
  if (!hasRoleColumn) {
    db.prepare("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'").run();
  }
  ensureGoalColumn();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#3D5AFE',
      target_hours INTEGER DEFAULT 4,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      subject_id INTEGER,
      title TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      weight INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      subject_id INTEGER,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
    )`
  ).run();

  const userCount = db.prepare('SELECT COUNT(*) as total FROM users').get().total;
  if (userCount === 0) {
    const passwordHash = bcrypt.hashSync('hubstudy', 10);
    const info = db
      .prepare('INSERT INTO users (name, email, password, role, goal) VALUES (?, ?, ?, ?, ?)')
      .run('Demo Hubber', 'demo@hubstudy.com', passwordHash, 'user', 'Criar rotina demo');

    const userId = info.lastInsertRowid;
    const subjectStmt = db.prepare('INSERT INTO subjects (user_id, name, color, target_hours) VALUES (?, ?, ?, ?)');
    const math = subjectStmt.run(userId, 'Matemática', '#3D5AFE', 6).lastInsertRowid;
    const reda = subjectStmt.run(userId, 'Redação', '#FF5ED6', 4).lastInsertRowid;

    db.prepare('INSERT INTO tasks (user_id, subject_id, title, due_date, status) VALUES (?, ?, ?, ?, ?)').run(
      userId,
      math,
      'Lista de funções',
      new Date().toISOString(),
      'pending'
    );
    db.prepare('INSERT INTO tasks (user_id, subject_id, title, due_date, status) VALUES (?, ?, ?, ?, ?)').run(
      userId,
      reda,
      'Revisar estrutura da redação',
      new Date(Date.now() + 86400000).toISOString(),
      'pending'
    );
    db.prepare('INSERT INTO exams (user_id, subject_id, title, exam_date, weight) VALUES (?, ?, ?, ?, ?)').run(
      userId,
      math,
      'Simulado ENEM',
      new Date(Date.now() + 2 * 86400000).toISOString(),
      2
    );
  }

  // Opcional: criar admin a partir de variáveis de ambiente
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const adminName = process.env.ADMIN_NAME ?? 'Administrador';
    const adminExists = db.prepare('SELECT id, role FROM users WHERE email = ?').get(adminEmail);
    if (!adminExists) {
      const adminPasswordHash = bcrypt.hashSync(adminPassword, 10);
      db.prepare('INSERT INTO users (name, email, password, role, goal) VALUES (?, ?, ?, ?, ?)')
        .run(adminName, adminEmail, adminPasswordHash, 'admin', 'Admin seed');
    } else if (adminExists.role !== 'admin') {
      db.prepare('UPDATE users SET role = ?, name = ? WHERE id = ?').run('admin', adminName, adminExists.id);
    }
  }
};

bootstrap();

export const ensureUserGoalColumn = () => {
  ensureGoalColumn();
};

export default db;
