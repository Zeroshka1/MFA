import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { createSession, createTempSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user) {
    return new Response(JSON.stringify({ error: 'Неверные данные' }), { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Неверные данные' }), { status: 401 });
  }

  const cookieStore = await cookies();

  if (user.mfa_enabled) {
    const tempToken = createTempSession(user);
    cookieStore.set('tempSession', tempToken, { httpOnly: true });
    return new Response(JSON.stringify({ mfaRequired: true }), { status: 200 });
  }

  const token = createSession(user);
  cookieStore.set('session', token, { httpOnly: true });

  return new Response(JSON.stringify({ message: 'Вход выполнен' }), { status: 200 });
}
