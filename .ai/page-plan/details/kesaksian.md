# Halaman: Kesaksian

- **Route**: `/kesaksian` dan `/kesaksian/kirim`
- **Tujuan**: Menjadi platform bagi pendengar untuk berbagi dan membaca kesaksian, serta memperkuat iman komunitas.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Daftar Kesaksian**: `testimonials__GET__testimonials`
  - Menggunakan `page` dan `limit` untuk pagination.
- **Submit Kesaksian**: `testimonials__POST__testimonials`

---

### Komponen UI

- **Daftar Kesaksian (`/kesaksian`)**:
  - Daftar kesaksian yang telah disetujui, menampilkan judul, nama pengirim, dan kutipan singkat.
  - Pagination untuk navigasi.
  - Tombol ajakan "Bagikan Kesaksian Anda" yang mengarah ke `/kesaksian/kirim`.
- **Form Kirim Kesaksian (`/kesaksian/kirim`)**:
  - Input untuk `Nama`, `Email`, `Kota`.
  - Input untuk `Judul Kesaksian`.
  - Textarea untuk `Isi Kesaksian`.
  - Tombol "Kirim Kesaksian".
- **Notifikasi**:
  - Pesan sukses setelah form berhasil dikirim, memberitahu bahwa kesaksian akan direview.

---

### State Management

- **Loading**: Skeleton loader saat memuat daftar kesaksian.
- **Submitting**: Status loading pada tombol kirim form.
- **Success/Error**: Pesan notifikasi untuk kedua halaman (daftar dan form).
- **Empty**: Pesan jika belum ada kesaksian yang ditampilkan.
