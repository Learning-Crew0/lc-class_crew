# 📨 Enquiry API Integration Guide

## 📋 Overview
This document describes the Enquiry API endpoints for integrating with the frontend enquiry/contact form.

---

## 🔌 API Endpoint

**Base URL:** `${process.env.NEXT_PUBLIC_BASE_API}/api/enquiries`

---

## 1️⃣ **Create Enquiry (Public)**

### **Endpoint:**
```
POST /api/enquiries
```

### **Access:**
- **Public** - No authentication required
- Anyone can submit an enquiry

### **Content-Type:**
```
multipart/form-data
```

### **Required Form Fields:**

| Field Name | Type | Description | Example | Required |
|------------|------|-------------|---------|----------|
| `name` | String | User's full name | "홍길동" | ✅ Yes |
| `phone` | String | 11-digit Korean phone number (no dashes) | "01012345678" | ✅ Yes |
| `email` | String | Valid email address | "hong@example.com" | ✅ Yes |
| `category` | String | Enquiry category (see options below) | "Program Inquiry" | ✅ Yes |
| `subject` | String | Subject/Title of enquiry (max 200 chars) | "DevOps 과정 문의" | ✅ Yes |
| `message` | String | Enquiry message (10-2000 chars) | "안녕하세요..." | ✅ Yes |
| `agreeToTerms` | Boolean/String | Must be `true` | `true` | ✅ Yes |
| `countryCode` | String | Country code (default: "82") | "82" | ❌ Optional |
| `company` | String | Company name | "Samsung Electronics" | ❌ Optional |
| `attachment` | File | Attachment file | [File Upload] | ❌ Optional |

---

### **Category Options:**
Must be **one of these exact values**:
- `Program Inquiry` - 프로그램 문의
- `Payment Issue` - 결제 문제
- `Technical Support` - 기술 지원
- `General Question` - 일반 질문
- `Partnership` - 제휴 문의
- `Other` - 기타

---

### **Field Validation Rules:**

#### **Phone Number:**
- **Must be exactly 11 digits**
- Korean format only
- **No dashes, spaces, or special characters**
- ✅ Valid: `01012345678`
- ❌ Invalid: `010-1234-5678`, `010 1234 5678`

#### **Email:**
- Must be a valid email format
- ✅ Valid: `user@domain.com`
- ❌ Invalid: `userdomain.com`, `user@`

#### **Subject:**
- Maximum 200 characters

#### **Message:**
- **Minimum 10 characters**
- **Maximum 2000 characters**

#### **Attachment:**
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
formData.append('phone', '01012345678');
formData.append('email', 'hong@test.com');
formData.append('category', 'Program Inquiry');
formData.append('subject', 'DevOps 과정 문의드립니다');
formData.append('message', '안녕하세요. DevOps 교육 과정에 대해 자세히 알고 싶어서 문의드립니다.');
formData.append('agreeToTerms', 'true');
formData.append('company', '네이버'); // Optional
formData.append('attachment', fileObject); // Optional - File from input

const response = await axios.post(
  `${process.env.NEXT_PUBLIC_BASE_API}/api/enquiries`,
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
  "message": "Enquiry submitted successfully. We will get back to you soon!",
  "data": {
    "_id": "67123abc456...",
    "name": "홍길동",
    "contact": {
      "countryCode": "82",
      "phone": "01012345678"
    },
    "email": "hong@test.com",
    "category": "Program Inquiry",
    "subject": "DevOps 과정 문의드립니다",
    "message": "안녕하세요. DevOps 교육 과정에 대해...",
    "status": "pending",
    "agreeToTerms": true,
    "attachment": "https://cloudinary.com/...",
    "createdAt": "2025-10-28T...",
    "updatedAt": "2025-10-28T..."
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
  "message": "Please provide all required fields: name, email, category, subject, message"
}
```

### **Missing Phone Number**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Phone number is required in contact information"
}
```

### **Invalid Phone Number**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Please provide a valid 11-digit Korean phone number"
}
```

### **Invalid Email**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

### **Invalid Category**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Please select a valid category"
}
```

### **Subject Too Long**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Subject cannot exceed 200 characters"
}
```

### **Message Too Short**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Message must be at least 10 characters long"
}
```

### **Message Too Long**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Message cannot exceed 2000 characters"
}
```

### **Terms Not Agreed**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "You must agree to the terms and conditions"
}
```

