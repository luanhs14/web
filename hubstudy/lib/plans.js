import db from './db';

export const PLAN_STATUSES = ['trial', 'pending', 'active', 'canceled', 'expired', 'free'];

const normalizeStatus = (status) => {
  if (!status) return 'active';
  return PLAN_STATUSES.includes(status) ? status : 'active';
};

export const getActivePlans = () => {
  return db
    .prepare('SELECT * FROM plans WHERE active = 1 ORDER BY price ASC, id ASC')
    .all()
    .map((plan) => ({
      ...plan,
      features: safeParseFeatures(plan.features_json),
    }));
};

export const getPlanById = (planId) => {
  if (!planId) return null;
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId);
  if (!plan) return null;
  return {
    ...plan,
    features: safeParseFeatures(plan.features_json),
  };
};

export const getPlansWithUsage = () => {
  const rows = db
    .prepare(
      `SELECT p.*, COUNT(u.id) AS user_count
       FROM plans p
       LEFT JOIN users u ON u.plan_id = p.id
       GROUP BY p.id
       ORDER BY p.price ASC`
    )
    .all();

  return rows.map((plan) => ({
    ...plan,
    features: safeParseFeatures(plan.features_json),
    user_count: Number(plan.user_count ?? 0),
  }));
};

export const getUserPlan = (userId) => {
  if (!userId) return null;
  return db
    .prepare(
      `SELECT u.plan_status, u.plan_id, p.name, p.price, p.billing_cycle, s.expires_at, s.status as subscription_status
       FROM users u
       LEFT JOIN plans p ON p.id = u.plan_id
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
       WHERE u.id = ?
       ORDER BY s.started_at DESC
       LIMIT 1`
    )
    .get(userId);
};

export const getUserActiveSubscription = (userId) => {
  if (!userId) return null;
  return db
    .prepare(
      `SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY started_at DESC LIMIT 1`
    )
    .get(userId);
};

const closePreviousSubscriptions = (userId) => {
  db.prepare(
    "UPDATE subscriptions SET status = CASE WHEN status = 'active' THEN 'expired' ELSE 'canceled' END WHERE user_id = ? AND status IN ('active', 'pending')"
  ).run(userId);
};

const safeParseFeatures = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const assignPlan = (userId, planId, status = 'active', metadata = {}) => {
  const normalizedStatus = normalizeStatus(status);
  const run = db.transaction(() => {
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId);
    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    closePreviousSubscriptions(userId);

    db.prepare('UPDATE users SET plan_id = ?, plan_status = ? WHERE id = ?').run(planId, normalizedStatus, userId);

    const now = new Date().toISOString();
    const startedAt = metadata.started_at ?? now;
    const expiresAt = metadata.expires_at ?? null;
    const lastPaymentAt = metadata.last_payment_at ?? null;
    const providerRef = metadata.provider_ref ?? null;

    const result = db
      .prepare(
        `INSERT INTO subscriptions (user_id, plan_id, status, started_at, expires_at, last_payment_at, provider_ref)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(userId, planId, normalizedStatus, startedAt, expiresAt, lastPaymentAt, providerRef);

    return { plan, subscriptionId: result.lastInsertRowid, status: normalizedStatus };
  });

  return run();
};

export const markSubscriptionStatus = ({ subscriptionId, providerRef, status, expiresAt, lastPaymentAt }) => {
  const normalizedStatus = normalizeStatus(status);
  const fields = [];
  const values = [];

  if (expiresAt !== undefined) {
    fields.push('expires_at = ?');
    values.push(expiresAt);
  }

  if (lastPaymentAt !== undefined) {
    fields.push('last_payment_at = ?');
    values.push(lastPaymentAt);
  }

  fields.push('status = ?');
  values.push(normalizedStatus);

  if (subscriptionId) {
    values.push(subscriptionId);
    db.prepare(`UPDATE subscriptions SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    const subscription = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(subscriptionId);
    if (subscription) {
      db.prepare('UPDATE users SET plan_status = ? WHERE id = ?').run(normalizedStatus, subscription.user_id);
    }
    return subscriptionId;
  }

  if (providerRef) {
    values.push(providerRef);
    db.prepare(`UPDATE subscriptions SET ${fields.join(', ')} WHERE provider_ref = ?`).run(...values);
    const subscription = db.prepare('SELECT * FROM subscriptions WHERE provider_ref = ?').get(providerRef);
    if (subscription) {
      db.prepare('UPDATE users SET plan_status = ? WHERE id = ?').run(normalizedStatus, subscription.user_id);
    }
    return subscription?.id ?? null;
  }

  throw new Error('subscriptionId ou providerRef são obrigatórios para atualizar status.');
};

export const createOrUpdateSubscription = ({ userId, planId, status, metadata = {} }) => {
  if (!userId || !planId) {
    throw new Error('userId e planId são obrigatórios.');
  }
  return assignPlan(userId, planId, status, metadata);
};

export const countUsersByPlan = () => {
  return db
    .prepare(
      `SELECT p.id, p.name, COUNT(u.id) AS total
       FROM plans p
       LEFT JOIN users u ON u.plan_id = p.id
       GROUP BY p.id`
    )
    .all();
};

const planService = {
  assignPlan,
  getActivePlans,
  getPlanById,
  getPlansWithUsage,
  getUserPlan,
  markSubscriptionStatus,
  getUserActiveSubscription,
};

export default planService;
