# Halaman: Admin Dashboard

- **Route**: `/admin/dashboard`
- **Tujuan**: Memberikan ringkasan visual dari aktivitas terbaru di website untuk admin dan editor.
- **Role**: `Admin`, `Editor`

---

### Data & Endpoints

- **Statistik Umum**:
  - `articles__GET__articles?limit=5`: Untuk widget "Artikel Terbaru".
  - `testimonials__GET__testimonials?status=pending`: Untuk widget "Kesaksian Perlu Moderasi".
  - *Asumsi*: Perlu endpoint baru untuk statistik agregat (mis. `GET /statistics/summary`).

---

### Komponen UI

- **Layout Admin**:
  - Sidebar navigasi untuk akses ke modul lain (Artikel, Jadwal, dll.).
  - Header dengan informasi pengguna yang login dan tombol logout.
- **Kartu Statistik**:
  - Kartu yang menampilkan jumlah total artikel, kesaksian menunggu, pesan masuk, dll.
- **Widget Aktivitas Terbaru**:
  - Daftar singkat artikel yang baru dibuat.
  - Daftar kesaksian yang menunggu persetujuan.
- **Grafik (Opsional)**:
  - Grafik sederhana yang menunjukkan tren pengunjung atau interaksi.

---

### State Management

- **Loading**: Skeleton loader untuk setiap widget saat data sedang diambil.
- **Error**: Pesan error di dalam widget jika data gagal dimuat.
- **Protected Route**: Jika pengguna belum login, arahkan kembali ke `/admin/login`.
