'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/loader/Loader';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='wrapper'>
      <h1>Регистрация</h1>
      {error && <p className='error'>{error}</p>}
      <input
        placeholder="Имя"
        required
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
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
        {loading ? <Loader size={25} /> : 'Регистрация'}
      </button>

      <Link
        href="/"
        className={loading ? 'disabled-link' : ''}
        onClick={loading ? (e) => e.preventDefault() : undefined}
      >
        Войти в аккаунт
      </Link>
    </form>
  );
}
