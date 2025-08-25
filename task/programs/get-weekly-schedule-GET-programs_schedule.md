# Get Jadwal Mingguan — GET — /programs/schedule

## Tujuan
Menyediakan endpoint publik untuk mengambil jadwal siaran program radio untuk satu minggu penuh (Senin-Minggu).

## Dependencies
- (Asumsi) Adanya mekanisme CRUD untuk Programs & Schedules di Admin Panel.

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Mengambil Jadwal Mingguan**
  - **Given** data jadwal siaran untuk minggu ini sudah terisi di database
  - **When** pengguna mengirim request `GET /programs/schedule`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi object JSON yang dikelompokkan per hari, contoh: `{"monday": [{"time": "08:00", "program_name": "Program Pagi"}, ...], "tuesday": [...]}`.

- **Scenario 2: Jadwal Belum Tersedia**
  - **Given** data jadwal siaran kosong
  - **When** pengguna mengirim request `GET /programs/schedule`
  - **Then** sistem merespon dengan `200 OK`
  - **And** response body berisi object dengan array kosong untuk setiap hari.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `schedule.service.js` dapat mengambil data dari database dan memformatnya ke dalam struktur per hari dengan benar.
- **Integrasi:**
  - Seed database dengan data jadwal.
  - Lakukan request `GET` dan verifikasi struktur dan isi data sesuai harapan.
- **Kinerja:**
  - Data jadwal kemungkinan tidak sering berubah. Terapkan caching dengan TTL yang cukup panjang (misal: 1 jam atau lebih).

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini akan digunakan oleh halaman "Program & Jadwal Siaran" untuk menampilkan jadwal kepada pengunjung.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/program.controller.js` -> `getWeeklySchedule`.
- **Service:** `services/schedule.service.js`.
- **Database:** Desain tabel bisa berupa tabel `schedules` yang memiliki relasi ke `programs` dan kolom untuk `day_of_week` (enum/integer) dan `start_time`.
- **Data Transformation:** Logika di service akan mengambil semua jadwal, lalu melakukan iterasi untuk mengelompokkannya ke dalam object per hari.
- **Caching:** Cache seluruh hasil JSON yang sudah diformat untuk menghindari query dan transformasi berulang.

## Non-Goal
- Mengambil jadwal untuk tanggal spesifik di masa depan atau lalu.
- Detail lengkap setiap program (hanya nama dan waktu).

## Asumsi
- Jadwal bersifat mingguan dan berulang.

## Risiko & Mitigasi
- **Risiko:** Tampilan jadwal salah jika ada kesalahan dalam logika pengelompokan hari.
  - **Mitigasi:** Buat pengujian unit yang kuat untuk fungsi transformasi data, mencakup semua hari dan kasus-kasus khusus (misal: tidak ada jadwal di satu hari).

## Scope In
- Mengembalikan jadwal untuk 7 hari (Senin-Minggu).
- Data yang dikembalikan adalah nama program dan waktu siaran.

## Scope Out
- Deskripsi detail program.
- Informasi penyiar.

## Definition of Ready (DoR)
- [x] Acceptance Criteria lengkap (format Gherkin)  
- [x] Skema I/O & error map jelas  
- [x] Testing Plan punya data uji & kasus negatif  
- [x] Dependensi konsisten & siap di-mock  
- [x] Non-Goal & Asumsi tertulis  
- [x] Risiko & mitigasi terisi  

## Definition of Done (DoD)
- [ ] Semua Acceptance Criteria lulus  
- [ ] Tes unit/integrasi 100% hijau  
- [ ] Log/metrics/traces muncul sesuai spesifikasi  
- [ ] SLO performa terpenuhi (bukti benchmark)  
- [ ] Dokumentasi (README/changelog) diperbarui  
- [ ] Backward compatibility dijaga (atau breaking change + rencana migrasi tertulis)  
