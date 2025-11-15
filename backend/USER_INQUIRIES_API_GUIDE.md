# User Inquiries API - Frontend Integration Guide

## 🎯 Overview

This document describes the backend API endpoint for the **1:1 Inquiry History Page** (`/mypage/inquiry`). This endpoint provides all inquiries submitted by the authenticated user.

---

## 📍 API Endpoint

### GET `/api/v1/user/inquiries`

**Authentication:** ✅ Required (Bearer Token)

**Description:** Get all inquiries submitted by the authenticated user, formatted for the inquiry history page.

---

## 📤 Request

### Headers

```http
Authorization: Bearer {your-jwt-token}
```

### Query Parameters (Optional)

| Parameter | Type   | Description                  | Example   |
| --------- | ------ | ---------------------------- | --------- |
| `page`    | Number | Page number (default: 1)     | `1`       |
| `limit`   | Number | Items per page (default: 10) | `10`      |
| `status`  | String | Filter by status             | `pending` |

---

## 📥 Response

### Success Response (200 OK)

```json
{
    "success": true,
    "message": "문의 내역을 성공적으로 조회했습니다",
    "data": {
        "inquiries": [
            {
                "_id": "507f1f77bcf86cd799439011",
                "title": "환불문의 드립니다",
                "content": "환불 가능한가요?",
                "category": "Registration/Payment",
                "status": "미확인",
                "createdAt": "2025-01-15T00:00:00.000Z"
            },
            {
                "_id": "507f1f77bcf86cd799439012",
                "title": "수강신청을 변경하고 싶습니다",
                "content": "변경 가능한가요?",
                "category": "Program Inquiry",
                "status": "답변완료",
                "createdAt": "2025-01-10T00:00:00.000Z",
                "reply": "네, 변경 가능합니다. 고객센터로 연락주세요.",
                "repliedAt": "2025-01-11T00:00:00.000Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 15,
            "totalPages": 2,
            "hasNextPage": true,
            "hasPrevPage": false
        }
    }
}
```

---

## 📋 Response Fields

### Inquiry Object

| Field       | Type   | Description                                      | Always Present                  |
| ----------- | ------ | ------------------------------------------------ | ------------------------------- |
| `_id`       | String | Inquiry ID (required for routing to detail page) | ✅ Yes                          |
| `title`     | String | Inquiry title/subject                            | ✅ Yes                          |
| `content`   | String | Inquiry message/content                          | ✅ Yes                          |
| `category`  | String | Inquiry category                                 | ✅ Yes                          |
| `status`    | String | Status in Korean: "미확인" or "답변완료"         | ✅ Yes                          |
| `createdAt` | String | Created date (ISO 8601)                          | ✅ Yes                          |
| `reply`     | String | Admin's reply message                            | ❌ Only if status is "답변완료" |
| `repliedAt` | String | Reply date (ISO 8601)                            | ❌ Only if status is "답변완료" |

---

## 📊 Status Values

| Status     | Korean        | Meaning                   | Has Reply |
| ---------- | ------------- | ------------------------- | --------- |
| `미확인`   | Not Confirmed | Pending, not yet answered | ❌ No     |
| `답변완료` | Answered      | Admin has replied         | ✅ Yes    |

**Backend Mapping:**

- Backend status `pending` or `in_progress` → Frontend `"미확인"`
- Backend status `resolved` or `closed` → Frontend `"답변완료"`
- If inquiry has a response message → Frontend `"답변완료"`

---

## 🏷️ Category Values

| Category                 | Description   |
| ------------------------ | ------------- |
| `Program Inquiry`        | 프로그램 문의 |
| `Registration/Payment`   | 교육신청/결제 |
| `Certificate`            | 수료증        |
| `Group Registration`     | 단체신청      |
| `Partnership/Instructor` | 제휴/강사섭외 |
| `Venue Rental`           | 시설대관      |
| `Other`                  | 기타          |

---

## 💻 Frontend Implementation

### 1. Fetch User Inquiries

```javascript
// Using fetch API
const getUserInquiries = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("/api/v1/user/inquiries", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch inquiries");
        }

        const data = await response.json();
        return data.data; // Returns { inquiries, pagination }
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        throw error;
    }
};
```

