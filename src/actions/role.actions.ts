'use server';

import { getSession } from '@/services/auth.service';
import { can } from '@/services/rbac.service';
import * as roleService from '@/services/role.service';
import { revalidatePath } from 'next/cache';

export async function createRoleAction(data: { name: string; description?: string; permissionIds?: string[] }) {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_roles')) {
    return { error: 'Unauthorized' };
  }
  try {
    const role = await roleService.createRole(data);
    revalidatePath('/dashboard/roles');
    return { success: true, data: role };
  } catch (err: any) {
    return { error: err.message || 'Failed to create role' };
  }
}

export async function updateRoleAction(id: string, data: { name?: string; description?: string; permissionIds?: string[] }) {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_roles')) {
    return { error: 'Unauthorized' };
  }
  try {
    const role = await roleService.updateRole(id, data);
    revalidatePath('/dashboard/roles');
    return { success: true, data: role };
  } catch (err: any) {
    return { error: err.message || 'Failed to update role' };
  }
}

export async function deleteRoleAction(id: string) {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_roles')) {
    return { error: 'Unauthorized' };
  }
  try {
    await roleService.deleteRole(id);
    revalidatePath('/dashboard/roles');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete role' };
  }
}
