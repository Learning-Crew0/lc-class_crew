# Inquiry API Documentation

Complete API reference for Personal and Corporate Inquiry endpoints.

---

## 📋 Table of Contents

- [User Side APIs (Frontend)](#user-side-apis-frontend)
- [Admin Side APIs](#admin-side-apis)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)

---

## 🔵 User Side APIs (Frontend)

### 1. Submit Personal Inquiry (개인 조회)

**Endpoint:** `POST /api/v1/public/inquiries/personal`

**Authentication:** Not Required (Public)

**Request Body:**

```json
{
    "phone": {
        "prefix": "010",
        "middle": "1234",
        "last": "5678"
    },
    "email": {
        "username": "hong",
        "domain": "naver.com"
    },
    "name": "홍길동"
}
```

**Success Response (200):**

```json
{
    "status": "success",
    "message": "조회 요청이 접수되었습니다.",
    "data": {
        "inquiryId": "INQ-20251114-001",
        "type": "personal",
        "status": "pending",
        "submittedAt": "2025-11-14T10:43:30.698Z"
    }
}
```

**Validation Rules:**

- `phone.prefix`: Must be one of: "010", "011", "016", "017", "018", "019"
- `phone.middle`: 3-4 digits
- `phone.last`: 4 digits
- `email.username`: Required, non-empty string
- `email.domain`: Required, non-empty string
- `name`: 2-100 characters

---

### 2. Submit Corporate Inquiry (기업 조회)

**Endpoint:** `POST /api/v1/public/inquiries/corporate`

**Authentication:** Not Required (Public)

**Request Body:**

```json
{
    "phone": {
        "prefix": "010",
        "middle": "5678",
        "last": "9012"
    },
    "email": {
        "username": "manager",
        "domain": "company.co.kr"
    },
    "name": "김담당"
}
```

**Success Response (200):**

```json
{
    "status": "success",
    "message": "조회 요청이 접수되었습니다.",
    "data": {
        "inquiryId": "INQ-20251114-002",
        "type": "corporate",
        "status": "pending",
        "submittedAt": "2025-11-14T10:45:12.458Z"
    }
}
```

**Validation Rules:** Same as Personal Inquiry

---

## 🔴 Admin Side APIs

### 1. Get All Inquiries (with Filtering)

**Endpoint:** `GET /api/v1/admin/inquiries`

**Authentication:** Required (Admin Token)

**Query Parameters:**

- `type` (optional): Filter by inquiry type
    - `personal` - Only personal inquiries
    - `corporate` - Only corporate inquiries
    - `general` - Only general inquiries
- `status` (optional): Filter by status
    - `pending` - New inquiries
    - `in_progress` - Being handled
    - `resolved` - Completed
    - `closed` - Archived
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Examples:**

```bash
# Get all personal inquiries
GET /api/v1/admin/inquiries?type=personal

# Get pending corporate inquiries
GET /api/v1/admin/inquiries?type=corporate&status=pending

# Get all pending inquiries (both personal and corporate)
GET /api/v1/admin/inquiries?status=pending

# Paginated results
GET /api/v1/admin/inquiries?type=personal&page=1&limit=20
```

**Success Response (200):**

```json
{
    "status": "success",
    "message": "Inquiries retrieved successfully",
    "data": [
        {
            "_id": "673582da6f1a2b3c4d5e6f7a",
            "inquiryId": "INQ-20251114-001",
            "ticketNumber": "ENQ-2025-000123",
            "type": "personal",
            "name": "홍길동",
            "email": "hong@naver.com",
            "phone": "01012345678",
            "status": "pending",
            "priority": "medium",
            "createdAt": "2025-11-14T10:43:30.698Z",
            "updatedAt": "2025-11-14T10:43:30.698Z"
        },
        {
            "_id": "673582da6f1a2b3c4d5e6f7b",
            "inquiryId": "INQ-20251114-002",
            "ticketNumber": "ENQ-2025-000124",
            "type": "corporate",
            "name": "김담당",
            "email": "manager@company.co.kr",
            "phone": "01056789012",
            "status": "pending",
            "priority": "medium",
            "createdAt": "2025-11-14T10:45:12.458Z",
            "updatedAt": "2025-11-14T10:45:12.458Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 25,
        "pages": 3
    }
}
```

---

### 2. Get Inquiry by ID

**Endpoint:** `GET /api/v1/admin/inquiries/:id`

**Authentication:** Required (Admin Token)

**Success Response (200):**

```json
{
    "status": "success",
    "message": "Inquiry retrieved successfully",
    "data": {
        "_id": "673582da6f1a2b3c4d5e6f7a",
        "inquiryId": "INQ-20251114-001",
        "ticketNumber": "ENQ-2025-000123",
        "type": "personal",
        "name": "홍길동",
        "email": "hong@naver.com",
        "phone": "01012345678",
        "status": "pending",
        "priority": "medium",
        "agreeToTerms": true,
        "createdAt": "2025-11-14T10:43:30.698Z",
        "updatedAt": "2025-11-14T10:43:30.698Z",
        "user": null,
        "assignedTo": null,
        "response": {},
        "notes": []
    }
}
```

---

### 3. Update Inquiry Status

**Endpoint:** `PUT /api/v1/admin/inquiries/:id/status`

**Authentication:** Required (Admin Token)

**Request Body:**

```json
{
    "status": "in_progress"
}
```

**Valid Status Values:**

- `pending`
- `in_progress`
- `resolved`
- `closed`

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Inquiry status updated successfully",
  "data": {
    "_id": "673582da6f1a2b3c4d5e6f7a",
    "status": "in_progress",
    ...
  }
}
```

---

### 4. Assign Inquiry to Admin

**Endpoint:** `PUT /api/v1/admin/inquiries/:id/assign`

**Authentication:** Required (Admin Token)

**Request Body:**

```json
{
    "adminId": "673582da6f1a2b3c4d5e6f7c"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Inquiry assigned successfully",
  "data": {
    "_id": "673582da6f1a2b3c4d5e6f7a",
    "assignedTo": {
      "_id": "673582da6f1a2b3c4d5e6f7c",
      "name": "Admin User",
      "email": "admin@classcrew.com"
    },
    "status": "in_progress",
    ...
  }
}
```

---

### 5. Add Response to Inquiry

**Endpoint:** `POST /api/v1/admin/inquiries/:id/respond`

**Authentication:** Required (Admin Token)

**Request Body:**

```json
{
    "message": "안녕하세요. 문의 주셔서 감사합니다. 담당자 배정 후 빠르게 연락드리겠습니다.",
    "attachments": []
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Response added successfully",
  "data": {
    "_id": "673582da6f1a2b3c4d5e6f7a",
    "response": {
      "message": "안녕하세요. 문의 주셔서 감사합니다...",
      "respondedBy": "673582da6f1a2b3c4d5e6f7c",
      "respondedByName": "Admin User",
      "respondedAt": "2025-11-14T11:00:00.000Z",
      "attachments": []
    },
    "status": "resolved",
    ...
  }
}
```

---

### 6. Delete Inquiry

**Endpoint:** `DELETE /api/v1/admin/inquiries/:id`

**Authentication:** Required (Admin Token)

**Success Response (200):**

```json
{
    "status": "success",
    "message": "Inquiry deleted successfully",
    "data": {
        "message": "Inquiry deleted successfully"
    }
}
```

---

## 📊 Response Formats

### Inquiry Object Fields

| Field          | Type        | Description                                    |
| -------------- | ----------- | ---------------------------------------------- |
| `_id`          | String      | MongoDB ObjectId                               |
| `inquiryId`    | String      | Unique ID (INQ-YYYYMMDD-NNN)                   |
| `ticketNumber` | String      | Legacy ticket number (ENQ-YYYY-NNNNNN)         |
| `type`         | String      | "personal", "corporate", or "general"          |
| `name`         | String      | Contact person name                            |
| `email`        | String      | Email address                                  |
| `phone`        | String      | Phone number                                   |
| `status`       | String      | "pending", "in_progress", "resolved", "closed" |
| `priority`     | String      | "low", "medium", "high", "urgent"              |
| `agreeToTerms` | Boolean     | Terms agreement flag                           |
| `createdAt`    | Date        | Creation timestamp                             |
| `updatedAt`    | Date        | Last update timestamp                          |
| `user`         | Object/null | Associated user (if logged in)                 |
| `assignedTo`   | Object/null | Assigned admin                                 |
| `response`     | Object      | Admin response details                         |
| `notes`        | Array       | Internal admin notes                           |

---

## ❌ Error Handling

### Validation Error (400)

```json
{
    "status": "error",
    "message": "Validation error",
    "errors": [
        "이름을 입력해주세요",
        "전화번호 중간자리는 3-4자리 숫자여야 합니다"
    ]
}
```

### Not Found (404)

```json
{
    "success": false,
    "message": "Inquiry not found"
}
```

### Duplicate Inquiry (409)

```json
{
    "success": false,
    "message": "inquiryId already exists"
}
```

### Server Error (500)

```json
{
    "success": false,
    "message": "Internal server error"
}
```

---

## 🔧 Frontend Integration Examples

### React/Next.js Example

```javascript
// Submit Personal Inquiry
const submitPersonalInquiry = async (data) => {
    try {
        const response = await fetch(
            "https://class-crew.onrender.com/api/v1/public/inquiries/personal",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: {
                        prefix: data.phonePrefix,
                        middle: data.phoneMiddle,
                        last: data.phoneLast,
                    },
                    email: {
                        username: data.emailUsername,
                        domain: data.emailDomain,
                    },
                    name: data.name,
                }),
            }
        );

        const result = await response.json();

        if (result.status === "success") {
            console.log("Inquiry submitted:", result.data.inquiryId);
            alert("조회 요청이 접수되었습니다!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
};

// Admin: Get All Personal Inquiries
const getPersonalInquiries = async (token) => {
    try {
        const response = await fetch(
            "https://class-crew.onrender.com/api/v1/admin/inquiries?type=personal&status=pending",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error:", error);
    }
};
```

---

## 🚀 Production URLs

**Base URL:** `https://class-crew.onrender.com/api/v1`

**User Endpoints:**

- POST `/public/inquiries/personal`
- POST `/public/inquiries/corporate`

**Admin Endpoints:**

- GET `/admin/inquiries`
- GET `/admin/inquiries/:id`
- PUT `/admin/inquiries/:id/status`
- PUT `/admin/inquiries/:id/assign`
- POST `/admin/inquiries/:id/respond`
- DELETE `/admin/inquiries/:id`

---

## ✅ Testing Status

- ✅ Personal Inquiry Endpoint
- ✅ Corporate Inquiry Endpoint
- ✅ Validation (Missing fields)
- ✅ Validation (Invalid phone format)
- ✅ Unique InquiryID Generation
- ✅ Admin Notification Logging

**Ready for Frontend Integration!**

