# Inisiasi Sesi Live Chat — POST — livechat/session

## Tujuan
Membuat endpoint untuk pengguna (baik guest maupun member) agar dapat menginisiasi sesi percakapan. Pengguna mengirimkan data diri (nama, kota, negara) dan menerima sebuah session token sebagai gantinya. Token ini akan digunakan untuk otentikasi koneksi WebSocket selanjutnya. Data pengguna disimpan di cookies untuk penggunaan di masa depan.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Pengguna Baru (Guest) Menginisiasi Sesi**
  - **Given** pengguna belum pernah berinteraksi dengan fitur live chat
  - **When** pengguna mengirimkan request `POST /livechat/session` dengan body JSON berisi `{"name": "Budi", "city": "Solo", "country": "Indonesia"}`
  - **Then** sistem merespon dengan status code `201 Created`
  - **And** response body berisi JSON dengan `sessionToken` (format JWT)
  - **And** sistem menyimpan data pengguna (`name`, `city`, `country`) ke dalam cookies browser dengan masa berlaku 1 tahun.
  - **And** sebuah record sesi baru dibuat di database.

- **Scenario 2: Pengguna Lama Kembali**
  - **Given** pengguna sudah pernah berinteraksi dan memiliki data di cookies
  - **When** pengguna membuka halaman live chat
  - **Then** frontend secara otomatis membaca data dari cookies dan menampilkannya di form.

- **Scenario 3: Request Tanpa Data yang Dibutuhkan**
  - **Given** pengguna adalah guest
  - **When** pengguna mengirimkan request `POST /livechat/session` dengan body `{"name": ""}`
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi error map yang jelas, contoh: `{"errors": {"name": ["Nama wajib diisi."]}}`

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `session.service.js` dapat membuat sesi baru dengan data valid menggunakan mock database.
  - Test middleware validasi (menggunakan `express-validator` atau `zod`) menolak input yang salah.
- **Integrasi:**
  - Kirim request `POST` ke endpoint `/livechat/session` dan verifikasi data sesi tersimpan di database (PostgreSQL).
  - Verifikasi bahwa response header `Set-Cookie` telah dikirim dengan benar.
- **Negatif:**
  - **Data Uji:** `{"name": null, "city": "Solo"}` → Harapkan `422`.
  - **Data Uji:** `{"name": "Budi", "city": "S"}` → Harapkan `422` jika ada validasi panjang minimal.
  - **Data Uji:** Kirim request dengan `Content-Type` yang salah → Harapkan `415`.
- **Kinerja:**
  - Lakukan load testing dengan 100 request/detik untuk memastikan endpoint merespon di bawah 200ms.
- **Keamanan:**
  - Pastikan tidak ada XSS pada field `name`, `city`, `country`.
  - Pastikan `sessionToken` yang di-generate menggunakan algoritma yang kuat (misal: RS256) dan memiliki expiry time yang wajar (misal: 24 jam).

## Artefak
- Skema OpenAPI/Swagger untuk endpoint.
- Postman collection untuk pengujian manual.

## Context
Endpoint ini adalah pintu gerbang untuk fitur "Suara Pendengar". Tanpa sesi yang valid, pengguna tidak bisa terhubung ke WebSocket. Penyimpanan data di cookies bertujuan untuk meningkatkan user experience agar pengguna tidak perlu mengisi data berulang kali.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js (atau Fastify).
- **Routing:** `routes/livechat.routes.js` dengan handler di `controllers/livechat.controller.js`.
- **Logic:** `services/session.service.js`.
- **Validasi:** Middleware menggunakan `express-validator` atau `zod`.
- **Database:** PostgreSQL dengan ORM seperti Prisma atau Sequelize.
- **Cookies:** Menggunakan middleware `cookie-parser`.
- **JWT:** Menggunakan library `jsonwebtoken` untuk membuat dan memverifikasi token. Token akan berisi `session_id` dan `user_id` (bisa guest ID).

## Non-Goal
- Endpoint ini tidak menangani otentikasi member terdaftar. Proses itu ditangani oleh modul `auth`.
- Endpoint ini tidak membuat koneksi WebSocket, hanya menyediakan token untuk itu.

## Asumsi
- Pengguna mengizinkan penggunaan cookies di browser mereka.
- Sistem dapat menangani pembuatan user "guest" secara implisit saat sesi dibuat.

## Risiko & Mitigasi
- **Risiko:** Potensi spam atau pembuatan sesi massal (bot).
  - **Mitigasi:** Terapkan rate limiting per IP address (misal: menggunakan `express-rate-limit`). Implementasikan hCaptcha di sisi frontend sebelum request dikirim.
- **Risiko:** Data pengguna di cookies dapat di-tamper.
  - **Mitigasi:** Meskipun data ini tidak kritis, jangan pernah mempercayai data dari cookies secara langsung. Lakukan validasi ulang di backend.

## Scope In
- Menerima data `name`, `city`, `country`.
- Validasi input.
- Membuat record sesi di database.
- Men-generate JWT `sessionToken`.
- Mengirim `sessionToken` dalam response body.
- Menyimpan data pengguna di cookies.

## Scope Out
- Manajemen profil pengguna.
- Riwayat percakapan.
- Login untuk penyiar atau member.

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
