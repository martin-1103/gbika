# MASTER — auth INDEX

## Checklist Subtask Modul auth
- [ ] admin-login-POST-auth_login.md (priority 1)
- [ ] admin-logout-POST-auth_logout.md (priority 2)
- [ ] get-user-profile-GET-auth_me.md (priority 3)

## Metadata
| SUBTASK | METHOD | PATH/FEATURE | FILE | PRIORITY | DEPENDENCIES |
|---|---|---|---|---:|---|
| Admin Login | POST | /auth/login | admin-login-POST-auth_login.md | 1 | - |
| Admin Logout | POST | /auth/logout | admin-logout-POST-auth_logout.md | 2 | `admin-login-POST-auth_login.md` |
| Get User Profile | GET | /auth/me | get-user-profile-GET-auth_me.md | 3 | `admin-login-POST-auth_login.md` |
