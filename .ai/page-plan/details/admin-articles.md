# Halaman: Manajemen Artikel

- **Route**: `/admin/articles`
- **Tujuan**: Memungkinkan admin dan editor untuk mengelola seluruh siklus hidup artikel dan renungan (Create, Read, Update, Delete).
- **Role**: `Admin`, `Editor`

---

### Data & Endpoints

- **List Artikel**: `articles__GET__articles` (versi admin, menampilkan semua status: draft, published)
- **Hapus Artikel**: `articles__DELETE__articles--slug-`
- **Buat Artikel**: `articles__POST__articles`
- **Update Artikel**: `articles__PUT__articles--slug-`

---

### Komponen UI

- **Tabel Artikel**:
  - Menampilkan daftar artikel dengan kolom: `Judul`, `Slug`, `Status`, `Tanggal Publikasi`, `Aksi`.
  - Mendukung pagination.
- **Tombol Aksi**:
  - "Tambah Artikel Baru" yang mengarah ke halaman form.
  - Di setiap baris: tombol "Edit" dan "Hapus".
- **Filter & Search**:
  - Filter berdasarkan status (`draft`, `published`).
  - Pencarian berdasarkan judul.
- **Modal Konfirmasi**:
  - Muncul saat tombol "Hapus" diklik untuk meminta konfirmasi.

---

### State Management

- **Loading**: Skeleton loader untuk tabel saat data dimuat.
- **Deleting**: Status loading pada baris yang sedang dihapus.
- **Success/Error**: Notifikasi (toast/snackbar) setelah berhasil membuat, mengubah, atau menghapus artikel.
- **Protected Route**: Memerlukan login dan peran `Admin` atau `Editor`.
