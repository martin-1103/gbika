# Halaman: Manajemen Kesaksian

- **Route**: `/admin/testimonials`
- **Tujuan**: Memungkinkan admin untuk memoderasi (menyetujui atau menolak) kesaksian yang dikirim oleh pengguna.
- **Role**: `Admin`

---

### Data & Endpoints

- **List Kesaksian**: `testimonials__GET__testimonials` (dengan parameter `status=pending` atau `status=all`)
- **Update Status Kesaksian**: `testimonials__PUT__testimonials--id-`
  - *Asumsi*: Perlu endpoint `PUT` atau `PATCH` untuk mengubah status kesaksian (mis. dari `pending` ke `approved` atau `rejected`).

---

### Komponen UI

- **Tabel Kesaksian**:
  - Menampilkan daftar kesaksian dengan kolom: `Judul`, `Nama Pengirim`, `Status`, `Tanggal Kirim`, `Aksi`.
  - Tab atau filter untuk melihat kesaksian berdasarkan status (`Pending`, `Approved`, `Rejected`).
- **Tombol Aksi**:
  - Di setiap baris (untuk kesaksian `pending`): tombol "Approve" dan "Reject".
  - Tombol "Lihat Detail" untuk membaca isi lengkap kesaksian di modal atau halaman terpisah.
- **Modal Detail**:
  - Menampilkan konten penuh dari kesaksian untuk dibaca admin sebelum mengambil keputusan.

---

### State Management

- **Loading**: Skeleton loader untuk tabel.
- **Updating**: Status loading pada baris yang statusnya sedang diubah.
- **Success/Error**: Notifikasi setelah berhasil mengubah status.
- **Protected Route**: Memerlukan login dan peran `Admin`.
