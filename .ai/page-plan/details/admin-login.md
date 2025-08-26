# Halaman: Admin Login

- **Route**: `/admin/login`
- **Tujuan**: Menyediakan gerbang aman bagi staf (Admin, Editor, Penyiar) untuk masuk ke panel internal.
- **Role**: `Guest (Admin)`

---

### Data & Endpoints

- **Login**: `auth__POST__login`
  - Mengirim `email` dan `password`.
  - Menerima `token` jika berhasil.

---

### Komponen UI

- **Form Login**:
  - Input `Email`.
  - Input `Password` (dengan tipe `password`).
  - Tombol "Login".
- **Error Handling**:
  - Menampilkan pesan error di atas form jika kredensial salah atau terjadi masalah server.

---

### State Management

- **Loading**: Tombol "Login" dinonaktifkan dan menampilkan spinner saat proses otentikasi berjalan.
- **Error**: Menampilkan pesan error yang relevan (mis. "Email atau password salah").
- **Success**: Menyimpan token yang diterima (mis. di `localStorage` atau `cookie`) dan mengarahkan pengguna ke `/admin/dashboard`.
