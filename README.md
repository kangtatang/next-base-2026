# Next.js Fullstack Engine & Admin Dashboard

Sebuah proyek dasar (*boilerplate*) dasbor administrasi tingkat *Enterprise* yang dirancang dengan **Clean Architecture**, **SPA First UI**, dan **Performa Optimal**. Aplikasi ini dibuat menggunakan Next.js App Router (React Server Components & Server Actions) dengan standar kode global yang ketat.

![Dashboard Preview](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?logo=prisma)

## 🌟 Fitur Utama

- **Autentikasi Aman:** Sistem *login* JWT yang sepenuhnya aman, menggunakan `jose` (tanpa dependensi berat) dan enkripsi sandi `bcrypt`.
- **Role-Based Access Control (RBAC):** Sistem manajemen hak akses *granular* dan dinamis yang dapat dikustomisasi, termasuk *bypass* otomatis khusus untuk `Super Admin`.
- **Manajemen Pengguna (CRUD):** Tambah, ubah, dan hapus pengguna dengan validasi dan keamanan berlapis (termasuk Server-side pagination).
- **Manajemen Peran & Hak Akses (CRUD):** Konfigurasi *Role* yang fleksibel, didukung dengan multi-seleksi hak akses yang elegan tanpa efek portal *library* eksternal yang *buggy*.
- **Pengaturan Aplikasi:** Manajemen *branding* aplikasi (Nama, Logo, dan skema warna).
- **Edit Profil Individual:** Memungkinkan pengguna masuk untuk mengubah nama, sandi baru, dan informasi profil secara independen.
- **UI/UX Premium & Responsif:** Menggunakan transisi halus (*Framer Motion*), *Glassmorphism*, layout interaktif kelas SaaS modern (dengan Vanilla CSS murni), serta desain *Mobile First Sidebar*.

## 🛠️ Teknologi & Stack

* **Framework:** Next.js (App Router)
- **Bahasa:** TypeScript (Strict Mode)
- **Database & ORM:** SQLite (secara *default* untuk *development*), dioptimasi menggunakan **Prisma**. Mendukung penuh migrasi ke PostgreSQL/MySQL saat produksi.
- **Styling:** Vanilla CSS (Sistem token warna variabel yang bersih tanpa TailwindCSS yang bengkak).
- **Animasi:** Framer Motion (Transisi gradasi *background*, efek kaca/blur, *page animations*).
- **Feedback System:** `notistack` untuk toast/notifikasi yang elegan.

---

## 🚀 Cara Instalasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal di mesin Anda.

### Persyaratan

Pastikan Anda telah menginstal `Node.js` (minimal versi 18.x) dan `npm` (atau `yarn`/`pnpm`).

### 1. Kloning Repositori

```bash
git clone <url-repositori-ini>
cd <nama-repository-ini>
```

### 2. Instalasi Dependensi

Jalankan perintah berikut untuk menginstal seluruh pustaka yang diperlukan:

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Salin contoh file environment ke lingkungan pengembangan Anda:

```bash
cp .env.example .env
```

Secara otomatis, *Environment* akan dikonfigurasi untuk menggunakan **SQLite** secara lokal (`DATABASE_URL="file:./dev.db"`) beserta *Secret Key* bawaan untuk JWT. Jika Anda bersiap untuk di *production*, ganti baris koneksi *database* dan pastikan *JWT_SECRET* menggunakan string acak yang kuat!

### 4. Setup Database & Seeding

Lakukan migrasi database dan tanam data bawaan (Seeding) untuk peran *Super Admin*:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Jalankan Aplikasi

Jalankan server *development*:

```bash
npm run dev
```

Aplikasi Anda kini sudah hidup dan dapat diakses melalui browser di alamat: **<http://localhost:3000>**

---

## 💻 Cara Menggunakan

1. **Akses Dashboard**
   Buka URL <http://localhost:3000>. Aplikasi akan mengalihkan Anda ke halaman `/login`.

2. **Kredensial Super Admin Bawaan (Hasil Seeding)**
   Gunakan informasi berikut untuk *login* pertama kali:
   - **Email:** `admin@example.com`
   - **Password:** `password123`

3. **Eksplorasi Menu Sidebar**
   Setelah masuk, Anda (sebagai *Super Admin*) akan melihat seluruh navigasi panel samping:
   - **Beranda:** Ringkasan statistik cepat.
   - **Users:** Membuat pengguna baru dan mengatur peran yang dimilikinya.
   - **Roles & Permissions:** Menambahkan peran administratif baru atau mengubah batas wewenang yang ada.
   - **Pengaturan Aplikasi:** Konfigurasi kustom untuk *branding* web.

4. **Kustomisasi Profil Diri**
   Klik alamat *email* Anda di pojok kiri bawah *Sidebar* untuk masuk ke halaman **Profil Saya**. Dari sana Anda dapat memperbarui Nama Lengkap, Alamat Email, hingga *Password* agar akun tidak mudah diretas!

---

## 📝 Catatan Rilis & Arsitektur (Clean Architecture)

Aplikasi mematuhi struktur *SOLID* principles:

- `src/actions/`: Tempat semua operasi Database *(Server Actions)* berlangsung. Kueri dioptimalkan menggunakan fungsi `select` spesifik guna menjaga *payload size* sekecil mungkin.
- `src/services/`: Modul bisnis (*Business Logic*) khusus seperti manipulasi sesi otentikasi JWT dan Helper Validasi RBAC (`can()`).
- `src/components/`: Kumpulan Komponen UI Murni dan Pembungkus (*Wrappers*) cerdas.
