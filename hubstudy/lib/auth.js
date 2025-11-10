import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from './db';

const AUTH_SECRET = (() => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is required to issue or validate tokens');
  }
  return secret;
})();
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
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(decoded.id);
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
