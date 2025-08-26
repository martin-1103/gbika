# Halaman: Galeri

- **Route**: `/galeri`
- **Tujuan**: Menampilkan dokumentasi visual (foto dan video) dari kegiatan dan pelayanan El Shaddai FM.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Daftar Item Galeri**: `GET /gallery`
  - **Asumsi**: Perlu dibuat endpoint `GET /gallery` yang mendukung pagination (`page`, `limit`) dan filter berdasarkan tipe (`image`, `video`).

---

### Komponen UI

- **Filter Tipe Konten**:
  - Tombol atau tab untuk memfilter antara "Foto" dan "Video".
- **Grid Galeri**:
  - Tampilan grid responsif yang menampilkan thumbnail dari foto atau video.
  - Saat thumbnail diklik, gambar akan terbuka dalam lightbox atau video akan diputar dalam modal.
- **Pagination**:
  - Navigasi untuk memuat lebih banyak item galeri.
- **Deskripsi**:
  - Setiap item galeri memiliki judul atau deskripsi singkat yang muncul saat di-hover atau di dalam lightbox.

---

### State Management

- **Loading**: Skeleton loader untuk grid saat item galeri sedang dimuat.
- **Error**: Pesan error jika gagal mengambil data dari API.
- **Empty**: Pesan yang ditampilkan jika tidak ada item galeri yang tersedia.
