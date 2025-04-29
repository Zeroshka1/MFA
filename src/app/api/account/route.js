import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromCookie } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const user = await getUserFromCookie(cookieStore);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    name: user.name,
    mfa_enabled: user.mfa_enabled,
  });
}
