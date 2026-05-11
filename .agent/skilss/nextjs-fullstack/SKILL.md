---
name: "Next.js Fullstack Engine"
description: "Aktifkan saat user meminta implementasi Auth, Role Management, Prisma Schema, atau API Routes."
keywords: ["next.js", "prisma", "sqlite", "auth", "rbac", "middleware"]
---

# Backend & Database

- **ORM:** Gunakan Prisma. Pastikan skema mendukung relasi Many-to-Many antara Roles dan Permissions.
- **Database:** Default SQLite untuk development, pastikan variabel lingkungan siap untuk migrasi ke PostgreSQL/MySQL.

# Auth & RBAC (Role-Based Access Control)

- **Login:** Implementasikan session-based atau JWT.
- **Permissions:**
  - Gunakan middleware untuk memproteksi route `/dashboard`.
  - Buat helper `can('permission_name')` untuk pengecekan akses di level komponen.
- **User Management:** Super Admin memiliki akses mutlak (override semua permission).
- **Password:** Gunakan bcrypt untuk hashing password. Jangan pernah menyimpan password dalam bentuk plain text.

# App Settings

- Buat tabel `Settings` di database untuk menyimpan: `app_name`, `app_logo`, `primary_color`.

# UI/UX & Frontend Constraints

- **Hydration Mismatch Prevention:** Selalu tambahkan properti `suppressHydrationWarning` pada tag `<html>` dan `<body>` di `layout.tsx` utama untuk mencegah error akibat ekstensi browser (seperti Grammarly) yang menyuntikkan atribut sebelum proses rendering client.
- **Prohibitions**: **JANGAN PERNAH** menggunakan `window.alert()` atau `window.confirm()`. Selalu gunakan modal kustom (contoh: `ConfirmationDialog`) atau Toast/Snackbar yang lebih profesional (menggunakan `notistack`).
- **Simplicity First**: Hindari penggunaan UI Dropdown/Portal yang rumit dari library eksternal (misal: MUI `<Select multiple>`) jika rawan memicu isu *hydration* atau tertutup *z-index*. Utamakan penggunaan *Vanilla React State* untuk *custom dropdown multi-select* agar _FormData_ dan klik berfungsi mulus.
