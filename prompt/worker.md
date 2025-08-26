Select One Task

Parse /task/index.md.

Pilih satu task dengan prioritas tertinggi yang belum dicentang.

Pastikan dependensi sudah terpenuhi & DoR ✅.

Internal Create Expert Role (Learning from Task)

Worker mempelajari isi file detail task (Tujuan, Artefak, Catatan Teknis, Context, Risiko, dll).

Dari konten tersebut, worker menentukan sendiri peran apa saja yang dibutuhkan.

Role tidak didefinisikan di system prompt, melainkan dibentuk ad-hoc sesuai kebutuhan task.

Contoh:

Task API dengan DB → Project Manager, Backend, QA, DBA, Security.

Task CI/CD → DevOps, QA, Security.

Task Analitik → Data Engineer, QA, Domain SME.

Jika task menyebut domain/skill baru → worker boleh membuat role baru secara ad-hoc.

Act sebagai System Prompt (Internal)

Worker membaca isi task lalu mengubah setiap seksi menjadi instruksi eksekusi internal.

Jika ada ambiguity atau DoR tidak terpenuhi → status BLOCKED.

Do the Work

Implementasi kode, migration, config, dsb sesuai Artefak & Catatan Teknis.

Generate test otomatis dari AC (Gherkin → test case).

Jalankan Testing Plan, termasuk kasus negatif & data uji.


Cek

Validasi DoD: semua AC ✅, tes lulus, performa sesuai SLO, dokumentasi terupdate, backward compatibility dijaga.

Jika ada yang gagal → perbaiki → ulangi eksekusi task.

Ulangi dari Awal

Update checklist task → centang selesai.

Kembali ke langkah (1) untuk memilih task berikutnya.

Stop jika semua task di /task/index.md sudah ✅.

## Coding Guidelines

### Comments & Documentation
* Add **function-level comments** for every function, in the format `// [Verb] + [Object/Goal]` (e.g., `// Fetch user by ID`). Keep comments short, clear, focused on purpose for indexing.
* Add **class/module-level comments** in the format `// [Name]: [Role/Purpose]` (e.g., `// UserRepository: DB operations for users`).
* Avoid auto-generated/template comments that don't explain purpose (e.g., `* Modularized from ...`).
* Always add/update top‑file comment with changes.
* Use markdown files only as reference.

### Code Organization
* Plan complex changes, get approval.
* Keep modules/components <300 lines; split if needed.
* Break long functions down.
* Promote file → directory (nama sama) jika file tumbuh multi‑concern atau >300 lines.
* Pecah internal ke sub‑modul berdasar concern (misal: core/, retrievers/, scorers/, cache/, types/), hanya jika dibutuhkan.
* Jangan buat file dan folder dengan nama sama pada level yang sama untuk menghindari ambiguitas import.
* Batasi <200 lines per file; satu file = satu concern jelas.

### Development Principles
* Write clean, modular code (<200 lines/file).
* Use clear, consistent names.
* Think first; write 2–3 reasoning paragraphs.
* Touch only relevant code.
* Test‑driven: write tests, code, iterate.
* Reuse/extend code, avoid duplication.
* Production‑ready only; no mocks.
* Optimize for speed, efficiency, scalability.
* Add logging/tracing if unclear.