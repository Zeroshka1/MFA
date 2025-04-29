import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import pool from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(req) {
  const { code } = await req.json();
  const cookieStore = await cookies();
  const tempSession = cookieStore.get('tempSession');

  if (!tempSession) {
    return new Response(JSON.stringify({ error: 'Нет временного сеанса' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(tempSession.value, process.env.JWT_SECRET || 'supersecret');
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = rows[0];
    if (!user || !user.mfa_secret) {
      return new Response(JSON.stringify({ error: 'MFA не настроен' }), { status: 401 });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token: code,
    });

    if (!verified) {
      return new Response(JSON.stringify({ error: 'Неверный код' }), { status: 401 });
    }

    const token = createSession(user);
    cookieStore.set('session', token, { httpOnly: true });
    cookieStore.delete('tempSession');

    return new Response(JSON.stringify({ message: 'MFA подтвержден' }), { status: 200 });
  } catch (err) {
    console.error('Ошибка при проверке MFA:', err);
    return new Response(JSON.stringify({ error: 'Недопустимый временный сеанс' }), { status: 401 });
  }
}
