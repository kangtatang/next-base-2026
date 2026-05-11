'use server';

import { getSession } from '@/services/auth.service';
import { can } from '@/services/rbac.service';
import { updateSettings } from '@/services/setting.service';

export async function updateSettingsAction(data: { appName?: string; appLogo?: string; primaryColor?: string }) {
  const session = await getSession();
  
  if (!session || !can(session.roles, 'manage_settings')) {
    return { error: 'Unauthorized: Missing manage_settings permission' };
  }

  try {
    const updated = await updateSettings(data);
    return { success: true, data: updated };
  } catch (error) {
    return { error: 'Failed to update settings' };
  }
}
