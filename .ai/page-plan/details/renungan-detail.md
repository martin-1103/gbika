# Halaman: Detail Renungan

- **Route**: `/renungan/:slug`
- **Tujuan**: Menampilkan konten lengkap dari satu artikel atau renungan yang dipilih.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Detail Artikel**: `articles__GET__articles--slug-`
  - Mengambil data artikel spesifik berdasarkan `slug` dari parameter URL.

---

### Komponen UI

- **Judul Artikel**:
  - Teks besar sebagai judul utama.
- **Meta Artikel**:
  - Informasi seperti tanggal publikasi.
- **Konten Artikel**:
  - Area utama untuk menampilkan isi teks dari renungan.
- **Tombol Berbagi (Share)**:
  - Tombol untuk berbagi artikel ke media sosial.
- **Artikel Terkait (Opsional)**:
  - Daftar beberapa artikel lain yang relevan di bagian bawah.

---

### State Management

- **Loading**: Skeleton loader saat konten artikel sedang dimuat.
- **Error**: Tampilan "404 Not Found" jika artikel dengan slug tersebut tidak ditemukan, atau pesan error umum jika ada masalah lain.
