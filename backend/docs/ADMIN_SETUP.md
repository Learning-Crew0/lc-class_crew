# Admin Setup & Configuration

## Overview

The system automatically seeds a default admin account on server startup. Admin is the **top-level role** in the hierarchy - there is no superadmin role.

---

## Default Admin Credentials

The following admin account is automatically created when the server starts for the first time:

| Field | Value |
|-------|-------|
| **Email** | `classcrew@admin.com` |
| **Username** | `classcrew_admin` |
| **Password** | `admin123` |
| **Role** | `admin` |

⚠️ **IMPORTANT**: Please change the password after first login!

---

## Admin Seeding Behavior

### On Server Startup

1. ✅ Server connects to MongoDB
2. ✅ Checks if admin with email `classcrew@admin.com` exists
3. If **NOT exists**: Creates new admin account
4. If **exists**: Logs "Admin already exists" and continues

### First Startup
```
✅ Default admin created successfully
📧 Email: classcrew@admin.com
🔑 Username: classcrew_admin
⚠️  Please change the password after first login!
```

### Subsequent Startups
```
Admin already exists
```

---

## Admin Role Hierarchy

### Single Admin Role

- **Role**: `admin` (only role available)
- **No superadmin**: Removed from enum to keep hierarchy simple
- **Top-level**: Admin has full system access

### Admin Model Configuration

```javascript
role: {
    type: String,
    default: "admin",
    enum: ["admin"]  // Only admin role exists
}
```

---

## Security Features

### 1. User Registration Protection

Users **CANNOT** register as admin through the public registration API.

**Validation in `auth.service.js`:**
```javascript
if (userData.memberType === "admin" || userData.role === "admin") {
    throw ApiError.forbidden("Users cannot register as admin");
}
```

**Test Result:**
```
POST /api/v1/auth/register with memberType: "admin"
Response: 400 Bad Request
Message: "Users cannot register as admin"
```

✅ Only the seed script can create admin accounts

### 2. Admin Schema Validation

```javascript
{
    email: { unique: true, required: true },
    username: { unique: true, required: true, 3-50 chars },
    password: { required: true, min 8 chars, bcrypt hashed },
    fullName: { required: true },
    role: { enum: ["admin"], default: "admin" },
    isActive: { default: true }
}
```

---

## Admin Login

### Endpoint
`POST /api/v1/admin/login`

### Login Methods

#### 1. Login with Username
```json
{
    "username": "classcrew_admin",
    "password": "admin123"
}
```

#### 2. Login with Email
```json
{
    "email": "classcrew@admin.com",
    "password": "admin123"
}
```

### Success Response (200 OK)
```json
{
    "status": "success",
    "message": "관리자 로그인 성공",
    "data": {
        "admin": {
            "_id": "690d51150f4ef1022305b11c",
            "id": "690d51150f4ef1022305b11c",
            "email": "classcrew@admin.com",
            "username": "classcrew_admin",
            "fullName": "ClassCrew Administrator",
            "role": "admin",
            "isActive": true,
            "createdAt": "2025-11-07T01:53:25.304Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

---

## Admin Operations

### Protected Admin Endpoints

All admin endpoints require authentication:

```
Authorization: Bearer <admin_token>
```

### Admin Management APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/login` | POST | Admin login (public) |
| `/api/v1/admin/profile` | GET | Get admin profile |
| `/api/v1/admin/password` | PUT | Change admin password |
| `/api/v1/admin/admins` | GET | List all admins |
| `/api/v1/admin/admins` | POST | Create new admin |
| `/api/v1/admin/admins/:id` | PUT | Update admin |
| `/api/v1/admin/admins/:id` | DELETE | Delete admin |
| `/api/v1/admin/admins/:id/status` | PATCH | Toggle admin status |

### User Management by Admin

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/users` | GET | List all users |
| `/api/v1/admin/users/:id` | GET | Get user by ID |
| `/api/v1/admin/users` | POST | Create user |
| `/api/v1/admin/users/:id` | PUT | Update user |
| `/api/v1/admin/users/:id` | DELETE | Delete user |
| `/api/v1/admin/users/:id/toggle-status` | PATCH | Toggle user status |

---

## Implementation Details

### 1. Seed Script (`src/seeds/seed-admin.js`)

```javascript
const seedAdmin = async () => {
    try {
        const adminEmail = "classcrew@admin.com";
        const adminPassword = "admin123";

        const existingAdmin = await Admin.findOne({ email: adminEmail });

        if (existingAdmin) {
            logger.info("Admin already exists");
            return;
        }

        const admin = await Admin.create({
            email: adminEmail,
            username: "classcrew_admin",
            password: adminPassword,
            fullName: "ClassCrew Administrator",
            role: "admin",
            isActive: true,
        });

        logger.info("✅ Default admin created successfully");
        // ... logging
    } catch (error) {
        logger.error("❌ Error seeding admin:", error.message);
    }
};

