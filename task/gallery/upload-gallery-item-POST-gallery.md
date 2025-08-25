# Unggah Item Galeri — POST — /gallery

## Tujuan
Menyediakan endpoint untuk Admin mengunggah item media baru (gambar atau video) ke galeri. Endpoint ini harus menangani upload file (multipart/form-data).

## Dependencies
- [x] /task/auth/admin-login-POST-auth_login.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Admin Berhasil Mengunggah Gambar**
  - **Given** seorang pengguna dengan role `Admin` telah login
  - **When** pengguna mengirim request `POST /gallery` dengan `multipart/form-data` berisi file gambar, `caption`, dan `type: 'image'`
  - **Then** sistem merespon dengan status code `201 Created`
  - **And** response body berisi data item galeri yang baru, termasuk URL media
  - **And** file gambar tersimpan di storage (misal: S3 bucket)
  - **And** record baru tersimpan di tabel `gallery_items`.

- **Scenario 2: Upload File dengan Tipe Tidak Didukung**
  - **Given** seorang `Admin` telah login
  - **When** pengguna mencoba mengunggah file `.zip`
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error `{"errors": {"file": ["Tipe file tidak didukung. Hanya gambar (jpg, png) dan video (mp4) yang diizinkan."]}}`.

- **Scenario 3: Upload Tanpa File**
  - **Given** seorang `Admin` telah login
  - **When** pengguna mengirim request tanpa menyertakan file
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error `{"errors": {"file": ["File wajib diunggah."]}}`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `gallery.service.js` dapat memproses file yang diunggah dan menyimpannya ke storage.
  - Test middleware validasi `multer` untuk tipe dan ukuran file.
- **Integrasi:**
  - Lakukan request `POST` end-to-end dengan file gambar tiruan. Verifikasi file tersimpan di disk (atau S3 mock) dan record dibuat di DB.
- **Negatif:**
  - Coba akses dengan role non-Admin. Harapkan `403 Forbidden`.
  - Unggah file yang lebih besar dari batas maksimal (misal: >10MB). Harapkan `413 Payload Too Large`.
  - Kirim request dengan `Content-Type` yang salah (bukan `multipart/form-data`). Harapkan `415`.
- **Keamanan:**
  - Pastikan file yang diunggah divalidasi MimeType-nya, jangan hanya mengandalkan ekstensi.
  - Jangan pernah menyimpan file yang diunggah di direktori yang dapat dieksekusi oleh server.
  - Lakukan scan antivirus pada file yang diunggah jika memungkinkan.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini adalah bagian dari manajemen konten visual untuk website.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **File Upload:** Middleware `multer` untuk menangani `multipart/form-data`. Konfigurasikan `multer` dengan filter file (untuk tipe) dan batas ukuran.
- **Storage:** Gunakan `aws-sdk` untuk upload ke S3, atau `fs` module untuk menyimpan di disk lokal.
- **Controller:** `controllers/admin/gallery.controller.js` -> `upload`.
- **Middleware:** Otentikasi JWT, otorisasi role `admin`, dan `multer`.

## Non-Goal
- Pemrosesan gambar (cropping, resizing, watermarking) secara sinkron. Jika dibutuhkan, lakukan di background job.
- Manajemen album atau folder.

## Asumsi
- Konfigurasi untuk file storage (S3 credentials atau path lokal) sudah di-setup.

## Risiko & Mitigasi
- **Risiko:** Penyimpanan file yang besar dan tidak terkontrol dapat memenuhi disk space atau S3 bucket.
  - **Mitigasi:** Terapkan validasi ukuran file yang ketat. Buat kebijakan untuk membersihkan media yang tidak terpakai.
- **Risiko:** Upload file berbahaya (misal: PHP script yang disamarkan sebagai gambar).
  - **Mitigasi:** Lakukan validasi MimeType yang ketat di backend. Konfigurasikan server web agar tidak mengeksekusi script dari direktori upload. Gunakan nama file yang di-generate oleh sistem.

## Scope In
- Menerima upload file (gambar/video).
- Menerima `caption` dan `type`.
- Menyimpan file ke storage.
- Membuat record di database.

## Scope Out
- Mengedit atau mengganti file yang sudah diunggah.
- Mengelola metadata EXIF gambar.

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
