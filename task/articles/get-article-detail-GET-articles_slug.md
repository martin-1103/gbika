# Get Detail Artikel — GET — /articles/{slug}

## Tujuan
Menyediakan endpoint publik untuk mengambil detail lengkap dari satu artikel berdasarkan slug-nya. Hanya artikel yang sudah `published` yang bisa diakses melalui endpoint ini.

## Dependencies
- [x] /task/articles/list-articles-GET-articles.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Mengambil Artikel yang Ada dan Sudah Dipublikasikan**
  - **Given** ada artikel dengan slug `renungan-hari-ini` dan status `published`
  - **When** pengguna mengirim request `GET /articles/renungan-hari-ini`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi object JSON lengkap dari artikel tersebut (ID, title, content, slug, published_at, author, category).

- **Scenario 2: Mencoba Mengambil Artikel Draft**
  - **Given** ada artikel dengan slug `artikel-rahasia` dan status `draft`
  - **When** pengguna (publik) mengirim request `GET /articles/artikel-rahasia`
  - **Then** sistem merespon dengan status code `404 Not Found`.

- **Scenario 3: Mengambil Artikel dengan Slug yang Tidak Ada**
  - **When** pengguna mengirim request `GET /articles/slug-yang-tidak-pernah-ada`
  - **Then** sistem merespon dengan status code `404 Not Found`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `article.service.js` dapat menemukan artikel berdasarkan slug dan status.
- **Integrasi:**
  - Seed database dengan artikel `published` dan `draft`.
  - Lakukan request `GET` untuk slug yang `published`, harapkan `200 OK`.
  - Lakukan request `GET` untuk slug yang `draft`, harapkan `404 Not Found`.
  - Lakukan request `GET` untuk slug yang tidak ada, harapkan `404 Not Found`.
- **Negatif:**
  - (Tidak banyak kasus negatif untuk endpoint GET by ID selain yang sudah dicakup di atas).
- **Kinerja:**
  - Pastikan ada index unik pada kolom `slug` di database untuk pencarian yang sangat cepat.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini digunakan ketika pengguna mengklik judul artikel dari halaman daftar untuk membaca isinya secara lengkap.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/article.controller.js` -> `findBySlug`.
- **Service:** `services/article.service.js` -> `findOneBySlug`.
- **ORM/Query Builder:** Prisma atau Sequelize. Query: `prisma.article.findUnique({ where: { slug: '...', status: 'published' } })`. Jika hasilnya `null`, controller akan mengembalikan `404`.

## Non-Goal
- Menampilkan artikel draft (kecuali mungkin untuk admin di endpoint terpisah).
- Menambah jumlah view (counter) secara langsung di endpoint ini. Jika diperlukan, ini harus dilakukan secara asinkron untuk tidak memperlambat response.

## Asumsi
- Slug artikel bersifat unik.

## Risiko & Mitigasi
- **Risiko:** Konten artikel (HTML) yang disimpan di database mengandung script berbahaya (XSS).
  - **Mitigasi:** Meskipun sanitasi idealnya dilakukan saat menyimpan (di endpoint `POST`/`PUT`), frontend yang me-render konten ini juga HARUS menggunakan library seperti `DOMPurify` untuk membersihkan HTML sebelum ditampilkan, sebagai lapisan pertahanan kedua.

## Scope In
- Mengambil satu artikel berdasarkan slug.
- Hanya mengembalikan artikel jika statusnya `published`.

## Scope Out
- Menampilkan komentar.
- Menampilkan artikel terkait (related articles).

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
