export const dynamic = 'force-dynamic';
import { getRoles } from '@/services/role.service';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const roles = await getRoles();
  return <UsersClient roles={roles} />;
}
