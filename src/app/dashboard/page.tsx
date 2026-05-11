import { getSettings } from '@/services/setting.service';

export default async function DashboardPage() {
  const settings = await getSettings();

  return (
    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-max)', border: '1px solid var(--border)' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Selamat Datang</h2>
      <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
        Ini adalah SPA First UI Dashboard untuk <strong>{settings?.appName}</strong>.
        Anda login sebagai pengguna dengan peran tertentu. Menu di sidebar menyesuaikan hak akses (RBAC) Anda secara dinamis.
      </p>
    </div>
  );
}
