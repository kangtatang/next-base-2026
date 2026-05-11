---
name: "MUI & Frontend Specialist"
description: "Aktifkan saat user meminta pembuatan UI, DataTable, Theme setting, atau sistem notifikasi menggunakan Material UI."
keywords: ["mui", "datatable", "snackbar", "toast", "theme", "dashboard"]
---

# Material UI Standards

- **Theme:** Implementasikan sistem tema yang mendukung skema warna dinamis (simpan di context/setting).
- **Notifications:** Gunakan Snackbar API dari MUI atau `notistack` untuk toast/snack bar.

# DataTable Requirements (Mandatory)

Setiap tampilan list data harus menggunakan komponen DataTable kustom dengan fitur:

1. **Server-side Pagination:** Jangan memuat semua data sekaligus.
2. **Page per View:** Opsi 10, 25, 50, 100.
3. **Live Search:** Debounced input (300ms) untuk pencarian real-time.
4. **Sort & Filter:** Berikan UI untuk sort kolom dan filter berdasarkan field tertentu.
5. **Quick Action Buttons:** Tambah, Edit, Delete, View harus ada di setiap row.
6. **Bulk Actions:** Tambahkan toolbar untuk bulk actions (enable/disable/delete multiple items).
7. **Quick Filters:** Tambahkan filter cepat berdasarkan status atau tipe data.
8. **Export:** Tambahkan tombol untuk export data ke CSV/Excel.
9. **Row Selection:** Allow selection of rows for bulk operations.
10. **Skeleton Loading:** Tampilkan skeleton loading saat data sedang diambil dari API.

# Component Design

- Gunakan `Compound Components` untuk bagian UI yang kompleks agar tetap DRY.
- **UI Design:** Gunakan desain UI yang modern dan profesional.
- **Responsive Design:** Pastikan UI responsive dan dapat digunakan di berbagai perangkat.
- **Accessibility:** Pastikan UI accessible untuk pengguna dengan kebutuhan khusus.
- **Performance:** Pastikan UI memiliki performa yang baik.
- **Security:** Pastikan UI aman dari serangan XSS dan CSRF.
- **Code Style:** Gunakan ESLint dan Prettier untuk memastikan konsistensi gaya kode.
- **TypeScript:** Gunakan TypeScript untuk memastikan tipe data yang benar.
- **Props:** Wajib memberikan props yang jelas dan dokumentasi yang lengkap untuk setiap komponen yang dibuat.

# Database & Schema (Mandatory)

Setiap pembuatan halaman CRUD baru **wajib** melibatkan skema database terlebih dahulu.

1. **Update Schema:** Edit file `prisma/schema.prisma` untuk menambahkan model yang diperlukan.
2. **Migration:** Jalankan perintah `npx prisma db push` untuk langsung menerapkan perubahan ke database (Development).
3. **Verify:** Pastikan data muncul di database setelah pembuatan tabel baru.

# Auth & RBAC Standards (Mandatory)

Semua fitur yang berkaitan dengan user dan hak akses harus mengikuti standar ini:

1. **Menu User:**
   - Halaman utama (list): `pages/protected/user/index.tsx`.
   - Form tambah/edit: `pages/protected/user/[id].tsx`.
   - Gunakan `DataTable` dengan kolom: foto, nama, email, role, status.

2. **Role & Permission Management:**
   - Halaman role: `pages/protected/role/index.tsx`.
   - Halaman permission: `pages/protected/permission/index.tsx`.
   - Wajib memiliki Super Admin sebagai root user (akses penuh).

3. **Form Design (User/Role):**
   - Gunakan `Card` sebagai container utama.
   - Gunakan `TextField` untuk input teks.
   - Gunakan `Select` untuk role dan status.
   - Gunakan `FormGroup` dengan `FormControlLabel` untuk hak akses (checkbox).

# Common CRUD Features

Untuk halaman CRUD generik lainnya (misal: Post, Product):

