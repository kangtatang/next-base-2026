'use server';

import { getSession } from '@/services/auth.service';
import { can } from '@/services/rbac.service';
import * as userService from '@/services/user.service';
import { revalidatePath } from 'next/cache';

export async function createUserAction(data: any) {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_users')) {
    return { error: 'Unauthorized' };
  }
  try {
    const user = await userService.createUser(data);
    revalidatePath('/dashboard/users');
    return { success: true, data: user };
  } catch (err: any) {
    return { error: err.message || 'Failed to create user' };
  }
}

export async function updateUserAction(id: string, data: any) {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_users')) {
    return { error: 'Unauthorized' };
  }
  try {
    const user = await userService.updateUser(id, data);
    revalidatePath('/dashboard/users');
    return { success: true, data: user };
  } catch (err: any) {
    return { error: err.message || 'Failed to update user' };
  }
}

export async function deleteUserAction(id: string) {
  const session = await getSession();
  if (!session || !can(session.roles, 'manage_users')) {
    return { error: 'Unauthorized' };
  }
  try {
    await userService.deleteUser(id);
    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete user' };
  }
}
