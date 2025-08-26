# Halaman: Program & Jadwal Siaran

- **Route**: `/program`
- **Tujuan**: Menyediakan informasi lengkap mengenai jadwal siaran mingguan agar pendengar dapat mengikuti program favorit mereka.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Jadwal Mingguan**: `programs__GET__schedule`
  - Endpoint ini akan mengembalikan seluruh jadwal yang dikelompokkan per hari.

---

### Komponen UI

- **Tampilan Jadwal**:
  - Tampilan tab per hari (Senin, Selasa, ..., Minggu).
  - Setiap tab berisi daftar program untuk hari tersebut, lengkap dengan jam tayang, nama program, dan deskripsi singkat.
- **Highlight Program Unggulan**:
  - Kartu atau banner khusus untuk program-program utama seperti "Gerasa" atau "Mujizat Setiap Hari".
- **Filter/Search (Opsional)**:
  - Fitur untuk mencari program berdasarkan nama.

---

### State Management

- **Loading**: Skeleton loader saat jadwal sedang dimuat.
- **Error**: Pesan error jika gagal mengambil data jadwal.
- **Empty**: Tampilan pesan jika tidak ada jadwal yang tersedia untuk hari tertentu.
