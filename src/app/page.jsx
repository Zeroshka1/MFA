'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/loader/Loader';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.mfaRequired) {
      router.push('/verify-mfa');
    } else if (res.ok) {
      router.push('/account');
    } else {
      setError(data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='wrapper'>
      <h1>Вход</h1>
      {error && <p className='error'>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Пароль"
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" disabled={loading} className={loading ? 'lock' : ''}>
        {loading ? <Loader size={25} /> : 'Вход'}
      </button>
      <Link
        href="/register"
        className={loading ? 'disabled-link' : ''}
        onClick={loading ? (e) => e.preventDefault() : undefined}
      >
        Создать аккаунт
      </Link>
    </form>
  );
}
