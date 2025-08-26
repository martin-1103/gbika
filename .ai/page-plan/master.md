# Page Plan: Website & Admin Panel El Shaddai FM

Dokumen ini merinci arsitektur halaman untuk website publik dan panel admin internal.

##  Public Routes (Website Pengguna)

| Nama Halaman              | Route                      | Peran Akses | Deskripsi Singkat                               |
| ------------------------- | -------------------------- | ----------- | ----------------------------------------------- |
| **Homepage**              | `/`                        | Guest, User | Halaman utama dengan live streaming & highlight.  |
| **Tentang Kami**          | `/tentang-kami`            | Guest, User | Sejarah, visi & misi, dan profil tim.           |
| **Program & Jadwal**      | `/program`                 | Guest, User | Jadwal siaran mingguan dan program unggulan.    |
| **Renungan & Artikel**    | `/renungan`                | Guest, User | Daftar artikel dan renungan harian.             |
| **Detail Renungan**       | `/renungan/:slug`          | Guest, User | Tampilan detail satu artikel atau renungan.     |
| **Layanan Doa**           | `/layanan/doa`             | Guest, User | Form untuk mengirim permohonan doa.             |
| **Request Lagu**          | `/layanan/request-lagu`    | Guest, User | Form untuk mengirim request lagu.               |
| **Kesaksian**             | `/kesaksian`               | Guest, User | Menampilkan daftar kesaksian dari pendengar.    |
| **Kirim Kesaksian**       | `/kesaksian/kirim`         | Guest, User | Form untuk mengirim kesaksian baru.             |
| **Galeri**                | `/galeri`                  | Guest, User | Galeri foto dan video kegiatan.                 |
| **Partnership**           | `/partnership`             | Guest, User | Informasi dan registrasi program membership.    |
| **Dengarkan Live**        | `/live`                    | Guest, User | Streaming radio dan kirim pesan ke penyiar.     |
| **Kontak Kami**           | `/kontak`                  | Guest, User | Informasi kontak dan alamat.                    |
| **Pasang Iklan**          | `/pasang-iklan`            | Guest, User | Informasi dan kontak untuk pemasangan iklan.    |

## Admin & Penyiar Routes (Panel Internal)

| Nama Halaman                    | Route                               | Peran Akses      | Deskripsi Singkat                                     |
| ------------------------------- | ----------------------------------- | ---------------- | ----------------------------------------------------- |
| **Admin Login**                 | `/admin/login`                      | Guest (Admin)    | Halaman login untuk admin, editor, dan penyiar.       |
| **Admin Dashboard**             | `/admin/dashboard`                  | Admin, Editor    | Ringkasan statistik dan aktivitas terbaru.            |
| **Manajemen Artikel**           | `/admin/articles`                   | Admin, Editor    | CRUD untuk renungan dan artikel.                      |
| **Buat/Edit Artikel**           | `/admin/articles/edit/:slug?`       | Admin, Editor    | Form untuk membuat atau mengubah artikel.             |
| **Manajemen Jadwal**            | `/admin/schedules`                  | Admin            | CRUD untuk program dan jadwal siaran.                 |
| **Manajemen Kesaksian**         | `/admin/testimonials`               | Admin            | Moderasi (approve/reject) kesaksian yang masuk.       |
| **Manajemen Halaman Statis**    | `/admin/pages`                      | Admin            | Mengelola konten halaman seperti 'Tentang Kami'.      |
| **Moderasi Live Chat**          | `/admin/live-chat`                  | Admin, Penyiar   | Panel untuk melihat dan memoderasi pesan masuk.       |
| **Manajemen User**              | `/admin/users`                      | Admin            | Mengelola akun dan peran (role) pengguna admin.       |
