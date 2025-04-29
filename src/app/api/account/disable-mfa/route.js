import { getUserFromCookie } from '@/lib/auth';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const user = await getUserFromCookie(cookieStore);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  await pool.query('UPDATE users SET mfa_secret = NULL, mfa_enabled = false WHERE id = $1', [
    user.id,
  ]);

  return new Response(JSON.stringify({ message: 'MFA disabled' }), { status: 200 });
}
