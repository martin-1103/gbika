# MASTER — gallery INDEX

## Checklist Subtask Modul gallery
- [ ] list-gallery-items-GET-gallery.md (priority 35)
- [ ] upload-gallery-item-POST-gallery.md (priority 53)
- [ ] update-gallery-item-PUT-gallery_id.md (priority 54)
- [ ] delete-gallery-item-DELETE-gallery_id.md (priority 55)

## Metadata
| SUBTASK | METHOD | PATH/FEATURE | FILE | PRIORITY | DEPENDENCIES |
|---|---|---|---|---:|---|
| List Item Galeri | GET | /gallery | list-gallery-items-GET-gallery.md | 35 | - |
| Unggah Item Galeri | POST | /gallery | upload-gallery-item-POST-gallery.md | 53 | `auth/admin-login` |
| Update Item Galeri | PUT | /gallery/{id} | update-gallery-item-PUT-gallery_id.md | 54 | `upload-gallery-item-POST-gallery.md` |
| Hapus Item Galeri | DELETE | /gallery/{id} | delete-gallery-item-DELETE-gallery_id.md | 55 | `upload-gallery-item-POST-gallery.md` |
