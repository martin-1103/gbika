# Update Artikel — PUT — /articles/{slug}

## Tujuan
Menyediakan endpoint untuk pengguna dengan role Admin atau Editor untuk memperbarui artikel atau renungan yang sudah ada. Endpoint ini memungkinkan perubahan pada judul, konten, slug, status, dan metadata lainnya.

## Dependencies
- (Asumsi) /task/auth/admin-login-POST-auth_login.md
- [x] /task/articles/create-article-POST-articles.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Editor Berhasil Memperbarui Artikel**
  - **Given** seorang pengguna dengan role `Editor` telah login
  - **And** ada sebuah artikel dengan slug `renungan-pagi`
  - **When** pengguna mengirim request `PUT /articles/renungan-pagi` dengan body JSON `{"title": "Renungan Pagi Edisi Revisi"}`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi data artikel yang sudah diperbarui
  - **And** judul artikel di database telah berubah.

- **Scenario 2: Admin Mempublikasikan Artikel Draft**
  - **Given** seorang pengguna dengan role `Admin` telah login
  - **And** ada artikel dengan slug `artikel-baru` yang berstatus `draft`
  - **When** pengguna mengirim request `PUT /articles/artikel-baru` dengan body `{"status": "published"}`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** status artikel di database menjadi `published` dan `published_at` terisi.

- **Scenario 3: Request untuk Artikel yang Tidak Ada**
  - **Given** seorang pengguna terotentikasi
  - **When** pengguna mengirim request `PUT /articles/slug-tidak-ada`
  - **Then** sistem merespon dengan status code `404 Not Found`.

- **Scenario 4: Slug Duplikat Saat Update**
  - **Given** ada artikel dengan slug `artikel-satu` dan `artikel-dua`
  - **When** pengguna mencoba mengubah slug `artikel-dua` menjadi `artikel-satu`
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error `{"errors": {"slug": ["Slug ini sudah digunakan."]}}`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `article.service.js` dapat menemukan dan memperbarui artikel dengan benar.
  - Test validasi pada `update.schema.js` (Zod) menolak data yang tidak valid.
- **Integrasi:**
  - Lakukan request `PUT` sebagai Editor, verifikasi data di DB telah berubah.
  - Coba update status dari `draft` ke `published`, verifikasi `published_at` terisi.
- **Negatif:**
  - Coba akses endpoint dengan role `Penyiar`. Harapkan `403 Forbidden`.
  - Coba update artikel dengan slug yang tidak ada. Harapkan `404`.
  - Kirim request dengan `title` kosong. Harapkan `422`.
- **Keamanan:**
  - Pastikan pengguna tidak bisa mengubah `author_id` artikel ke user lain jika tidak diizinkan.
  - Lakukan sanitasi input HTML pada `content` untuk mencegah XSS.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini penting untuk siklus hidup konten, memungkinkan koreksi, pembaruan, dan perubahan status dari draft menjadi publikasi.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/admin/article.controller.js` -> `update`.
- **Middleware:** Otentikasi JWT, otorisasi role, dan validasi.
- **Service:** `services/article.service.js` -> `updateBySlug`.
- **HTTP Method:** `PUT` atau `PATCH`. `PATCH` lebih cocok untuk pembaruan parsial.
- **Validasi Slug:** Pastikan validasi keunikan slug mengabaikan slug dari artikel yang sedang di-update itu sendiri.

## Non-Goal
- Membuat revisi atau riwayat perubahan artikel (versioning).
- Mengubah penulis artikel (kecuali jika diizinkan secara eksplisit untuk Admin).

## Asumsi
- UI Admin Panel akan mengambil data artikel terlebih dahulu sebelum menampilkan form edit.

## Risiko & Mitigasi
- **Risiko:** Overwriting data secara tidak sengaja jika dua editor mengedit artikel yang sama.
  - **Mitigasi:** Implementasikan optimistic locking. Tambahkan field `version` atau `updated_at`. Request `PUT`/`PATCH` harus menyertakan `version` terakhir. Jika `version` di DB tidak cocok, tolak update.
- **Risiko:** Mengubah slug dapat merusak link (SEO).
  - **Mitigasi:** Beri peringatan di UI Admin Panel. Secara opsional, buat sistem redirection dari slug lama ke slug baru.

## Scope In
- Memperbarui `title`, `content`, `slug`, `status`, `category_id`.
- Validasi input.
- Menemukan artikel berdasarkan slug.
- Mengembalikan data artikel yang sudah di-update.

## Scope Out
- Komentar pada artikel.
- Analitik (jumlah view).

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
