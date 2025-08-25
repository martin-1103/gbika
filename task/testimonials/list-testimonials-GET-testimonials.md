# List Kesaksian — GET — /testimonials

## Tujuan
Menyediakan endpoint publik untuk menampilkan daftar kesaksian dari pendengar yang sudah disetujui (dimoderasi) oleh admin. Mendukung paginasi.

## Dependencies
- (Asumsi) Adanya mekanisme submit dan moderasi kesaksian.

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Mengambil Daftar Kesaksian Halaman Pertama**
  - **Given** ada 15 kesaksian dengan status `approved`
  - **When** pengguna mengirim request `GET /testimonials?page=1&limit=5`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi object JSON dengan `data` (array berisi 5 kesaksian) dan `meta` (info paginasi).
  - **And** hanya kesaksian dengan status `approved` yang ditampilkan.
  - **And** kesaksian diurutkan berdasarkan tanggal (terbaru dulu).

- **Scenario 2: Daftar Kesaksian Kosong**
  - **Given** tidak ada kesaksian yang berstatus `approved`
  - **When** pengguna mengirim request `GET /testimonials`
  - **Then** sistem merespon dengan `200 OK` dan `data` berisi array kosong.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `testimonial.service.js` dapat mengambil data dengan kriteria status dan paginasi yang benar.
- **Integrasi:**
  - Seed database dengan kesaksian berstatus `pending` dan `approved`.
  - Lakukan request `GET` dan verifikasi hanya data yang `approved` yang muncul.
- **Kinerja:**
  - Pastikan query database menggunakan index pada kolom `status` dan `created_at`.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Halaman kesaksian adalah bagian penting dari website untuk membangun iman dan komunitas. Endpoint ini menyajikan konten tersebut.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/testimonial.controller.js` -> `list`.
- **Service:** `services/testimonial.service.js` -> `findAllApproved`.
- **Database:** Tabel `testimonials` dengan kolom `status` (enum: `pending`, `approved`, `rejected`).
- **Query:** Query ke database harus selalu menyertakan `WHERE status = 'approved'`.

## Non-Goal
- Menampilkan kesaksian yang masih `pending` atau di-`reject`.
- Pencarian kesaksian.

## Asumsi
- Proses moderasi kesaksian dilakukan di admin panel.

## Risiko & Mitigasi
- **Risiko:** Menampilkan data pribadi pengirim kesaksian secara tidak sengaja.
  - **Mitigasi:** Gunakan DTO atau serializer untuk memastikan hanya field yang aman (misal: nama depan, kota, isi kesaksian) yang dikirim ke frontend. Jangan pernah mengirim email atau kontak.

## Scope In
- Paginasi.
- Sorting berdasarkan tanggal.
- Hanya menampilkan kesaksian yang `approved`.

## Scope Out
- Filtering berdasarkan kategori.
- Menampilkan video/audio kesaksian (bisa jadi task terpisah).

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
