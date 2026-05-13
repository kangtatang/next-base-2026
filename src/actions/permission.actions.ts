"use server";
import prisma from '@/lib/prisma';
import { getSession } from '@/services/auth.service';
import { can } from '@/services/rbac.service';
import { revalidatePath } from 'next/cache';

async function authorize() {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_roles')) throw new Error('Unauthorized');
}

export async function getPermissionsPaginated(params: {
  page: number;
  limit: number;
  search: string;
  sortKey: string;
  sortDir: 'asc' | 'desc';
}) {
  await authorize();
  const { page, limit, search, sortKey, sortDir } = params;

  const where = search
    ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] }
    : {};

  const [data, totalCount] = await Promise.all([
    prisma.permission.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: { select: { roles: true } },
      },
      orderBy: { [sortKey || 'name']: sortDir || 'asc' },
      skip: page * limit,
      take: limit,
    }),
    prisma.permission.count({ where }),
  ]);

  return { data, totalCount };
}

export async function createPermissionAction(data: FormData) {
  await authorize();
  const name = (data.get('name') as string)?.trim().toLowerCase().replace(/\s+/g, '_');
  const description = (data.get('description') as string)?.trim();

  if (!name) return { error: 'Nama permission wajib diisi' };

  const existing = await prisma.permission.findUnique({ where: { name } });
  if (existing) return { error: `Permission "${name}" sudah ada` };

  await prisma.permission.create({ data: { name, description } });
  revalidatePath('/dashboard/permissions');
  return { success: true };
}

export async function updatePermissionAction(data: FormData) {
  await authorize();
  const id = data.get('id') as string;
  const name = (data.get('name') as string)?.trim().toLowerCase().replace(/\s+/g, '_');
  const description = (data.get('description') as string)?.trim();

  if (!id || !name) return { error: 'ID dan Nama permission wajib diisi' };

  const existing = await prisma.permission.findUnique({ where: { name } });
  if (existing && existing.id !== id) return { error: `Permission "${name}" sudah digunakan` };

  await prisma.permission.update({ where: { id }, data: { name, description } });
  revalidatePath('/dashboard/permissions');
  return { success: true };
}

export async function deletePermissionAction(id: string) {
  await authorize();
  if (!id) return { error: 'ID tidak valid' };
  await prisma.permission.delete({ where: { id } });
  revalidatePath('/dashboard/permissions');
  return { success: true };
}
