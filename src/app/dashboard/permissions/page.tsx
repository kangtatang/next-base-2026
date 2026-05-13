import Providers from '@/components/Providers';
import PermissionsClient from './PermissionsClient';

export const dynamic = 'force-dynamic';

export default function PermissionsPage() {
  return (
    <Providers>
      <PermissionsClient />
    </Providers>
  );
}
