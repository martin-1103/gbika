# MASTER — TASK INDEX

## Checklist Semua Task
- [ ] articles/list-articles-GET-articles.md (priority 20)
- [ ] articles/get-article-detail-GET-articles_slug.md (priority 21)
- [ ] articles/create-article-POST-articles.md (priority 50)
- [ ] articles/update-article-PUT-articles_slug.md (priority 51)
- [ ] articles/delete-article-DELETE-articles_slug.md (priority 52)
- [x] auth/admin-login-POST-auth_login.md (priority 1)
- [x] auth/admin-logout-POST-auth_logout.md (priority 2)
- [x] auth/get-user-profile-GET-auth_me.md (priority 3)
- [ ] gallery/list-gallery-items-GET-gallery.md (priority 35)
- [ ] gallery/upload-gallery-item-POST-gallery.md (priority 53)
- [ ] gallery/update-gallery-item-PUT-gallery_id.md (priority 54)
- [ ] gallery/delete-gallery-item-DELETE-gallery_id.md (priority 55)
- [ ] livechat/initiate-session-POST-livechat_session.md (priority 10)
- [ ] livechat/connect-websocket-WEBSOCKET-livechat_ws.md (priority 11)
- [ ] livechat/moderate-message-POST-livechat_messages_id_moderate.md (priority 12)
- [ ] membership/get-partnership-info-GET-membership_info.md (priority 40)
- [ ] membership/register-partnership-POST-membership_register.md (priority 41)
- [ ] pages/get-homepage-data-GET-homepage.md (priority 5)
- [ ] pages/get-page-content-GET-pages_slug.md (priority 6)
- [ ] programs/get-weekly-schedule-GET-programs_schedule.md (priority 30)
- [ ] services/submit-prayer-request-POST-services_prayer.md (priority 15)
- [ ] services/submit-song-request-POST-services_song_request.md (priority 16)
- [ ] testimonials/list-testimonials-GET-testimonials.md (priority 25)
- [ ] testimonials/submit-testimonial-POST-testimonials.md (priority 26)

## Metadata
| TASK | PATH | PRIORITY | DEPENDENCIES |
|---|---|---:|---|
| auth | /task/auth/admin-login-POST-auth_login.md | 1 | - |
| auth | /task/auth/admin-logout-POST-auth_logout.md | 2 | `auth/admin-login` |
| auth | /task/auth/get-user-profile-GET-auth_me.md | 3 | `auth/admin-login` |
| pages | /task/pages/get-homepage-data-GET-homepage.md | 5 | - |
| pages | /task/pages/get-page-content-GET-pages_slug.md | 6 | - |
| livechat | /task/livechat/initiate-session-POST-livechat_session.md | 10 | - |
| livechat | /task/livechat/connect-websocket-WEBSOCKET-livechat_ws.md | 11 | `livechat/initiate-session` |
| livechat | /task/livechat/moderate-message-POST-livechat_messages_id_moderate.md | 12 | `auth/admin-login` |
| services | /task/services/submit-prayer-request-POST-services_prayer.md | 15 | - |
| services | /task/services/submit-song-request-POST-services_song_request.md | 16 | - |
| articles | /task/articles/list-articles-GET-articles.md | 20 | - |
| articles | /task/articles/get-article-detail-GET-articles_slug.md | 21 | `articles/list-articles` |
| testimonials | /task/testimonials/list-testimonials-GET-testimonials.md | 25 | - |
| testimonials | /task/testimonials/submit-testimonial-POST-testimonials.md | 26 | - |
| programs | /task/programs/get-weekly-schedule-GET-programs_schedule.md | 30 | - |
| gallery | /task/gallery/list-gallery-items-GET-gallery.md | 35 | - |
| membership | /task/membership/get-partnership-info-GET-membership_info.md | 40 | - |
| membership | /task/membership/register-partnership-POST-membership_register.md | 41 | - |
| articles | /task/articles/create-article-POST-articles.md | 50 | `auth/admin-login` |
| articles | /task/articles/update-article-PUT-articles_slug.md | 51 | `articles/create-article` |
| articles | /task/articles/delete-article-DELETE-articles_slug.md | 52 | `articles/create-article` |
| gallery | /task/gallery/upload-gallery-item-POST-gallery.md | 53 | `auth/admin-login` |
| gallery | /task/gallery/update-gallery-item-PUT-gallery_id.md | 54 | `gallery/upload-gallery-item` |
| gallery | /task/gallery/delete-gallery-item-DELETE-gallery_id.md | 55 | `gallery/upload-gallery-item` |
