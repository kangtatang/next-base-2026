import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Settings
  const setting = await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      appName: 'Next.js Fullstack Engine',
      primaryColor: '#3b82f6',
    },
  });
  console.log('✅ Settings seeded');

  // 2. Create Default Permissions
  const permissionsData = [
    { name: 'manage_users', description: 'Can create, read, update, delete users' },
    { name: 'manage_roles', description: 'Can manage roles and permissions' },
    { name: 'manage_permissions', description: 'Can create, read, update, delete permissions' },
    { name: 'manage_settings', description: 'Can update app settings' },
    { name: 'view_dashboard', description: 'Can view main dashboard' },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
    permissions.push(perm);
  }
  console.log('✅ Permissions seeded');

  // 3. Create Super Admin Role with all permissions
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'System Administrator with full access',
      permissions: {
        connect: permissions.map((p) => ({ id: p.id })),
      },
    },
  });
  console.log('✅ Super Admin role seeded');

  // 4. Create initial Super Admin User
  const adminPassword = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      password: adminPassword,
      roles: {
        connect: [{ id: superAdminRole.id }],
      },
    },
  });
  console.log(`✅ Super Admin user seeded (Email: ${adminUser.email})`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
