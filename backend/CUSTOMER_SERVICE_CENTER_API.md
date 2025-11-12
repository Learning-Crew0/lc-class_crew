# 🎓 Customer Service Center Backend API Documentation

**Complete Implementation Guide for Customer Service Center Module**

**Date:** November 12, 2025  
**Version:** 1.0  
**Base URL:** `https://class-crew.onrender.com/api/v1`

---

## 📋 Implementation Status

| Feature                       | Status            | Endpoints     |
| ----------------------------- | ----------------- | ------------- |
| **Course History Lookup**     | ✅ Implemented    | 1 endpoint    |
| **Course Enrollment History** | ✅ Implemented    | 2 endpoints   |
| **FAQ Management**            | ✅ Implemented    | 10+ endpoints |
| **Enquiry Management**        | ✅ Already Exists | 3+ endpoints  |

---

## 1. 📚 Course History Lookup

### 1.1 Verify User Identity & Get Course History

**Endpoint:** `POST /api/v1/course-history/verify`

**Purpose:** Verify user identity (phone + email + name) and return their course enrollment history

**Authentication:** None (Public)

**Request Body:**

```json
{
    "phone": "01012345678",
    "email": "user@example.com",
    "name": "홍길동",
    "type": "personal"
}
```

**Response (Success - 200):**

```json
{
    "success": true,
    "message": "User verified successfully",
    "data": {
        "user": {
            "_id": "user_id",
            "name": "홍길동",
            "email": "user@example.com",
            "phone": "01012345678"
        },
        "enrollments": [
            {
                "_id": "enrollment_id",
                "no": 10,
                "courseTitle": "[중분류] 교육 과정명",
                "courseId": "course_id",
                "trainingDate": "2025.07.10~2025.07.13",
                "startDate": "2025-07-10T00:00:00.000Z",
                "endDate": "2025-07-13T23:59:59.000Z",
                "status": "수료",
                "completionStatus": "completed",
                "certificateUrl": "/uploads/certificates/cert-12345.pdf",
                "certificateAvailable": true,
                "completionDate": "2025-07-13T23:59:59.000Z",
                "grade": "A",
                "attendance": {
                    "totalSessions": 4,
                    "attendedSessions": 4,
                    "attendanceRate": 100
                },
                "enrolledAt": "2025-07-01T10:00:00.000Z"
            }
        ],
        "totalEnrollments": 45,
        "completedCourses": 38,
        "inProgressCourses": 5,
        "notCompletedCourses": 2
    }
}
```

**Response (Not Found - 404):**

```json
{
    "success": false,
    "message": "해당 정보와 일치하는 수강 이력을 찾을 수 없습니다.",
    "status": 404
}
```

**Response (Company Type - 400):**

```json
{
    "success": false,
    "message": "기업 회원의 수강 이력 조회는 전화 문의를 이용해주세요. (02-6914-9353)",
    "status": 400
}
```

**Validation Rules:**

- Phone: Must match Korean or Indian format (`^01[0-9]{9,10}$|^[6-9][0-9]{9}$...`)
- Email: Valid email format
- Name: Required, 2-50 characters
- Type: Must be "personal" or "company"

---

## 2. 📖 Course Enrollment History

### 2.1 Get My Enrollment History (Authenticated)

**Endpoint:** `GET /api/v1/enrollments/my-history`

**Purpose:** Get authenticated user's course enrollment history with filters

**Authentication:** Required (Bearer Token)

**Query Parameters:**

```
?page=1
&limit=10
&sortBy=startDate           // Options: startDate, courseTitle, status, enrolledAt
&sortOrder=desc             // Options: asc, desc
&status=completed           // Options: completed, not_completed, in_progress, cancelled
&search=교육과정            // Search in course title
```

**Response (200):**

```json
{
    "success": true,
    "message": "Course history retrieved successfully",
    "data": [
        {
            "_id": "enrollment_id",
            "no": 10,
            "courseTitle": "[중분류] 교육 과정명",
            "courseId": "course_id",
            "course": {
                "_id": "course_id",
                "title": "교육 과정명",
                "category": "중분류",
                "thumbnail": "/uploads/courses/thumb.jpg"
            },
            "trainingDate": "2025.07.10~2025.07.13",
            "startDate": "2025-07-10T00:00:00.000Z",
            "endDate": "2025-07-13T23:59:59.000Z",
            "status": "수료",
            "completionStatus": "completed",
            "certificateUrl": "/uploads/certificates/cert-12345.pdf",
            "certificateAvailable": true,
            "completionDate": "2025-07-13T23:59:59.000Z",
            "grade": "A",
            "attendance": {
                "totalSessions": 4,
                "attendedSessions": 4,
                "attendanceRate": 100
            },
            "enrolledAt": "2025-07-01T10:00:00.000Z"
        }
    ]
}
```

