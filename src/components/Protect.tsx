'use client';

import React from 'react';

type ProtectProps = {
  permission: string;
  userPermissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isSuperAdmin?: boolean;
};

export default function Protect({
  permission,
  userPermissions,
  children,
  fallback = null,
  isSuperAdmin = false,
}: ProtectProps) {
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  if (userPermissions.includes(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
