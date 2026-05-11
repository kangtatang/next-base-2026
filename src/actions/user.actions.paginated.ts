'use server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getSession } from '@/services/auth.service';
import { can } from '@/services/rbac.service';

export async function getUsersPaginated(params: { page: number; limit: number; search: string; sortKey: string; sortDir: 'asc' | 'desc' }) {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_users')) throw new Error('Unauthorized');

  const { page, limit, search, sortKey, sortDir } = params;
  
  const where = search ? {
    OR: [
      { name: { contains: search } },
      { email: { contains: search } }
    ]
  } : {};

  const [data, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { [sortKey || 'createdAt']: sortDir || 'desc' },
      skip: page * limit,
      take: limit,
    }),
    prisma.user.count({ where })
  ]);

  return { data, totalCount };
}