1. **Structure:**
   - List page: `pages/protected/[nama_menu]/index.tsx`.
   - Form page: `pages/protected/[nama_menu]/[id].tsx`.

2. **Tools:**
   - Selalu gunakan komponen `DataTable` untuk list.
   - Selalu gunakan `FormCard` atau `Card` untuk form.
   - Selalu gunakan `ConfirmationDialog` saat tombol delete ditekan.

# Notification System

Untuk semua action yang berhasil dilakukan oleh user, wajib menampilkan notifikasi success yang sopan:

Contoh pesan sukses:

- **Save/Submit/Create:** "Data berhasil disimpan."
- **Update:** "Data berhasil diperbarui."
- **Delete:** "Data berhasil dihapus."
- **General Success:** "Operasi berhasil dilakukan."

Pastikan menggunakan Toast/Snackbar yang tidak mengganggu alur kerja user namun tetap terlihat.

# Confirmation Dialog (Mandatory)

Setiap kali user menekan tombol **Delete** pada halaman manapun, **wajib** muncul dialog konfirmasi sebelum data dihapus.

## Format Dialog

### Judul

"Konfirmasi Penghapusan"

### Pesan

"Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."

### Tombol

- Kiri: "Batal" (Cancel) - Warna default/abu-abu
- Kanan: "Hapus" (Delete) - Warna merah

## Implementasi

Gunakan komponen `ConfirmationDialog` yang sudah ada, pastikan alur kerjanya benar:

1. User klik delete
2. Muncul dialog konfirmasi
3. Jika user klik "Batal", dialog tertutup dan data tetap ada
4. Jika user klik "Hapus", panggil API delete lalu tutup dialog dan tampilkan notifikasi success

# Image Upload Standard (Mandatory)

Semua proses upload gambar wajib mengikuti standar ini:

1. **Komponen:** Gunakan komponen `ImageUploadCard` dari `components/common/ImageUploadCard.tsx`.

2. **Validasi Ukuran:**
   - Maksimum: 5MB
   - Jika user upload lebih dari 5MB, tampilkan error "Ukuran file maksimal 5MB"

3. **Fungsi:**
   - Preview gambar sebelum upload
   - Hapus gambar (tanpa menyimpan ke server)
   - Upload ke server (mengembalikan URL)

4. **Output:**
   - Saat submit form, ambil nilai dari `ImageUploadCard` berupa URL gambar
   - Kirim URL tersebut ke API untuk disimpan ke database

# Data Table Features (Mandatory)

Semua halaman yang menampilkan daftar data (list) wajib menggunakan komponen `DataTable` dengan fitur berikut:

## Fitur Wajib

### 1. Server-side Pagination

- **Halaman per View:** Opsi 10, 25, 50, 100
- **Total Data:** Tampilkan jumlah total data di atas tabel
- **Pagination Controls:** Next, Previous, dan nomor halaman

### 2. Live Search

- **Search Box:** Di atas tabel, sebelah kiri
- **Debounce:** 300ms (tunggu 300ms setelah user berhenti mengetik sebelum search)
- **Placeholder:** "Cari data..."

### 3. Sort

- **Column Headers:** Semua kolom harus bisa di-click untuk sort
- **Indicators:** Tampilkan panah naik/turun saat di-sort
- **Multi-sort:** Saat klik kolom yang sudah di-sort, sort descending (panah ke bawah)

### 4. Filter (Opsional)

- Jika ada kolom status atau kategori, sediakan filter dropdown
- Filter harus bekerja bersamaan dengan search

## Implementasi

Gunakan komponen `DataTable` dengan props berikut:

```typescript
<DataTable
    columns={columns}          // Definisi kolom
    data={data}               // Data array
    totalCount={totalCount}     // Jumlah total data
    page={page}               // Halaman saat ini
    rowsPerPage={rowsPerPage} // Jumlah per halaman
    onPageChange={handlePageChange}
    onRowsPerPageChange={handleRowsPerPageChange}
    onSearch={handleSearch}     // Fungsi search
    onSort={handleSort}         // Fungsi sort
/>
```

