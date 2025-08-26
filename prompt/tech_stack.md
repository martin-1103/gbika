# Teknologi Stack — Website Remake El Shaddai FM

Dokumen ini menguraikan pilihan teknologi utama yang akan digunakan dalam pengembangan backend untuk proyek remake website El Shaddai FM, sesuai dengan task-task yang telah dibuat.

## Backend

Stack utama backend akan dibangun di atas ekosistem Node.js yang modern, handal, dan skalabel.

- **Runtime:** **Node.js** (Versi LTS terbaru, misal: 20.x)
- **Framework:** **Express.js**
  - *Alasan:* Ringan, fleksibel, dan memiliki ekosistem middleware yang sangat besar dan matang.
- **Bahasa:** **TypeScript**
  - *Alasan:* Memberikan static typing untuk meningkatkan kualitas kode, mengurangi bug, dan mempermudah maintenance seiring pertumbuhan proyek.
- **Database ORM:** **Prisma**
  - *Alasan:* Menyediakan type-safety dari database hingga aplikasi, auto-completion, dan migrasi skema yang mudah dikelola. Alternatifnya adalah Sequelize.
- **Otentikasi:** **JSON Web Tokens (JWT)**
  - *Library:* `jsonwebtoken` untuk membuat dan memverifikasi token.
- **Real-time Communication (WebSocket):** **Socket.IO** atau **ws**
  - *Alasan:* Untuk fitur seperti "Suara Pendengar" (live chat), Socket.IO menyediakan fungsionalitas yang kaya seperti auto-reconnect dan fallback. `ws` adalah pilihan yang lebih ringan jika hanya butuh fungsionalitas dasar WebSocket.
- **Validasi Data:** **Zod**
  - *Alasan:* Validasi skema dengan inferensi tipe TypeScript, memastikan data yang masuk dan keluar dari fungsi sesuai dengan yang diharapkan.
- **File Uploads:** **Multer**
  - *Alasan:* Middleware standar di ekosistem Express.js untuk menangani `multipart/form-data`.

## Database

- **Database Utama:** **MySQL**
  - *Alasan:* Sistem database relasional yang sangat populer, open-source, handal, dan didukung oleh komunitas yang besar serta ekosistem yang matang.
- **Caching & Pub/Sub:** **Redis**
  - *Alasan:* Digunakan untuk caching data yang sering diakses (jadwal, homepage) dan sebagai message broker (Pub/Sub) untuk komunikasi real-time antar service atau instance aplikasi (misal: notifikasi request lagu, moderasi chat).

## Testing

- **Testing Framework:** **Jest**
  - *Alasan:* Framework testing "all-in-one" yang populer di ekosistem JavaScript/TypeScript.
- **API Integration Testing:** **Supertest**
  - *Alasan:* Memudahkan pengujian endpoint HTTP secara end-to-end tanpa perlu menjalankan server secara manual.

## Deployment

- **Process Manager:** **PM2**
  - *Alasan:* Untuk menjaga aplikasi Node.js tetap berjalan (process management), memfasilitasi clustering untuk memanfaatkan semua core CPU, dan monitoring.
