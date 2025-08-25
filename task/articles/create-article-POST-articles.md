# Buat Artikel Baru — POST — /articles

## Tujuan
Menyediakan endpoint untuk pengguna dengan role Admin atau Editor untuk membuat artikel atau renungan baru. Endpoint ini akan menerima judul, konten, slug, status (draft/published), penulis, dan kategori.

## Dependencies
- (Asumsi) /task/auth/admin-login-POST-auth_login.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Editor Berhasil Membuat Artikel Draft**
  - **Given** seorang pengguna dengan role `Editor` telah login (memiliki JWT valid)
  - **When** pengguna mengirim request `POST /articles` dengan body JSON yang valid, termasuk `{"title": "Renungan Pagi", "content": "...", "status": "draft"}`
  - **Then** sistem merespon dengan status code `201 Created`
  - **And** response body berisi data artikel yang baru dibuat, termasuk ID unik
  - **And** sebuah record artikel baru tersimpan di database dengan status `draft`.

- **Scenario 2: Admin Mempublikasikan Artikel Secara Langsung**
  - **Given** seorang pengguna dengan role `Admin` telah login
  - **When** pengguna mengirim request `POST /articles` dengan body JSON yang valid dan `{"status": "published"}`
  - **Then** sistem merespon dengan status code `201 Created`
  - **And** record artikel baru tersimpan di database dengan status `published` dan `published_at` terisi tanggal dan waktu saat ini.

- **Scenario 3: Request dengan Judul Kosong**
  - **Given** seorang pengguna terotentikasi
  - **When** pengguna mengirim request `POST /articles` dengan `{"title": ""}`
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error `{"errors": {"title": ["Judul wajib diisi."]}}`.

- **Scenario 4: Slug Duplikat**
  - **Given** sudah ada artikel dengan slug `renungan-pagi-ini`
  - **When** pengguna mencoba membuat artikel baru dengan slug yang sama
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error `{"errors": {"slug": ["Slug ini sudah digunakan."]}}`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `article.service.js` dapat membuat dan menyimpan artikel dengan benar.
  - Test middleware validasi (misal: `zod`) menolak data yang tidak valid.
- **Integrasi:**
  - Lakukan request `POST` sebagai Editor, verifikasi data tersimpan di DB dengan status `draft`.
  - Lakukan request `POST` sebagai Admin, verifikasi data tersimpan di DB dengan status `published`.
- **Negatif:**
  - Coba akses endpoint dengan role `Penyiar` atau pengguna biasa. Harapkan `403 Forbidden`.
  - Kirim request dengan `status` yang tidak valid (misal: `archived`). Harapkan `422`.
  - Kirim request tanpa `content`. Harapkan `422`.
- **Keamanan:**
  - Pastikan konten artikel (HTML) di-sanitasi di backend (misal: menggunakan `DOMPurify` di server-side) sebelum disimpan untuk mencegah serangan XSS.
  - Pastikan hanya role yang diizinkan yang bisa mengakses endpoint ini.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini adalah bagian fundamental dari CMS untuk mengelola konten renungan dan artikel di website.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Middleware:**
  - `auth.middleware.js`: Memverifikasi JWT.
  - `roles.middleware.js`: Memeriksa role (`admin` atau `editor`).
  - `validation.middleware.js`: Menggunakan `zod` atau `express-validator`.
- **Controller:** `controllers/admin/article.controller.js` -> `create`.
- **Service:** `services/article.service.js` -> `create`.
- **Slug Generation:** Jika `slug` tidak disediakan, generate otomatis dari `title` menggunakan library seperti `slugify`. Pastikan slug unik dengan memeriksa database.
- **Sanitization:** Gunakan `DOMPurify` (dijalankan di JSDOM di Node.js) atau library serupa untuk membersihkan `content` HTML.

## Non-Goal
- Upload gambar atau media (akan ditangani oleh endpoint terpisah).
- Manajemen kategori atau tag (diasumsikan sudah ada).

## Asumsi
- Sistem otentikasi dan otorisasi (roles/permissions) sudah ada.
- Kategori artikel sudah ada di database.

## Risiko & Mitigasi
- **Risiko:** Performa lambat jika konten artikel sangat besar.
  - **Mitigasi:** Lakukan validasi ukuran maksimal konten. Proses penyimpanan bisa dijalankan sebagai background job jika ada pemrosesan tambahan.
- **Risiko:** Race condition saat men-generate slug unik.
  - **Mitigasi:** Gunakan unique constraint di level database pada kolom `slug`. Tangani exception jika terjadi duplikasi.

## Scope In
- Menerima `title`, `content`, `slug`, `status`, `author_id`, `category_id`.
- Validasi input.
- Membuat record baru di tabel `articles`.
- Mengembalikan data artikel yang baru dibuat.

## Scope Out
- Proses approval atau workflow editorial yang kompleks.
- Versi atau riwayat revisi artikel.

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
