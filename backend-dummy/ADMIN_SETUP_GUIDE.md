# 🔐 ClassCrew Admin Setup Guide

## ✅ Admin Already Created!

Your ClassCrew admin has been successfully created and is ready to use!

---

## 👤 **Admin Credentials**

```
Username: classcrew_admin
Email:    admin@classcrew.com
Password: Admin@123456
```

⚠️ **IMPORTANT:** Change the password after first login for security!

---

## 🚀 **How to Login**

### **Using Postman:**

**POST** `http://localhost:YOUR_PORT/api/admin/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@classcrew.com",
  "password": "Admin@123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "67123abc...",
    "username": "classcrew_admin",
    "email": "admin@classcrew.com",
    "role": "admin",
    "isActive": true
  }
}
```

**Copy the `token` from the response!**

---

## 🔑 **Using the Token**

For all protected admin routes, include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📋 **Available Admin APIs**

### **1. Login**
```
POST /api/admin/login
Body: { "email": "admin@classcrew.com", "password": "Admin@123456" }
```

### **2. Get Profile**
```
GET /api/admin/profile
Headers: Authorization: Bearer YOUR_TOKEN
```

### **3. Change Password**
```
PUT /api/admin/password
Headers: Authorization: Bearer YOUR_TOKEN
Body: { "currentPassword": "Admin@123456", "newPassword": "NewSecurePassword@123" }
```

### **4. Create Another Admin**
```
POST /api/admin
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "username": "admin2",
  "email": "admin2@classcrew.com",
  "password": "Admin2@123456"
}
```

### **5. Get All Admins**
```
GET /api/admin?page=1&limit=10
Headers: Authorization: Bearer YOUR_TOKEN
```

### **6. Update Admin Status (Activate/Deactivate)**
```
PATCH /api/admin/:id/status
Headers: Authorization: Bearer YOUR_TOKEN
Body: { "isActive": false }
```

### **7. Delete Admin**
```
DELETE /api/admin/:id
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## 🎯 **Admin Capabilities**

All admins have **full access** to:
- ✅ **Courses** - Create, update, delete courses, curriculum, instructors
- ✅ **Users** - Manage all users
- ✅ **Products** - Manage all products
- ✅ **Orders** - Manage all orders
- ✅ **Banners** - Manage all banners
- ✅ **Categories** - Manage all categories
- ✅ **Applicants** - Manage all applicants
- ✅ **Schedules** - Manage all schedules
- ✅ **Enquiries** - Manage all enquiries
- ✅ **Admin Management** - Create, update, delete other admins

---

## 🔧 **Creating Additional Admins**

### **Method 1: Using API (Recommended)**
Once you have a token from the first admin, use the API to create more admins.

### **Method 2: Using Script**
```bash
cd backend-dummy
node scripts/createAdmin.js
```
Then follow the interactive prompts.

---

## ⚠️ **Important Security Notes**

1. ✅ **Change default password** immediately after first login
2. ✅ **Keep admin credentials secure** - never commit to git
3. ✅ **Use strong passwords** (min 8 characters)
4. ✅ **Store tokens securely** on the frontend
5. ✅ **Tokens expire in 7 days** by default
6. ✅ **All admins can manage other admins** - be careful who you grant access to!

---

## 🆘 **Common Issues**

### "Invalid credentials"
- Check username/email and password
- Ensure you're using the correct endpoint

### "Not authorized, no token provided"
- Include `Authorization: Bearer YOUR_TOKEN` header
- Check that token hasn't expired

### "Admin account is deactivated"
- Contact another admin to reactivate your account
- Use `PATCH /api/admin/:id/status` with `{ "isActive": true }`

### "Cannot delete your own admin account"
- You cannot delete yourself
- Ask another admin to delete your account if needed

---

## 📞 **Need Help?**

Check:
1. `backend-dummy/scripts/README.md` - Script documentation
2. `backend-dummy/frontend-help/integration/` - API integration guides
3. Server logs for detailed error messages

---

**Your admin is ready to use! Start by logging in and changing the password!** 🎉

