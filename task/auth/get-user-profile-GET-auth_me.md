# Get User Profile — GET — /auth/me

## Tujuan
Menyediakan endpoint terproteksi bagi pengguna yang sudah login untuk mendapatkan informasi profil mereka sendiri. Ini berguna bagi frontend untuk menampilkan nama pengguna, role, dan informasi relevan lainnya.

## Dependencies
- [x] /task/auth/admin-login-POST-auth_login.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Pengguna Terotentikasi Mengambil Profil**
  - **Given** seorang pengguna telah login dan memiliki `accessToken` yang valid
  - **When** pengguna mengirim request `GET /auth/me` dengan menyertakan token di header `Authorization`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi object JSON dengan data pengguna (misal: `id`, `name`, `email`, `role`), tanpa menyertakan data sensitif seperti hash password.

- **Scenario 2: Akses Tanpa Token**
  - **When** pengguna mengirim request `GET /auth/me` tanpa token otentikasi
  - **Then** sistem merespon dengan status code `401 Unauthorized`.

- **Scenario 3: Akses dengan Token yang Sudah di-Logout**
  - **Given** pengguna telah login lalu logout (tokennya masuk blacklist)
  - **When** pengguna mencoba mengirim request `GET /auth/me` dengan token yang sudah tidak valid tersebut
  - **Then** sistem merespon dengan status code `401 Unauthorized`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `user.service.js` dapat menemukan pengguna berdasarkan ID dan mengembalikan data tanpa field sensitif.
- **Integrasi:**
  - 1. Login untuk mendapatkan token.
  - 2. Panggil `GET /auth/me` dengan token tersebut, verifikasi data yang diterima benar.
- **Negatif:**
  - Coba akses dengan token yang salah format atau expired. Harapkan `401`.
- **Keamanan:**
  - Pastikan response **tidak pernah** menyertakan hash password atau informasi sensitif lainnya. Gunakan DTO (Data Transfer Object) atau serialisasi untuk memfilter output.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini adalah endpoint dasar untuk aplikasi yang memerlukan otentikasi, memungkinkan UI untuk mempersonalisasi pengalaman pengguna.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/auth.controller.js` -> `getProfile`.
- **Middleware:** `auth.middleware.js` untuk memverifikasi JWT. ID pengguna (`sub`) dan `role` akan diekstrak dari payload token dan ditambahkan ke object `request`.
- **Service:** `services/user.service.js` akan mengambil data lengkap pengguna dari database berdasarkan ID yang ada di token.
- **Data Filtering:** Gunakan fungsi utilitas atau method pada model untuk menghapus properti sensitif sebelum mengirim response. Contoh: `delete user.password;`.

## Non-Goal
- Mengizinkan pengguna mengambil profil pengguna lain.
- Mengedit profil (ini akan menjadi endpoint `PUT /auth/me` atau `PATCH /auth/me` yang terpisah).

## Asumsi
- ID pengguna yang tersimpan di payload JWT (`sub`) dapat dipercaya (karena token ditandatangani secara digital).

## Risiko & Mitigasi
- **Risiko:** Kebocoran data sensitif jika response tidak difilter dengan benar.
  - **Mitigasi:** Terapkan pengujian unit yang ketat untuk memastikan field seperti `password` tidak pernah ada di response. Gunakan DTO atau serializer secara konsisten.

## Scope In
- Memverifikasi token.
- Mengambil data pengguna yang bersangkutan.
- Mengembalikan data pengguna yang sudah difilter.

## Scope Out
- Mengambil data profil pengguna lain.
- Memperbarui profil.

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