---

### 2.2 Download Certificate

**Endpoint:** `GET /api/v1/enrollments/:enrollmentId/certificate`

**Purpose:** Download course completion certificate

**Authentication:** Required (Bearer Token)

**Response:**

- **Success (302):** Redirects to certificate URL or downloads file
- **Error (400):** Certificate not available

**Error Response:**

```json
{
    "success": false,
    "message": "수료증을 다운로드할 수 없습니다. 과정이 아직 완료되지 않았습니다.",
    "status": 400
}
```

---

## 3. ❓ FAQ Management

### 3.1 Get All FAQs (Public)

**Endpoint:** `GET /api/v1/faqs`

**Purpose:** Get all active FAQs with optional filters

**Authentication:** None (Public)

**Query Parameters:**

```
?category=signup/login      // Options: all, signup/login, program, payment, coalition, other
&page=1
&limit=20
&search=회원가입
&isActive=true
```

**Response (200):**

```json
{
    "success": true,
    "message": "FAQs retrieved successfully",
    "data": [
        {
            "_id": "faq_id",
            "question": "공개교육을 신청하려면 회원가입을 해야 하나요?",
            "answer": "...",
            "category": "signup/login",
            "categoryLabel": "회원가입/로그인",
            "order": 1,
            "isActive": true,
            "isFeatured": false,
            "viewCount": 1523,
            "helpfulCount": 145,
            "tags": ["회원가입", "로그인", "공개교육"],
            "slug": "do-i-need-to-register-1234567890",
            "createdAt": "2025-01-01T00:00:00.000Z",
            "updatedAt": "2025-11-12T10:00:00.000Z"
        }
    ]
}
```

---

### 3.2 Get Single FAQ

**Endpoint:** `GET /api/v1/faqs/:id`

**Authentication:** None (Public)

**Response (200):**

```json
{
    "success": true,
    "message": "FAQ retrieved successfully",
    "data": {
        "_id": "faq_id",
        "question": "공개교육을 신청하려면 회원가입을 해야 하나요?",
        "answer": "...",
        "category": "signup/login",
        "categoryLabel": "회원가입/로그인",
        "order": 1,
        "isActive": true,
        "viewCount": 1524,
        "helpfulCount": 145,
        "slug": "do-i-need-to-register-1234567890",
        "relatedFAQs": [
            {
                "_id": "related_faq_id",
                "question": "회원사인데도 개인계정 가입을 해야 하나요?",
                "category": "signup/login"
            }
        ]
    }
}
```

---

### 3.3 Search FAQs

**Endpoint:** `GET /api/v1/faqs/search`

**Purpose:** Search FAQs using text search

**Authentication:** None (Public)

**Query Parameters:**

```
?q=회원가입              // Required search query
&category=signup/login   // Optional category filter
&limit=10
```

**Response (200):**

```json
{
    "success": true,
    "message": "Search results",
    "data": {
        "results": [
            {
                "_id": "faq_id",
                "question": "공개교육을 신청하려면 회원가입을 해야 하나요?",
                "answer": "...",
                "category": "signup/login",
                "categoryLabel": "회원가입/로그인",
                "relevanceScore": 0.95
            }
        ],
        "total": 3,
        "query": "회원가입"
    }
}
```

---

### 3.4 Mark FAQ as Helpful

**Endpoint:** `POST /api/v1/faqs/:id/helpful`

**Purpose:** Increment helpful count for FAQ

**Authentication:** None (Public)

**Request Body:**

```json
{
    "helpful": true
}
```

**Response (200):**

```json
{
    "success": true,
    "message": "Feedback recorded successfully",
    "data": {
        "message": "Feedback recorded successfully",
        "helpful": 146,
        "notHelpful": 5
    }
}
```

---

### 3.5 Get FAQs by Category

**Endpoint:** `GET /api/v1/faqs/category/:categoryKey`

**Purpose:** Get FAQs filtered by category

**Authentication:** None (Public)

**Response (200):**

```json
{
  "success": true,
  "message": "FAQs retrieved successfully",
  "data": {
    "category": {
      "_id": "category_id",
      "key": "signup/login",
      "label": "회원가입/로그인",
      "description": "...",
      "order": 1,
      "faqCount": 8
    },
    "faqs": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalFAQs": 8,
      "limit": 20
    }
  }
}
```

---

