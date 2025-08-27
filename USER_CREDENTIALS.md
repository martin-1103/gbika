# User Credentials - El Shaddai FM

## Admin Users

### Administrator Account
- **Email**: admin@elshadaifm.com
- **Password**: admin123
- **Role**: admin
- **Name**: Administrator
- **Access**: Full system access

### Moderator Account
- **Email**: moderator@elshadaifm.com
- **Password**: admin123
- **Role**: moderator
- **Name**: Moderator
- **Access**: Content moderation, chat moderation

### Editor Account
- **Email**: editor@elshadaifm.com
- **Password**: admin123
- **Role**: editor
- **Name**: Editor
- **Access**: Create and edit articles

### Penyiar Account (Broadcaster)
- **Email**: penyiar@elshadaifm.com
- **Password**: admin123
- **Role**: penyiar
- **Name**: Penyiar
- **Access**: Live chat management, broadcasting controls

## Database Information

### Guest Users (Live Chat)
The following guest users have been created with active chat sessions:

1. **John Doe** (Jakarta, Indonesia)
2. **Maria Santos** (Surabaya, Indonesia)
3. **David Chen** (Medan, Indonesia)
4. **Sarah Johnson** (Bandung, Indonesia)
5. **Michael Brown** (Makassar, Indonesia)

### Login Instructions

1. **Admin Login**: 
   - Go to: http://localhost:3001/admin/login
   - Use: admin@elshadaifm.com / admin123

2. **Moderator Login**:
   - Go to: http://localhost:3001/admin/login
   - Use: moderator@elshadaifm.com / admin123

### Database Access

- **Database**: MySQL
- **Database Name**: elshadaifm
- **Connection String**: mysql://root:@localhost:3306/elshadaifm

### Additional Information

- All passwords are hashed using bcrypt with salt rounds: 12
- Guest user sessions are valid for 24 hours
- JWT secret is configured in backend .env file
- Admin accounts have full access to all features
- Moderator accounts have limited access for content moderation

### Sample Data Created

- **5 Radio Programs** with weekly schedules
- **50+ Articles** with Christian content
- **Prayer Requests** from various users
- **Song Requests** with personal messages
- **User Testimonials** (both approved and pending)
- **Static Pages** (About Us, Contact)
- **Active Chat Sessions** ready for live chat testing

### Security Notes

- Change default passwords before production use
- JWT secret should be updated for production
- Database credentials should be secured
- Admin access should be restricted to authorized personnel only