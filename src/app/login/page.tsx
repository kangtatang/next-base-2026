'use client';

import { login } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <div style={{ position: 'relative', display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#0b0f19' }}>
      {/* Animated Background Gradients using Framer Motion */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.6, 0.9, 0.6],
          x: [0, 80, 0],
          y: [0, -80, 0]
        }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(11,15,25,0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <motion.div 
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.5, 0.8, 0.5],
          x: [0, -90, 0],
          y: [0, 90, 0]
        }}
        transition={{ duration: 15, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '70vw',
          height: '70vw',
          background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(11,15,25,0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      
      {/* Login Card Entrance Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '3rem',
          borderRadius: 'var(--radius-max)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 700 }}>Welcome Back</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', opacity: 0.7 }}>Sign in to continue to Dashboard</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--foreground)' }}>Email Address</label>
            <input 
              name="email"
              type="email"
              required
              defaultValue="admin@example.com"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: 'var(--foreground)',
                outline: 'none',
                transition: 'border 0.2s ease',
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--primary)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--foreground)' }}>Password</label>
            <input 
              name="password"
              type="password"
              required
              defaultValue="password123"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: 'var(--foreground)',
                outline: 'none',
                transition: 'border 0.2s ease',
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--primary)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #2563eb 100%)',
              color: 'white',
              fontWeight: 600,
              padding: '0.85rem',
              marginTop: '1rem',
              opacity: loading ? 0.7 : 1,
              border: 'none',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
