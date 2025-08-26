# Halaman: Layanan (Doa & Request Lagu)

- **Route**: `/layanan/doa` dan `/layanan/request-lagu`
- **Tujuan**: Menyediakan sarana bagi pendengar untuk berinteraksi langsung dengan radio melalui permohonan doa dan permintaan lagu.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Submit Doa**: `services__POST__prayer`
- **Submit Request Lagu**: `services__POST__song-request`

---

### Komponen UI

- **Form Permohonan Doa (`/layanan/doa`)**:
  - Input untuk `Nama`.
  - Input untuk `Kontak` (No. Telepon/Email).
  - Textarea untuk `Isi Doa`.
  - Checkbox untuk `Kirim sebagai anonim`.
  - Tombol "Kirim Permohonan Doa".
- **Form Request Lagu (`/layanan/request-lagu`)**:
  - Input untuk `Nama`.
  - Input untuk `Kota`.
  - Input untuk `Judul Lagu & Penyanyi`.
  - Textarea untuk `Pesan`.
  - Tombol "Kirim Request".
- **Notifikasi**:
  - Pesan sukses setelah form berhasil dikirim.
  - Pesan error jika terjadi kegagalan validasi atau masalah server.

---

### State Management

- **Submitting**: Status loading pada tombol "Kirim" untuk mencegah pengiriman ganda.
- **Success**: Menampilkan pesan konfirmasi dan mereset form.
- **Error**: Menampilkan pesan error di atas form atau di bawah field yang relevan.
- **Rate Limit**: Menampilkan pesan bahwa pengguna telah mencapai batas pengiriman jika API mengembalikan status 429.
