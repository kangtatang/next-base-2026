"use server";

import prisma from '@/lib/prisma';
import { getSession } from '@/services/auth.service';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';

export async function updateProfileAction(data: FormData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!name || !email) {
      return { error: 'Nama dan Email wajib diisi' };
    }

    const updateData: Record<string, unknown> = {
      name,
      email,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Cek apakah email sudah dipakai user lain
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== session.userId) {
      return { error: 'Email sudah digunakan oleh akun lain' };
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    revalidatePath('/dashboard/profile');
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: 'Gagal memperbarui profil' };
  }
}
