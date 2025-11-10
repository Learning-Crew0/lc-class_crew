# 🎓 Class Application & Shopping Basket API Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Cart APIs](#cart-apis)
4. [Class Application APIs](#class-application-apis)
5. [Student Enrollment APIs](#student-enrollment-apis)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [Complete User Flow Example](#complete-user-flow-example)

---

## 🎯 Overview

This API guide covers the complete shopping basket → class application flow for the ClassCrew platform.

**Base URL**: `/api/v1`

**Key Features**:
- Add courses and products to cart
- Filter cart by item type (courses/products)
- Validate student credentials (MUST have existing accounts)
- Support for 1-5 students per course (manual entry)
- Support for 6+ students per course (Excel bulk upload)
- Multi-course application submission
- Student enrollment tracking

---

## 🔐 Authentication

All endpoints (except template download) require authentication via JWT token.

**Header**:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🛒 Cart APIs

### 1. Get Cart

**Endpoint**: `GET /api/v1/cart`

**Query Parameters** (Optional):
- `itemType`: `"course"` | `"product"` - Filter by type

**Examples**:
```bash
# Get all items
GET /api/v1/cart

# Get only courses
GET /api/v1/cart?itemType=course

# Get only products
GET /api/v1/cart?itemType=product
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "cart123",
    "user": "user123",
    "items": [
      {
        "itemType": "course",
        "course": {
          "_id": "course123",
          "title": "핵심을잡는말과글",
          "price": 150000,
          "mainImage": "https://..."
        },
        "courseSchedule": {
          "_id": "schedule123",
          "scheduleName": "2025.09.14 ~ 2025.10.14",
          "startDate": "2025-09-14",
          "endDate": "2025-10-14"
        },
        "quantity": 1,
        "priceAtTime": 150000,
        "subtotal": 150000
      }
    ],
    "itemCount": 1,
    "totalAmount": 150000
  }
}
```

### 2. Add to Cart

**Endpoint**: `POST /api/v1/cart/add`

**Request Body**:
```json
{
  "itemType": "course",           // Required: "course" or "product"
  "productId": "course123",       // Required: Course ID or Product ID
  "quantity": 1,                  // Optional: For products only (default: 1)
  "courseSchedule": "schedule123" // Required for courses: Training schedule ID
}
```

**Examples**:

#### Add Course:
```bash
curl -X POST http://localhost:5000/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "course",
    "productId": "673abc123...",
    "courseSchedule": "673xyz789..."
  }'
```

#### Add Product:
```bash
curl -X POST http://localhost:5000/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "product",
    "productId": "673prod123...",
    "quantity": 2
  }'
```

### 3. Update Cart Item

**Endpoint**: `PUT /api/v1/cart/update/:productId`

**Note**: Only products can have quantity updated. Courses always have quantity of 1.

**Request Body**:
```json
{
  "quantity": 3
}
```

### 4. Remove from Cart

**Endpoint**: `DELETE /api/v1/cart/remove/:productId`

**Query Parameters**:
- `itemType`: Required - `"course"` or `"product"`
- `scheduleId`: Optional - For courses, specify schedule to remove specific schedule

**Example**:
```bash
# Remove course
DELETE /api/v1/cart/remove/course123?itemType=course&scheduleId=schedule123

# Remove product
DELETE /api/v1/cart/remove/product123?itemType=product
```

### 5. Get Selected Courses for Application

**Endpoint**: `POST /api/v1/cart/get-selected-courses`

**Request Body**:
```json
{
  "selectedProductIds": ["course123", "course456", "course789"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "course123",
        "name": "핵심을잡는말과글",
        "trainingSchedule": {
          "_id": "schedule123",
          "scheduleName": "2025.09.14 ~ 2025.10.14"
        },
        "price": 150000,
        "discountedPrice": 135000,
        "thumbnail": "https://..."
      }
    ]
  }
}
```

**Validation**: Only courses can be selected. Products will throw error.

### 6. Clear Cart

**Endpoint**: `DELETE /api/v1/cart/clear`

---

## 📝 Class Application APIs

### 1. Download Bulk Upload Template

**Endpoint**: `GET /api/v1/class-applications/download-template`

**Auth**: Not required (Public)

**Response**:
```json
{
  "success": true,
  "data": {
    "filename": "students_bulk_upload_template.xlsx",
    "headers": ["Name", "Email", "Phone", "Company", "Position"],
    "instructions": [
      "Fill in student information row by row",
      "Name, Email, and Phone are REQUIRED fields",
      "Phone format: 01012345678 (11 digits, no hyphens)",
      "Email format: example@domain.com",
      "At least 6 students required for bulk upload",
      "All students MUST have existing user accounts"
    ],
    "sampleData": [
      {
        "Name": "홍길동",
        "Email": "hong@example.com",
        "Phone": "01012345678",
        "Company": "ABC Company",
        "Position": "Manager"
      }
    ]
  }
}
```

### 2. Create Draft Application

**Endpoint**: `POST /api/v1/class-applications/draft`

**Request Body**:
```json
{
  "courseIds": ["course123", "course456"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "app123",
    "applicationNumber": "APP-20250914-0001",
    "user": "user123",
    "courses": [
      {
        "course": "course123",
        "trainingSchedule": "schedule123",
        "courseName": "핵심을잡는말과글",
        "period": "2025.09.14~2025.10.14",
        "price": 150000,
        "discountedPrice": 135000,
        "students": []
      }
    ],
    "status": "draft"
  }
}
```

### 3. Validate Student

**Endpoint**: `POST /api/v1/class-applications/validate-student`

**CRITICAL**: Students MUST have existing user accounts

**Request Body** (Option 1 - Structured):
```json
{
  "email": {
    "username": "hong",
    "domain": "example.com"
  },
  "phone": {
    "prefix": "010",
    "middle": "1234",
    "last": "5678"
  },
  "name": "홍길동"
}
```

**Request Body** (Option 2 - String format):
```json
{
  "email": "hong@example.com",
  "phone": "01012345678",
  "name": "홍길동"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "exists": true,
    "user": {
      "_id": "user123",
      "fullName": "홍길동",
      "email": "hong@example.com",
      "phone": "010-1234-5678"
    }
  },
  "message": "Student validated successfully"
}
```

**Response (Failure)**:
```json
{
  "success": false,
  "data": {
    "exists": false,
    "message": "학생은 반드시 등록된 계정이 있어야 합니다. 먼저 회원가입을 진행해주세요."
  }
}
```

### 4. Add Student to Course

**Endpoint**: `POST /api/v1/class-applications/:applicationId/add-student`

**Request Body**:
```json
{
  "courseId": "course123",
  "studentData": {
    "userId": "user123",        // From validation response
    "name": "홍길동",
    "phone": {
      "prefix": "010",
      "middle": "1234",
      "last": "5678"
    },
    "email": {
      "username": "hong",
      "domain": "example.com"
    },
    "company": "ABC Company",
    "position": "Manager"
  }
}
```

**Business Rules**:
- Maximum 5 students per course for individual entry
- If 6+ students needed, use bulk upload
- Student must be validated first (userId required)

### 5. Upload Bulk Students

**Endpoint**: `POST /api/v1/class-applications/:applicationId/upload-bulk-students`

**Content-Type**: `multipart/form-data`

**Form Data**:
- `courseId`: Course ID (form field)
- `file`: Excel file (`.xls`, `.xlsx`, max 10MB)

**Example**:
```bash
curl -X POST http://localhost:5000/api/v1/class-applications/app123/upload-bulk-students \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "courseId=course123" \
  -F "file=@students.xlsx"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "filePath": "/var/data/files/applications/students-xxx.xlsx",
    "studentsCount": 10,
    "validatedStudents": [
      {
        "name": "홍길동",
        "email": {
          "username": "hong",
          "domain": "example.com"
        },
        "userId": "user123",
        "valid": true
      },
      {
        "name": "김영희",
        "email": {
          "username": "kim",
          "domain": "example.com"
        },
        "valid": false,
        "error": "학생은 반드시 등록된 계정이 있어야 합니다."
      }
    ]
  }
}
```

**Business Rules**:
- Minimum 6 students required for bulk upload
- All students MUST have existing accounts
- File format: `.xls` or `.xlsx`
- Max file size: 10MB

### 6. Update Payment Information

**Endpoint**: `PUT /api/v1/class-applications/:applicationId/payment`

**Request Body**:
```json
{
  "paymentMethod": "카드결제",  // "간편결제" | "카드결제" | "계좌이체" | "무통장입금" | "카드현장결제"
  "taxInvoiceRequired": true,
  "invoiceManager": {
    "name": "이재윤",
    "phone": {
      "prefix": "010",
      "middle": "6362",
      "last": "0714"
    },
    "email": {
      "username": "lee",
      "domain": "company.com"
    }
  }
}
```

**Business Rule**: Online card payment ("카드결제") is NOT allowed for group applications (2+ students).

### 7. Submit Application

**Endpoint**: `POST /api/v1/class-applications/:applicationId/submit`

**Request Body**:
```json
{
  "agreements": {
    "paymentAndRefundPolicy": true,
    "refundPolicy": true
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "applicationId": "app123",
    "applicationNumber": "APP-20250914-0001",
    "status": "submitted",
    "submittedAt": "2025-09-14T10:30:00.000Z",
    "courses": [
      {
        "courseName": "핵심을잡는말과글",
        "students": [...]
      }
    ],
    "totalAmount": 270000
  },
  "message": "Application submitted successfully"
}
```

**Side Effects**:
- Creates student enrollments for all students
- Removes courses from cart
- Status changed to "submitted"

### 8. Get Application by ID

**Endpoint**: `GET /api/v1/class-applications/:applicationId`

### 9. Get User's Applications

**Endpoint**: `GET /api/v1/class-applications/user/:userId`

**Query Parameters**:
- `status`: Optional - Filter by status
- `page`: Optional - Page number (default: 1)
- `limit`: Optional - Items per page (default: 10)

### 10. Cancel Application

**Endpoint**: `POST /api/v1/class-applications/:applicationId/cancel`

**Request Body**:
```json
{
  "reason": "일정 변경으로 인한 취소"
}
```

---

## 👨‍🎓 Student Enrollment APIs

### 1. Get Student's Enrollments

**Endpoint**: `GET /api/v1/enrollments/student/:userId`

**Query Parameters**:
- `status`: Optional - `"enrolled"` | `"completed"` | `"cancelled"` | `"no-show"`
- `page`: Optional
- `limit`: Optional

**Response**:
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "_id": "enroll123",
        "course": {
          "title": "핵심을잡는말과글",
          "mainImage": "https://..."
        },
        "trainingSchedule": {
          "scheduleName": "2025.09.14 ~ 2025.10.14"
        },
        "enrollmentStatus": "enrolled",
        "attendanceRecords": [],
        "completionPercentage": 0
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "pages": 1
    }
  }
}
```

### 2. Get Enrollment by ID

**Endpoint**: `GET /api/v1/enrollments/:enrollmentId`

### 3. Cancel Enrollment

**Endpoint**: `POST /api/v1/enrollments/:enrollmentId/cancel`

**Request Body**:
```json
{
  "reason": "개인 사정으로 인한 취소"
}
```

### 4. Add Attendance Record (Admin Only)

**Endpoint**: `POST /api/v1/enrollments/:enrollmentId/attendance`

**Request Body**:
```json
{
  "date": "2025-09-14",
  "status": "present",  // "present" | "absent" | "late"
  "notes": "정상 출석"
}
```

### 5. Mark as Completed (Admin Only)

**Endpoint**: `POST /api/v1/enrollments/:enrollmentId/complete`

### 6. Issue Certificate (Admin Only)

**Endpoint**: `POST /api/v1/enrollments/:enrollmentId/certificate`

**Request Body**:
```json
{
  "certificateUrl": "https://certificates.classcrew.com/cert123.pdf"
}
```

### 7. Get Course Enrollment Stats (Admin Only)

**Endpoint**: `GET /api/v1/enrollments/stats/course/:courseId`

**Query Parameters**:
- `scheduleId`: Optional - Filter by specific schedule

---

## 📊 Data Models

### Cart Item
```typescript
{
  itemType: "course" | "product",
  course?: ObjectId,              // For courses
  courseSchedule?: ObjectId,      // For courses
  product?: ObjectId,             // For products
  quantity: Number,
  priceAtTime: Number,
  subtotal: Number,
  addedAt: Date
}
```

### Class Application
```typescript
{
  _id: ObjectId,
  applicationNumber: String,      // AUTO-GENERATED: "APP-20250914-0001"
  user: ObjectId,                 // Applicant
  courses: [
    {
      course: ObjectId,
      trainingSchedule: ObjectId,
      courseName: String,
      period: String,             // "2025.09.14~2025.10.14"
      price: Number,
      discountedPrice: Number,
      students: [
        {
          userId: ObjectId,       // REQUIRED: Must be existing user
          name: String,
          phone: { prefix, middle, last },
          email: { username, domain },
          company?: String,
          position?: String
        }
      ],
      bulkUploadFile?: String     // For 6+ students
    }
  ],
  paymentInfo: {
    totalAmount: Number,
    paymentMethod: String,
    taxInvoiceRequired: Boolean,
    paymentStatus: String
  },
  invoiceManager: {
    name: String,
    phone: Object,
    email: Object
  },
  agreements: {
    paymentAndRefundPolicy: Boolean,  // MUST be true
    refundPolicy: Boolean             // MUST be true
  },
  status: "draft" | "submitted" | "confirmed" | "cancelled" | "completed"
}
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack trace (development only)"
}
```

### Common Errors

**400 Bad Request**:
- Invalid item type
- Student validation failed
- Student limit exceeded (>5 for individual entry)
- Online card payment for group application

**401 Unauthorized**:
- Missing or invalid JWT token

**403 Forbidden**:
- Accessing other user's data

**404 Not Found**:
- Course/Product not found
- Application not found
- Enrollment not found

---

## 🔄 Complete User Flow Example

```javascript
// Step 1: Add courses to cart
const response1 = await fetch('/api/v1/cart/add', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    itemType: 'course',
    productId: 'course123',
    courseSchedule: 'schedule123'
  })
});

