"use client";

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { updateProfileAction } from '@/actions/profile.actions';

interface RoleData {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  roles: RoleData[];
}

export default function ProfileClient({ user }: { user: UserData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    
    const res = await updateProfileAction(fd);
    setIsSubmitting(false);

    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Profil berhasil diperbarui', { variant: 'success' });
      const passwordField = (e.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;
      if (passwordField) passwordField.value = '';
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    outline: 'none',
    fontSize: '0.95rem'
  };

  return (
    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', maxWidth: '600px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nama Lengkap</label>
          <input name="name" defaultValue={user.name} required style={inputStyle} />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
          <input name="email" type="email" defaultValue={user.email} required style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password Baru</label>
          <input name="password" type="password" minLength={6} placeholder="Kosongkan jika tidak ingin mengubah password" style={inputStyle} />
          <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>Mengubah password akan berlaku pada login berikutnya.</p>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Roles Saat Ini (Hanya Baca)</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {user.roles.length === 0 ? <span style={{ opacity: 0.5 }}>Tidak ada role khusus</span> : null}
            {user.roles.map(r => (
              <span key={r.id} style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                {r.name}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn" 
            style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              fontWeight: 600,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
