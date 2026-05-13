"use server";
import prisma from '@/lib/prisma';
import { getSession } from '@/services/auth.service';

export async function getDashboardStats() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const [totalUsers, totalRoles, totalPermissions, latestUsers] = await Promise.all([
    prisma.user.count(),
    prisma.role.count(),
    prisma.permission.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        roles: { select: { id: true, name: true } },
      },
    }),
  ]);

  return { totalUsers, totalRoles, totalPermissions, latestUsers };
}