## 4. 📧 Enquiry Management

### 4.1 Create Enquiry

**Endpoint:** `POST /api/v1/enquiries`

**Status:** ✅ Fully implemented with all required fields

**Authentication:** None (Public, optional auth)

**Request Body (JSON):**

```json
{
    "name": "홍길동", // Required, 2-100 characters
    "email": "user@example.com", // Required, valid email
    "phone": "01012345678", // Required, Korean/Indian format
    "company": "회사명", // Optional, max 200 characters
    "countryCode": "82", // Optional, default: "82"
    "category": "General Question", // Required, see enum below
    "subject": "문의 제목", // Required, max 200 characters
    "message": "문의 내용...", // Required, 10-2000 characters
    "attachmentUrl": "/uploads/...", // Optional (after file upload)
    "attachmentOriginalName": "file.pdf", // Optional
    "agreeToTerms": true // Required, must be true
}
```

**Category Enum:**

- `"General Question"` - 일반문의
- `"Technical Support"` - 기술지원
- `"Program Inquiry"` - 프로그램문의
- `"Payment Issue"` - 결제문제
- `"Partnership"` - 제휴문의
- `"Other"` - 기타

**Response (201):**

```json
{
    "success": true,
    "message": "Enquiry submitted successfully",
    "data": {
        "_id": "enquiry_id",
        "ticketNumber": "ENQ-2025-000123",
        "name": "홍길동",
        "phone": "01012345678",
        "email": "user@example.com",
        "company": "회사명",
        "countryCode": "82",
        "category": "General Question",
        "subject": "문의 제목",
        "message": "문의 내용...",
        "attachmentUrl": "/uploads/enquiries/file-123.pdf",
        "attachmentOriginalName": "file.pdf",
        "status": "pending",
        "priority": "medium",
        "agreeToTerms": true,
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2025-11-12T10:00:00.000Z",
        "updatedAt": "2025-11-12T10:00:00.000Z"
    }
}
```

**Validation Errors:**

- `"Name is required"` - Name must be 2-100 characters
- `"Phone must be valid format"` - Must match Korean/Indian phone format
- `"Please provide a valid email"` - Invalid email format
- `"Category is required"` - Must be one of the enum values
- `"Subject cannot exceed 200 characters"`
- `"Message must be at least 10 characters"`
- `"Message cannot exceed 2000 characters"`
- `"You must agree to the terms"` - agreeToTerms must be true

**File Upload Workflow:**

1. First upload file: `POST /api/v1/admin/uploads/single` (FormData: file, folder="enquiries")
2. Get `url` from response
3. Use `url` as `attachmentUrl` in enquiry creation

---

### 4.2 Get My Enquiries

**Endpoint:** `GET /api/v1/enquiries/my-enquiries`

**Authentication:** Required (Bearer Token)

**Query Parameters:**

```
?page=1
&limit=10
&status=pending          // Options: pending, in_progress, resolved, closed
```

**Response (200):**

```json
{
    "success": true,
    "message": "Enquiries retrieved successfully",
    "data": [
        {
            "_id": "enquiry_id",
            "ticketNumber": "ENQ-2025-000123",
            "subject": "문의 제목",
            "category": "General Question",
            "status": "pending",
            "createdAt": "2025-11-12T10:00:00.000Z",
            "hasResponse": false
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 5,
        "pages": 1
    }
}
```

---

### 4.3 Get Enquiry by ID

**Endpoint:** `GET /api/v1/enquiries/:id`

**Authentication:** Required (Bearer Token)

**Response (200):**

```json
{
    "success": true,
    "message": "Inquiry retrieved successfully",
    "data": {
        "_id": "enquiry_id",
        "ticketNumber": "ENQ-2025-000123",
        "name": "홍길동",
        "email": "user@example.com",
        "phone": "01012345678",
        "company": "회사명",
        "countryCode": "82",
        "category": "General Question",
        "subject": "문의 제목",
        "message": "문의 내용...",
        "attachmentUrl": "/uploads/enquiries/file-123.pdf",
        "attachmentOriginalName": "file.pdf",
        "status": "in_progress",
        "priority": "medium",
        "response": {
            "message": "답변 내용...",
            "respondedBy": "admin_id",
            "respondedByName": "Admin Name",
            "respondedAt": "2025-11-12T14:00:00.000Z",
            "attachments": ["/uploads/responses/response-1.pdf"]
        },
        "agreeToTerms": true,
        "createdAt": "2025-11-12T10:00:00.000Z",
        "updatedAt": "2025-11-12T14:00:00.000Z"
    }
}
```

**Status Enum:**