## Contoh Komponen DataTable

```typescript
// pages/protected/user/index.tsx

import DataTable from '@/components/common/DataTable';
import { useState, useEffect } from 'react';

export default function UserPage() {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    useEffect(() => {
        fetchUsers({ page, limit: rowsPerPage, search, sort: sortConfig });
    }, [page, rowsPerPage, search, sortConfig]);

    const columns = [
        { field: 'name', header: 'Nama' },
        { field: 'email', header: 'Email' },
        { field: 'role', header: 'Role' },
        { field: 'status', header: 'Status' },
    ];

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset ke halaman pertama
    };

    const handleSearch = (newSearch) => {
        setSearch(newSearch);
        setPage(0); // Reset ke halaman pertama
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setPage(0); // Reset ke halaman pertama
    };

    return (
        <DataTable
            columns={columns}
            data={data}
            totalCount={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSearch={handleSearch}
            onSort={handleSort}
        />
    );
}
```

# Form Builder (Auto-Generate from Prisma Schema)

Untuk mempercepat pembuatan halaman CRUD, gunakan `FormBuilder` yang bisa secara otomatis membuat form dari skema Prisma. `FormBuilder` mendukung **Semua Tipe Data Prisma** termasuk **Relasi (Many-to-One, One-to-Many, Many-to-Many)**.

## Cara Kerja

1. AI membaca `prisma/schema.prisma`
2. AI mendeteksi semua model dan relasi
3. AI membuat form menggunakan `FormBuilder`
4. `FormBuilder` otomatis mengenali tipe data dan membuat input yang sesuai

## Tipe Input Otomatis berdasarkan Tipe Data Prisma

| Tipe Data Prisma        | Komponen Otomatis              | Keterangan                             |
| ----------------------- | ------------------------------ | -------------------------------------- |
| `String`                | `TextField`                    | Input teks biasa                       |
| `String?`               | `TextField` (optional)         | Input teks opsional                    |
| `Int`, `Float`, `Decimal` | `TextField` (type="number")    | Input angka                            |
| `Boolean`               | `Checkbox`                     | Centang true/false                     |
| `DateTime`              | `DateTimePicker`               | Pilih tanggal dan waktu                |
| `Enum`                  | `Select`                       | Dropdown dari nilai enum               |
| `Json`                  | `TextField` (multiline)        | Input JSON/teks panjang                |
| `ModelRelation` (M:1)   | `Select` biasa / HTML Select   | Dropdown sederhana dari relasi         |
| `ModelRelation[]` (1:N) | `Vanilla React Dropdown`       | Gunakan UI dropdown murni dengan `checkbox` standar (bukan `MUI Select` karena rawan isu portal/z-index) |
| `model @relation(...)`   | `Many-to-Many Form`            | Form khusus Many-to-Many              |

## Fitur Khusus Relasi

### 1. Many-to-One (M:1)

```typescript
model Post {
  id    Int     @id @default(autoincrement())
  title String
  authorId Int
  author User    @relation(fields: [authorId], references: [id])
}
```

**Otomatis:** `FormBuilder` akan membuat `Select` yang berisi semua user dan value-nya adalah `authorId`.

### 2. Many-to-Many (M:N)

```typescript
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  tags      Tag[]
}

model Tag {
  id    Int     @id @default(autoincrement())
  name  String
  posts Post[]
}
```

**Otomatis:** `FormBuilder` akan membuat **Multi-Select Chip** yang berisi semua tag, memungkinkan user memilih banyak tag sekaligus.

## Contoh Implementasi

### Input dalam FormBuilder

