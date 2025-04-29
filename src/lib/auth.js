import jwt from 'jsonwebtoken';
import pool from './db';

export async function getUserFromCookie(cookieStore) {
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie) return null;

  try {
    const decoded = jwt.verify(sessionCookie.value, process.env.JWT_SECRET);
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    return rows[0];
  } catch (err) {
    return null;
  }
}
export function createSession(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
}
export function createTempSession(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '5m' });
  return token;
}
