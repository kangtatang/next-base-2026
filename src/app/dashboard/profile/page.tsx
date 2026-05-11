import { getSession } from '@/services/auth.service';
import prisma from '@/lib/prisma';
import ProfileClient from './ProfileClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { roles: true }
  });

  if (!user) redirect('/login');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Profil Saya</h1>
        <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>Kelola informasi personal dan kata sandi akun Anda.</p>
      </div>

      <ProfileClient user={user} />
    </div>
  );
}
