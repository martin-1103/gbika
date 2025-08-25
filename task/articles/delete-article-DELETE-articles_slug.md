# Hapus Artikel — DELETE — /articles/{slug}

## Tujuan
Menyediakan endpoint untuk pengguna dengan role Admin untuk menghapus artikel. Implementasi akan menggunakan soft delete untuk memungkinkan pemulihan data jika terjadi kesalahan.

## Dependencies
- (Asumsi) /task/auth/admin-login-POST-auth_login.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Admin Berhasil Menghapus Artikel**
  - **Given** seorang pengguna dengan role `Admin` telah login
  - **And** ada sebuah artikel dengan slug `artikel-lama`
  - **When** pengguna mengirim request `DELETE /articles/artikel-lama`
  - **Then** sistem merespon dengan status code `204 No Content`
  - **And** record artikel di database memiliki kolom `deleted_at` yang terisi (soft deleted).
  - **And** artikel tersebut tidak lagi muncul di endpoint `GET /articles` publik.

- **Scenario 2: Pengguna dengan Role Editor Mencoba Menghapus**
  - **Given** seorang pengguna dengan role `Editor` telah login
  - **When** pengguna mengirim request `DELETE /articles/artikel-lama`
  - **Then** sistem merespon dengan status code `403 Forbidden`.

- **Scenario 3: Menghapus Artikel yang Tidak Ada**
  - **Given** seorang pengguna `Admin` telah login
  - **When** pengguna mengirim request `DELETE /articles/slug-tidak-ditemukan`
  - **Then** sistem merespon dengan status code `404 Not Found`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `article.service.js` memanggil method `softDelete` pada repository.
- **Integrasi:**
  - Lakukan request `DELETE` sebagai Admin, verifikasi `deleted_at` terisi di DB.
  - Panggil endpoint `GET /articles` dan `GET /articles/{slug}` setelah delete, pastikan keduanya mengembalikan `404` atau tidak menyertakan artikel tersebut.
- **Negatif:**
  - Coba akses endpoint dengan role selain `Admin`. Harapkan `403`.
  - Coba hapus artikel dengan slug yang tidak ada. Harapkan `404`.
- **Keamanan:**
  - Pastikan hanya role `Admin` yang bisa mengakses. Otorisasi ini sangat penting.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini melengkapi siklus hidup manajemen konten. Penggunaan soft delete adalah best practice untuk mencegah kehilangan data permanen.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/admin/article.controller.js` -> `remove`.
- **Middleware:** Otentikasi JWT dan otorisasi role (`admin`).
- **Service:** `services/article.service.js` -> `softDeleteBySlug`.
- **ORM:** Prisma memiliki support untuk soft delete melalui middleware. Sequelize memiliki support bawaan. Ini akan memastikan semua query `find` secara otomatis mengecualikan record yang sudah di-soft delete.
- **Response:** Sesuai konvensi REST, response untuk `DELETE` yang sukses adalah `204 No Content` dengan body kosong.

## Non-Goal
- Hard delete (penghapusan permanen dari database) melalui API.
- Fitur "Trash" atau "Recycle Bin" di UI untuk restore.

## Asumsi
- Keputusan bisnis menyetujui bahwa hanya Admin, bukan Editor, yang boleh menghapus konten.

## Risiko & Mitigasi
- **Risiko:** Kesalahan penghapusan artikel penting.
  - **Mitigasi:** Penggunaan soft delete sudah menjadi mitigasi utama. Tambahkan UI konfirmasi di Admin Panel dan buat log audit untuk setiap aksi delete.
- **Risiko:** Penumpukan data `deleted` di database.
  - **Mitigasi:** Buat sebuah scheduled job (cron) untuk membersihkan (hard delete) record yang sudah di-soft delete lebih dari periode tertentu (misal: 30 hari).

## Scope In
- Soft deleting sebuah artikel berdasarkan slug.
- Otorisasi hanya untuk role `Admin`.
- Mengembalikan response `204 No Content`.

## Scope Out
- Restore artikel dari soft delete.
- Menghapus beberapa artikel sekaligus (bulk delete).

## Definition of Ready (DoR)
- [x] Acceptance Criteria lengkap (format Gherkin)  
- [x] Skema I/O & error map jelas  
- [x] Testing Plan punya data uji & kasus negatif  
- [x] Dependensi konsisten & siap di-mock  
- [x] Non-Goal & Asumsi tertulis  
- [x] Risiko & mitigasi terisi  

## Definition of Done (DoD)
- [ ] Semua Acceptance Criteria lulus  
- [ ] Tes unit/integrasi 100% hijau  
- [ ] Log/metrics/traces muncul sesuai spesifikasi  
- [ ] SLO performa terpenuhi (bukti benchmark)  
- [ ] Dokumentasi (README/changelog) diperbarui  
- [ ] Backward compatibility dijaga (atau breaking change + rencana migrasi tertulis)  