### **File Type Not Allowed**
**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Only zip, pdf, hwp, ppt, pptx, doc, docx, xls, xlsx, jpg, jpeg, png files are allowed!"
}
```

---

## 🎯 **Frontend Integration Steps**

### **Step 1: Create State for Form**
```javascript
const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '',
  category: '',
  subject: '',
  message: '',
  company: '',
  agreeToTerms: false
});
const [file, setFile] = useState(null);
```

### **Step 2: Handle Form Submission**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (!formData.name || !formData.phone || !formData.email || 
      !formData.category || !formData.subject || !formData.message) {
    alert('모든 필수 항목을 입력해주세요.');
    return;
  }

  if (!formData.agreeToTerms) {
    alert('약관에 동의해주세요.');
    return;
  }

  // Create FormData
  const submitData = new FormData();
  submitData.append('name', formData.name);
  submitData.append('phone', formData.phone);
  submitData.append('email', formData.email);
  submitData.append('category', formData.category);
  submitData.append('subject', formData.subject);
  submitData.append('message', formData.message);
  submitData.append('agreeToTerms', 'true');
  
  if (formData.company) {
    submitData.append('company', formData.company);
  }
  
  if (file) {
    submitData.append('attachment', file);
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/enquiries`,
      submitData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );

    if (response.data.success) {
      alert('문의가 성공적으로 제출되었습니다!');
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        category: '',
        subject: '',
        message: '',
        company: '',
        agreeToTerms: false
      });
      setFile(null);
    }
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || '문의 제출 중 오류가 발생했습니다.');
  }
};
```

---

## 🧪 **Testing with Postman**

**Method:** `POST`  
**URL:** `http://localhost:5000/api/enquiries`  
**Body:** `form-data`

| KEY | VALUE | TYPE |
|-----|-------|------|
| `name` | 홍길동 | Text |
| `phone` | 01012345678 | Text |
| `email` | test@classcrew.com | Text |
| `category` | Program Inquiry | Text |
| `subject` | DevOps 교육 과정 문의드립니다 | Text |
| `message` | 안녕하세요. DevOps 교육 과정에 대해 자세히 알고 싶어서 문의드립니다. 교육 일정과 비용에 대해 안내 부탁드립니다. | Text |
| `agreeToTerms` | true | Text |
| `company` | 네이버 | Text |
| `attachment` | [Choose File] | File |

---

## 🔐 **User-Specific Endpoints (Requires Login)**

### **Get My Enquiries**
```
GET /api/enquiries/my-enquiries
Authorization: Bearer {userToken}
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `status` (optional: "pending", "in progress", "resolved")

**Response:**
```json
{
  "success": true,
  "data": {
    "enquiries": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalEnquiries": 25,
      "limit": 10
    }
  }
}
```

---

## 🔒 **Admin-Only Endpoints (Not for Public Frontend)**

These endpoints require admin authentication and are used in the admin panel:

- `GET /api/enquiries` - Get all enquiries with filters (Admin only)
- `GET /api/enquiries/stats` - Get enquiry statistics (Admin only)
- `GET /api/enquiries/:id` - Get enquiry by ID (User/Admin)
- `PUT /api/enquiries/:id` - Update enquiry (Admin only)
- `PATCH /api/enquiries/:id/status` - Update status (Admin only)
- `DELETE /api/enquiries/:id` - Delete enquiry (Admin only)

---

## 📝 **Important Notes**

1. **Phone Number Format:**
   - Must be exactly 11 digits
   - No dashes, spaces, or formatting
   - Example: `01012345678` ✅ NOT `010-1234-5678` ❌

2. **Category Values:**
   - Must use exact English values from the list
   - Display Korean text in UI, but send English value to API

3. **File Upload:**
   - Optional, but if provided, must be under 15MB
   - Check file type before upload
   - Field name must be `attachment`

4. **Terms Agreement:**
   - Must be `true` to submit
   - Can send as boolean `true` or string `"true"`

5. **Message Length:**
   - Minimum 10 characters
   - Maximum 2000 characters
   - Validate before submission

---

## 📞 **Support**

For questions or issues with the API integration, check:
- Backend Controller: `/backend-dummy/src/modules/Enquiry/enquiry.controller.js`
- Backend Routes: `/backend-dummy/src/modules/Enquiry/enquiry.routes.js`
- Backend Model: `/backend-dummy/src/modules/Enquiry/enquiry.model.js`

