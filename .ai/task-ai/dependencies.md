# Pemetaan Dependensi API & Socket

Dokumen ini memetakan komponen dan halaman ke endpoint API atau koneksi WebSocket yang mereka butuhkan dari backend.

## Endpoints HTTP

| Halaman / Komponen        | Endpoint API Terkait                      |
| ------------------------- | ----------------------------------------- |
| **LoginForm**             | `auth__POST__login`                       |
| **Admin Dashboard**       | `articles__GET__articles`, `testimonials__GET__testimonials` |
| **Manajemen Artikel**     | `articles__GET__articles`, `articles__DELETE__articles--slug-` |
| **ArticleForm**           | `articles__POST__articles`, `articles__PUT__articles--slug-` |
| **Manajemen Kesaksian**   | `testimonials__GET__testimonials`         |
| **TestimonialEditForm**   | `GET /testimonials/:id`, `PUT /testimonials/:id` (Asumsi) |
| **Homepage**              | `programs__GET__schedule`, `articles__GET__articles`, `testimonials__GET__testimonials` |
| **Renungan & Artikel**    | `articles__GET__articles`                 |
| **Detail Renungan**       | `articles__GET__articles--slug-`          |
| **Layanan Doa**           | `services__POST__prayer`                  |
| **Request Lagu**          | `services__POST__song-request`            |
| **Kesaksian**             | `testimonials__GET__testimonials`         |
| **Kirim Kesaksian**       | `testimonials__POST__testimonials`        |
| **Profil Penyiar**        | `GET /presenters` (Asumsi)                |
| **Pasang Iklan**          | `POST /advertising/inquiry` (Asumsi)      |
| **Partnership**           | `POST /membership/register` (Asumsi)      |
| **Manajemen Jadwal**      | CRUD `/schedules` (Asumsi)                |
| **Manajemen Halaman**     | `GET /pages`, `PUT /pages/:slug` (Asumsi) |
| **Manajemen User**        | CRUD `/users` (Asumsi)                    |
| **Manajemen Partnership** | `GET /admin/partnerships`, `PUT /admin/partnerships/:id` (Asumsi) |

## Koneksi WebSocket

| Halaman / Komponen        | Channel / Event                           |
| ------------------------- | ----------------------------------------- |
| **Dengarkan Live (ChatView)** | `WEBSOCKET /livechat/ws`                  |
| **Moderasi Live Chat**    | `WEBSOCKET /livechat/ws` (Admin)          |
| **Dashboard Penyiar**     | `WEBSOCKET /livechat/ws` (Penyiar)        |
| **Homepage Widget**       | `event: 'public-messages'`                |
