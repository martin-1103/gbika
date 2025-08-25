# Get Info Partnership — GET — /membership/info

## Tujuan
Menyediakan endpoint publik untuk mendapatkan informasi detail mengenai program partnership, termasuk tingkatan (Basic, VIP, VVIP), biaya, dan benefit dari masing-masing tingkatan.

## Dependencies
- (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Mengambil Informasi Partnership**
  - **Given** sistem memiliki data program partnership yang sudah dikonfigurasi
  - **When** pengguna mengirim request `GET /membership/info`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi object JSON yang terstruktur, contoh: `{"tiers": [{"name": "Basic", "price_range": "500000-1000000", "benefits": [...]}, ...]}`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test service dapat mengambil dan memformat data dari sumbernya (misal: file config atau database).
- **Integrasi:**
  - Lakukan request `GET` dan pastikan struktur data JSON sesuai dengan yang diharapkan.
- **Negatif:**
  - (Tidak ada kasus negatif yang signifikan untuk endpoint ini).
- **Kinerja:**
  - Karena data ini cenderung statis, terapkan caching (misal: in-memory atau Redis) selama beberapa menit untuk mengurangi beban database.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Endpoint ini akan digunakan oleh halaman "Membership" di frontend untuk menampilkan informasi program kepada calon partner.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/membership.controller.js` -> `getInfo`.
- **Data Source:** Informasi ini bisa disimpan di tabel database (`membership_tiers`) atau di file konfigurasi (`config/membership.json`) jika jarang berubah. Menggunakan database lebih fleksibel.
- **Caching:** Implementasikan caching di level service atau route untuk meningkatkan performa.

## Non-Goal
- Menampilkan daftar partner yang sudah terdaftar.
- Memproses pendaftaran baru.

## Asumsi
- Data benefit dan tingkatan partnership sudah terdefinisi.

## Risiko & Mitigasi
- **Risiko:** Informasi di frontend tidak update jika ada perubahan di backend.
  - **Mitigasi:** Pastikan frontend selalu mengambil data dari endpoint ini, bukan hardcode. Mekanisme caching harus memiliki TTL (Time To Live) yang wajar.

## Scope In
- Mengembalikan semua tingkatan partnership.
- Mengembalikan benefit untuk setiap tingkatan.

## Scope Out
- Informasi personal partner.

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
