# List Item Galeri — GET — /gallery

## Tujuan
Menyediakan endpoint publik untuk menampilkan daftar item galeri (gambar dan video) yang telah diunggah. Mendukung paginasi untuk menangani jumlah item yang banyak.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Mengambil Daftar Item Galeri Halaman Pertama**
  - **Given** ada 30 item di galeri
  - **When** pengguna mengirim request `GET /gallery?page=1&limit=12`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi object JSON dengan `data` (array berisi 12 item galeri) dan `meta` (informasi paginasi).
  - **And** item diurutkan berdasarkan tanggal dibuat (terbaru dulu).

- **Scenario 2: Halaman Terakhir dengan Item Tidak Penuh**
  - **Given** ada 30 item di galeri dan limit per halaman adalah 12
  - **When** pengguna mengirim request `GET /gallery?page=3`
  - **Then** sistem merespon dengan `200 OK`
  - **And** `data` di response body berisi array dengan 6 item galeri (sisa dari total 30).

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `gallery.service.js` dapat mengambil data dengan paginasi yang benar.
- **Integrasi:**
  - Seed database dengan data item galeri.
  - Lakukan request `GET` dan verifikasi paginasi serta urutan data sudah benar.
- **Negatif:**
  - Kirim request dengan `page` atau `limit` non-numerik. Harapkan `422` atau kembali ke nilai default.
- **Kinerja:**
  - Pastikan query database menggunakan index pada kolom `created_at` untuk sorting.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini akan digunakan oleh frontend untuk menampilkan halaman galeri kepada pengunjung.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/gallery.controller.js` -> `list`.
- **Service:** `services/gallery.service.js` -> `findAll`.
- **ORM/Query Builder:** Prisma atau Sequelize.
- **Validasi Query Params:** Middleware untuk validasi `page` dan `limit`.

## Non-Goal
- Filtering berdasarkan tipe media (gambar/video).
- Pencarian berdasarkan caption.

## Asumsi
- Semua item galeri bersifat publik.

## Risiko & Mitigasi
- **Risiko:** Memuat terlalu banyak data jika tidak ada paginasi default.
  - **Mitigasi:** Terapkan `limit` default (misal: 12) dan `limit` maksimal (misal: 100) untuk mencegah klien meminta semua data sekaligus.

## Scope In
- Paginasi.
- Sorting berdasarkan tanggal pembuatan.

## Scope Out
- Filtering dan pencarian.

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
