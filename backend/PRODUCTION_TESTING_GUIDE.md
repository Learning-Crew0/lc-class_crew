# Production Testing Guide - Class Application

## ⚠️ Important Issue Found

**Problem:** You're trying to use a **LOCAL** application ID on **PRODUCTION**.

```
Local ID (doesn't exist in production):
❌ 691afc21d81f98c0612a16c5

Production URL:
✅ https://class-crew.onrender.com
```

**Result:** `404 Application not found`

---

## 🎯 Solution: Create Fresh Draft on Production

### **Method 1: Via Frontend (Easiest)**

1. **Open production:** https://class-crew.onrender.com

2. **Login:**
   - Email: `ishant@gmail.com`
   - Username: `Ishant@1001`
   - Password: [Your password]

3. **Navigate to courses:**
   - Browse courses
   - Click "수강신청" (Apply) on any course

4. **Add to cart:**
   - Course gets added to shopping basket

5. **Go to checkout:**
   - Click cart icon
   - Click "수강신청하기" (Apply for class)

6. **Check browser console:**
   - Open DevTools (F12)
   - Look for draft application creation
   - Copy the application ID

7. **Use that ID** for API testing

---

### **Method 2: Via API (For Quick Testing)**

#### **Step 1: Login**

```bash
curl -X POST https://class-crew.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Ishant@1001",
    "password": "YOUR_PASSWORD"
  }'
```

**Save the token from response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",  // ← Copy this
  "user": { ... }
}
```

---

#### **Step 2: Create Draft Application**

```bash
curl -X POST https://class-crew.onrender.com/api/v1/class-applications/draft \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "courseIds": ["6916cc33ec0d797bcaef685f"]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "PRODUCTION_APPLICATION_ID",  // ← Use this for testing!
    "status": "draft",
    ...
  }
}
```

---

#### **Step 3: Add Student**

```bash
curl -X POST https://class-crew.onrender.com/api/v1/class-applications/PRODUCTION_APPLICATION_ID/add-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "courseId": "6916cc33ec0d797bcaef685f",
    "studentData": {
      "userId": "691aebe8962da064edc9cb18",
      "name": "Ishant Patel",
      "email": {
        "username": "ishant",
        "domain": "gmail.com"
      },
      "phone": {
        "prefix": "012",
        "middle": "3456",
        "last": "7891"
      },
      "company": "Test Company",
      "position": "Engineer"
    }
  }'
```

---

#### **Step 4: Update Payment Info**

```bash
curl -X PUT https://class-crew.onrender.com/api/v1/class-applications/PRODUCTION_APPLICATION_ID/payment-info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "paymentMethod": "간편결제",
    "applicantInfo": {
      "name": "Ishant Patel",
      "phone": {
        "prefix": "012",
        "middle": "3456",
        "last": "7891"
      },
      "email": {
        "username": "ishant",
        "domain": "gmail.com"
      }
    },
    "taxInvoice": {
      "enabled": false
    }
  }'
```

---

#### **Step 5: Submit Application**

```bash
curl -X POST https://class-crew.onrender.com/api/v1/class-applications/PRODUCTION_APPLICATION_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "agreements": {
      "purchaseTerms": true,
      "refundPolicy": true
    }
  }'
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "...",
    "status": "submitted",
    "applicationNumber": "APP-20251117-0001"
  }
}
```

---

## 🔍 Debugging Commands

### Check if draft exists:
```bash
curl https://class-crew.onrender.com/api/v1/class-applications/YOUR_APP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get user's applications:
```bash
curl https://class-crew.onrender.com/api/v1/class-applications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check user profile:
```bash
curl https://class-crew.onrender.com/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Common Errors

### ❌ "Application not found"
**Cause:** Using local ID on production  
**Fix:** Create new draft on production

### ❌ "All agreements must be accepted"
**Cause:** Old backend code  
**Fix:** ✅ Already fixed and deployed (commit d6141e3)

### ❌ "applicationNumber already exists"
**Cause:** Database index issue  
**Fix:** Run `node scripts/production-fix-deployment.js` (once Render deploys)

### ❌ 401 Unauthorized
**Cause:** Token expired or invalid  
**Fix:** Login again to get fresh token

---

## ✅ Complete Test Flow

```bash
# 1. Login
TOKEN=$(curl -s -X POST https://class-crew.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Ishant@1001","password":"YOUR_PASSWORD"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Create draft
APP_ID=$(curl -s -X POST https://class-crew.onrender.com/api/v1/class-applications/draft \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"courseIds":["6916cc33ec0d797bcaef685f"]}' \
  | jq -r '.data._id')

echo "Application ID: $APP_ID"

# 3. Add student
curl -X POST "https://class-crew.onrender.com/api/v1/class-applications/$APP_ID/add-student" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "courseId": "6916cc33ec0d797bcaef685f",
    "studentData": {
      "userId": "691aebe8962da064edc9cb18",
      "name": "Ishant Patel",
      "email": {"username": "ishant", "domain": "gmail.com"},
      "phone": {"prefix": "012", "middle": "3456", "last": "7891"}
    }
  }'

# 4. Update payment
curl -X PUT "https://class-crew.onrender.com/api/v1/class-applications/$APP_ID/payment-info" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "paymentMethod": "간편결제",
    "applicantInfo": {
      "name": "Ishant Patel",
      "phone": {"prefix": "012", "middle": "3456", "last": "7891"},
      "email": {"username": "ishant", "domain": "gmail.com"}
    },
    "taxInvoice": {"enabled": false}
  }'

# 5. Submit
curl -X POST "https://class-crew.onrender.com/api/v1/class-applications/$APP_ID/submit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "agreements": {
      "purchaseTerms": true,
      "refundPolicy": true
    }
  }'
```

---

## 🚀 Next Steps

1. ✅ **Agreements fix deployed** (commit d6141e3)
2. ⏳ **Wait for Render to deploy** (check dashboard)
3. 🧪 **Create fresh draft on production** (use Method 1 or 2 above)
4. ✅ **Test complete flow** with production application ID
5. 🔧 **Run index fix if needed** (`production-fix-deployment.js`)

---

**Status:** Ready to test once Render deployment completes  
**Estimated Deploy Time:** 2-5 minutes

