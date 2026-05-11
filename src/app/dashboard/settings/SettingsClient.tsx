'use client';
import { updateSettingsAction } from '@/actions/setting.actions';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateSettingsAction({
      appName: fd.get('appName') as string,
      primaryColor: fd.get('primaryColor') as string,
    });
    setLoading(false);
    if (res.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Pengaturan berhasil disimpan!', { variant: 'success' });
      // Apply color change locally for SPA feel
      if (res.data?.primaryColor) {
        document.documentElement.style.setProperty('--primary', res.data.primaryColor);
      }
    }
  };

  return (
    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-max)', border: '1px solid var(--border)' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>⚙️ Pengaturan Global Aplikasi</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nama Aplikasi</label>
          <input 
            name="appName" 
            defaultValue={initialSettings?.appName} 
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Warna Tema Utama (Primary Color)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              name="primaryColor" 
              type="color" 
              defaultValue={initialSettings?.primaryColor} 
              style={{ width: '50px', height: '40px', padding: '0', cursor: 'pointer', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} 
            />
            <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>Pilih warna utama untuk tombol dan aksen</span>
          </div>
        </div>
        <button className="btn" style={{ background: 'var(--primary)', color: 'white', fontWeight: 'bold' }} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </form>
    </div>
  );
}
