import { getSession } from '@/services/auth.service';
import { redirect } from 'next/navigation';
import Providers from '@/components/Providers';
import DashboardShell from '@/components/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const userPermissions = session.roles.flatMap(r => r.permissions);
  const isSuperAdmin = session.roles.some(r => r.name === 'Super Admin');

  return (
    <DashboardShell 
      session={session} 
      userPermissions={userPermissions} 
      isSuperAdmin={isSuperAdmin}
    >
      <Providers>
        {children}
      </Providers>
    </DashboardShell>
  );
}
