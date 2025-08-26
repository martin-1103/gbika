# Halaman: Moderasi Live Chat (Admin)

- **Route**: `/admin/live-chat`
- **Tujuan**: Memberikan antarmuka bagi penyiar dan admin untuk melihat, memoderasi, dan berinteraksi dengan pesan yang masuk dari pendengar secara realtime.
- **Role**: `Admin`, `Penyiar`

---

### Data & Endpoints

- **Koneksi WebSocket**: `WEBSOCKET /livechat/ws` (dengan token otentikasi admin/penyiar).
- **Moderasi Pesan**: `POST /livechat/messages/:id/moderate`
  - Mengirim status baru untuk pesan (`approved`, `rejected`).
- **Terima Pesan Baru**: Mendengarkan event dari WebSocket (`event: 'adminNewMessage'`).

---

### Komponen UI

- **Layout Multi-kolom**:
  - **Kolom "Pesan Masuk"**: Menampilkan semua pesan baru dengan status `pending`. Pesan dengan kata kunci (mis. "doa") di-highlight.
  - **Kolom "On-Air / Disetujui"**: Menampilkan pesan yang telah disetujui (`approved`) dan siap untuk dibacakan atau ditampilkan.
  - **Kolom "Ditolak"**: Arsip pesan yang ditolak (`rejected`).
- **Aksi Moderasi**:
  - Di setiap pesan di kolom "Pesan Masuk", terdapat tombol "Setujui" dan "Tolak".
  - Tombol "Blokir Pengguna" untuk menghentikan pengguna mengirim pesan lebih lanjut.
- **Panel Balas Cepat**:
  - Textarea untuk mengirim balasan ke pengguna.
  - Daftar template balasan yang bisa diklik.
- **Filter & Search**:
  - Filter pesan berdasarkan status.
  - Cari pesan berdasarkan nama pengirim atau isi pesan.

---

### State Management

- **Realtime Update**: Daftar pesan di setiap kolom diperbarui secara otomatis saat ada pesan baru masuk atau saat status pesan diubah.
- **Loading**: Indikator loading saat melakukan aksi moderasi (menyetujui/menolak).
- **Protected Route**: Memerlukan login dan peran `Admin` atau `Penyiar`.
