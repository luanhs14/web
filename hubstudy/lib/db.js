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

const ensurePlanColumns = () => {
  const tableInfo = db.prepare('PRAGMA table_info(users)').all();
  const hasPlanIdColumn = tableInfo.some((col) => col.name === 'plan_id');
  if (!hasPlanIdColumn) {
    db.prepare('ALTER TABLE users ADD COLUMN plan_id INTEGER').run();
  }

  const hasPlanStatusColumn = tableInfo.some((col) => col.name === 'plan_status');
  if (!hasPlanStatusColumn) {
    db.prepare("ALTER TABLE users ADD COLUMN plan_status TEXT DEFAULT 'trial'").run();
  }
};

const ensurePlansTable = () => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      price REAL DEFAULT 0,
      billing_cycle TEXT NOT NULL,
      features_json TEXT DEFAULT '[]',
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
};

const ensureSubscriptionsTable = () => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      started_at TEXT DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT,
      last_payment_at TEXT,
      provider_ref TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
    )`
  ).run();
};

const seedPlans = () => {
  const plansCount = db.prepare('SELECT COUNT(*) as total FROM plans').get().total;
  if (plansCount === 0) {
    const defaultPlans = [
      {
        name: 'Free',
        price: 0,
        billing_cycle: 'free',
        features: ['Planner básico', '1 quadro de metas', 'Suporte via email'],
        active: 1,
      },
      {
        name: 'Pro Mensal',
        price: 29.9,
        billing_cycle: 'monthly',
        features: ['Dashboard avançado', 'Rotinas ilimitadas', 'Relatórios semanais'],
        active: 1,
      },
      {
        name: 'Pro Anual',
        price: 299,
        billing_cycle: 'yearly',
        features: ['Tudo do Pro Mensal', 'Consultoria trimestral', '20% OFF no plano anual'],
        active: 1,
      },
    ];

    const insertPlan = db.prepare(
      'INSERT INTO plans (name, price, billing_cycle, features_json, active) VALUES (?, ?, ?, ?, ?)'
    );
    defaultPlans.forEach((plan) => {
      insertPlan.run(plan.name, plan.price, plan.billing_cycle, JSON.stringify(plan.features), plan.active);
    });
  }

  const freePlan = db.prepare("SELECT id FROM plans WHERE name = 'Free'").get();
  if (freePlan) {
    db.prepare("UPDATE users SET plan_id = COALESCE(plan_id, ?), plan_status = COALESCE(plan_status, 'free')").run(
      freePlan.id
    );
    db.prepare("UPDATE users SET plan_status = 'free' WHERE plan_status IS NULL OR plan_status = ''").run();
    db.prepare(
      `INSERT INTO subscriptions (user_id, plan_id, status, started_at)
       SELECT u.id, ?, 'active', CURRENT_TIMESTAMP
       FROM users u
       WHERE NOT EXISTS (
         SELECT 1 FROM subscriptions s WHERE s.user_id = u.id
       )`
    ).run(freePlan.id);
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
      plan_id INTEGER,
      plan_status TEXT DEFAULT 'trial',
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
  ensurePlanColumns();
  ensurePlansTable();
  ensureSubscriptionsTable();
  seedPlans();

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
    const freePlan = db.prepare("SELECT id FROM plans WHERE name = 'Free'").get();
    if (freePlan) {
      db.prepare('UPDATE users SET plan_id = ?, plan_status = ? WHERE id = ?').run(freePlan.id, 'active', userId);
      db.prepare(
        `INSERT INTO subscriptions (user_id, plan_id, status, started_at) VALUES (?, ?, 'active', ?)`
      ).run(userId, freePlan.id, new Date().toISOString());
    }
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
