"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Protect from '@/components/Protect';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface SessionData {
  email: string;
  roles: any[];
}

interface DashboardShellProps {
  children: React.ReactNode;
  session: SessionData;
  userPermissions: string[];
  isSuperAdmin: boolean;
}

export default function DashboardShell({ 
  children, 
  session, 
  userPermissions, 
  isSuperAdmin 
}: DashboardShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Default false for mobile first approach, or we can use useEffect

  // Close sidebar on route change for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Mobile Backdrop */}
      <div 
        className={`dashboard-backdrop ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', height: '100%', minWidth: '260px' }}>
          <div style={{ marginBottom: '2rem', padding: '0 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>Dashboard</h2>
            <button 
              onClick={() => setSidebarOpen(false)} 
              style={{ background: 'var(--border)', border: 'none', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }}
              title="Sembunyikan Sidebar"
            >
               <ChevronLeftIcon fontSize="small" />
            </button>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <Link href="/dashboard" className="sidebar-link" onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
              Beranda
            </Link>
            
            <Protect permission="manage_users" userPermissions={userPermissions} isSuperAdmin={isSuperAdmin}>
              <Link href="/dashboard/users" className="sidebar-link" onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                Users
              </Link>
            </Protect>
            
            <Protect permission="manage_roles" userPermissions={userPermissions} isSuperAdmin={isSuperAdmin}>
              <Link href="/dashboard/roles" className="sidebar-link" onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                Roles & Permissions
              </Link>
            </Protect>

            <Protect permission="manage_settings" userPermissions={userPermissions} isSuperAdmin={isSuperAdmin}>
              <Link href="/dashboard/settings" className="sidebar-link" onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                Pengaturan Aplikasi
              </Link>
            </Protect>
          </nav>

          <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/dashboard/profile" onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)} style={{ display: 'block', textDecoration: 'none', color: 'var(--foreground)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--background)', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.email}</strong>
              <span style={{ fontSize: '0.75rem', opacity: 0.7, color: 'var(--primary)' }}>Edit Profil &rarr;</span>
            </Link>
            <form action="/api/logout" method="POST">
               <button type="submit" style={{ width: '100%', textAlign: 'left', padding: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', borderRadius: 'var(--radius-sm)' }}>Logout</button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header style={{ height: '64px', minHeight: '64px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: isSidebarOpen ? '0px' : '40px', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', opacity: isSidebarOpen ? 0 : 1 }}>
            <button 
              onClick={() => setSidebarOpen(true)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
              title="Tampilkan Sidebar"
            >
              <MenuIcon />
            </button>
          </div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 500 }}>Sistem Administrasi</h1>
        </header>
        <div style={{ padding: '1rem', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
