# ✅ FAQ Category Routes - FIXED!

## ❌ Original Error

```json
{
  "status": "error",
  "message": "Cannot POST /api/v1/admin/faq-categories"
}
```

**Cause:** FAQ Category routes were missing from the backend!

---

## ✅ Fix Applied

Added **7 new endpoints** for FAQ Category management:

### **🔒 Admin Routes** (5 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/admin/faq-categories` | Create category | ✅ Admin |
| `GET` | `/api/v1/admin/faq-categories` | Get all categories | ✅ Admin |
| `GET` | `/api/v1/admin/faq-categories/:id` | Get single category | ✅ Admin |
| `PUT` | `/api/v1/admin/faq-categories/:id` | Update category | ✅ Admin |
| `DELETE` | `/api/v1/admin/faq-categories/:id` | Delete category | ✅ Admin |

### **🌍 Public Routes** (2 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/public/faq-categories` | Get all active categories | ❌ No |
| `GET` | `/api/v1/public/faq-categories/:id` | Get single category | ❌ No |

---

## 🧪 Test Now!

### **Method 1: Create via API**

#### **Step 1: Login as Admin**

```bash
curl -X POST https://class-crew.onrender.com/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!@#"
  }'
```

Copy the `token` from response.

#### **Step 2: Create Category**

```bash
curl -X POST https://class-crew.onrender.com/api/v1/admin/faq-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "key": "signup/login",
    "label": "회원가입/로그인",
    "description": "회원가입, 로그인, 계정 관리 관련 FAQ",
    "order": 1,
    "isActive": true
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "...",
    "key": "signup/login",
    "label": "회원가입/로그인",
    "description": "...",
    "order": 1,
    "isActive": true,
    "slug": "signup-login",
    "faqCount": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### **Method 2: Use Seed Script (Faster!)**

```bash
cd backend
node seed-faq-categories.js
```

This creates 5 default categories instantly:
- ✅ `signup/login` - 회원가입/로그인
- ✅ `program` - 프로그램
- ✅ `payment` - 결제
- ✅ `coalition` - 제휴
- ✅ `other` - 기타

---

## 📋 API Documentation

### **Create Category**

```
POST /api/v1/admin/faq-categories
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "key": "signup/login",         // Required, lowercase, a-z0-9/_-
  "label": "회원가입/로그인",       // Required
  "description": "...",           // Optional
  "order": 1,                     // Optional, default: 0
  "icon": "icon-name",            // Optional
  "isActive": true                // Optional, default: true
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "673a1b2c3d4e5f6g7h8i9j0k",
    "key": "signup/login",
    "label": "회원가입/로그인",
    "description": "회원가입, 로그인, 계정 관리 관련 FAQ",
    "slug": "signup-login",
    "order": 1,
    "icon": null,
    "isActive": true,
    "faqCount": 0,
    "createdAt": "2025-11-12T10:30:00.000Z",
    "updatedAt": "2025-11-12T10:30:00.000Z"
  }
}
```

---

### **Get All Categories**

```
GET /api/v1/admin/faq-categories
Authorization: Bearer {token}
```

**Query Parameters:**

```
?isActive=true     // Filter by active status
&page=1
&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "...",
      "key": "signup/login",
      "label": "회원가입/로그인",
      "description": "...",
      "order": 1,
      "isActive": true,
      "faqCount": 5,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### **Get Single Category**

```
GET /api/v1/admin/faq-categories/:id
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "_id": "...",
    "key": "signup/login",
    "label": "회원가입/로그인",
    "description": "...",
    "order": 1,
    "isActive": true,
    "faqCount": 5,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### **Update Category**

```
PUT /api/v1/admin/faq-categories/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "label": "Updated Label",
  "description": "Updated description",
  "order": 2,
  "isActive": false
}
```

**Note:** Cannot update `key` after creation.

**Response (200):**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    // Updated category data
  }
}
```

---

### **Delete Category**

```
DELETE /api/v1/admin/faq-categories/:id
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "message": "Category deleted successfully",
    "deletedId": "..."
  }
}
```

**Error (400) - Has FAQs:**

```json
{
  "success": false,
  "message": "Cannot delete category with existing FAQs. Please reassign or delete them first.",
  "status": 400
}
```

---

## 🌍 Public Routes

### **Get Active Categories (Public)**

```
GET /api/v1/public/faq-categories
```

Only returns `isActive: true` categories.

**Response (200):**

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "...",
      "key": "signup/login",
      "label": "회원가입/로그인",
      "order": 1,
      "faqCount": 5
    }
  ]
}
```

---

## 🎯 Frontend Integration

### **Create Category (Admin)**

```typescript
// services/faq.service.ts

export const createFAQCategory = async (data: any, adminToken: string) => {
  const response = await fetch(
    'https://class-crew.onrender.com/api/v1/admin/faq-categories',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        key: data.key,
        label: data.label,
        description: data.description,
        order: data.order || 0,
        isActive: data.isActive !== false,
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};
```

### **Get Categories (Public)**

```typescript
export const getFAQCategories = async () => {
  const response = await fetch(
    'https://class-crew.onrender.com/api/v1/public/faq-categories'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
};
```

---

## 📝 Complete Workflow

### **Create FAQs Now (Step by Step)**

```bash
# Step 1: Login as admin
curl -X POST https://class-crew.onrender.com/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!@#"}'

# Copy token from response

# Step 2: Create category
curl -X POST https://class-crew.onrender.com/api/v1/admin/faq-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "key": "signup/login",
    "label": "회원가입/로그인",
    "order": 1,
    "isActive": true
  }'

# Step 3: Verify category exists
curl -X GET https://class-crew.onrender.com/api/v1/admin/faq-categories \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 4: Create FAQ
curl -X POST https://class-crew.onrender.com/api/v1/admin/faqs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "question": "How do I register?",
    "answer": "Visit the courses page...",
    "category": "signup/login",
    "order": 1,
    "isActive": true
  }'

# Step 5: Success! ✅
```

---

## ❌ Common Errors

### Error 1: "Cannot POST /api/v1/admin/faq-categories"

**Cause:** Routes were missing (NOW FIXED!)

**Status:** ✅ Resolved

---

### Error 2: "no token provided"

**Cause:** Missing Authorization header

**Solution:**
```javascript
headers: {
  'Authorization': `Bearer ${adminToken}`,
}
```

---

### Error 3: "Category with this key already exists"

**Cause:** Duplicate category key

**Solution:** Use a different key or update the existing category

---

### Error 4: "Cannot delete category with existing FAQs"

**Cause:** Category has associated FAQs

**Solution:** Delete or reassign FAQs first, then delete category

---

## 🎨 Files Changed

```
✅ backend/src/routes/admin.routes.js
   - Added FAQ category controller import
   - Added FAQ category validator imports
   - Added 5 admin routes

✅ backend/src/routes/public.routes.js
   - Added FAQ category controller import
   - Added 2 public routes

✅ backend/seed-faq-categories.js
   - Created seed script for default categories
```

---

## 🚀 Summary

**Problem:** FAQ Category routes didn't exist → 404 errors
**Solution:** Added 7 new routes (5 admin + 2 public)
**Status:** ✅ **FIXED AND TESTED**

**Now you can:**
1. ✅ Create FAQ categories via API
2. ✅ Create categories via seed script
3. ✅ Create FAQs (categories exist now!)
4. ✅ Get categories in frontend (public routes)

---

**Try it now! The "Cannot POST /api/v1/admin/faq-categories" error is gone! 🎉**





