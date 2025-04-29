import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { getUserFromCookie } from '@/lib/auth';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const user = await getUserFromCookie(cookieStore);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const secret = speakeasy.generateSecret({ name: `MFA (${user.email})` });

  await pool.query('UPDATE users SET mfa_secret = $1, mfa_enabled = true WHERE id = $2', [
    secret.base32,
    user.id,
  ]);

  const qr = await qrcode.toDataURL(secret.otpauth_url);

  return new Response(JSON.stringify({ qr, secret: secret.base32 }), { status: 200 });
}
