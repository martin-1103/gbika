# List Artikel — GET — /articles

## Tujuan
Menyediakan endpoint publik untuk menampilkan daftar artikel, renungan, atau berita yang sudah dipublikasikan. Endpoint ini mendukung paginasi, sorting, dan filtering berdasarkan kategori.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Mengambil Daftar Artikel Halaman Pertama**
  - **Given** ada 25 artikel yang berstatus `published`
  - **When** pengguna (publik) mengirim request `GET /articles?page=1&limit=10`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi object JSON dengan `data` (array berisi 10 artikel) dan `meta` (informasi paginasi: `total`, `page`, `limit`, `totalPages`).
  - **And** artikel yang ditampilkan hanya yang berstatus `published`.
  - **And** artikel diurutkan berdasarkan `published_at` terbaru.

- **Scenario 2: Filtering Berdasarkan Kategori**
  - **Given** ada artikel dalam kategori "Keluarga" dan "Pemuda"
  - **When** pengguna mengirim request `GET /articles?category=keluarga`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body hanya berisi artikel dari kategori "Keluarga".

- **Scenario 3: Request Halaman yang Tidak Ada**
  - **Given** total artikel hanya cukup untuk 3 halaman
  - **When** pengguna mengirim request `GET /articles?page=4`
  - **Then** sistem merespon dengan `200 OK` dan `data` berisi array kosong.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `article.service.js` dapat mengambil data artikel dengan kriteria (filter, paginasi) yang benar dari database (menggunakan mock).
- **Integrasi:**
  - Seed database dengan data artikel (termasuk draft dan published).
  - Lakukan request `GET` ke endpoint dan verifikasi bahwa hanya artikel `published` yang muncul dan paginasi bekerja dengan benar.
- **Negatif:**
  - Kirim request dengan parameter query yang tidak valid (misal: `limit=-1`). Harapkan `422 Unprocessable Entity` atau diabaikan dan kembali ke default.
  - Kirim request dengan `sort_by` field yang tidak diizinkan. Harapkan `422`.
- **Kinerja:**
  - Pastikan query database menggunakan index pada kolom `status`, `published_at`, dan `category_id` untuk performa query yang cepat.
  - Endpoint harus merespon di bawah 150ms dengan 1000+ artikel di database.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Ini adalah salah satu endpoint utama yang akan digunakan oleh frontend untuk menampilkan konten kepada pengunjung website.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/article.controller.js` -> `list`.
- **Service:** `services/article.service.js` -> `findAll`.
- **ORM/Query Builder:** Prisma atau Sequelize. Query akan terlihat seperti: `prisma.article.findMany({ where: { status: 'published', ... }, take: limit, skip: offset, orderBy: { published_at: 'desc' } })`.
- **Validasi Query Params:** Gunakan middleware dengan `express-validator` atau `zod` untuk memvalidasi dan membersihkan query string (`page`, `limit`, `category`, `sort_by`).

## Non-Goal
- Menampilkan artikel yang masih berstatus `draft` atau `archived`.
- Fitur pencarian full-text (akan dibuat di endpoint terpisah).

## Asumsi
- Frontend akan menangani tampilan jika `data` yang diterima adalah array kosong.

## Risiko & Mitigasi
- **Risiko:** Performa lambat jika jumlah artikel sangat besar (N+1 query problem).
  - **Mitigasi:** Gunakan eager loading untuk memuat relasi (seperti kategori atau penulis) dalam satu query. Pastikan paginasi diimplementasikan dengan benar di level database (`LIMIT`/`OFFSET`), bukan di memori aplikasi.

## Scope In
- Paginasi.
- Filtering berdasarkan satu kategori.
- Sorting berdasarkan tanggal publikasi.
- Hanya menampilkan artikel `published`.

## Scope Out
- Filtering multi-kategori.
- Pencarian full-text.
- Menampilkan jumlah view atau komentar.

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