- `"pending"` - 접수 대기
- `"in_progress"` - 처리 중
- `"resolved"` - 해결됨
- `"closed"` - 종료

---

## 5. 📊 Data Models

### Enquiry Model (Complete)

```typescript
{
  _id: ObjectId;
  ticketNumber: string;                // Auto-generated: "ENQ-YYYY-######"

  // User Info
  user: ObjectId;                      // Optional, if authenticated
  name: string;                        // Required, 2-100 chars
  email: string;                       // Required, valid email
  phone: string;                       // Required, valid format
  company: string;                     // Optional, max 200 chars
  countryCode: string;                 // Default: "82"

  // Enquiry Details
  category: string;                    // Required, enum: "General Question", "Technical Support", etc.
  subject: string;                     // Required, max 200 chars
  message: string;                     // Required, 10-2000 chars
  attachmentUrl: string;               // Optional
  attachmentOriginalName: string;      // Optional

  // Status
  status: string;                      // "pending", "in_progress", "resolved", "closed"
  priority: string;                    // "low", "medium", "high", "urgent"

  // Assignment
  assignedTo: ObjectId;                // Admin user ID

  // Response
  response: {
    message: string;
    respondedBy: ObjectId;             // Admin user ID
    respondedByName: string;           // Admin full name
    respondedAt: Date;
    attachments: string[];             // Array of file URLs
  };

  // Consent
  agreeToTerms: boolean;               // Required, must be true

  // Tracking
  ipAddress: string;                   // Auto-captured
  userAgent: string;                   // Auto-captured

  // Notes (Admin only)
  notes: Array<{
    content: string;
    addedBy: ObjectId;
    addedAt: Date;
  }>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;                      // Auto-set when status="closed"
}
```

**Auto-generated Fields:**

- `ticketNumber`: Format `ENQ-YYYY-######` (e.g., "ENQ-2025-000123")
- `ipAddress`: Captured from `req.ip`
- `userAgent`: Captured from request headers
- `closedAt`: Auto-set when status changes to "closed"

---

### Enrollment Model Updates

**New Fields:**

```javascript
{
  grade: String,                    // "A", "B", "C", "D", "F", or null
  // ... existing fields
}
```

**New Virtual Fields:**

```javascript
{
  completionStatus: String,         // Virtual: "completed", "not_completed", "in_progress", "cancelled"
  certificateAvailable: Boolean,    // Virtual: based on certificateIssued, certificateUrl, status
  attendancePercentage: Number,     // Virtual: calculated from attendanceRecords
}
```

---

### FAQ Model Updates

**New Fields:**

```javascript
{
  viewCount: Number,                // Renamed from 'views'
  helpfulCount: Number,             // Renamed from 'helpful'
  slug: String,                     // Auto-generated from question
  metaDescription: String,          // Optional, max 200 chars
  // ... existing fields
}
```

**Slug Generation:**

- Auto-generated from question on save
- Uses slugify with Korean locale support
- Format: `question-text-timestamp`
- Unique index on slug field

---

## 6. ❌ Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
    "success": false,
    "message": "올바른 휴대전화번호 형식이 아닙니다.",
    "status": 400
}
```

**Unauthorized (401):**

```json
{
    "success": false,
    "message": "인증 토큰이 제공되지 않았습니다",
    "status": 401
}
```

**Not Found (404):**

```json
{
    "success": false,
    "message": "해당 정보와 일치하는 수강 이력을 찾을 수 없습니다.",
    "status": 404
}
```

---

## 7. 🔒 Authentication

### Public Endpoints (No Auth Required)

- `POST /api/v1/course-history/verify`
- `GET /api/v1/faqs`
- `GET /api/v1/faqs/:id`
- `GET /api/v1/faqs/search`
- `GET /api/v1/faqs/category/:categoryKey`
- `POST /api/v1/faqs/:id/helpful`
- `POST /api/v1/enquiries`

### Authenticated Endpoints (Token Required)

- `GET /api/v1/enrollments/my-history`
- `GET /api/v1/enrollments/:enrollmentId/certificate`
- `GET /api/v1/enquiries/my-enquiries`
- `GET /api/v1/enquiries/:id`

### Admin Endpoints (Admin Token Required)

- All FAQ CRUD endpoints
- All enquiry admin management endpoints

---

## 8. 🚀 Frontend Integration

### Course History Lookup Flow

```javascript
// 1. User fills verification form
const verifyHistory = async (data) => {
    const response = await axios.post("/api/v1/course-history/verify", {
        phone: data.phone,
        email: data.email,
        name: data.name,
        type: "personal",
    });

    if (response.data.success) {
        // Navigate to coursehistorylist with data
        navigate(
            "/customerservicecenter/checkcoursehistory/coursehistorylist",
            {
                state: response.data.data,
            }
        );
    }
};
```

---

### FAQ Display Flow

```javascript
// 1. Load all FAQs
const fetchFAQs = async (category = "all") => {
    const response = await axios.get("/api/v1/faqs", {
        params: { category, page: 1, limit: 20 },
    });

    return response.data.data;
};

