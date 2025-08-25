# Submit Kesaksian — POST — /testimonials

## Tujuan
Menyediakan endpoint publik bagi pendengar untuk mengirimkan kesaksian mereka. Kesaksian yang masuk akan ditampung dengan status `pending` untuk dimoderasi oleh admin.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Kesaksian Berhasil Dikirim**
  - **Given** seorang pendengar mengisi form kesaksian
  - **When** pengguna mengirim request `POST /testimonials` dengan data valid (nama, email, kota, judul, isi kesaksian)
  - **Then** sistem merespon dengan status code `201 Created`
  - **And** response body berisi pesan sukses
  - **And** data kesaksian tersimpan di database dengan status `pending`
  - **And** notifikasi dikirim ke admin untuk moderasi.

- **Scenario 2: Request dengan Isi Kesaksian Kosong**
  - **When** pengguna mengirim request dengan `content` yang kosong
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error yang jelas.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `testimonial.service.js` dapat menyimpan data dengan status default `pending`.
- **Integrasi:**
  - Lakukan request `POST` dan verifikasi data tersimpan di DB dengan status `pending`.
  - Mock service notifikasi dan verifikasi method-nya dipanggil.
- **Negatif:**
  - Lakukan spam submit. Harapkan `429 Too Many Requests`.
- **Keamanan:**
  - Lakukan sanitasi pada semua input teks.
  - Terapkan rate limiting dan captcha.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Fitur ini mendorong keterlibatan komunitas dan menyediakan konten yang berharga untuk dibagikan kepada pendengar lain.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/testimonial.controller.js` -> `submit`.
- **Service:** `services/testimonial.service.js`.
- **Database:** Tabel `testimonials` dengan `status` enum.
- **Notifikasi:** Kirim notifikasi ke admin secara asinkron.

## Non-Goal
- Upload file (foto/video) bersamaan dengan kesaksian.
- Mengedit kesaksian setelah dikirim.

## Asumsi
- Semua kesaksian yang masuk memerlukan moderasi sebelum ditampilkan.

## Risiko & Mitigasi
- **Risiko:** Spam atau kesaksian palsu.
  - **Mitigasi:** Captcha dan rate limiting. Proses moderasi oleh admin adalah filter utama.

## Scope In
- Menerima data kesaksian.
- Validasi dan penyimpanan data dengan status `pending`.
- Memicu notifikasi ke admin.

## Scope Out
- Proses moderasi (akan ada di endpoint admin terpisah).
- Menampilkan kesaksian (endpoint GET).

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
