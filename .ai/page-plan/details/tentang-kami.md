# Halaman: Tentang Kami

- **Route**: `/tentang-kami`
- **Tujuan**: Memberikan informasi latar belakang mengenai El Shaddai FM, termasuk sejarah, visi, misi, dan profil tim untuk membangun kepercayaan dan kedekatan dengan pendengar.
- **Role**: `Guest`, `User`

---

### Data & Endpoints

- **Konten Halaman**: `pages__GET__pages--slug-` (dengan `slug=tentang-kami`)
  - *Asumsi*: Endpoint ini menyediakan data terstruktur untuk setiap bagian di bawah ini. Jika tidak, konten akan bersifat statis di frontend.

---

### Komponen UI

- **Sejarah El Shaddai FM**:
  - Narasi atau timeline yang menceritakan perjalanan radio dari awal berdiri hingga sekarang.
- **Visi & Misi Pelayanan**:
  - Dua blok teks terpisah yang dengan jelas menyatakan Visi dan Misi dari El Shaddai FM.
- **Profil Penyiar & Tim**:
  - Grid yang menampilkan foto, nama, dan jabatan/peran dari setiap penyiar dan anggota tim kunci.
- **Slogan & Nilai Inti**:
  - Bagian yang menyoroti slogan radio dan nilai-nilai utama yang dipegang dalam pelayanan.

---

### State Management

- **Loading**: Skeleton loader saat mengambil konten dari API.
- **Error**: Pesan error jika konten halaman gagal dimuat.