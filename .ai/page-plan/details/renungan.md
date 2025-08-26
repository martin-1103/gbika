# Halaman: Renungan & Artikel

- **Route**: `/renungan`
- **Tujuan**: Menyediakan sumber bacaan rohani bagi pendengar dan menjadi arsip konten yang dapat diakses kapan saja.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Daftar Artikel**: `articles__GET__articles`
  - Menggunakan parameter `page` dan `limit` untuk pagination.
  - Menggunakan `sort_by` dan `sort_order` untuk pengurutan.

---

### Komponen UI

- **Daftar Artikel**:
  - Grid atau daftar yang menampilkan setiap artikel dengan judul, ringkasan singkat, dan tanggal publikasi.
- **Pagination**:
  - Tombol "Next" dan "Previous" atau nomor halaman untuk navigasi.
- **Filter & Sorting**:
  - Dropdown untuk mengurutkan artikel (terbaru, terlama).
  - Opsi filter berdasarkan kategori (jika diimplementasikan di masa depan).
- **Search Bar**:
  - Input teks untuk mencari artikel berdasarkan judul atau kata kunci.

---

### State Management

- **Loading**: Skeleton loader saat daftar artikel sedang dimuat.
- **Error**: Pesan error jika gagal mengambil data.
- **Empty**: Pesan yang ditampilkan jika tidak ada artikel yang ditemukan atau hasil pencarian kosong.
