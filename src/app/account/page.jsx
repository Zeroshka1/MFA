'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader/Loader';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [qr, setQr] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const res = await fetch('/api/account');
    const data = await res.json();
    if (data.error) return router.push('/');
    setUser(data);
    setLoading(false);
  }

  async function enableMfa() {
    if (mfaLoading) return;
    setMfaLoading(true);
    const res = await fetch('/api/account/enable-mfa', { method: 'POST' });
    const data = await res.json();
    setQr(data.qr);
    setSecret(data.secret);
    await fetchUser();
    setMfaLoading(false);
  }

  async function disableMfa() {
    if (mfaLoading) return;
    setMfaLoading(true);
    await fetch('/api/account/disable-mfa', { method: 'POST' });
    await fetchUser();
    setMfaLoading(false);
  }

  async function logout() {
    setLogoutLoading(true);
    await fetch('/api/logout');
    router.push('/');
  }

  if (loading) return <Loader size={25} />;

  return (
    <div className='wrapper account'>
      <h1>Аккаунт</h1>
      <h1>{user.name}</h1>
      <h1>
        MFA {mfaLoading ? <Loader size={25} /> : user.mfa_enabled ? '✅' : '❌'}

      </h1>

      {user.mfa_enabled ? (
        <button
          onClick={disableMfa}
          disabled={mfaLoading}
          className={mfaLoading ? 'lock' : ''}
        >
          {mfaLoading ? <Loader size={20} /> : 'Отключить MFA'}
        </button>
      ) : (
        <button
          onClick={enableMfa}
          disabled={mfaLoading}
          className={mfaLoading ? 'lock' : ''}
        >
          {mfaLoading ? <Loader size={20} /> : 'Включить MFA'}
        </button>
      )}

      {qr && (
        <div className='qrKeyBlock'>
          <p className='error'>⚠️ Сохраните этот код! После перезагрузки он исчезнет.</p>
          <p>Секретный Код: {secret}</p>
          <img src={qr} alt="QR Code" className='qr' />
        </div>
      )}

      <button
        onClick={logout}
        disabled={logoutLoading || mfaLoading}
        className={(logoutLoading || mfaLoading) ? 'lock' : ''}
      >
        Выйти
      </button>
    </div>
  );
}
