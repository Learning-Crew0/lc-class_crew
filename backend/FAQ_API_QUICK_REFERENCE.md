# FAQ API - Frontend Integration Guide

## ✅ Status: ALL TESTS PASSED - Ready for Integration

### 📊 Test Results:
- ✅ 6 FAQs found in database
- ✅ 7 FAQ Categories found
- ✅ All approval filters REMOVED
- ✅ FAQs show directly to users without approval

---

## 🔵 Frontend Endpoints (No Authentication Required)

### 1. Get All FAQs

**Endpoint:**
```
GET https://class-crew.onrender.com/api/v1/public/faqs
```

**Optional Query Parameters:**
- `category`: Filter by category (e.g., `signup/login`, `payment`, `courses`)
- `limit`: Number of results per page (default: 20)
- `page`: Page number (default: 1)
- `search`: Search term for questions/answers

**Examples:**

```bash
# Get all FAQs (no filtering)
curl https://class-crew.onrender.com/api/v1/public/faqs

# Get FAQs for specific category
curl https://class-crew.onrender.com/api/v1/public/faqs?category=signup/login

# Get FAQs with pagination
curl https://class-crew.onrender.com/api/v1/public/faqs?limit=10&page=1

# Search FAQs
curl https://class-crew.onrender.com/api/v1/public/faqs?search=password
```

**Response Format:**
```json
{
  "status": "success",
  "message": "FAQs retrieved successfully",
  "data": [
    {
      "_id": "69146b35efd02fc2a62a18fb",
      "question": "How do I reset my password?",
      "answer": "Click on the 'Forgot Password' link...",
      "category": "signup/login",
      "categoryLabel": "회원가입/로그인",
      "order": 1,
      "tags": ["password", "account"],
      "viewCount": 150,
      "helpfulCount": 45,
      "notHelpful": 3,
      "isActive": true,
      "isFeatured": false,
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalFAQs": 6,
    "limit": 20
  }
}
```

---

### 2. Get All FAQ Categories

**Endpoint:**
```
GET https://class-crew.onrender.com/api/v1/public/faq-categories
```

**Examples:**

```bash
# Get all categories
curl https://class-crew.onrender.com/api/v1/public/faq-categories
```

**Response Format:**
```json
{
  "status": "success",
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "69146a23efd02fc2a62a18f0",
      "key": "signup/login",
      "label": "회원가입/로그인",
      "description": "Account and login related questions",
      "order": 1,
      "icon": "user",
      "isActive": true,
      "faqCount": 3,
      "createdAt": "2025-01-10T09:00:00.000Z",
      "updatedAt": "2025-01-10T09:00:00.000Z"
    },
    {
      "_id": "69146a23efd02fc2a62a18f1",
      "key": "payment",
      "label": "결제/환불",
      "description": "Payment and refund questions",
      "order": 2,
      "icon": "credit-card",
      "isActive": true,
      "faqCount": 2,
      "createdAt": "2025-01-10T09:00:00.000Z",
      "updatedAt": "2025-01-10T09:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single FAQ by ID

**Endpoint:**
```
GET https://class-crew.onrender.com/api/v1/public/faqs/:id
```

**Example:**
```bash
curl https://class-crew.onrender.com/api/v1/public/faqs/69146b35efd02fc2a62a18fb
```

**Response Format:**
```json
{
  "status": "success",
  "message": "FAQ retrieved successfully",
  "data": {
    "_id": "69146b35efd02fc2a62a18fb",
    "question": "How do I reset my password?",
    "answer": "Click on the 'Forgot Password' link...",
    "category": "signup/login",
    "categoryLabel": "회원가입/로그인",
    "relatedFAQs": [
      {
        "_id": "69146b35efd02fc2a62a18fc",
        "question": "How do I change my email?",
        "category": "signup/login"
      }
    ],
    ...
  }
}
```

---

### 4. Mark FAQ as Helpful/Not Helpful

**Endpoint:**
```
POST https://class-crew.onrender.com/api/v1/public/faqs/:id/helpful
```

**Request Body:**
```json
{
  "helpful": true
}
```

**Example:**
```bash
curl -X POST https://class-crew.onrender.com/api/v1/public/faqs/69146b35efd02fc2a62a18fb/helpful \
  -H "Content-Type: application/json" \
  -d '{"helpful": true}'
