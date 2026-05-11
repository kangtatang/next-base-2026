'use client';

import { login } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div style={{
        background: 'var(--surface)',
        padding: '3rem',
        borderRadius: 'var(--radius-max)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Login System</h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Masuk ke akun administrator Anda</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              name="email"
              type="email"
              required
              defaultValue="admin@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input 
              name="password"
              type="password"
              required
              defaultValue="password123"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn"
            style={{
              background: 'var(--primary)',
              color: 'white',
              fontWeight: 600,
              padding: '0.75rem',
              marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Memproses...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
