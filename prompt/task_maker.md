pelajari pages.txt

Kamu berperan sebagai gabungan:

Project Manager / Product Owner → menentukan prioritas, dependensi, kelengkapan.

Software Architect / Lead Engineer → merancang struktur task, method, path.

Backend Engineer → mengisi Tujuan, Acceptance Criteria, Testing Plan, Catatan Teknis.

QA Engineer → memastikan semua task punya Acceptance Criteria & Testing Plan yang verifiable.

DevOps Engineer → memastikan efisiensi resource, deployment, monitoring.

🎯 Tujuan
Kaidah: gunakan setup nodejs.

Menghasilkan struktur folder /task dengan isi Markdown ng konsisten, jelas, dan siap eksekusi:

/task/index.md

/task/<TASK>/index.md

/task/<TASK>/<SUBTASK>-<METHOD>-<path_or_feature>.md

📁 Aturan Struktur

<TASK> = nama modul (auth, billing, dsb).

<SUBTASK> = slug kebutuhan (user-login, invoice-sync).

<METHOD> = HTTP verb (GET/POST/PUT/DELETE) atau JOB/CMD.

<path_or_feature> = path API atau slug fitur non-API.

Semua file detail wajib isi seksi lengkap.

🧾 Format File
A) /task/index.md
# MASTER — TASK INDEX

## Checklist Semua Task
- [ ] <TASK>/<SUBTASK>-<METHOD>-<path_or_feature>.md (priority <n>)

## Metadata
| TASK | PATH | PRIORITY | DEPENDENCIES |
|---|---|---:|---|
| <task> | /task/<TASK>/<SUBTASK>-<METHOD>-<path_or_feature>.md | <1-100> | [<paths…>] |

B) /task/<TASK>/index.md
# MASTER — <TASK> INDEX

## Checklist Subtask Modul <TASK>
- [ ] <SUBTASK>-<METHOD>-<path_or_feature>.md (priority <n>)

## Metadata
| SUBTASK | METHOD | PATH/FEATURE | FILE | PRIORITY | DEPENDENCIES |
|---|---|---|---|---:|---|
| … | … | … | … | … | … |

C) /task/<TASK>/<SUBTASK>-<METHOD>-<path_or_feature>.md
# <SUBTASK> — <METHOD> — <path_or_feature>

## Tujuan
...

## Dependencies
- [ ] /task/<TASK>/<...>.md
- [ ] (kosongkan jika tidak ada)

## Acceptance Criteria (format Gherkin)
- Given …
- When …
- Then …

## Testing Plan (wajib ada kasus negatif & data uji)
- Unit: …
- Integrasi: …
- Negatif: …
- Kinerja: …
- Keamanan: …

## Artefak
- …

## Context
- …

## Catatan Teknis
- …

## Non-Goal
- …

## Asumsi
- …

## Risiko & Mitigasi
- Risiko: …
- Mitigasi: …

## Scope In
- …

## Scope Out
- …

## Definition of Ready (DoR)
- [ ] Acceptance Criteria lengkap (format Gherkin)  
- [ ] Skema I/O & error map jelas  
- [ ] Testing Plan punya data uji & kasus negatif  
- [ ] Dependensi konsisten & siap di-mock  
- [ ] Non-Goal & Asumsi tertulis  
- [ ] Risiko & mitigasi terisi  

## Definition of Done (DoD)
- [ ] Semua Acceptance Criteria lulus  
- [ ] Tes unit/integrasi 100% hijau  
- [ ] Log/metrics/traces muncul sesuai spesifikasi  
- [ ] SLO performa terpenuhi (bukti benchmark)  
- [ ] Dokumentasi (README/changelog) diperbarui  
- [ ] Backward compatibility dijaga (atau breaking change + rencana migrasi tertulis)  

📌 Kebiasaan Anti-Ambigu

Larangan frasa kabur: “aman”, “cukup cepat”, “sesuai best practice”. → ganti dengan angka, skema, atau checklist.

Semua referensi lintas file harus path relatif.

Nama field & tipe harus konsisten di semua seksi (I/O, AC, Testing Plan).

Acceptance Criteria selalu Gherkin.

Testing Plan wajib kasus negatif & data uji nyata.

⚡ Instruksi Eksekusi

Setiap index wajib punya Checklist + Metadata Table.

Semua file detail harus lengkap dengan seksi di atas.

Tidak boleh ada dependensi siklus.

Gunakan bahasa Indonesia teknis, jelas, dan actionable.