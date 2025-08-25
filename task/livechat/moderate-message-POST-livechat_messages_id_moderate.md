# Moderasi Pesan Live Chat — POST — livechat/messages/{id}/moderate

## Tujuan
Menyediakan endpoint yang aman bagi Admin dan Penyiar untuk memoderasi pesan yang masuk dari pendengar. Aksi moderasi meliputi menyetujui (`approve`), menyembunyikan (`reject`), atau memblokir (`block`) pengguna yang mengirim pesan.

## Dependencies
- (Asumsi) /task/auth/admin-login-POST-auth_login.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Penyiar Menyetujui Pesan**
  - **Given** seorang Penyiar telah login dan memiliki token otentikasi (JWT)
  - **And** ada pesan dengan ID `123` yang berstatus `pending`
  - **When** Penyiar mengirim request `POST /livechat/messages/123/moderate` dengan body `{"action": "approve"}` dan header `Authorization: Bearer <token>`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** status pesan di database diubah menjadi `approved`
  - **And** pesan tersebut di-broadcast melalui WebSocket ke channel `feed:public` untuk ditampilkan di widget homepage.

- **Scenario 2: Admin Menolak Pesan**
  - **Given** seorang Admin telah login
  - **And** ada pesan dengan ID `456` yang berstatus `pending`
  - **When** Admin mengirim request `POST /livechat/messages/456/moderate` dengan body `{"action": "reject"}`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** status pesan di database diubah menjadi `rejected`.

- **Scenario 3: Pengguna Tidak Terotentikasi**
  - **Given** pengguna tidak memiliki token otentikasi yang valid
  - **When** pengguna mencoba mengirim request `POST /livechat/messages/123/moderate`
  - **Then** sistem merespon dengan status code `401 Unauthorized`.

- **Scenario 4: Aksi Moderasi Tidak Valid**
  - **Given** seorang Penyiar telah login
  - **When** Penyiar mengirim request dengan body `{"action": "delete"}` (aksi yang tidak diizinkan)
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error yang jelas.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `moderation.service.js` dapat mengubah status pesan dengan benar.
  - Test middleware otorisasi (role `Admin` atau `Penyiar`) bekerja sesuai harapan.
- **Integrasi:**
  - Lakukan request end-to-end sebagai Admin, verifikasi perubahan status di database.
  - Verifikasi bahwa setelah pesan di-`approve`, event WebSocket terkirim ke channel yang benar (misal: via Redis Pub/Sub).
- **Negatif:**
  - Coba akses endpoint dengan role pengguna biasa (bukan Admin/Penyiar). Harapkan `403 Forbidden`.
  - Coba moderasi pesan yang tidak ada (ID salah). Harapkan `404 Not Found`.
  - Kirim body request tanpa field `action`. Harapkan `422`.
- **Keamanan:**
  - Pastikan hanya role yang diizinkan (Admin, Penyiar) yang bisa mengakses endpoint ini (Role-Based Access Control).
  - Cegah IDOR (Insecure Direct Object Reference) dengan memastikan pesan yang dimoderasi milik konteks yang benar.

## Artefak
- Skema OpenAPI/Swagger untuk endpoint.
- Definisi role dan permission dalam dokumentasi sistem.

## Context
Moderasi adalah komponen krusial untuk fitur "Suara Pendengar" agar konten yang ditampilkan ke publik tetap terkurasi dan aman. Endpoint ini akan sering digunakan dari Admin Panel/Dashboard Penyiar.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Routing:** `routes/admin/livechat.routes.js`.
- **Middleware:**
  - `auth.middleware.js`: Memverifikasi JWT dari header `Authorization`.
  - `roles.middleware.js`: Memeriksa apakah user memiliki role `admin` atau `penyiar`.
- **Controller:** `controllers/admin/livechat.controller.js`.
- **Service:** `services/moderation.service.js`.
- **Events:** Setelah moderasi berhasil, service akan mem-publish event ke Redis. WebSocket server akan menerima event ini dan menyiarkannya ke klien yang relevan.

## Non-Goal
- Mengedit konten pesan.
- Membalas pesan (ini dilakukan melalui WebSocket, bukan REST API ini).
- Moderasi massal (bulk moderation) dalam satu request.

## Asumsi
- Sistem role dan permission sudah terdefinisi dengan jelas.
- Admin/Penyiar berinteraksi melalui sebuah UI (Admin Panel) yang memanggil API ini.

## Risiko & Mitigasi
- **Risiko:** Kesalahan moderasi oleh manusia.
  - **Mitigasi:** Sediakan fitur "undo" atau log moderasi di Admin Panel agar aksi bisa dilacak dan dibatalkan jika perlu.
- **Risiko:** Delay antara aksi moderasi dan pembaruan di UI publik.
  - **Mitigasi:** Gunakan arsitektur berbasis event (Redis Pub/Sub) dan WebSocket untuk memastikan pembaruan terjadi secara instan.

## Scope In
- Menerima aksi `approve`, `reject`, `block`.
- Mengubah status pesan di database.
- Memicu event untuk notifikasi real-time.
- Otentikasi dan otorisasi request.

## Scope Out
- UI untuk panel moderasi.
- Analitik dan laporan moderasi.
- Auto-moderasi menggunakan AI/filter kata kunci.

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