// 2. Search FAQs
const searchFAQs = async (query) => {
    const response = await axios.get("/api/v1/faqs/search", {
        params: { q: query, limit: 10 },
    });

    return response.data.data.results;
};

// 3. Mark as helpful
const markHelpful = async (faqId) => {
    await axios.post(`/api/v1/faqs/${faqId}/helpful`, {
        helpful: true,
    });
};
```

---

### Enrollment History Flow

```javascript
// 1. Get my enrollment history (requires authentication)
const getMyHistory = async () => {
    const response = await axios.get("/api/v1/enrollments/my-history", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            page: 1,
            limit: 10,
            status: "completed",
            sortBy: "startDate",
            sortOrder: "desc",
        },
    });

    return response.data.data;
};

// 2. Download certificate
const downloadCertificate = (enrollmentId) => {
    window.location.href = `/api/v1/enrollments/${enrollmentId}/certificate?token=${token}`;
};
```

---

## 9. 📝 Database Indexes

### Required Indexes

**Enrollment Collection:**

```javascript
{ user: 1, enrollmentDate: -1 }
{ phone: 1, email: 1, name: 1 }  // For course history verification
{ status: 1 }
```

**FAQ Collection:**

```javascript
{ category: 1, order: 1 }
{ isActive: 1, isFeatured: -1 }
{ question: "text", answer: "text" }  // Text search
{ slug: 1 }  // Unique index
{ viewCount: -1 }  // For popular FAQs
```

**User Collection:**

```javascript
{ phone: 1, email: 1, name: 1 }  // Composite index for verification
```

---

## 10. 🎯 Testing

### Test Course History Lookup

```bash
curl -X POST https://class-crew.onrender.com/api/v1/course-history/verify \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01012345678",
    "email": "test@example.com",
    "name": "홍길동",
    "type": "personal"
  }'
```

---

### Test FAQ Search

```bash
curl -X GET "https://class-crew.onrender.com/api/v1/faqs/search?q=회원가입&limit=5"
```

---

### Test My Enrollment History

```bash
curl -X GET "https://class-crew.onrender.com/api/v1/enrollments/my-history?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 11. 📞 Support

**Base URL:** `https://class-crew.onrender.com/api/v1`

**Frontend Routes:**

- Course History Lookup: `/customerservicecenter/checkcoursehistory`
- Course History List: `/customerservicecenter/checkcoursehistory/coursehistorylist`
- FAQ: `/customerservicecenter/faq`
- Enquiry: `/customerservicecenter/enquiry`

**Contact:**

- Phone: 02-6914-9353
- Email: support@classcrew.com

---

## 12. ✅ Implementation Checklist

### Course History & Enrollment

- [x] Course History Lookup API
- [x] Course Enrollment History API
- [x] Certificate Download API
- [x] Training date formatting
- [x] Attendance calculation
- [x] Status mapping (Korean → English)

### FAQ Management

- [x] FAQ Management APIs (CRUD)
- [x] FAQ Search API (full-text search)
- [x] FAQ Helpful Voting
- [x] Slug generation for FAQs
- [x] View count tracking
- [x] Related FAQs

### Enquiry Management

- [x] Create Enquiry API (public, optional auth)
- [x] Get My Enquiries API (authenticated)
- [x] Get Enquiry by ID API (authenticated)
- [x] Ticket number auto-generation
- [x] Updated category enum
- [x] Added: company, countryCode, agreeToTerms
- [x] Added: attachmentUrl, attachmentOriginalName
- [x] Added: ipAddress, userAgent tracking
- [x] Added: closedAt timestamp
- [x] Updated response object (respondedByName, attachments)
- [x] Phone validation (Korean/Indian formats)

### Infrastructure

- [x] Database Model Updates
- [x] Virtual Fields Implementation
- [x] Database Indexes
- [x] Error Handling
- [x] Authentication (optional & required)
- [x] Validation (Joi schemas)
- [x] API Documentation

---

**Last Updated:** November 12, 2025  
**Document Version:** 1.0  
**API Version:** v1  
**Implementation:** Complete ✅
