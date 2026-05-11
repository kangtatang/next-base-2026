import prisma from '@/lib/prisma';

export async function getSettings() {
  return await prisma.setting.findUnique({
    where: { id: 1 },
  });
}

export async function updateSettings(data: { appName?: string; appLogo?: string; primaryColor?: string }) {
  return await prisma.setting.upsert({
    where: { id: 1 },
    update: data,
    create: {
      appName: data.appName || 'Next.js Fullstack Engine',
      appLogo: data.appLogo,
      primaryColor: data.primaryColor || '#3b82f6',
    },
  });
}
