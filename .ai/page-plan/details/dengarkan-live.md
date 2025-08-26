# Halaman: Dengarkan Live & Kirim Pesan

- **Route**: `/live`
- **Tujuan**: Menjadi halaman utama untuk mendengarkan siaran radio secara streaming dan berinteraksi langsung dengan penyiar melalui pesan teks.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Audio Stream URL**: URL statis ke server streaming radio (mis. Icecast/Shoutcast).
- **Koneksi WebSocket**: `WEBSOCKET /livechat/ws`
  - Untuk mengirim dan menerima pesan chat.
- **Inisiasi Sesi**: `POST /livechat/session`
  - Mengirim data awal pengguna (nama, kota) untuk memulai sesi chat.

---

### Komponen UI

- **Radio Player Utama**:
  - Komponen audio player yang menjadi fokus utama halaman.
  - Menampilkan status (Live / Offline), nama program yang sedang berjalan, dan kontrol volume.
- **Jendela Chat**:
  - Ditempatkan di samping atau di bawah player.
  - **Form Data Pengirim**: Meminta `Nama` dan `Kota` sebelum bisa mengirim pesan (disimpan di `localStorage`).
  - **Input Pesan**: Textarea untuk mengetik pesan dan tombol "Kirim".
  - **Tampilan Pesan**: Area untuk menampilkan pesan terkirim.
- **Captcha**:
  - Integrasi hCaptcha untuk mencegah spam pada pengiriman pesan.

---

### State Management

- **Player State**: Mengelola status player (playing, paused, buffering, error).
- **Chat State**:
  - **Connecting**: Status saat mencoba terhubung ke WebSocket.
  - **Connected**: Status terhubung, form input pesan aktif.
  - **Disconnected**: Status terputus, menampilkan pesan untuk mencoba menyambung ulang.
  - **Submitting**: Status loading pada pesan yang sedang dikirim.