// Step 2: Get cart (filter courses only)
const response2 = await fetch('/api/v1/cart?itemType=course', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const cart = await response2.json();

// Step 3: Get selected courses for application
const response3 = await fetch('/api/v1/cart/get-selected-courses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    selectedProductIds: ['course123', 'course456']
  })
});

// Step 4: Create draft application
const response4 = await fetch('/api/v1/class-applications/draft', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    courseIds: ['course123', 'course456']
  })
});
const application = await response4.json();
const applicationId = application.data._id;

// Step 5: Validate student
const response5 = await fetch('/api/v1/class-applications/validate-student', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'hong@example.com',
    phone: '01012345678',
    name: '홍길동'
  })
});
const validation = await response5.json();

// Step 6: Add student to course
if (validation.data.exists) {
  await fetch(`/api/v1/class-applications/${applicationId}/add-student`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      courseId: 'course123',
      studentData: {
        userId: validation.data.userId,
        name: '홍길동',
        phone: { prefix: '010', middle: '1234', last: '5678' },
        email: { username: 'hong', domain: 'example.com' },
        company: 'ABC Company',
        position: 'Manager'
      }
    })
  });
}

// Step 7: Update payment info
await fetch(`/api/v1/class-applications/${applicationId}/payment`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    paymentMethod: '간편결제',
    taxInvoiceRequired: true,
    invoiceManager: {
      name: '이재윤',
      phone: { prefix: '010', middle: '6362', last: '0714' },
      email: { username: 'lee', domain: 'company.com' }
    }
  })
});

// Step 8: Submit application
await fetch(`/api/v1/class-applications/${applicationId}/submit`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    agreements: {
      paymentAndRefundPolicy: true,
      refundPolicy: true
    }
  })
});

// Courses automatically removed from cart after submission!
```

---

## 📝 Notes

1. **Student Validation is Critical**: All students MUST have existing user accounts
2. **Student Limit**: Max 5 students for individual entry, 6+ requires bulk upload
3. **Payment Restriction**: No online card payment for group applications
4. **Courses Only**: Only courses can be selected for class application, not products
5. **Auto Cart Cleanup**: Courses are automatically removed from cart after successful application submission

---

**Last Updated**: 2025-01-10  
**Version**: 2.0 (Clean Implementation)

**Need Help?** Contact the backend team or check `/api-docs` for interactive API documentation.