```typescript
import { FormBuilder } from '@/components/common/FormBuilder';

<FormBuilder
    fields={[
        { name: 'title', label: 'Judul Post', type: 'text', required: true },
        { name: 'content', label: 'Konten', type: 'textarea', required: true },
        { 
            name: 'categoryId', 
            label: 'Kategori', 
            type: 'select', 
            required: true,
            options: '/api/categories'
        },
        {
            name: 'tags', 
            label: 'Tags',
            type: 'manyToMany',  // Otomatis jadi Multi-Select Chip
            options: '/api/tags',
            defaultValue: []
        },
        { 
            name: 'status', 
            label: 'Status', 
            type: 'select', 
            options: [
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' }
            ]
        }
    ]}
    onSubmit={(data) => {
        // data akan otomatis berisi: title, content, categoryId, tags[]
    }}
    initialData={editingPost || {}}
    isLoading={isLoading}
/>
```

### Contoh dari Prisma

**Scenario 1: Model dengan Many-to-Many**

```prisma
model Post {
  id    Int     @id @default(autoincrement())
  title String
  tags  Tag[]
}

model Tag {
  id    Int     @id @default(autoincrement())
  name  String
}
```

**AI akan menghasilkan:**

```typescript
// Otomatis terdeteksi sebagai Many-to-Many
<FormBuilder
    fields={[
        { name: 'id', type: 'hidden' },
        { name: 'title', label: 'Title', type: 'text', required: true },
        { 
            name: 'tags', 
            label: 'Tags', 
            type: 'manyToMany',
            api: '/api/tags'
        }
    ]}
    onSubmit={handleSubmit}
/>
```

**Result:** User bisa memilih banyak tag dengan Multi-Select Chip.

**Scenario 2: Model dengan Many-to-One**

```prisma
model Product {
  id        Int      @id @default(autoincrement())
  name      String
  brandId   Int
  brand     Brand    @relation(fields: [brandId], references: [id])
}

model Brand {
  id    Int     @id @default(autoincrement())
  name  String
  products Product[]
}
```

**AI akan menghasilkan:**

```typescript
// Otomatis terdeteksi sebagai Many-to-One
<FormBuilder
    fields={[
        { name: 'id', type: 'hidden' },
        { name: 'name', label: 'Product Name', type: 'text', required: true },
        { 
            name: 'brandId', 
            label: 'Brand', 
            type: 'select',
            api: '/api/brands',
            required: true
        }
    ]}
    onSubmit={handleSubmit}
/>
```

**Result:** Dropdown berisi semua brand, value-nya adalah `brandId`.

## Keunggulan FormBuilder

1. **Hemat Waktu:** AI otomatis mengenali tipe data dan relasi tanpa perlu spesifikasi manual
2. **Konsisten:** Semua form mengikuti struktur yang sama di seluruh aplikasi
3. **Maintainable:** Saat schema berubah, tinggal update `prisma/schema.prisma`, form otomatis mengikuti
4. **Flexibel:** Bisa override field tertentu atau menggunakan komponen kustom jika perlu
5. **Support Semua Relasi:** M:1, 1:N, dan M:N terhandle otomatis

## Tips untuk Penggunaan FormBuilder

1. **Selalu simpan di `pages/protected/[menu]/[id].tsx`**
2. **Gunakan `FormBuilder` untuk semua pembuatan form baru**
3. **Untuk dropdown list, gunakan `api: '/api/[nama_relasi]'`**
4. **Untuk Many-to-Many, gunakan `type: 'manyToMany'`**
5. **Jangan ubah field tipe `hidden` yang dibuat otomatis**
6. **Semua input harus validasi (required jika field wajib di Prisma)**

# Validation (Auto-Generated from Prisma Schema)

Semua halaman form (CRUD) wajib memiliki validasi frontend yang sesuai dengan skema Prisma. **Tidak boleh** membuat form tanpa validasi.

## Aturan Validasi

### 1. String Validation

- **Required Field:** Jika field `String` tidak memiliki `?`, maka `required: true`.

```typescript
model User {
  id    Int     @id @default(autoincrement())
  name  String    // Wajib diisi
  email String?   // Opsional
}
```

**AI akan menghasilkan:**

```typescript
{ 
  name: 'string',   // required: true
  email: 'string'  // required: false
}
```
