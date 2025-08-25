# MASTER — articles INDEX

## Checklist Subtask Modul articles
- [ ] list-articles-GET-articles.md (priority 20)
- [ ] get-article-detail-GET-articles_slug.md (priority 21)
- [ ] create-article-POST-articles.md (priority 50)
- [ ] update-article-PUT-articles_slug.md (priority 51)
- [ ] delete-article-DELETE-articles_slug.md (priority 52)

## Metadata
| SUBTASK | METHOD | PATH/FEATURE | FILE | PRIORITY | DEPENDENCIES |
|---|---|---|---|---:|---|
| List Artikel | GET | /articles | list-articles-GET-articles.md | 20 | - |
| Get Detail Artikel | GET | /articles/{slug} | get-article-detail-GET-articles_slug.md | 21 | `list-articles-GET-articles.md` |
| Buat Artikel Baru | POST | /articles | create-article-POST-articles.md | 50 | `auth/admin-login` |
| Update Artikel | PUT | /articles/{slug} | update-article-PUT-articles_slug.md | 51 | `create-article-POST-articles.md` |
| Hapus Artikel | DELETE | /articles/{slug} | delete-article-DELETE-articles_slug.md | 52 | `create-article-POST-articles.md` |
