# Halaman: Homepage

- **Route**: `/`
- **Tujuan**: Menjadi gerbang utama bagi pengunjung, menyediakan akses cepat ke streaming, program terbaru, renungan, dan layanan interaktif.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Jadwal Hari Ini**: `programs__GET__schedule` (dengan filter tambahan untuk hari ini)
- **Renungan Terbaru**: `articles__GET__articles` (dengan `limit=3`, `sort_by=published_at`)
- **Kesaksian Terbaru**: `testimonials__GET__testimonials` (dengan `limit=3`, `status=approved`)
- **Pesan Live Chat (Moderated)**: `sockets__GET__livechat` (mendengarkan event `public-messages`)

---

### Komponen UI

- **Hero Section / Live Status Bar**:
    - **Status Siaran**: Menampilkan nama program yang sedang berlangsung dan indikator "LIVE".
    - **Tombol Aksi Utama**: Tombol besar "Dengarkan Live" yang mengarah ke halaman `/live`.
    - **Link Cepat**: Link sekunder ke "Doa Online" dan "Request Lagu".
- **Jadwal Siaran Ringkas**:
    - Menampilkan jadwal untuk hari ini dan besok.
- **Renungan Terbaru**:
    - Grid atau daftar berisi 3 kartu artikel terbaru.
- **Kesaksian Terbaru**:
    - Menampilkan 2-3 kutipan kesaksian terbaru yang sudah disetujui.
    - Setiap kartu menampilkan judul, nama pengirim, dan ringkasan.
    - Terdapat link "Lihat Semua Kesaksian" yang mengarah ke halaman `/kesaksian`.
- **Widget Live Chat**:
    - Menampilkan beberapa pesan terbaru yang sudah dimoderasi.
- **Call-to-Action (CTA)**:
    - Blok visual yang mengajak pengguna untuk bergabung dalam partnership atau mengirim kesaksian.

---

### State Management

- **Loading**: Tampilkan skeleton loaders untuk jadwal dan renungan saat data sedang diambil.
- **Error**: Tampilkan pesan jika gagal memuat data jadwal atau renungan.
- **Empty**: Tampilkan pesan jika tidak ada jadwal atau renungan untuk ditampilkan.
- **Live Status**: Indikator visual pada player yang menunjukkan status streaming (live, offline).
