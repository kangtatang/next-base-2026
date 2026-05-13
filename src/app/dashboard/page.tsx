import { getDashboardStats } from '@/actions/dashboard.actions';
import { getSession } from '@/services/auth.service';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const { totalUsers, totalRoles, totalPermissions, latestUsers } = await getDashboardStats();

  const isSuperAdmin = session.roles.some(r => r.name === 'Super Admin');

  const stats = [
    {
      label: 'Total Pengguna',
      value: totalUsers,
      icon: '👥',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Total Peran (Roles)',
      value: totalRoles,
      icon: '🛡️',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.1)',
    },
    {
      label: 'Total Hak Akses',
      value: totalPermissions,
      icon: '🔑',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Greeting */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Selamat Datang 👋
        </h1>
        <p style={{ opacity: 0.65, fontSize: '0.95rem' }}>
          Login sebagai <strong>{session.email}</strong>
          {isSuperAdmin && (
            <span style={{ marginLeft: '0.5rem', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
              Super Admin
            </span>
          )}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-max)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: stat.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: stat.color }}>{stat.value}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.65, marginTop: '0.25rem' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Users Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-max)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1rem' }}>Pengguna Terbaru</h2>
          <a href="/dashboard/users" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}>Lihat Semua →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--background)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 1.5rem', fontWeight: 600, opacity: 0.7, whiteSpace: 'nowrap' }}>Nama</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, opacity: 0.7, whiteSpace: 'nowrap' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, opacity: 0.7, whiteSpace: 'nowrap' }}>Peran</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1.5rem 0.75rem 1rem', fontWeight: 600, opacity: 0.7, whiteSpace: 'nowrap' }}>Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers.map((user, i) => (
                <tr key={user.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                  <td style={{ padding: '0.875rem 1.5rem', fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: '0.875rem 1rem', opacity: 0.75 }}>{user.email}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {user.roles.length === 0
                        ? <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>—</span>
                        : user.roles.map(r => (
                          <span key={r.id} style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {r.name}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1.5rem 0.875rem 1rem', opacity: 0.6, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {latestUsers.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>Belum ada pengguna</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
