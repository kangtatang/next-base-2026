'use server';
import prisma from '@/lib/prisma';
import { getSession } from '@/services/auth.service';
import { can } from '@/services/rbac.service';

export async function getRolesPaginated(params: { page: number; limit: number; search: string; sortKey: string; sortDir: 'asc' | 'desc' }) {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_roles')) throw new Error('Unauthorized');

  const { page, limit, search, sortKey, sortDir } = params;
  
  const where = search ? {
    OR: [
      { name: { contains: search } },
      { description: { contains: search } }
    ]
  } : {};

  const [data, totalCount] = await Promise.all([
    prisma.role.findMany({
      where,
      include: { permissions: true },
      orderBy: { [sortKey || 'createdAt']: sortDir || 'desc' },
      skip: page * limit,
      take: limit,
    }),
    prisma.role.count({ where })
  ]);

  return { data, totalCount };
}
