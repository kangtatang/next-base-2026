import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function getUsers() {
  return await prisma.user.findMany({
    include: { roles: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: { roles: true },
  });
}

export async function createUser(data: any) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      roles: {
        connect: data.roleIds?.map((id: string) => ({ id })) || [],
      },
    },
  });
}

export async function updateUser(id: string, data: any) {
  const updateData: any = {
    email: data.email,
    name: data.name,
  };
  
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  
  if (data.roleIds) {
    updateData.roles = {
      set: data.roleIds.map((rid: string) => ({ id: rid })),
    };
  }

  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
