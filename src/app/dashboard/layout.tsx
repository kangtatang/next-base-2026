import { getSession } from '@/services/auth.service';
import Link from 'next/link';
import Protect from '@/components/Protect';
import { redirect } from 'next/navigation';
import Providers from '@/components/Providers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const userPermissions = session.roles.flatMap(r => r.permissions);
  const isSuperAdmin = session.roles.some(r => r.name === 'Super Admin');

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem'
      }}>
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>Dashboard</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/dashboard" className="sidebar-link">
            Beranda
          </Link>
          
          <Protect permission="manage_users" userPermissions={userPermissions} isSuperAdmin={isSuperAdmin}>
            <Link href="/dashboard/users" className="sidebar-link">
              Users
            </Link>
          </Protect>
          
          <Protect permission="manage_roles" userPermissions={userPermissions} isSuperAdmin={isSuperAdmin}>
            <Link href="/dashboard/roles" className="sidebar-link">
              Roles & Permissions
            </Link>
          </Protect>

          <Protect permission="manage_settings" userPermissions={userPermissions} isSuperAdmin={isSuperAdmin}>
            <Link href="/dashboard/settings" className="sidebar-link">
              Pengaturan Aplikasi
            </Link>
          </Protect>
        </nav>

        <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.5rem' }}>{session.email}</p>
          <form action="/api/logout" method="POST">
             <button type="submit" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--background)' }}>
        <header style={{ height: '64px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 500 }}>Sistem Administrasi</h1>
        </header>
        <div style={{ padding: '2rem' }}>
          <Providers>
            {children}
          </Providers>
        </div>
      </main>
    </div>
  );
}