```

**Response Format:**
```json
{
  "status": "success",
  "message": "Feedback recorded successfully",
  "data": {
    "message": "Feedback recorded successfully",
    "helpful": 46,
    "notHelpful": 3
  }
}
```

---

## 🔴 Admin Side APIs (Authentication Required)

All admin endpoints require Bearer token authentication:
```
Authorization: Bearer {admin_token}
```

### Admin Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/faq-categories` | Create new category |
| GET | `/api/v1/admin/faq-categories` | Get all categories (including inactive) |
| PUT | `/api/v1/admin/faq-categories/:id` | Update category |
| DELETE | `/api/v1/admin/faq-categories/:id` | Delete category |
| POST | `/api/v1/admin/faqs` | Create new FAQ |
| GET | `/api/v1/admin/faqs` | Get all FAQs (including inactive) |
| GET | `/api/v1/admin/faqs/:id` | Get single FAQ |
| PUT | `/api/v1/admin/faqs/:id` | Update FAQ |
| DELETE | `/api/v1/admin/faqs/:id` | Delete FAQ |
| GET | `/api/v1/admin/faqs/stats` | Get FAQ statistics |

---

## 📦 React/Next.js Integration Example

```javascript
// Get all FAQs
const fetchFAQs = async (category = null, page = 1) => {
  try {
    let url = 'https://class-crew.onrender.com/api/v1/public/faqs';
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    params.append('page', page);
    params.append('limit', '20');
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log(`Found ${result.data.length} FAQs`);
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching FAQs:', error);
  }
};

// Get all categories
const fetchCategories = async () => {
  try {
    const response = await fetch(
      'https://class-crew.onrender.com/api/v1/public/faq-categories'
    );
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log(`Found ${result.data.length} categories`);
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Mark FAQ as helpful
const markHelpful = async (faqId, helpful = true) => {
  try {
    const response = await fetch(
      `https://class-crew.onrender.com/api/v1/public/faqs/${faqId}/helpful`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful }),
      }
    );
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error marking helpful:', error);
  }
};

// Usage example
useEffect(() => {
  const loadData = async () => {
    const categories = await fetchCategories();
    const faqs = await fetchFAQs();
    
    console.log('Categories:', categories);
    console.log('FAQs:', faqs);
  };
  
  loadData();
}, []);
```

---

## 🧪 Quick Test Commands (Run in Terminal)

### Test FAQs Endpoint:
```bash
# Windows PowerShell
Invoke-RestMethod -Uri "https://class-crew.onrender.com/api/v1/public/faqs" -Method Get

# Linux/Mac
curl https://class-crew.onrender.com/api/v1/public/faqs | jq
```

### Test Categories Endpoint:
```bash
# Windows PowerShell
Invoke-RestMethod -Uri "https://class-crew.onrender.com/api/v1/public/faq-categories" -Method Get

# Linux/Mac
curl https://class-crew.onrender.com/api/v1/public/faq-categories | jq
```

---

## 🎯 Current Database Status

### FAQs:
- **Total FAQs:** 6
- **Categories used:** signup/login, payment, courses

### Categories:
- **Total Categories:** 7
- **All Active:** Yes

---

## ✅ Changes Made

1. ✅ **Removed approval filtering** - All FAQs show directly
2. ✅ **Removed isActive filter** from public endpoints
3. ✅ **Categories show without filtering**
4. ✅ **Search returns all results** without status checks
5. ✅ **getAllFAQs** - No filtering by default
6. ✅ **getFAQsByCategory** - No filtering by default
7. ✅ **searchFAQs** - No filtering by default

---

## 🚀 Ready for Production!

All endpoints tested and working:
- ✅ GET `/api/v1/public/faqs`
- ✅ GET `/api/v1/public/faqs?category=signup/login`
- ✅ GET `/api/v1/public/faq-categories`
- ✅ POST `/api/v1/public/faqs/:id/helpful`

**Backend is ready for frontend integration!**

