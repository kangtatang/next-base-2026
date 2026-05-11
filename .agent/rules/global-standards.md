---
trigger: always_on
---

# Global Development Standards

- **Principles:** Ikuti prinsip SOLID dan DRY. Setiap komponen harus memiliki satu tanggung jawab (Single Responsibility).
- **Architecture:** Gunakan Clean Architecture. Pisahkan logic database (Prisma) ke dalam layer `services` atau `actions`, jangan menaruh business logic langsung di dalam komponen UI.
- **UI Constraints:**
  - Gunakan **SPA First UI** (minimalisir full page reload).
  - **Border Radius:** Maksimal 8px (Jangan pernah menggunakan oversized/rounded pill kecuali untuk icon).
- **Code Style:** Gunakan TypeScript secara ketat. Hindari penggunaan `any`.
- **Roadmap:** Baca dan update ROADMAP.md untuk progress pekerjaan
