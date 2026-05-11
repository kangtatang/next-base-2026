import prisma from '@/lib/prisma';

export async function getRoles() {
  return await prisma.role.findMany({
    include: { permissions: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPermissions() {
  return await prisma.permission.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function createRole(data: { name: string; description?: string; permissionIds?: string[] }) {
  return await prisma.role.create({
    data: {
      name: data.name,
      description: data.description,
      permissions: {
        connect: data.permissionIds?.map((id) => ({ id })) || [],
      },
    },
  });
}

export async function updateRole(id: string, data: { name?: string; description?: string; permissionIds?: string[] }) {
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.permissionIds) {
    updateData.permissions = {
      set: data.permissionIds.map((pid) => ({ id: pid })),
    };
  }

  return await prisma.role.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteRole(id: string) {
  return await prisma.role.delete({
    where: { id },
  });
}
