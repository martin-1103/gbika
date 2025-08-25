# Submit Request Lagu — POST — /services/song-request

## Tujuan
Menyediakan endpoint publik bagi pendengar untuk mengirimkan request lagu. Data yang masuk akan diteruskan ke penyiar yang sedang siaran.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Request Lagu Berhasil Dikirim**
  - **Given** seorang pendengar mengisi form request lagu
  - **When** pengguna mengirim request `POST /services/song-request` dengan data valid (nama, kota, judul lagu, pesan)
  - **Then** sistem merespon dengan status code `201 Created`
  - **And** response body berisi pesan sukses
  - **And** data request lagu tersimpan di database
  - **And** notifikasi realtime dikirim ke dashboard penyiar.

- **Scenario 2: Request dengan Judul Lagu Kosong**
  - **When** pengguna mengirim request dengan `song_title` yang kosong
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`
  - **And** response body berisi pesan error yang jelas.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `songRequest.service.js` dapat menyimpan data.
- **Integrasi:**
  - Lakukan request `POST` dan verifikasi data tersimpan di DB.
  - Mock WebSocket server dan verifikasi event notifikasi dipanggil dengan data yang benar.
- **Negatif:**
  - Lakukan spam submit. Harapkan `429 Too Many Requests`.
- **Keamanan:**
  - Lakukan sanitasi pada semua input teks.
  - Terapkan rate limiting dan captcha.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Fitur ini meningkatkan interaktivitas antara pendengar dan penyiar, membuat siaran lebih personal.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/service.controller.js` -> `submitSongRequest`.
- **Service:** `services/songRequest.service.js`.
- **Database:** Tabel `song_requests`.
- **Notifikasi Realtime:** Setelah menyimpan ke DB, service akan mem-publish event ke Redis (misal: channel `song-requests`). WebSocket server yang menangani dashboard penyiar akan subscribe ke channel ini dan mendorong notifikasi ke UI penyiar.

## Non-Goal
- Validasi apakah lagu yang di-request ada di library.
- Memberikan feedback otomatis ke pendengar.

## Asumsi
- Ada dashboard penyiar yang dapat menerima notifikasi realtime.

## Risiko & Mitigasi
- **Risiko:** Spam request.
  - **Mitigasi:** Captcha dan rate limiting.
- **Risiko:** Delay notifikasi ke penyiar.
  - **Mitigasi:** Gunakan arsitektur berbasis event (Redis Pub/Sub) yang cepat dan andal.

## Scope In
- Menerima data request lagu.
- Validasi dan penyimpanan data.
- Memicu notifikasi realtime ke dashboard penyiar.

## Scope Out
- Antrian request lagu otomatis.
- Riwayat request per pengguna.

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
