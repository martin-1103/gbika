# Get Page Content — GET — /pages/{slug}

## Tujuan
Menyediakan endpoint publik untuk mengambil konten dari halaman statis (seperti "Tentang Kami", "Visi & Misi") yang dikelola melalui CMS.

## Dependencies
- (Asumsi) Adanya mekanisme CRUD untuk Pages di Admin Panel.

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Mengambil Konten Halaman yang Ada**
  - **Given** ada halaman yang dibuat di CMS dengan slug `tentang-kami` dan status `published`
  - **When** pengguna mengirim request `GET /pages/tentang-kami`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi data halaman tersebut (title, content HTML, dll).

- **Scenario 2: Mengambil Halaman yang Tidak Ada atau Draft**
  - **Given** halaman dengan slug `kontak-baru` masih berstatus `draft`
  - **When** pengguna mengirim request `GET /pages/kontak-baru`
  - **Then** sistem merespon dengan status code `404 Not Found`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `page.service.js` dapat menemukan halaman berdasarkan slug dan status.
- **Integrasi:**
  - Seed database dengan halaman `published` dan `draft`.
  - Lakukan request untuk slug yang `published`, harapkan `200 OK`.
  - Lakukan request untuk slug yang `draft` atau tidak ada, harapkan `404 Not Found`.
- **Kinerja:**
  - Konten halaman statis adalah kandidat utama untuk caching. Terapkan cache dengan TTL yang panjang (misal: beberapa jam) atau sampai ada pembaruan.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini memungkinkan konten halaman-halaman informasional di website menjadi dinamis dan dapat diubah oleh admin tanpa perlu melakukan deployment ulang kode.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/page.controller.js` -> `findBySlug`.
- **Service:** `services/page.service.js` -> `findOneBySlug`.
- **Database:** Tabel `pages` dengan kolom `id`, `title`, `slug`, `content`, `status`.
- **Caching:** Gunakan Redis dengan cache-key `page:{slug}`. Saat halaman di-update di admin panel, cache untuk slug tersebut harus di-invalidate.

## Non-Goal
- Menampilkan artikel atau berita (ini ditangani oleh modul `articles`).
- Menampilkan data yang memerlukan logika kompleks (seperti homepage).

## Asumsi
- Slug halaman bersifat unik.

## Risiko & Mitigasi
- **Risiko:** Konten HTML mengandung XSS.
  - **Mitigasi:** Konten harus di-sanitasi sebelum disimpan ke DB (saat create/update) dan idealnya juga di-sanitasi di frontend sebelum di-render.

## Scope In
- Mengambil satu halaman statis berdasarkan slug.
- Hanya mengembalikan halaman jika statusnya `published`.

## Scope Out
- Mengelola revisi halaman.

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
