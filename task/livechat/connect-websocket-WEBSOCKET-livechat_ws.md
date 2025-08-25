# Koneksi WebSocket Live Chat — WEBSOCKET — livechat/ws

## Tujuan
Menyediakan endpoint WebSocket yang aman dan realtime bagi pengguna yang sudah memiliki `sessionToken` untuk mengirim dan menerima pesan. Endpoint ini menjadi jalur komunikasi utama antara pendengar dengan penyiar/admin di dashboard.

## Dependencies
- [x] /task/livechat/initiate-session-POST-livechat_session.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Koneksi Berhasil**
  - **Given** pengguna memiliki `sessionToken` yang valid
  - **When** pengguna mencoba membuka koneksi WebSocket ke `wss://<domain>/livechat/ws` dengan menyertakan `sessionToken` (misal: sebagai query parameter `?token=...`)
  - **Then** koneksi berhasil dibuat (handshake sukses)
  - **And** server mengirimkan event `connection:success` dengan data sesi pengguna.

- **Scenario 2: Koneksi Gagal (Token Tidak Valid)**
  - **Given** pengguna mencoba koneksi dengan `sessionToken` yang salah atau kedaluwarsa
  - **When** pengguna mencoba membuka koneksi WebSocket
  - **Then** koneksi ditolak oleh server dengan status code `401 Unauthorized` atau `403 Forbidden`.

- **Scenario 3: Mengirim Pesan**
  - **Given** pengguna memiliki koneksi WebSocket yang aktif
  - **When** pengguna mengirim event `message:send` dengan payload `{"text": "Request lagu dari Budi di Solo"}`
  - **Then** server menerima pesan tersebut dan menyimpannya ke database
  - **And** server mengirimkan event `message:ack` ke pengirim sebagai konfirmasi
  - **And** server mem-broadcast pesan tersebut ke dashboard admin/penyiar melalui room yang sesuai.

- **Scenario 4: Menerima Pesan dari Admin/Penyiar**
  - **Given** pengguna memiliki koneksi WebSocket yang aktif
  - **When** seorang admin/penyiar membalas pesan pengguna dari dashboard
  - **Then** server mengirimkan event `message:receive` ke pengguna dengan payload `{"from": "Penyiar A", "text": "Terima kasih, lagunya akan segera diputar!"}`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test WebSocket service dapat memvalidasi JWT `sessionToken`.
  - Test message handler dapat memproses dan menyimpan pesan masuk.
- **Integrasi:**
  - Gunakan WebSocket client (seperti `wscat` atau library di Jest) untuk menguji alur koneksi, otentikasi, pengiriman, dan penerimaan event secara end-to-end.
- **Negatif:**
  - Coba koneksi dengan token kosong/invalid/expired. Harapkan koneksi ditolak.
  - Kirim payload pesan dengan format yang salah (misal: bukan JSON atau field tidak lengkap). Harapkan server mengirim event `error:invalid_payload`.
  - Lakukan spam message dari satu koneksi. Harapkan server menerapkan rate limiting dan mungkin memutuskan koneksi.
- **Kinerja:**
  - Uji konkurensi dengan 1000 koneksi simultan, pastikan latensi pengiriman pesan di bawah 500ms.
  - Gunakan Redis Pub/Sub untuk memastikan pesan dapat di-broadcast secara efisien jika aplikasi berjalan di beberapa server (scaling).
- **Keamanan:**
  - Pastikan `sessionToken` divalidasi pada setiap koneksi.
  - Lakukan sanitasi pada semua pesan teks untuk mencegah XSS.
  - Pastikan pengguna hanya bisa menerima pesan yang ditujukan untuk sesi mereka (tidak ada kebocoran data antar sesi).

## Artefak
- Dokumentasi event-event WebSocket (nama event, payload, arah).
- Contoh kode client-side (JavaScript) untuk koneksi dan interaksi.

## Context
Ini adalah tulang punggung dari fitur interaktif "Suara Pendengar". Keandalan dan kecepatan komunikasi di sini sangat krusial untuk user experience. Arsitektur harus dirancang untuk bisa di-scale jika jumlah pendengar yang online sangat tinggi.

## Catatan Teknis
- **Framework/Library:** Node.js dengan library `ws` atau `socket.io` yang diintegrasikan dengan server HTTP (Express.js).
- **Otentikasi:** Saat server WebSocket menerima permintaan upgrade koneksi, akan ada hook untuk memverifikasi `sessionToken` (JWT) yang dikirim oleh klien.
- **Manajemen Koneksi:** Gunakan `Map` object di Node.js untuk skala kecil, atau Redis untuk menyimpan state koneksi (`connection_id` -> `user_id`) jika aplikasi berjalan di beberapa proses/server.
- **Skalabilitas:** Gunakan Redis Pub/Sub. Ketika satu instance server menerima pesan, ia mem-publish ke channel Redis. Semua instance lain yang subscribe ke channel tersebut akan menerima pesan dan meneruskannya ke klien yang relevan.
- **Event Schema (Contoh):**
  - Client → Server: `message:send`, `user:typing`
  - Server → Client: `connection:success`, `message:ack`, `message:receive`, `error:invalid_token`

## Non-Goal
- Video/audio call.
- File sharing.
- Notifikasi di luar sesi koneksi aktif (push notification).

## Asumsi
- Infrastruktur mendukung koneksi WebSocket yang persisten.
- Klien (browser pengguna) mendukung WebSocket.

## Risiko & Mitigasi
- **Risiko:** Koneksi terputus-putus karena jaringan klien yang tidak stabil.
  - **Mitigasi:** Implementasikan mekanisme auto-reconnect di sisi klien dengan exponential backoff. `socket.io` memiliki fitur ini secara default.
- **Risiko:** Beban server tinggi karena banyak koneksi simultan.
  - **Mitigasi:** Rancang arsitektur stateless dengan Redis untuk state management, sehingga mudah di-scale out dengan menambah jumlah server. Gunakan Node.js cluster mode atau process manager seperti PM2.
- **Risiko:** Pesan tidak terkirim (at-most-once delivery).
  - **Mitigasi:** Implementasikan mekanisme acknowledgement (`message:ack`). Jika klien tidak menerima ack dalam waktu tertentu, ia bisa mencoba mengirim ulang (dengan de-duplikasi di sisi server).

## Scope In
- Handshake dan otentikasi koneksi.
- Mengirim pesan teks dari klien ke server.
- Menerima pesan teks dari server ke klien.
- Event `typing` (opsional, nice-to-have).
- Penanganan error koneksi dan payload.

## Scope Out
- Riwayat percakapan (ditangani via REST API).
- Moderasi pesan (ditangani via REST API oleh admin).
- Grup chat atau multi-user chat.

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
