# Registrasi Partnership — POST — /membership/register

## Tujuan
Menyediakan endpoint publik bagi calon partner untuk mendaftar ke program partnership. Endpoint ini menerima data diri pendaftar dan tingkatan yang dipilih.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Pendaftaran Berhasil**
  - **Given** seorang calon partner mengisi form registrasi
  - **When** pengguna mengirim request `POST /membership/register` dengan data yang valid (nama, email, telepon, tier_id)
  - **Then** sistem merespon dengan status code `201 Created`
  - **And** response body berisi pesan sukses
  - **And** data pendaftaran tersimpan di database
  - **And** sebuah notifikasi (email atau WhatsApp) dikirim ke tim admin untuk follow-up.

- **Scenario 2: Pendaftaran dengan Email Duplikat**
  - **Given** email `partner@example.com` sudah terdaftar
  - **When** pengguna mencoba mendaftar lagi dengan email yang sama
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error `{"errors": {"email": ["Email ini sudah terdaftar."]}}`.

- **Scenario 3: Pendaftaran dengan Data Tidak Lengkap**
  - **When** pengguna mengirim request tanpa menyertakan `name`
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error yang sesuai.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `membership.service.js` dapat menyimpan data pendaftar baru.
  - Test middleware validasi menolak input yang tidak valid.
- **Integrasi:**
  - Lakukan request `POST` dan verifikasi data tersimpan di DB.
  - Mock service notifikasi dan verifikasi bahwa method untuk mengirim email/notifikasi telah dipanggil.
- **Negatif:**
  - Kirim request dengan `tier_id` yang tidak ada. Harapkan `422`.
  - Lakukan spam submit dari IP yang sama. Harapkan `429 Too Many Requests`.
- **Keamanan:**
  - Lakukan sanitasi pada semua input untuk mencegah XSS.
  - Terapkan rate limiting dan captcha (misal: hCaptcha) di frontend untuk mencegah spam.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Ini adalah "call to action" utama dari halaman membership, mengubah pengunjung tertarik menjadi lead yang bisa di-follow-up oleh tim.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/membership.controller.js` -> `register`.
- **Service:** `services/membership.service.js`.
- **Validasi:** Middleware validasi untuk semua field yang dibutuhkan.
- **Notifikasi:** Gunakan library seperti `nodemailer` untuk mengirim email, atau integrasi dengan API WhatsApp. Pengiriman notifikasi harus dilakukan secara asinkron (background job) agar tidak memperlambat response ke user.

## Non-Goal
- Memproses pembayaran.
- Membuat akun login untuk partner.

## Asumsi
- Proses selanjutnya setelah registrasi (verifikasi, pembayaran) dilakukan secara manual/offline oleh admin.

## Risiko & Mitigasi
- **Risiko:** Pendaftaran spam atau bot.
  - **Mitigasi:** Wajibkan penggunaan captcha di sisi frontend. Terapkan rate limiting yang ketat di backend.
- **Risiko:** Gagal mengirim notifikasi ke admin.
  - **Mitigasi:** Gunakan sistem antrian (queue) untuk pengiriman notifikasi dengan mekanisme retry. Log setiap kegagalan pengiriman.

## Scope In
- Menerima data pendaftar.
- Validasi data.
- Menyimpan data ke database.
- Memicu notifikasi ke admin.

## Scope Out
- Alur pembayaran online.
- Dashboard untuk partner.

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
