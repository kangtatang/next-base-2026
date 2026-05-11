# Project Roadmap: Next.js Fullstack Engine

Proyek ini dibangun menggunakan arsitektur **Clean Architecture**, berfokus pada **SPA First UI**, dengan menggunakan **TypeScript Strict** dan styling **Vanilla CSS** sesuai dengan standar global.

## Fase 1: Inisialisasi & Setup (Selesai)
- [x] Inisialisasi Next.js App Router dengan TypeScript.
- [x] Konfigurasi ESLint & Prettier.
- [x] Setup struktur folder untuk Clean Architecture (`src/actions`, `src/services`, `src/components`).
- [x] Setup dan konfigurasi Vanilla CSS (tanpa Tailwind).
- [x] Konfigurasi Prisma ORM dengan default database SQLite.

## Fase 2: Skema Database & Migrasi (Selesai)
- [x] Desain skema `User`, `Role`, dan `Permission` (Relasi Many-to-Many).
- [x] Desain skema `Settings` (`app_name`, `app_logo`, `primary_color`).
- [x] Eksekusi initial Prisma migration.
- [x] Buat seed data awal (Super Admin Role, Default Permissions, Default Settings).

## Fase 3: Autentikasi & RBAC (Selesai)
- [x] Implementasi Session / JWT Auth.
- [x] Setup Next.js Middleware untuk memproteksi route `/dashboard`.
- [x] Pembuatan Helper `can('permission_name')` untuk pengecekan akses di level UI/Komponen.
- [x] Hak akses penuh (override) khusus untuk peran Super Admin.
- [x] Hashing password menggunakan `bcrypt`.

## Fase 4: Core Features & API Routes (Selesai)
- [x] Modul Manajemen Pengguna (CRUD Users).
- [x] Modul Manajemen Peran & Hak Akses (CRUD Roles & Permissions).
- [x] Modul Pengaturan Aplikasi (Settings CRUD).

## Fase 5: UI/UX & SPA First Integration (Selesai)
- [x] Desain layout dashboard SPA (Responsive & Minimalist).
- [x] Implementasi aturan Border Radius maksimal 8px.
- [x] Loading States dan transisi halaman tanpa reload.
- [x] Integrasi helper RBAC pada level komponen di frontend.

## Fase 6: Finalisasi & Deployment Readiness (Selesai)
- [x] Review Code terhadap Global Standards (SOLID & DRY).
- [x] Pastikan tidak ada type `any` yang lolos.
- [x] Persiapan environment variables untuk mendukung postgreSQL/MySQL ketika akan produksi.
