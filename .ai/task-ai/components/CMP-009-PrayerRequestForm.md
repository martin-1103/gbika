# Task: PrayerRequestForm
ID: CMP-009
Title: Prayer Request Form
Type: component
Priority: p1
Page(s): /layanan/doa
Status: todo
Owner: -
Depends On: DS-001, API:services__POST__prayer

## Scope
- Form untuk mengirim permohonan doa.
- Fields: `name`, `contact`, `content`, `is_anonymous`.
- Validasi klien dan penanganan state (submitting, success, error).

## Acceptance
- Data berhasil dikirim ke API dan pengguna mendapat notifikasi.
