# Halaman: Partnership (Membership)

- **Route**: `/partnership`
- **Tujuan**: Menginformasikan kepada pendengar mengenai program "Partnership El-Shaddai Two in One" dan menyediakan formulir pendaftaran untuk menjadi partner.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Informasi Program**: Konten statis atau dari `GET /membership/info`
  - **Asumsi**: Perlu dibuat endpoint `GET /membership/info` untuk mengambil detail tingkatan (Basic, VIP, VVIP) dan benefitnya secara dinamis. Untuk saat ini, bisa dianggap sebagai konten statis.
- **Pendaftaran Partner**: `POST /membership/register`
  - **Asumsi**: Perlu dibuat endpoint `POST /membership/register` untuk menangani pengiriman formulir pendaftaran.

---

### Komponen UI

- **Blok Informasi Program**:
  - Penjelasan mengenai tujuan program partnership.
  - Tampilan kartu atau tabel yang membandingkan tingkatan partner (Basic, VIP, VVIP), iuran bulanan, dan benefit yang didapat.
- **Tombol Call-to-Action (CTA)**:
  - Tombol "Mari Bergabung!" yang jelas, yang akan menampilkan form pendaftaran.
- **Form Pendaftaran (Bisa dalam Modal)**:
  - Input untuk `Nama Lengkap`.
  - Input untuk `Email`.
  - Input untuk `Nomor WhatsApp`.
  - Pilihan (Radio button atau Dropdown) untuk `Tipe Partner` (Basic, VIP, VVIP).
  - Tombol "Daftar Sebagai Partner".
- **Informasi Kontak**:
  - Menampilkan nomor kontak (0855 2822 777) untuk informasi lebih lanjut.

---

### State Management

- **Submitting**: Status loading pada tombol "Daftar" saat form sedang dikirim.
- **Success**: Menampilkan pesan konfirmasi setelah pendaftaran berhasil, misalnya: "Terima kasih telah bergabung! Tim kami akan segera menghubungi Anda."
- **Error**: Menampilkan pesan error jika validasi gagal atau terjadi masalah pada server.
