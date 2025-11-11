import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from './db';
import { getAuthSecret } from './auth-secret';

const AUTH_SECRET = getAuthSecret();
const TOKEN_NAME = 'hubstudy_token';

export function signToken(payload) {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, AUTH_SECRET);
  } catch {
    return null;
  }
}

export function setAuthCookie(token) {
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  cookies().set(TOKEN_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export function getUserFromCookies() {
  const token = cookies().get(TOKEN_NAME)?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  const user = db
    .prepare(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.goal,
        u.plan_id,
        u.plan_status,
        u.created_at,
        p.name AS plan_name,
        p.price AS plan_price,
        p.billing_cycle AS plan_billing_cycle
      FROM users u
      LEFT JOIN plans p ON p.id = u.plan_id
      WHERE u.id = ?`
    )
    .get(decoded.id);
  return user ?? null;
}

export function isAdmin(user) {
  return user && user.role === 'admin';
}

export function requireAdmin() {
  const user = getUserFromCookies();
  if (!user || !isAdmin(user)) {
    return null;
  }
  return user;
}
