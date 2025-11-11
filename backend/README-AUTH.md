# 🔐 Authentication System - Quick Start

This document provides a quick overview of the ClassCrew authentication system.

---

## 🚀 Available Endpoints

### User Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/admin/login` - Admin login

### Account Recovery
- `POST /api/v1/auth/find-id` - Find username by name + phone
- `POST /api/v1/auth/password-reset/initiate` - Send verification code
- `POST /api/v1/auth/password-reset/verify-code` - Verify code
- `POST /api/v1/auth/password-reset/reset` - Reset password

---

## 🧪 Quick Test

Run the test script:
```powershell
cd backend
.\test-final.ps1
```

Or test individual endpoints:
```powershell
# Find ID
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/find-id" `
  -Method Post `
  -Body '{"name":"Your Name","phoneNumber":"01012345678"}' `
  -ContentType "application/json"
```

---

## 📚 Full Documentation

- **Implementation Details:** `docs/PASSWORD_RESET_IMPLEMENTATION.md`
- **Frontend Integration:** `frontend-integration-guides/02-authentication.md`
- **API Reference:** `FRONTEND_INTEGRATION_GUIDE.md`

---

## ⚙️ Configuration

### Development (Current)
- SMS codes are logged to console
- No actual SMS sent

### Production
1. Choose SMS provider (Twilio/AWS SNS)
2. Add credentials to `.env`:
   ```bash
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```
3. Update `src/services/sms.service.js` (uncomment production code)

---

## ✅ Status

- ✅ Registration & Login
- ✅ Find ID
- ✅ Password Reset (3-step flow)
- ⚠️ SMS Integration (needs production config)
- ✅ Frontend Components
- ✅ API Documentation

**All endpoints tested and working!**

