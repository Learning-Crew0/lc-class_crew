# 🤝 Coalition API - Complete Guide

## 📋 Overview

The Coalition API allows anyone to submit a coalition/partnership application with ClassCrew. Admin users can view, manage, and update the status of all applications.

---

## 🏗️ Coalition Model

```javascript
{
  name: String (required),              // Applicant name
  affiliation: String (required),       // Organization/Company name
  field: String (required),             // Field of work/expertise
  contact: String (required),           // 11-digit Korean phone number
  email: String (required),             // Valid email address
  file: String (required),              // Profile/Reference file (uploaded)
  status: String (enum),                // pending, reviewed, approved, rejected
  adminNote: String,                    // Admin's internal notes
  timestamps: true                      // createdAt, updatedAt
}
```

### **Status Options:**
- `pending` (default) - Application submitted, awaiting review
- `reviewed` - Application has been reviewed
- `approved` - Application approved
- `rejected` - Application rejected

---

## 🔌 API Endpoints

### **1. Create Coalition Application (Public)**

**POST** `/api/coalitions`

**Access:** Public (No authentication required)

**Content-Type:** `multipart/form-data`

**Body (form-data):**
```
name: "홍길동"
affiliation: "ABC Corporation"
field: "Education Technology"
contact: "01012345678"
email: "hong@example.com"
file: [File Upload]
```

**Response:**
```json
{
  "success": true,
  "message": "Coalition application submitted successfully",
  "data": {
    "id": "67123abc...",
    "name": "홍길동",
    "status": "pending",
    "createdAt": "2025-10-28T..."
  }
}
```

**Error (Missing Fields):**
```json
{
  "success": false,
  "message": "All fields are required"
}
```

**Error (No File):**
```json
{
  "success": false,
  "message": "Profile/Reference file is required"
}
```

---

### **2. Get All Coalition Applications (Admin Only)**

**GET** `/api/coalitions`

**Access:** Protected (Admin only)

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, reviewed, approved, rejected)
- `search` - Search in name, email, affiliation, field
- `sortBy` - Sort field (default: createdAt)
- `order` - Sort order (asc/desc, default: desc)

**Example:**
```
GET /api/coalitions?page=1&limit=10&status=pending&search=technology
```

**Response:**
```json
{
  "success": true,
  "data": {
    "coalitions": [
      {
        "_id": "67123abc...",
        "name": "홍길동",
        "affiliation": "ABC Corporation",
        "field": "Education Technology",
        "contact": "01012345678",
        "email": "hong@example.com",
        "file": "https://cloudinary.com/...",
        "status": "pending",
        "createdAt": "2025-10-28T...",
        "updatedAt": "2025-10-28T..."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCoalitions": 48,
      "limit": 10
    },
    "statistics": {
      "pending": 25,
      "reviewed": 10,
      "approved": 8,
      "rejected": 5
    }
  }
}
```

---

### **3. Get Coalition by ID (Admin Only)**

**GET** `/api/coalitions/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67123abc...",
    "name": "홍길동",
    "affiliation": "ABC Corporation",
    "field": "Education Technology",
    "contact": "01012345678",
    "email": "hong@example.com",
    "file": "https://cloudinary.com/...",
    "status": "pending",
    "adminNote": null,
    "createdAt": "2025-10-28T...",
    "updatedAt": "2025-10-28T..."
  }
}
```

---

### **4. Update Coalition Status (Admin Only)**

**PATCH** `/api/coalitions/:id/status`

**Access:** Protected (Admin only)

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "status": "approved",
  "adminNote": "Great candidate for partnership"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coalition status updated successfully",
  "data": {
    "_id": "67123abc...",
    "name": "홍길동",
    "status": "approved",
    "adminNote": "Great candidate for partnership",
    "updatedAt": "2025-10-28T..."
  }
}
```

---

### **5. Delete Coalition Application (Admin Only)**

**DELETE** `/api/coalitions/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Coalition application deleted successfully"
}
```

---

### **6. Get Coalition Statistics (Admin Only)**

**GET** `/api/coalitions/stats`

**Access:** Protected (Admin only)

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 48,
    "byStatus": {
      "pending": 25,
      "reviewed": 10,
      "approved": 8,
      "rejected": 5
    },
    "byField": [
      {
        "_id": "Education Technology",
        "count": 15
      },
      {
        "_id": "Software Development",
        "count": 12
      }
    ]
  }
}
```

---

## 🎯 Use Cases

### **Public User - Submit Application:**

```javascript
const formData = new FormData();
formData.append('name', '홍길동');
formData.append('affiliation', 'ABC Corporation');
formData.append('field', 'Education Technology');
formData.append('contact', '01012345678');
formData.append('email', 'hong@example.com');
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/coalitions', {
  method: 'POST',
  body: formData
});
```

---

### **Admin - View All Applications:**

```javascript
const response = await fetch('/api/coalitions?status=pending&page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

---

### **Admin - Approve Application:**

```javascript
const response = await fetch(`/api/coalitions/${id}/status`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'approved',
    adminNote: 'Excellent partnership opportunity'
  })
});
```

---

## ✅ Validation Rules

- ✅ **name** - Required
- ✅ **affiliation** - Required
- ✅ **field** - Required
- ✅ **contact** - Required, must be 11-digit Korean phone number
- ✅ **email** - Required, must be valid email format
- ✅ **file** - Required, uploaded file (PDF, DOC, images, etc.)
- ✅ **status** - Must be one of: pending, reviewed, approved, rejected

---

## 📊 Features

1. ✅ **Public Submission** - Anyone can submit without login
2. ✅ **File Upload** - Upload profile/reference documents
3. ✅ **Admin Management** - View and manage all applications
4. ✅ **Status Tracking** - Track application status
5. ✅ **Search & Filter** - Search by name, email, field, etc.
6. ✅ **Statistics** - View application statistics
7. ✅ **Admin Notes** - Add internal notes to applications
8. ✅ **Pagination** - Handle large number of applications

---

## 🔧 Integration Steps

### **1. Add to `index.js`:**
```javascript
const coalitionRoutes = require("./modules/coalation/coalation.routes");

app.use("/api/coalitions", coalitionRoutes);
```

### **2. Test in Postman:**

**Create Coalition:**
```
POST http://localhost:PORT/api/coalitions
Body: form-data
- name: 홍길동
- affiliation: ABC Corp
- field: Technology
- contact: 01012345678
- email: test@example.com
- file: [Select File]
```

**Get All (Admin):**
```
GET http://localhost:PORT/api/coalitions
Headers: Authorization: Bearer ADMIN_TOKEN
```

---

Your coalition/partnership system is ready! 🤝✨

