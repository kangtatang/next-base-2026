export const dynamic = 'force-dynamic';
import { getPermissions } from '@/services/role.service';
import RolesClient from './RolesClient';

export default async function RolesPage() {
  const permissions = await getPermissions();
  return <RolesClient permissions={permissions} />;
}
