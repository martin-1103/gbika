# Get Homepage Data — GET — /homepage

## Tujuan
Menyediakan satu endpoint agregat untuk mengambil semua data yang dibutuhkan untuk menampilkan halaman homepage. Ini untuk menghindari frontend melakukan beberapa kali panggilan API (waterfall requests).

## Dependencies
- [x] /task/articles/list-articles-GET-articles.md
- [x] /task/programs/get-weekly-schedule-GET-programs_schedule.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Mengambil Data Homepage**
  - **Given** sistem memiliki data untuk semua seksi homepage (jadwal siaran, artikel terbaru, dll.)
  - **When** pengguna mengakses halaman utama website
  - **Then** frontend mengirim request `GET /homepage`
  - **And** sistem merespon dengan status code `200 OK`
  - **And** response body berisi satu object JSON besar yang berisi semua data yang dibutuhkan, contoh: `{"hero": {...}, "schedule": [...], "latest_articles": [...]}`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `homepage.service.js` dapat memanggil service-service lain (`article.service`, `program.service`) dan mengagregasi hasilnya dengan benar.
- **Integrasi:**
  - Lakukan request `GET` dan verifikasi bahwa semua bagian data (hero, schedule, articles) ada di dalam response dan memiliki format yang benar.
- **Kinerja:**
  - Endpoint ini akan menjadi salah satu yang paling sering diakses. Terapkan caching (Redis/in-memory) dengan TTL yang sesuai (misal: 1-5 menit).
  - Pastikan semua query database yang mendasarinya dioptimalkan. Gunakan `Promise.all` untuk menjalankan query yang tidak dependen secara paralel.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini sangat penting untuk performa frontend. Dengan satu panggilan, semua data untuk "above the fold" dan seksi utama lainnya bisa didapatkan, mempercepat waktu render halaman.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/page.controller.js` -> `getHomepageData`.
- **Service:** `services/homepage.service.js`. Service ini akan bertindak sebagai orchestrator, memanggil method dari service lain (misal: `articleService.findLatest(3)`, `programService.findTodaySchedule()`) dan menggabungkan hasilnya.
- **Paralelisasi:** Gunakan `Promise.all` untuk efisiensi. Contoh: `const [articles, schedule] = await Promise.all([articleService.findLatest(3), programService.findTodaySchedule()]);`.
- **Caching:** Gunakan library seperti `node-cache` untuk in-memory cache atau `ioredis` untuk Redis.

## Non-Goal
- Menyediakan data untuk halaman lain selain homepage.
- Personalisasi konten.

## Asumsi
- Konten untuk setiap seksi (hero, dll.) sudah ditentukan.

## Risiko & Mitigasi
- **Risiko:** Endpoint menjadi lambat jika salah satu query di dalamnya lambat.
  - **Mitigasi:** Terapkan caching yang agresif. Monitor performa masing-masing query yang dipanggil. Jika ada query yang sangat lambat, pertimbangkan untuk memisahkannya atau mengoptimalkannya.
- **Risiko:** Response menjadi sangat besar.
  - **Mitigasi:** Pastikan setiap service yang dipanggil hanya mengembalikan field yang benar-benar dibutuhkan oleh homepage, bukan seluruh object.

## Scope In
- Mengambil data untuk hero section.
- Mengambil jadwal siaran hari ini/besok.
- Mengambil 3 artikel/renungan terbaru.

## Scope Out
- Data footer atau header yang bersifat global (ini bisa diambil dari endpoint lain yang di-cache secara permanen).

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
