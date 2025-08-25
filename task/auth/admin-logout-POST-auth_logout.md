# Admin Logout — POST — /auth/logout

## Tujuan
Menyediakan endpoint untuk pengguna yang sudah login agar dapat keluar dari sistem secara aman. Tergantung pada implementasi, ini bisa berarti membatalkan token di sisi server (blacklist) atau hanya menginstruksikan klien untuk menghapus token.

## Dependencies
- [x] /task/auth/admin-login-POST-auth_login.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Logout Berhasil**
  - **Given** seorang pengguna telah login dan memiliki `accessToken` yang valid
  - **When** pengguna mengirim request `POST /auth/logout` dengan menyertakan token di header `Authorization`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi pesan sukses, misal: `{"message": "Logout berhasil."}`
  - **And** `accessToken` yang digunakan tidak dapat lagi dipakai untuk mengakses endpoint yang terproteksi.

- **Scenario 2: Logout dengan Token Tidak Valid**
  - **Given** pengguna menggunakan token yang sudah kedaluwarsa atau tidak valid
  - **When** pengguna mengirim request `POST /auth/logout`
  - **Then** sistem merespon dengan status code `401 Unauthorized`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `auth.service.js` dapat menambahkan ID token ke blacklist (misal: di Redis).
- **Integrasi:**
  - 1. Login untuk mendapatkan token.
  - 2. Panggil `POST /auth/logout` dengan token tersebut.
  - 3. Coba akses endpoint terproteksi (misal: `GET /auth/me`) menggunakan token yang sama. Harapkan response `401 Unauthorized`.
- **Negatif:**
  - Panggil endpoint logout dua kali dengan token yang sama. Harapkan response `401` pada panggilan kedua.
- **Keamanan:**
  - Pastikan mekanisme blacklist token bekerja dengan benar untuk mencegah penyalahgunaan token yang "seharusnya" sudah tidak valid.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Logout adalah fitur keamanan standar. Dengan JWT yang stateless, logout yang "sebenarnya" (membuat token tidak valid sebelum expiry) memerlukan state di sisi server, biasanya dalam bentuk blacklist.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/auth.controller.js` -> `logout`.
- **Middleware:** `auth.middleware.js` untuk memverifikasi token.
- **Blacklisting:**
  - **Strategi:** Simpan `jti` (JWT ID) atau signature token di dalam blacklist (Redis adalah pilihan yang sangat baik untuk ini) dengan TTL yang sama dengan sisa waktu validitas token.
  - Middleware `auth.middleware.js` harus memeriksa apakah token ada di blacklist sebelum memvalidasinya.
- **Alternatif Stateless:** Jika tidak ingin ada state di server, endpoint ini hanya akan mengembalikan `200 OK`. Tanggung jawab untuk menghapus token sepenuhnya ada di sisi klien (frontend). Namun, ini berarti token tersebut secara teknis masih valid sampai kedaluwarsa.

## Non-Goal
- Meng-handle logout dari semua device (kill all sessions).

## Asumsi
- Implementasi stateful (blacklist) dipilih untuk keamanan yang lebih tinggi.

## Risiko & Mitigasi
- **Risiko:** Jika Redis (atau storage blacklist) down, logout tidak akan tercatat.
  - **Mitigasi:** Pastikan infrastruktur Redis memiliki high availability. Jika Redis down, sistem bisa fallback ke perilaku stateless (token tetap valid sampai expiry).

## Scope In
- Menerima request dari pengguna terotentikasi.
- Menambahkan token ke blacklist.
- Mengembalikan response sukses.

## Scope Out
- Menghapus token dari storage klien (ini adalah tugas frontend).

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
