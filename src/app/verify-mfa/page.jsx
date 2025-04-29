'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader/Loader';

export default function VerifyMFA() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleVerify(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    const res = await fetch('/api/verify-mfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/account');
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  return (
    <form onSubmit={handleVerify} className='wrapper'>
      <h1>Введите MFA код</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        placeholder="MFA код"
        required
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit" disabled={loading} className={loading ? 'lock' : ''}>
        {loading ? <Loader size={25} /> : 'Подтвердить'}
      </button>
    </form>
  );
}
