# Learning Status Page - Backend API Guide

## 🎯 Overview

This document describes the backend API endpoint for the **Learning Status Page** (`/mypage/learning-status`). This endpoint provides all enrolled courses with their status, dates, and certificate information.

---

## 📍 API Endpoint

### GET `/api/v1/user/enrolled-courses`

**Authentication:** ✅ Required (Bearer Token)

**Description:** Get all enrolled courses for the authenticated user, formatted for the learning status page.

---

## 📤 Request

### Headers

```http
Authorization: Bearer {your-jwt-token}
```

### Query Parameters

None required. The endpoint automatically fetches all non-cancelled enrollments for the authenticated user.

---

## 📥 Response

### Success Response (200 OK)

```json
{
    "success": true,
    "message": "수강 중인 강의 목록을 성공적으로 조회했습니다",
    "data": {
        "courses": [
            {
                "_id": "507f1f77bcf86cd799439011",
                "title": "[리더십] 팀 리더십 강화 과정",
                "type": "환급",
                "startDate": "2025-01-20T00:00:00.000Z",
                "endDate": "2025-02-20T00:00:00.000Z",
                "status": "수강중",
                "enrolledAt": "2025-01-10T00:00:00.000Z",
                "progress": 45
            },
            {
                "_id": "507f1f77bcf86cd799439012",
                "title": "[비즈니스] 프레젠테이션 스킬",
                "type": "비환급",
                "startDate": "2024-12-15T00:00:00.000Z",
                "endDate": "2025-01-15T00:00:00.000Z",
                "status": "수료",
                "enrolledAt": "2024-12-10T00:00:00.000Z",
                "progress": 100,
                "certificateUrl": "http://localhost:5000/uploads/certificates/cert-12345.pdf"
            }
        ]
    }
}
```

---

## 📋 Response Fields

### Course Object

| Field            | Type   | Description                                              | Possible Values                                |
| ---------------- | ------ | -------------------------------------------------------- | ---------------------------------------------- |
| `_id`            | String | Course ID (required)                                     | MongoDB ObjectId                               |
| `title`          | String | Course title (required)                                  | Any string                                     |
| `type`           | String | Course type (required)                                   | `"환급"` or `"비환급"`                         |
| `startDate`      | String | Course start date (ISO 8601)                             | ISO date string or `null`                      |
| `endDate`        | String | Course end date (ISO 8601)                               | ISO date string or `null`                      |
| `status`         | String | Current enrollment status (required)                     | `"수강예정"`, `"수강중"`, `"미수료"`, `"수료"` |
| `enrolledAt`     | String | Enrollment date (ISO 8601) (required)                    | ISO date string                                |
| `progress`       | Number | Course completion percentage (required)                  | 0-100                                          |
| `certificateUrl` | String | PDF certificate URL (only present if status is `"수료"`) | Full URL or `undefined`                        |

---

## 🔄 Sorting Logic

Courses are **automatically sorted** by the backend in the following order:

1. **By Status Priority:**
    - 수강예정 (Scheduled)
    - 수강중 (In Progress)
    - 미수료 (Incomplete)
    - 수료 (Completed)

2. **Within Same Status:**
    - Most recently enrolled first (`enrolledAt` descending)

---

## 💻 Frontend Implementation

### 1. Fetch Enrolled Courses

```javascript
// Using fetch API
const getEnrolledCourses = async () => {
    const token = localStorage.getItem("token"); // or your auth storage method

    try {
        const response = await fetch("/api/v1/user/enrolled-courses", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        return data.data.courses; // Returns array of course objects
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
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

const getEnrolledCourses = async () => {
    try {
        const response = await api.get("/user/enrolled-courses");
        return response.data.data.courses;
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        throw error;
    }
};
```

---

## 🎨 Frontend Integration Example (React/Next.js)

```jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LearningStatusPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("/api/v1/user/enrolled-courses", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch courses");
            }

            const data = await response.json();
            setCourses(data.data.courses);
        } catch (err) {
            setError(err.message);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseId) => {
        router.push(`/class/${courseId}`);
    };

    const downloadCertificate = (certificateUrl, courseTitle) => {
        if (!certificateUrl) return;

        const link = document.createElement("a");
        link.href = certificateUrl;
        link.download = `수료증_${courseTitle}.pdf`;
        link.click();
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류: {error}</div>;
    }

    if (!courses || courses.length === 0) {
        return <div>수강 중인 강의가 없습니다.</div>;
    }

    return (
        <div>
            <h1>학습 현황</h1>
            <table>
                <thead>
                    <tr>
                        <th>강의명</th>
                        <th>유형</th>
                        <th>시작일</th>
                        <th>종료일</th>
                        <th>상태</th>
                        <th>진도율</th>
                        <th>수료증</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course._id}>
                            <td>
                                <span
                                    onClick={() =>
                                        handleCourseClick(course._id)
                                    }
                                    style={{ cursor: "pointer", color: "blue" }}
                                >
                                    {course.title}
                                </span>
                            </td>
                            <td>{course.type}</td>
                            <td>
                                {course.startDate
                                    ? new Date(
                                          course.startDate
                                      ).toLocaleDateString("ko-KR")
                                    : "-"}
                            </td>
                            <td>
                                {course.endDate
                                    ? new Date(
                                          course.endDate
                                      ).toLocaleDateString("ko-KR")
                                    : "-"}
                            </td>
                            <td>{course.status}</td>
                            <td>{course.progress}%</td>
                            <td>
                                {course.status === "수료" &&
                                course.certificateUrl ? (
                                    <button
                                        onClick={() =>
                                            downloadCertificate(
                                                course.certificateUrl,
                                                course.title
                                            )
                                        }
                                    >
                                        다운로드
                                    </button>
                                ) : (
                                    "-"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

---

## 🎯 Client-Side Filtering (Optional)

If you need additional filtering on the frontend (e.g., by type, period, status), you can implement it like this:

```javascript
const filterCourses = (courses, filters) => {
    return courses.filter((course) => {
        // Filter by type
        if (filters.type && filters.type !== "전체") {
            if (course.type !== filters.type) return false;
        }

        // Filter by period
        if (filters.period && filters.period !== "전체") {
            const enrolledDate = new Date(course.enrolledAt);
            const now = new Date();
            const diffMonths =
                (now - enrolledDate) / (1000 * 60 * 60 * 24 * 30);

            if (filters.period === "1개월" && diffMonths > 1) return false;
            if (filters.period === "3개월" && diffMonths > 3) return false;
            if (filters.period === "1년" && diffMonths > 12) return false;
        }

        // Filter by status
        if (filters.status && filters.status !== "전체") {
            if (course.status !== filters.status) return false;
        }

        return true;
    });
};

