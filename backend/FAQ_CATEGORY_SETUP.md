# 🔧 FAQ Category Setup Guide

## ❌ Error: "Category not found"

This error occurs when you try to create an FAQ but the **category doesn't exist** in the database yet.

---

## ✅ Solution: Create Categories First

You have **3 options**:

### **Option 1: Run Seed Script (Recommended)**

```bash
cd backend
node seed-faq-categories.js
```

This will create 5 default categories:

- ✅ `signup/login` - 회원가입/로그인
- ✅ `program` - 프로그램
- ✅ `payment` - 결제
- ✅ `coalition` - 제휴
- ✅ `other` - 기타

---

### **Option 2: Create Categories via API**

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

#### **Step 2: Create Each Category**

```bash
# Category 1: Signup/Login
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

# Category 2: Program
curl -X POST https://class-crew.onrender.com/api/v1/admin/faq-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "key": "program",
    "label": "프로그램",
    "description": "교육 프로그램 및 과정 관련 FAQ",
    "order": 2,
    "isActive": true
  }'

# Category 3: Payment
curl -X POST https://class-crew.onrender.com/api/v1/admin/faq-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "key": "payment",
    "label": "결제",
    "description": "결제, 환불, 영수증 관련 FAQ",
    "order": 3,
    "isActive": true
  }'

# Category 4: Coalition
curl -X POST https://class-crew.onrender.com/api/v1/admin/faq-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "key": "coalition",
    "label": "제휴",
    "description": "제휴 및 파트너십 관련 FAQ",
    "order": 4,
    "isActive": true
  }'

# Category 5: Other
curl -X POST https://class-crew.onrender.com/api/v1/admin/faq-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "key": "other",
    "label": "기타",
    "description": "기타 문의사항",
    "order": 5,
    "isActive": true
  }'
```

---

### **Option 3: Use Postman**

1. Import collection: `backend/postman/Customer-Service-Center-API.postman_collection.json`
2. Run **"0. Authentication → Admin Login"**
3. Go to **"5. Admin - FAQ Management"** folder
4. There should be category creation requests (if not, add them manually)

---

## 🧪 Test: Create FAQ After Categories Exist

```bash
curl -X POST https://class-crew.onrender.com/api/v1/admin/faqs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "question": "공개교육을 신청하려면 회원가입을 해야 하나요?",
    "answer": "네, 개인회원가입 후 교육 수강신청이 가능합니다.",
    "category": "signup/login",
    "order": 1,
    "isActive": true,
    "isFeatured": false,
    "tags": ["회원가입", "로그인", "공개교육"]
  }'
```

**Expected Response:**

```json
{
    "success": true,
    "message": "FAQ created successfully",
    "data": {
        "_id": "...",
        "question": "공개교육을 신청하려면 회원가입을 해야 하나요?",
        "answer": "네, 개인회원가입 후...",
        "category": "signup/login",
        "categoryLabel": "회원가입/로그인", // ✅ Auto-populated!
        "slug": "...",
        "createdBy": "...",
        "createdAt": "..."
    }
}
```

---

## 📋 Available Category Keys

Use these **exact keys** when creating FAQs:

| Category Key   | Korean Label    | Description                 |
| -------------- | --------------- | --------------------------- |
| `signup/login` | 회원가입/로그인 | 회원가입, 로그인, 계정 관리 |
| `program`      | 프로그램        | 교육 프로그램 및 과정       |
| `payment`      | 결제            | 결제, 환불, 영수증          |
| `coalition`    | 제휴            | 제휴 및 파트너십            |
| `other`        | 기타            | 기타 문의사항               |

---

## 🎯 Frontend: Creating Categories

```typescript
// services/faq.service.ts

export const createFAQCategory = async (data: any, adminToken: string) => {
    const response = await fetch(
        "https://class-crew.onrender.com/api/v1/admin/faq-categories",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                key: data.key, // e.g., "signup/login"
                label: data.label, // e.g., "회원가입/로그인"
                description: data.description, // Optional
                order: data.order || 0,
                isActive: data.isActive !== false,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
};

// Usage
const categories = [
    {
        key: "signup/login",
        label: "회원가입/로그인",
        description: "회원가입, 로그인, 계정 관리 관련 FAQ",
        order: 1,
    },
    // ... more categories
];

// Create all categories
for (const category of categories) {
    await createFAQCategory(category, adminToken);
}
```

---

## 🔍 Check Existing Categories

```bash
# Get all categories
curl -X GET https://class-crew.onrender.com/api/v1/admin/faq-categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**

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
            "faqCount": 0,
            "createdAt": "...",
            "updatedAt": "..."
        }
        // ... more categories
    ]
}
```

---

## ❌ Common Errors

### Error 1: "Category not found"

**Cause:** The category key doesn't exist in database

**Solution:** Create the category first (see options above)

---

### Error 2: "Category with this key already exists"

**Cause:** You're trying to create a duplicate category

**Solution:** Use a different key or update the existing category

```bash
# Update existing category
curl -X PUT https://class-crew.onrender.com/api/v1/admin/faq-categories/{categoryId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "label": "Updated Label",
    "description": "Updated description"
  }'
```

---

### Error 3: FAQ created but categoryLabel is empty

**Cause:** Category exists but doesn't have a `label` field

**Solution:** Update the category to include a `label`:

```bash
curl -X PUT https://class-crew.onrender.com/api/v1/admin/faq-categories/{categoryId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "label": "회원가입/로그인"
  }'
```

---

## 🎨 Category Management API

### Get All Categories

```
GET /api/v1/admin/faq-categories
```

### Get Category by ID

```
GET /api/v1/admin/faq-categories/:id
```

### Create Category

```
POST /api/v1/admin/faq-categories
```

### Update Category

```
PUT /api/v1/admin/faq-categories/:id
```

### Delete Category

```
DELETE /api/v1/admin/faq-categories/:id
```

**Note:** Cannot delete category if it has associated FAQs!

---

## 📝 Workflow: Creating FAQs

```
1. Login as Admin
   POST /api/v1/admin/login
   → Get token

2. Create Categories (if not exists)
   POST /api/v1/admin/faq-categories
   → Create all 5 categories

3. Verify Categories
   GET /api/v1/admin/faq-categories
   → Check they exist

4. Create FAQ
   POST /api/v1/admin/faqs
   → Use category key from step 2

5. Success! ✅
```

---

## 🚀 Quick Start

**Run this in your terminal:**

```bash
cd backend

# Seed categories
node seed-faq-categories.js

# Now you can create FAQs!
```

---

**Categories created! Now you can create FAQs without "Category not found" error! 🎉**
