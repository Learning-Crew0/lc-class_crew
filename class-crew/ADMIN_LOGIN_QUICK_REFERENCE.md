# 🔐 Admin Login - Quick Reference

## 🚀 Quick Start

### Access Admin Login
```
URL: http://localhost:3000/admin-login
```

### Default Credentials
```
Username: classcrew_admin
Email:    admin@classcrew.com
Password: Admin@123456
```

---

## 📋 Key Features

✅ **Correct Endpoint:** `/api/admin/login` (not `/api/users/login`)  
✅ **Smart Detection:** Auto-detects email vs username  
✅ **Response Handling:** Properly handles `admin` object  
✅ **Error Messages:** Korean language, user-friendly  
✅ **Security:** Active status check, role verification  
✅ **Dev Helper:** Shows credentials in development mode  
✅ **Full API Suite:** 7 admin management functions  

---

## 🔧 API Functions Available

```typescript
// Authentication
loginAdmin(credentials)
getAdminProfile(token)
updateAdminPassword(token, passwords)

// Management
createAdmin(token, adminData)
getAllAdmins(token, page, limit)
updateAdminStatus(token, adminId, isActive)
deleteAdmin(token, adminId)
```

---

## 🎯 What Changed

### Before
- Used `/api/users/login` endpoint
- Expected `user` object in response
- Basic error handling
- No admin-specific features

### After
- Uses `/api/admin/login` endpoint ✅
- Handles `admin` object in response ✅
- Comprehensive error handling ✅
- Full admin API suite ✅
- Development helpers ✅
- Korean error messages ✅

---

## ✅ Integration Checklist

- [x] Admin login endpoint (`/api/admin/login`)
- [x] Admin response object handling
- [x] Email/username auto-detection
- [x] Active status verification
- [x] Error message localization (Korean)
- [x] Development credential helper
- [x] Token storage and management
- [x] Admin API functions (7 total)
- [x] TypeScript type safety
- [x] No compilation errors

---

## 🧪 Test It

1. Navigate to `/admin-login`
2. See blue dev helper box with credentials
3. Enter: `classcrew_admin` / `Admin@123456`
4. Click "관리자 로그인"
5. See success alert
6. Redirect to `/admin` dashboard

**Status:** ✅ PERFECT INTEGRATION COMPLETE