// Usage
const [filters, setFilters] = useState({
    type: "전체",
    period: "전체",
    status: "전체",
});

const filteredCourses = filterCourses(courses, filters);
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

#### 403 Forbidden (Token Expired)

```json
{
    "success": false,
    "message": "토큰이 만료되었습니다"
}
```

---

## 📊 Status Values Explained

| Status Value | Korean      | Meaning                | Certificate Available               |
| ------------ | ----------- | ---------------------- | ----------------------------------- |
| `수강예정`   | Scheduled   | Course not started yet | ❌ No                               |
| `수강중`     | In Progress | Currently taking       | ❌ No                               |
| `미수료`     | Incomplete  | Failed/Incomplete      | ❌ No                               |
| `수료`       | Completed   | Successfully completed | ✅ Yes (if `certificateUrl` exists) |

---

## 🎯 Type Values

| Type Value | Meaning                                   |
| ---------- | ----------------------------------------- |
| `환급`     | Refundable course (government-subsidized) |
| `비환급`   | Non-refundable course                     |

---

## 🧪 Testing

### Using cURL

```bash
# Get enrolled courses
curl -X GET http://localhost:5000/api/v1/user/enrolled-courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Using the Test Script

```bash
cd backend
node scripts/test-enrolled-courses.js
```

**Note:** The test script will automatically find a user in your database and test the endpoint.

---

## 📝 Notes

1. **Cancelled enrollments are excluded** - Only active enrollments are returned (status ≠ "취소")

2. **Certificate URL** - Only present for courses with status `"수료"` (completed)

3. **Dates** - All dates are in ISO 8601 format. Use JavaScript `Date` object to parse:

    ```javascript
    const date = new Date(course.startDate);
    const formatted = date.toLocaleDateString("ko-KR");
    ```

4. **Sorting** - Courses are pre-sorted by the backend, no need to sort on frontend

5. **Empty State** - If user has no enrollments, `courses` array will be empty `[]`

---

## 🔄 Common Use Cases

### 1. Display Recent Courses First

Already sorted! Just display them in order.

### 2. Download Certificate

```javascript
const downloadCertificate = (course) => {
    if (course.status !== "수료" || !course.certificateUrl) {
        alert("수료증이 없습니다");
        return;
    }

    const link = document.createElement("a");
    link.href = course.certificateUrl;
    link.download = `수료증_${course.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
```

### 3. Navigate to Course Detail

```javascript
const router = useRouter();

const goToCourse = (courseId) => {
    router.push(`/class/${courseId}`);
};
```

### 4. Format Dates

```javascript
const formatDate = (isoDateString) => {
    if (!isoDateString) return "-";

    const date = new Date(isoDateString);
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// Usage
<td>{formatDate(course.startDate)}</td>;
```

---

## ✅ Implementation Checklist

- [ ] Add API endpoint to your frontend API service/utils
- [ ] Implement authentication header with JWT token
- [ ] Create state management for courses (useState/Redux/etc)
- [ ] Add loading state while fetching
- [ ] Handle error states (network error, auth error)
- [ ] Display courses in table/list format
- [ ] Make course titles clickable → navigate to course detail
- [ ] Show certificate download button only for completed courses
- [ ] Implement certificate download functionality
- [ ] Add empty state message when no courses
- [ ] Format dates to Korean locale
- [ ] (Optional) Implement client-side filtering
- [ ] Test with various user accounts
- [ ] Test error scenarios (no token, expired token)

---

## 🚀 Ready to Use!

The backend endpoint is fully implemented and ready for integration. Just:

1. **Make sure your backend is running**
2. **Use the provided code examples**
3. **Test with the test script**
4. **Integrate into your frontend**

For questions or issues, contact the backend team or check the test script for working examples!

---

## 📚 Related Endpoints

- `GET /api/v1/user/profile` - Get user profile
- `GET /api/v1/user/enrollments` - Get detailed enrollment info
- `GET /api/v1/user/enrollments/:id` - Get single enrollment details
- `GET /api/v1/enrollments/:enrollmentId/certificate` - Download certificate (alternative method)

---

**Last Updated:** 2025-01-15  
**Backend Version:** v1  
**Status:** ✅ Production Ready