### 2. Using Axios

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const getUserInquiries = async (page = 1, limit = 10) => {
    try {
        const response = await api.get("/user/inquiries", {
            params: { page, limit },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        throw error;
    }
};
```

---

## 🎨 Complete Frontend Example (React/Next.js)

```jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InquiryHistoryPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        period: "전체",
        status: "전체",
    });
    const router = useRouter();

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("/api/v1/user/inquiries", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch inquiries");
            }

            const data = await response.json();
            setInquiries(data.data.inquiries);
        } catch (err) {
            setError(err.message);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInquiryClick = (inquiryId) => {
        router.push(`/mypage/inquiry/${inquiryId}`);
    };

    // Filter inquiries based on selected filters
    const getFilteredInquiries = () => {
        return inquiries.filter((inquiry) => {
            // Filter by status
            if (filters.status !== "전체") {
                if (inquiry.status !== filters.status) return false;
            }

            // Filter by period
            if (filters.period !== "전체") {
                const createdDate = new Date(inquiry.createdAt);
                const now = new Date();
                const diffMonths =
                    (now - createdDate) / (1000 * 60 * 60 * 24 * 30);

                if (filters.period === "1개월" && diffMonths > 1) return false;
                if (filters.period === "3개월" && diffMonths > 3) return false;
                if (filters.period === "1년" && diffMonths > 12) return false;
            }

            return true;
        });
    };

    const filteredInquiries = getFilteredInquiries();

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류: {error}</div>;
    }

    return (
        <div>
            <h1>1:1 문의 내역</h1>

            {/* New Inquiry Button */}
            <Link href="/customerservicecenter/enquiry">
                <button>문의하기</button>
            </Link>

            {/* Filter Dropdown */}
            <div>
                <button>조회기간 설정</button>
                {/* Filter dropdown content */}
            </div>

            {/* Inquiry Table */}
            {filteredInquiries.length === 0 ? (
                <p>문의 내역이 없습니다.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>제목</th>
                            <th>등록일시</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInquiries.map((inquiry, index) => (
                            <tr key={inquiry._id}>
                                <td>{filteredInquiries.length - index}</td>
                                <td>
                                    <Link
                                        href={`/mypage/inquiry/${inquiry._id}`}
                                    >
                                        {inquiry.title}
                                    </Link>
                                </td>
                                <td>
                                    {new Date(inquiry.createdAt)
                                        .toLocaleDateString("ko-KR", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })
                                        .replace(/\. /g, ".")
                                        .replace(".", "")}
                                </td>
                                <td>{inquiry.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
```

---

## 🎯 Client-Side Filtering

```javascript
const filterInquiries = (inquiries, filters) => {
    return inquiries.filter((inquiry) => {
        // Filter by period
        if (filters.period && filters.period !== "전체") {
            const createdDate = new Date(inquiry.createdAt);
            const now = new Date();
            const diffMonths = (now - createdDate) / (1000 * 60 * 60 * 24 * 30);

            if (filters.period === "1개월" && diffMonths > 1) return false;
            if (filters.period === "3개월" && diffMonths > 3) return false;
            if (filters.period === "1년" && diffMonths > 12) return false;
        }

        // Filter by status
        if (filters.status && filters.status !== "전체") {
            if (inquiry.status !== filters.status) return false;
        }

        return true;
    });
};
```

---

## 🔐 Authentication & Authorization

### Required Headers

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Error Responses

#### 401 Unauthorized (No Token)

```json
{
    "success": false,
    "message": "인증 토큰이 필요합니다"
}
```

#### 401 Unauthorized (Invalid Token)

```json
{
    "success": false,
    "message": "유효하지 않은 토큰입니다"
}
```

---

## 🧪 Testing

### Using cURL

```bash
# Get user inquiries
curl -X GET http://localhost:5000/api/v1/user/inquiries \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Using Test Script

```bash
cd backend
node scripts/test-user-inquiries.js
```

**Note:** The test script will automatically:

1. Find a user in your database
2. Create a test inquiry if none exist
3. Test the endpoint
4. Validate the response structure

---

## 📝 Notes

1. **Sorting** - Inquiries are automatically sorted by `createdAt` descending (most recent first)

2. **Status Mapping** - Backend status values are automatically converted to Korean:
    - `pending`, `in_progress` → `"미확인"`
    - `resolved`, `closed` → `"답변완료"`

3. **Reply Field** - Only present when `status === "답변완료"` and admin has replied

4. **Date Formatting** - Dates are in ISO 8601 format:

    ```javascript
    const formatted = new Date(inquiry.createdAt)
        .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(".", ""); // "2025.01.15"
    ```

5. **Empty State** - If user has no inquiries, `inquiries` array will be empty `[]`

6. **Pagination** - Response includes pagination info for implementing "Load More" or page numbers

---

## 🔄 Routing Flow

```
1. User visits: /mypage/inquiry
   ↓
2. Fetch inquiries from API
   ↓
3. Display in table
   ↓
4. User clicks "문의하기" button
   → Navigate to /customerservicecenter/enquiry
   ↓
5. User clicks inquiry title
   → Navigate to /mypage/inquiry/{id}
```

---

## ✅ Implementation Checklist

- [ ] Add API endpoint to frontend API service/utils
- [ ] Implement authentication header with JWT token
- [ ] Create state management for inquiries
- [ ] Add loading state
- [ ] Handle error states
- [ ] Display inquiries in table
- [ ] Make inquiry titles clickable (route to detail page)
- [ ] Add "문의하기" button (route to enquiry form)
- [ ] Implement filter dropdown
- [ ] Format dates to Korean locale (YYYY.MM.DD)
- [ ] Show empty state when no inquiries
- [ ] Test with various user accounts
- [ ] Test error scenarios (no token, expired token)

---

## 🚀 Ready to Use!

The backend endpoint is fully implemented and ready for integration:

1. **Restart your backend server** to pick up the new changes
2. **Use the provided code examples**
3. **Test with the test script**
4. **Integrate into your frontend**

---

## 📚 Related Endpoints

- `GET /api/v1/user/inquiries/:id` - Get inquiry detail by ID
- `POST /api/v1/public/inquiries` - Submit new inquiry (general)
- `POST /api/v1/public/inquiries/personal` - Submit personal inquiry
- `POST /api/v1/public/inquiries/corporate` - Submit corporate inquiry

---

**Last Updated:** 2025-01-15  
**Backend Version:** v1  
**Status:** ✅ Production Ready (Restart server required)
