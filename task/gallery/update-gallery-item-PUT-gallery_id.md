# Update Item Galeri — PUT — /gallery/{id}

## Tujuan
Menyediakan endpoint untuk Admin memperbarui metadata dari item galeri yang sudah ada, seperti `caption`. Endpoint ini tidak untuk mengganti file media itu sendiri.

## Dependencies
- [x] /task/auth/admin-login-POST-auth_login.md
- [x] /task/gallery/upload-gallery-item-POST-gallery.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Admin Berhasil Memperbarui Caption**
  - **Given** seorang pengguna dengan role `Admin` telah login
  - **And** ada item galeri dengan ID `123`
  - **When** pengguna mengirim request `PUT /gallery/123` dengan body `{"caption": "Kegiatan Pelayanan Sosial 2025"}`
  - **Then** sistem merespon dengan status code `200 OK`
  - **And** response body berisi data item galeri yang sudah diperbarui
  - **And** `caption` untuk item galeri `123` di database telah berubah.

- **Scenario 2: Memperbarui Item yang Tidak Ada**
  - **Given** seorang `Admin` telah login
  - **When** pengguna mengirim request `PUT /gallery/999` dengan data valid
  - **Then** sistem merespon dengan status code `404 Not Found`.

- **Scenario 3: Request dengan Data Tidak Valid**
  - **Given** seorang `Admin` telah login
  - **When** pengguna mengirim request `PUT /gallery/123` dengan `{"caption": ""}` (jika caption wajib diisi)
  - **Then** sistem merespon dengan status code `422 Unprocessable Entity`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `gallery.service.js` dapat menemukan dan memperbarui record di database.
- **Integrasi:**
  - Lakukan request `PUT` end-to-end dan verifikasi perubahan data di database.
- **Negatif:**
  - Coba akses dengan role non-Admin. Harapkan `403 Forbidden`.
  - Coba update item dengan ID yang tidak ada. Harapkan `404`.
- **Keamanan:**
  - Lakukan sanitasi pada input `caption` untuk mencegah XSS.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Setelah media diunggah, seringkali ada kebutuhan untuk memperbaiki typo atau mengubah deskripsi.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/admin/gallery.controller.js` -> `update`.
- **Middleware:** Otentikasi JWT, otorisasi role `admin`, validasi body.
- **HTTP Method:** `PUT` atau `PATCH`. `PATCH` lebih cocok karena ini adalah update parsial.

## Non-Goal
- Mengganti file media.
- Mengedit gambar (crop, rotate).

## Asumsi
- ID item galeri adalah integer atau UUID.

## Risiko & Mitigasi
- **Risiko:** Lost update jika dua admin mengedit caption yang sama.
  - **Mitigasi:** Implementasikan optimistic locking dengan menambahkan field `version` atau `updated_at` pada request.

## Scope In
- Memperbarui `caption`.
- Memperbarui `alt_text`.

## Scope Out
- Mengganti file.
- Memindahkan item ke album lain.

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
