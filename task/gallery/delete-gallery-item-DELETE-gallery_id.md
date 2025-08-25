# Hapus Item Galeri — DELETE — /gallery/{id}

## Tujuan
Menyediakan endpoint untuk Admin menghapus item dari galeri. Implementasi akan menggunakan soft delete pada record database, dan secara opsional menghapus file dari storage setelah periode waktu tertentu.

## Dependencies
- [x] /task/auth/admin-login-POST-auth_login.md

## Acceptance Criteria (format Gherkin)
- **Scenario 1: Admin Berhasil Menghapus Item Galeri**
  - **Given** seorang pengguna dengan role `Admin` telah login
  - **And** ada item galeri dengan ID `123`
  - **When** pengguna mengirim request `DELETE /gallery/123`
  - **Then** sistem merespon dengan status code `204 No Content`
  - **And** record item galeri di database ditandai sebagai soft deleted.
  - **And** item tersebut tidak lagi muncul di list galeri publik.

- **Scenario 2: Menghapus Item yang Tidak Ada**
  - **Given** seorang `Admin` telah login
  - **When** pengguna mengirim request `DELETE /gallery/999`
  - **Then** sistem merespon dengan status code `404 Not Found`.

- **Scenario 3: Pengguna Non-Admin Mencoba Menghapus**
  - **Given** seorang pengguna dengan role `Editor` telah login
  - **When** pengguna mengirim request `DELETE /gallery/123`
  - **Then** sistem merespon dengan status code `403 Forbidden`.

## Testing Plan (wajib ada kasus negatif & data uji)
- **Unit:**
  - Test `gallery.service.js` memanggil method `softDelete` pada repository.
- **Integrasi:**
  - Lakukan request `DELETE` dan verifikasi record di-soft delete di DB.
  - Pastikan file di storage *tidak* langsung terhapus.
  - Panggil endpoint `GET /gallery` dan pastikan item yang dihapus tidak ada di list.
- **Negatif:**
  - Coba akses dengan role non-Admin. Harapkan `403`.
  - Coba hapus item dengan ID yang tidak ada. Harapkan `404`.
- **Keamanan:**
  - Pastikan otorisasi role `Admin` diterapkan dengan benar.

## Artefak
- Skema OpenAPI/Swagger.
- Postman collection.

## Context
Menghapus media yang tidak lagi relevan adalah bagian dari tugas maintenance konten. Soft delete memberikan jaring pengaman.

## Catatan Teknis
- **Framework:** Node.js dengan Express.js.
- **Controller:** `controllers/admin/gallery.controller.js` -> `remove`.
- **Middleware:** Otentikasi JWT dan otorisasi role `admin`.
- **ORM:** Prisma (via middleware) atau Sequelize (bawaan) untuk soft delete.
- **File Storage:** Saat record di-soft delete, file di storage (S3, dll.) tidak langsung dihapus. Buat sebuah scheduled job (cron) untuk menghapus file dari storage yang record-nya sudah di-soft delete lebih dari X hari.

## Non-Goal
- Hard delete (penghapusan permanen) melalui API.
- Restore item dari recycle bin.

## Asumsi
- Kebijakan retensi data untuk media yang dihapus telah ditentukan.

## Risiko & Mitigasi
- **Risiko:** Biaya storage membengkak karena file dari item yang di-soft delete tidak pernah dihapus.
  - **Mitigasi:** Implementasikan scheduled job untuk membersihkan file orphan secara rutin.
- **Risiko:** Kesalahan penghapusan item penting.
  - **Mitigasi:** Soft delete adalah mitigasi utama. Tambahkan konfirmasi di UI dan log audit.

## Scope In
- Soft deleting record item galeri.
- Otorisasi untuk `Admin`.

## Scope Out
- Penghapusan file dari storage secara sinkron.
- Bulk delete.

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
