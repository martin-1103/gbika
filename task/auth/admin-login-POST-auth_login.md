# Admin Login — POST — /auth/login

## Tujuan
Menyediakan endpoint yang aman bagi pengguna (Admin, Editor, Penyiar) untuk login ke sistem backoffice. Endpoint ini menerima email dan password, dan jika valid, mengembalikan JSON Web Token (JWT) untuk otentikasi request selanjutnya.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Login Berhasil dengan Kredensial Valid**
  - **Given** ada pengguna terdaftar dengan email `admin@example.com` dan password `password123`
  - **When** pengguna mengirim request `POST /auth/login` dengan body `{"email": "admin@example.com", "password": "password123"}`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi `accessToken` (JWT) dan informasi pengguna (misal: `id`, `name`, `role`).

- **Scenario 2: Login Gagal dengan Password Salah**
  - **Given** ada pengguna terdaftar dengan email `admin@example.com`
  - **When** pengguna mengirim request `POST /auth/login` dengan password yang salah
  - **Then** sistem merespon dengan status code `401 Unauthorized`
  - **And** response body berisi pesan error `{"message": "Email atau password salah."}`.

- **Scenario 3: Login Gagal dengan Email Tidak Terdaftar**
  - **When** pengguna mengirim request `POST /auth/login` dengan email yang tidak ada di database
  - **Then** sistem merespon dengan status code `401 Unauthorized`
  - **And** response body berisi pesan error `{"message": "Email atau password salah."}` (pesan error disamakan untuk keamanan).

- **Scenario 4: Request dengan Data Tidak Lengkap**
  - **When** pengguna mengirim request `POST /auth/login` hanya dengan `email`
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error `{"errors": {"password": ["Password wajib diisi."]}}`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `auth.service.js` dapat memvalidasi hash password dengan benar menggunakan `bcrypt`.
  - Test `auth.service.js` dapat men-generate JWT yang valid.
- **Integrasi:**
  - Lakukan request `POST` dengan kredensial valid, verifikasi response berisi token.
  - Lakukan request `POST` dengan kredensial tidak valid, verifikasi response `401`.
- **Negatif:**
  - Lakukan beberapa kali percobaan login gagal dari IP yang sama. Harapkan response `429 Too Many Requests` jika ada rate limiting.
- **Keamanan:**
  - Pastikan password di-hash menggunakan algoritma yang kuat (misal: `bcrypt` atau `argon2`).
  - Jangan pernah menyimpan password dalam bentuk plain text.
  - Terapkan rate limiting untuk mencegah serangan brute-force.
  - JWT harus memiliki expiry time yang singkat (misal: 15 menit) dan didukung oleh refresh token.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Ini adalah pintu masuk utama untuk semua pengguna yang akan mengelola konten atau fitur di website. Keamanan adalah prioritas tertinggi.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/auth.controller.js` -> `login`.
- **Service:** `services/auth.service.js`, `services/user.service.js`.
- **Password Hashing:** `bcrypt.js`.
- **JWT:** `jsonwebtoken`.
- **Validasi:** Middleware validasi untuk `email` dan `password`.
- **Payload JWT:** Harus berisi `sub` (user ID) dan `role`.

## Non-Goal
- Registrasi pengguna (diasumsikan dibuat manual oleh super-admin).
- Fitur "Lupa Password".
- Login menggunakan social media (Google, Facebook).

## Asumsi
- Pengguna (admin, editor) sudah ada di database.

## Risiko & Mitigasi
- **Risiko:** Serangan brute-force untuk menebak password.
  - **Mitigasi:** Implementasikan rate limiting (`express-rate-limit`) dan/atau mekanisme account lockout setelah beberapa kali percobaan gagal.
- **Risiko:** Kebocoran token JWT.
  - **Mitigasi:** Gunakan HTTPS di semua komunikasi. Simpan JWT di `httpOnly` cookie jika memungkinkan, atau di memory storage frontend. Edukasi pengguna untuk tidak membagikan token.

## Scope In
- Menerima `email` dan `password`.
- Memvalidasi kredensial.
- Menghasilkan JWT.

## Scope Out
- Manajemen sesi di server.
- Refresh token (bisa jadi task terpisah).

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
