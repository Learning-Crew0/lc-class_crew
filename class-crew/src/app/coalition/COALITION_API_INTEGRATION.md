# 🤝 Coalition API Integration Guide

## 📋 Overview
This document describes the Coalition API endpoints for integrating with the frontend coalition form.

---

## 🔌 API Endpoint

**Base URL:** `${process.env.NEXT_PUBLIC_BASE_API}/api/coalitions`

---

## 1️⃣ **Create Coalition Application (Public)**

### **Endpoint:**
```
POST /api/coalitions
```

### **Access:**
- **Public** - No authentication required
- Anyone can submit a coalition application

### **Content-Type:**
```
multipart/form-data
```

### **Required Form Fields:**

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| `name` | String | Applicant's full name | "홍길동" |
| `affiliation` | String | Organization/Company name | "ABC Corporation" |
| `field` | String | Field of work/expertise | "Education Technology" |
| `contact` | String | 11-digit Korean phone number (no dashes) | "01012345678" |
| `email` | String | Valid email address | "hong@example.com" |
| `file` | File | Profile/Reference document | [File Upload] |

### **Phone Number Format:**
- Must be **11 digits** (e.g., `01012345678`)
- No dashes or spaces
- Korean format only

### **Email Format:**
- Valid email address (e.g., `user@domain.com`)
- Must include `@` and domain

### **File Upload:**
- **Max Size:** 15MB
- **Allowed Formats:** 
  - Documents: `pdf`, `hwp`, `ppt`, `pptx`, `doc`, `docx`, `xls`, `xlsx`
  - Images: `jpg`, `jpeg`, `png`
  - Archive: `zip`

---

## 📤 **Request Example (JavaScript/Axios)**

```javascript
const formData = new FormData();
formData.append('name', '홍길동');
formData.append('affiliation', 'ABC Corporation');
formData.append('field', 'Education Technology');
formData.append('contact', '01012345678');
formData.append('email', 'hong@example.com');
formData.append('file', fileObject); // File object from input

const response = await axios.post(
  `${process.env.NEXT_PUBLIC_BASE_API}/api/coalitions`,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
);
```

---

## ✅ **Success Response**

**Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "Coalition application submitted successfully",
  "data": {
    "id": "67123abc456def789...",
    "name": "홍길동",
    "status": "pending",
    "createdAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

## ❌ **Error Responses**

### **Missing Required Fields**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "All fields are required"
}
```

### **Missing File**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Profile/Reference file is required"
}
```

### **Invalid Email Format**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Please fill a valid email address"
}
```

### **Invalid Phone Number (Not 11 digits)**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Contact number must be 11 digits"
}
```

### **Duplicate Email**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "An application with this email already exists"
}
```

### **Server Error**
**Status Code:** `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details..."
}
```

---

## 🎯 **Frontend Integration Steps**

### **Step 1: Prepare Form Data**
```javascript
// Combine phone number parts (remove dashes)
const fullPhoneNumber = `${phonePrefix}${phoneMiddle}${phoneLast}`; 
// Result: "01012345678"

// Combine email parts
const fullEmail = `${emailLocal}@${emailDomain}`;
// Result: "user@gmail.com"
```

### **Step 2: Create FormData Object**
```javascript
const formData = new FormData();
formData.append('name', name);
formData.append('affiliation', organization); // Note: backend expects "affiliation"
formData.append('field', field);
formData.append('contact', fullPhoneNumber);
formData.append('email', fullEmail);
formData.append('file', fileObject);
```

### **Step 3: Submit to Backend**
```javascript
try {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API}/api/coalitions`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  
  if (response.data.success) {
    // Show success message
    alert('제출이 완료되었습니다!');
    // Reset form
  }
} catch (error) {
  // Handle error
  console.error(error);
  alert(error.response?.data?.message || '제출 중 오류가 발생했습니다.');
}
```

---

## 📝 **Important Notes**

### **Field Name Mapping:**
| Frontend Field | Backend Field |
|----------------|---------------|
| `name` | `name` ✅ |
| `organization` | `affiliation` ⚠️ |
| `field` | `field` ✅ |
| `phonePrefix + phoneMiddle + phoneLast` | `contact` ⚠️ |
| `emailLocal + @ + emailDomain` | `email` ⚠️ |
| `file` | `file` ✅ |

### **Validation Rules:**
- ✅ All fields are **required**
- ✅ Phone must be **exactly 11 digits**
- ✅ Email must be **valid format**
- ✅ File must be **uploaded**
- ✅ File size must be **≤ 15MB**
- ✅ Email must be **unique** (no duplicates)

### **File Upload Notes:**
- Field name in FormData must be `file` (singular)
- Use `File` object from HTML input element
- Backend will upload to Cloudinary or local storage

---

## 🔐 **Admin Endpoints (Not for Public Frontend)**

These endpoints require admin authentication and are used in the admin panel:

- `GET /api/coalitions` - Get all applications (Admin only)
- `GET /api/coalitions/:id` - Get single application (Admin only)
- `PUT /api/coalitions/:id/status` - Update status (Admin only)
- `DELETE /api/coalitions/:id` - Delete application (Admin only)
- `GET /api/coalitions/stats` - Get statistics (Admin only)

---

## 🧪 **Testing with Postman**

1. Set method to **POST**
2. URL: `http://localhost:5000/api/coalitions`
3. Go to **Body** tab
4. Select **form-data**
5. Add fields:

| KEY | VALUE | TYPE |
|-----|-------|------|
| name | 홍길동 | Text |
| affiliation | ABC Corp | Text |
| field | Technology | Text |
| contact | 01012345678 | Text |
| email | test@example.com | Text |
| file | [Choose File] | File |

6. Click **Send**

---

## 📞 **Support**

For questions or issues with the API integration, check:
- Backend API Guide: `/backend-dummy/COALITION_API_GUIDE.md`
- Backend Controller: `/backend-dummy/src/modules/coalation/coalation.controller.js`
- Backend Routes: `/backend-dummy/src/modules/coalation/coalation.routes.js`

