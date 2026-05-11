export function can(
  userRoles: { name: string; permissions: string[] }[] | undefined,
  permissionName: string
): boolean {
  if (!userRoles || userRoles.length === 0) return false;

  // Hak akses penuh untuk Super Admin
  const isSuperAdmin = userRoles.some((role) => role.name === 'Super Admin');
  if (isSuperAdmin) return true;

  // Cek spesifik permission
  return userRoles.some((role) => role.permissions.includes(permissionName));
}