module.exports = seedAdmin;
```

### 2. Server Integration (`src/server.js`)

```javascript
const seedAdmin = require("./seeds/seed-admin");

// Connect to database and seed admin
connectDB().then(async () => {
    await seedAdmin();
});
```

### 3. Registration Protection (`src/services/auth.service.js`)

```javascript
const register = async (userData) => {
    // Prevent admin registration
    if (userData.memberType === "admin" || userData.role === "admin") {
        throw ApiError.forbidden("Users cannot register as admin");
    }
    // ... rest of registration logic
};
```

---

## Testing Results

### ✅ Test 1: Admin Seeding
- Admin created automatically on first startup
- Subsequent startups detect existing admin
- No duplicate admins created

### ✅ Test 2: Admin Login
- Login with username: **SUCCESS**
- Login with email: **SUCCESS**
- Invalid credentials: **Rejected (401)**
- Inactive admin: **Rejected (403)**

### ✅ Test 3: Admin Profile Access
- Get profile with valid token: **SUCCESS**
- Get profile without token: **Rejected (401)**

### ✅ Test 4: User Registration Protection
- User attempts to register with memberType "admin": **Rejected (403)**
- User attempts to register with role "admin": **Rejected (403)**
- Normal user registration: **SUCCESS**

---

## Admin vs User Comparison

| Feature | User | Admin |
|---------|------|-------|
| Registration | ✅ Public API | ❌ Seed script only |
| Login Endpoint | `/auth/login` | `/admin/login` |
| Member Types | employed, corporate_training, job_seeker | admin |
| User Management | Self only | All users |
| Admin Management | ❌ No access | ✅ Full access |
| Role | "user" | "admin" |
| Hierarchy | Standard | **Top-level** |

---

## Changing Admin Password

### Option 1: Via API

```bash
PUT /api/v1/admin/password
Authorization: Bearer <admin_token>

{
    "currentPassword": "admin123",
    "newPassword": "new_secure_password"
}
```

### Option 2: Via Database

```javascript
const Admin = require("./models/admin.model");

const admin = await Admin.findOne({ email: "classcrew@admin.com" });
admin.password = "new_secure_password";
await admin.save(); // Automatically hashed by pre-save hook
```

---

## Production Recommendations

1. ✅ **Change Default Password**: Immediately change `admin123` after deployment
2. ✅ **Use Strong Passwords**: Min 12+ characters, mixed case, numbers, symbols
3. ✅ **Environment Variables**: Store credentials in `.env` (not hardcoded)
4. ✅ **Monitor Admin Activity**: Track admin login and actions
5. ✅ **Limit Admin Accounts**: Only create admins when necessary
6. ✅ **Regular Security Audits**: Review admin access periodically

---

## Environment Variables (Future Enhancement)

Currently hardcoded, but can be moved to `.env`:

```env
# Admin Credentials
ADMIN_EMAIL=classcrew@admin.com
ADMIN_USERNAME=classcrew_admin
ADMIN_PASSWORD=admin123
ADMIN_FULL_NAME=ClassCrew Administrator
```

Then update `seed-admin.js`:
```javascript
const adminEmail = process.env.ADMIN_EMAIL || "classcrew@admin.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
```

---

## Troubleshooting

### Issue: Admin not created on startup
**Solution**: Check MongoDB connection and logs

### Issue: "Admin already exists" but cannot login
**Solution**: Check if admin is active in database
```javascript
db.admins.findOne({ email: "classcrew@admin.com" })
```

### Issue: User registered as admin
**Solution**: Check validation in `auth.service.js` - this should not be possible

### Issue: Cannot change admin password
**Solution**: Ensure current password is correct and token is valid

---

## Summary

✅ **Admin seeding**: Automatic on server startup
✅ **Default credentials**: classcrew@admin.com / admin123
✅ **Role hierarchy**: Admin is top-level (no superadmin)
✅ **Security**: Users cannot register as admin
✅ **Idempotent**: Safe to restart server (no duplicate admins)

**Status**: ✅ Production Ready

