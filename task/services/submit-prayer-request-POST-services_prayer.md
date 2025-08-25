# Submit Permohonan Doa — POST — /services/prayer

## Tujuan
Menyediakan endpoint publik bagi pendengar untuk mengirimkan permohonan doa. Data yang masuk akan disimpan dan diteruskan ke tim doa.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Permohonan Doa Berhasil Dikirim**
  - **Given** seorang pendengar mengisi form permohonan doa
  - **When** pengguna mengirim request `POST /services/prayer` dengan data valid (nama, kontak, isi doa, `is_anonymous`)
  - **Then** sistem merespon dengan status code `201 Created`
  - **And** response body berisi pesan sukses
  - **And** data permohonan doa tersimpan di database
  - **And** notifikasi dikirim ke tim doa.

- **Scenario 2: Request dengan Isi Doa Kosong**
  - **When** pengguna mengirim request dengan `prayer_content` yang kosong
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error yang jelas.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `prayer.service.js` dapat menyimpan data permohonan doa.
  - Test middleware validasi menolak input yang tidak valid.
- **Integrasi:**
  - Lakukan request `POST` dan verifikasi data tersimpan di DB.
  - Mock service notifikasi dan verifikasi method-nya dipanggil.
- **Negatif:**
  - Lakukan spam submit dari IP yang sama. Harapkan `429 Too Many Requests`.
- **Keamanan:**
  - Lakukan sanitasi pada semua input teks untuk mencegah XSS.
  - Terapkan rate limiting dan captcha di frontend.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Ini adalah salah satu fitur pelayanan utama, memungkinkan interaksi langsung antara pendengar dan tim pelayanan doa.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/service.controller.js` -> `submitPrayerRequest`.
- **Service:** `services/prayer.service.js`.
- **Database:** Tabel `prayer_requests` (`id`, `name`, `contact`, `content`, `is_anonymous`, `created_at`).
- **Notifikasi:** Sama seperti registrasi membership, gunakan `nodemailer` atau integrasi lain secara asinkron.

## Non-Goal
- Menampilkan daftar permohonan doa secara publik.
- Memberikan balasan/feedback langsung kepada pengirim melalui sistem.

## Asumsi
- Follow-up doa dilakukan secara offline oleh tim.

## Risiko & Mitigasi
- **Risiko:** Spam atau permohonan doa yang tidak pantas.
  - **Mitigasi:** Wajibkan captcha di frontend. Terapkan rate limiting. Admin panel harus memiliki fitur untuk memoderasi atau menghapus permohonan yang masuk.
- **Risiko:** Kegagalan pengiriman notifikasi.
  - **Mitigasi:** Gunakan sistem antrian (queue) dengan retry.

## Scope In
- Menerima data permohonan doa.
- Validasi dan penyimpanan data.
- Memicu notifikasi ke tim doa.

## Scope Out
- Manajemen status permohonan doa (misal: "sudah didoakan").
- Komunikasi dua arah.

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
