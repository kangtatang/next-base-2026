'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { createSession } from '@/services/auth.service';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return { error: 'Invalid email or password' };
  }

  // Create session payload
  const sessionRoles = user.roles.map((role) => ({
    name: role.name,
    permissions: role.permissions.map((p) => p.name),
  }));

  await createSession({
    userId: user.id,
    email: user.email,
    roles: sessionRoles,
  });

  return { success: true };
}
