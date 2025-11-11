# 🚀 ClassCrew Frontend Integration Guide

Complete API documentation for frontend integration with request/response examples.

**Base URL:** `http://localhost:5000/api/v1` (Development)  
**Production:** `https://your-domain.com/api/v1`

---

## 📑 Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Courses](#courses)
4. [Training Schedules](#training-schedules)
5. [Products (Learning Store)](#products-learning-store)
6. [Shopping Cart](#shopping-cart)
7. [Class Applications](#class-applications)
8. [Student Enrollments](#student-enrollments)
9. [Announcements](#announcements)
10. [FAQs](#faqs)
11. [Course History](#course-history)
12. [Admin](#admin)

---

## 🔐 Authentication

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01012345678",
  "memberType": "individual"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "user": {
            "_id": "userId123",
            "fullName": "John Doe",
            "email": "john@example.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "emailOrUsername": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Admin Login

```http
POST /admin/login
Content-Type: application/json

{
  "email": "classcrew@admin.com",
  "password": "admin123"
}
```

### Frontend Integration:

```javascript
// Login
const login = async (email, password) => {
    const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: email, password }),
    });
    const { data } = await response.json();

    // Store token
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
};

// Use token in requests
const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
};
```

---

## 👤 Users

### Get User Profile

```http
GET /user/profile
Authorization: Bearer {token}
```

### Update Profile

```http
PUT /user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Updated",
  "phone": "01098765432"
}
```

### Change Password

```http
POST /user/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

---

## 📚 Courses

### Get All Courses (Public)

```http
GET /courses?page=1&limit=10&category={categoryId}&level=beginner&search=leadership
```

**Response:**

```json
{
    "success": true,
    "data": {
        "courses": [
            {
                "_id": "course123",
                "title": "Leadership Training",
                "description": "Comprehensive leadership course",
                "price": 500000,
                "category": { "_id": "cat1", "title": "Leadership" },
                "mainImage": "/uploads/courses/image.png",
                "hours": 12,
                "level": "beginner",
                "isActive": true,
                "isFeatured": true
            }
        ],
        "pagination": {
            "total": 50,
            "page": 1,
            "pages": 5,
            "limit": 10
        }
    }
}
```

### Get Course by ID

```http
GET /courses/{courseId}
```

**Response:** Includes populated data (category, schedules, curriculum, instructors, reviews)

### Frontend Integration:

```javascript
// Course List Page
const fetchCourses = async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/v1/courses?${params}`);
    const { data } = await response.json();
    return data;
};

// Course Detail Page
const fetchCourse = async (id) => {
    const response = await fetch(`/api/v1/courses/${id}`);
    const { data } = await response.json();
    return data;
};
```

### Create Course (Admin)

```http
POST /courses
Authorization: Bearer {adminToken}
Content-Type: multipart/form-data

FormData:
  title: "New Course"
  description: "Course description"
  category: "{categoryId}"
  price: 500000
  hours: 12
  level: "beginner"
  mainImage: (file)
  hoverImage: (file)
```

### Update Course (Admin)

```http
PUT /courses/{courseId}
Authorization: Bearer {adminToken}
Content-Type: multipart/form-data
```

### Delete Course (Admin)

```http
DELETE /courses/{courseId}
Authorization: Bearer {adminToken}
```

---

## 🗓️ Training Schedules

### Get Schedules for Course (Public)

```http
GET /courses/{courseId}/training-schedules
```

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "_id": "schedule123",
            "scheduleName": "2025년 1월 3주차",
            "startDate": "2025-01-15T00:00:00.000Z",
            "endDate": "2025-01-16T00:00:00.000Z",
            "availableSeats": 30,
            "enrolledCount": 5,
            "remainingSeats": 25,
            "isFull": false,
            "status": "upcoming",
            "isActive": true
        }
    ]
}
```

### Frontend Integration (Schedule Dropdown):

```jsx
const ScheduleSelector = ({ courseId, onSelect }) => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/courses/${courseId}/training-schedules`)
            .then((res) => res.json())
            .then((data) => setSchedules(data.data));
    }, [courseId]);

    return (
        <select onChange={(e) => onSelect(e.target.value)}>
            <option>일정 선택</option>
            {schedules
                .filter((s) => s.isActive && !s.isFull)
                .map((schedule) => (
                    <option key={schedule._id} value={schedule._id}>
                        {schedule.scheduleName}(
                        {new Date(schedule.startDate).toLocaleDateString()} ~
                        {new Date(schedule.endDate).toLocaleDateString()}) -
                        잔여 {schedule.remainingSeats}석
                    </option>
                ))}
        </select>
    );
};
```

### Create Schedule (Admin)

```http
POST /courses/{courseId}/training-schedules
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "scheduleName": "2025년 2월 1주차",
  "startDate": "2025-02-01",
  "endDate": "2025-02-02",
  "availableSeats": 30,
  "status": "upcoming",
  "isActive": true
}
```

### Update Schedule (Admin)

```http
PUT /courses/{courseId}/training-schedules/{scheduleId}
Authorization: Bearer {adminToken}
```

### Delete Schedule (Admin)

```http
DELETE /courses/{courseId}/training-schedules/{scheduleId}
Authorization: Bearer {adminToken}
```

---

## 🛍️ Products (Learning Store)

### Get All Products (Public)

```http
GET /products?page=1&limit=10&category=진단도구&inStock=true
```

**Response:**

```json
{
    "success": true,
    "data": {
        "products": [
            {
                "_id": "prod123",
                "name": "66일 챌린지",
                "description": "66일 동안 꾸준한 실천을 돕는 굿즈",
                "price": 100000,
                "stock": {
                    "quantity": 50,
                    "trackInventory": true
                },
                "images": ["/uploads/products/image1.png"],
                "isPublished": true,
                "isFeatured": false
            }
        ],
        "pagination": { "total": 20, "page": 1, "pages": 2 }
    }
}
```

### Get Featured Products

```http
GET /products/featured?limit=6
```

### Get Product by ID

```http
GET /products/{productId}
```

### Create Product (Admin)

```http
POST /products
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "66일 챌린지",
  "description": "습관 형성을 위한 66일 챌린지 키트",
  "price": 100000,
  "category": "진단도구",
  "stock": {
    "quantity": 50,
    "trackInventory": true
  },
  "isPublished": true,
  "isFeatured": true
}
```

### Update Product (Admin)

```http
PUT /products/{productId}
Authorization: Bearer {adminToken}
```

### Update Stock (Admin)

```http
PATCH /products/{productId}/stock
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "quantity": 30
}
```

### Delete Product (Admin)

```http
DELETE /products/{productId}
Authorization: Bearer {adminToken}
```

---

## 🛒 Shopping Cart

### Get Cart

```http
GET /cart
Authorization: Bearer {token}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "items": [
            {
                "itemType": "course",
                "course": {
                    /* course details */
                },
                "courseSchedule": {
                    /* schedule details */
                },
                "quantity": 1,
                "priceAtTime": 500000,
                "subtotal": 500000
            },
            {
                "itemType": "product",
                "product": {
                    /* product details */
                },
                "quantity": 2,
                "priceAtTime": 100000,
                "subtotal": 200000
            }
        ],
        "subtotal": 700000,
        "totalDiscount": 0,
        "grandTotal": 700000,
        "itemCount": 2
    }
}
```

### Get Courses Only

```http
GET /cart?itemType=course
Authorization: Bearer {token}
```

### Add Course to Cart

```http
POST /cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "itemType": "course",
  "productId": "{courseId}",
  "courseSchedule": "{scheduleId}"
}
```

### Add Product to Cart

```http
POST /cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "itemType": "product",
  "productId": "{productId}",
  "quantity": 2
}
```

### Frontend Integration:

```javascript
const addToCart = async (itemType, productId, extraData) => {
    const body = { itemType, productId };

    if (itemType === "course") {
        body.courseSchedule = extraData.scheduleId;
    } else {
        body.quantity = extraData.quantity || 1;
    }

    const response = await fetch("/api/v1/cart/add", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

// Usage
await addToCart("course", courseId, { scheduleId });
await addToCart("product", productId, { quantity: 2 });
```

### Get Selected Courses for Application

```http
POST /cart/get-selected-courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "selectedProductIds": ["courseId1", "courseId2"]
}
```

### Update Product Quantity

```http
PUT /cart/update/{productId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart

```http
DELETE /cart/remove/{itemId}?itemType=course&scheduleId={scheduleId}
Authorization: Bearer {token}
```

### Clear Cart

```http
DELETE /cart/clear
Authorization: Bearer {token}
```

---

## 📝 Class Applications

### Download Template (Public)

```http
GET /class-applications/download-template
```

### Create Draft Application

```http
POST /class-applications/draft
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseIds": ["courseId1", "courseId2"]
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "_id": "app123",
        "user": "userId",
        "courses": [
            {
                "course": {
                    /* course details */
                },
                "trainingSchedule": {
                    /* schedule details */
                },
                "students": [],
                "price": 500000
            }
        ],
        "status": "draft",
        "paymentInfo": { "totalAmount": 500000 }
    }
}
```

### Validate Student

```http
POST /class-applications/validate-student
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "student@example.com",
  "phone": "01012345678",
  "name": "홍길동"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "userId": "user123",
        "exists": true,
        "user": {
            "_id": "user123",
            "fullName": "홍길동",
            "email": "student@example.com"
        }
    }
}
```

### Add Student to Course

```http
POST /class-applications/{applicationId}/add-student
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": "{courseId}",
  "studentData": {
    "userId": "user123",
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

### Upload Bulk Students (6+)

```http
POST /class-applications/{applicationId}/upload-bulk-students
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  courseId: "{courseId}"
  file: (Excel file)
```

### Update Payment Info

```http
PUT /class-applications/{applicationId}/payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "간편결제",
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

### Submit Application

```http
POST /class-applications/{applicationId}/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "agreements": {
    "paymentAndRefundPolicy": true,
    "refundPolicy": true
  }
}
```

**Response:** Creates enrollments, removes courses from cart, generates application number

### Frontend Integration (Complete Flow):

```javascript
// Step 1: Create draft
const createDraft = async (courseIds) => {
    const response = await fetch("/api/v1/class-applications/draft", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseIds }),
    });
    const { data } = await response.json();
    return data._id; // applicationId
};

// Step 2: Validate student
const validateStudent = async (email, phone, name) => {
    const response = await fetch(
        "/api/v1/class-applications/validate-student",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, phone, name }),
        }
    );
    const { data } = await response.json();
    return data.userId;
};

// Step 3: Add student
const addStudent = async (applicationId, courseId, studentData) => {
    await fetch(`/api/v1/class-applications/${applicationId}/add-student`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, studentData }),
    });
};

// Step 4: Update payment
const updatePayment = async (applicationId, paymentInfo) => {
    await fetch(`/api/v1/class-applications/${applicationId}/payment`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentInfo),
    });
};

// Step 5: Submit
const submitApplication = async (applicationId) => {
    const response = await fetch(
        `/api/v1/class-applications/${applicationId}/submit`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                agreements: {
                    paymentAndRefundPolicy: true,
                    refundPolicy: true,
                },
            }),
        }
    );
    return await response.json();
};
```

### Get Application by ID

```http
GET /class-applications/{applicationId}
Authorization: Bearer {token}
```

### Get User's Applications

```http
GET /class-applications/user/{userId}?page=1&limit=10&status=submitted
Authorization: Bearer {token}
```

### Cancel Application

```http
POST /class-applications/{applicationId}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "일정 변경"
}
```

---

## 👨‍🎓 Student Enrollments

### Get Student's Enrollments

```http
GET /enrollments/student/{userId}?page=1&limit=10&status=enrolled
Authorization: Bearer {token}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "enrollments": [
            {
                "_id": "enroll123",
                "student": {
                    /* user details */
                },
                "course": {
                    /* course details */
                },
                "schedule": {
                    /* schedule details */
                },
                "status": "enrolled",
                "enrolledAt": "2025-01-10T00:00:00.000Z",
                "attendance": [],
                "certificate": {
                    "issued": false
                }
            }
        ],
        "pagination": { "total": 10, "page": 1, "pages": 1 }
    }
}
```

### Get Enrollment by ID

```http
GET /enrollments/{enrollmentId}
Authorization: Bearer {token}
```

### Cancel Enrollment

```http
POST /enrollments/{enrollmentId}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "개인 사정"
}
```

### Add Attendance (Admin)

```http
POST /enrollments/{enrollmentId}/attendance
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "date": "2025-01-15",
  "status": "present",
  "notes": "정상 출석"
}
```

### Mark as Completed (Admin)

```http
POST /enrollments/{enrollmentId}/complete
Authorization: Bearer {adminToken}
```

### Issue Certificate (Admin)

```http
POST /enrollments/{enrollmentId}/certificate
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "certificateUrl": "https://certificates.example.com/cert123.pdf"
}
```

### Get Course Stats (Admin)

```http
GET /enrollments/stats/course/{courseId}?scheduleId={scheduleId}
Authorization: Bearer {adminToken}
```

---

## 📢 Announcements

### Get All Announcements (Public)

```http
GET /announcements?page=1&limit=10&status=published&category=notice
```

**Response:**

```json
{
    "success": true,
    "data": {
        "announcements": [
            {
                "_id": "ann123",
                "title": "Important Notice",
                "content": "Announcement content...",
                "category": "notice",
                "isImportant": true,
                "isPinned": false,
                "views": 150,
                "publishedAt": "2025-01-10T00:00:00.000Z",
                "author": "Admin"
            }
        ],
        "pagination": { "total": 50, "page": 1, "pages": 5 }
    }
}
```

### Get Announcement by ID (Public)

```http
GET /announcements/{announcementId}
```

### Create Announcement (Admin)

```http
POST /announcements
Authorization: Bearer {adminToken}
Content-Type: multipart/form-data

FormData:
  title: "Important Notice"
  content: "Announcement content"
  category: "공지사항"
  authorName: "Admin"
  status: "published"
  isImportant: true
  attachments: (files, max 5)
```

### Update Announcement (Admin)

```http
PUT /announcements/{announcementId}
Authorization: Bearer {adminToken}
Content-Type: multipart/form-data
```

### Delete Announcement (Admin)

```http
DELETE /announcements/{announcementId}
Authorization: Bearer {adminToken}
```

---

## ❓ FAQs

### Get All FAQs (Public)

```http
GET /faqs?page=1&limit=20&category=signup-login&search=password
```

**Response:**

```json
{
    "success": true,
    "data": {
        "faqs": [
            {
                "_id": "faq123",
                "question": "How do I reset my password?",
                "answer": "Click on 'Forgot Password'...",
                "category": "signup-login",
                "tags": ["password", "reset"],
                "views": 250,
                "helpful": 45,
                "notHelpful": 5,
                "isActive": true
            }
        ],
        "pagination": { "total": 30, "page": 1, "pages": 2 }
    }
}
```

### Get FAQ Categories (Public)

```http
GET /faqs/categories?isActive=true
```

### Get FAQ by ID (Public)

```http
GET /faqs/{faqId}
```

### Create FAQ (Admin)

```http
POST /faqs
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "question": "How do I register?",
  "answer": "Click on Sign Up...",
  "category": "signup-login",
  "tags": ["registration", "signup"],
  "isActive": true
}
```

### Update FAQ (Admin)

```http
PUT /faqs/{faqId}
Authorization: Bearer {adminToken}
```

### Delete FAQ (Admin)

```http
DELETE /faqs/{faqId}
Authorization: Bearer {adminToken}
```

### Mark as Helpful (Public)

```http
POST /faqs/{faqId}/helpful
Content-Type: application/json

{
  "helpful": true
}
```

---

## 📚 Course History

### Check Personal History (Public)

```http
POST /course-history/personal
Content-Type: application/json

{
  "phoneNumber": "01012345678",
  "email": "hong@example.com",
  "name": "홍길동"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "userInfo": {
            "name": "홍길동",
            "email": "hong@example.com"
        },
        "courseHistory": [
            {
                "no": 1,
                "enrollmentId": "enroll123",
                "courseName": "Leadership Training",
                "trainingDate": "2025.01.15~2025.01.16",
                "status": "수료",
                "certificateAvailable": true,
                "certificateUrl": "/certificates/cert123.pdf"
            }
        ],
        "totalCourses": 5,
        "completedCourses": 3
    }
}
```

### Get Certificate (Public)

```http
GET /course-history/certificate/{enrollmentId}
```

---

## 🔐 Admin Endpoints

### Get All Users (Admin)

```http
GET /admin/users?page=1&limit=20&memberType=individual
Authorization: Bearer {adminToken}
```

### Toggle User Status (Admin)

```http
PATCH /admin/users/{userId}/toggle-status
Authorization: Bearer {adminToken}
```

### Get Dashboard Stats (Admin)

```http
GET /admin/dashboard/stats
Authorization: Bearer {adminToken}
```

---

## 🎨 Frontend Examples

### Complete Course Purchase Flow

```javascript
// 1. Browse courses
const courses = await fetch("/api/v1/courses").then((r) => r.json());

// 2. View course details
const course = await fetch(`/api/v1/courses/${courseId}`).then((r) => r.json());

// 3. Get available schedules
const schedules = await fetch(
    `/api/v1/courses/${courseId}/training-schedules`
).then((r) => r.json());

// 4. Add to cart
await fetch("/api/v1/cart/add", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        itemType: "course",
        productId: courseId,
        courseSchedule: selectedScheduleId,
    }),
});

// 5. View cart
const cart = await fetch("/api/v1/cart", {
    headers: { Authorization: `Bearer ${token}` },
}).then((r) => r.json());

// 6. Proceed to application
const selectedCourses = cart.data.items
    .filter((item) => item.itemType === "course")
    .map((item) => item.course._id);

const applicationId = await createDraft(selectedCourses);

// 7. Add students
for (const student of students) {
    const userId = await validateStudent(
        student.email,
        student.phone,
        student.name
    );
    await addStudent(applicationId, courseId, { ...student, userId });
}

// 8. Update payment
await updatePayment(applicationId, paymentInfo);

// 9. Submit
await submitApplication(applicationId);
```

---

## ⚠️ Error Handling

All errors follow this format:

```json
{
    "success": false,
    "message": "Error message here",
    "errors": ["Detailed error 1", "Detailed error 2"],
    "stack": "Error stack trace (development only)"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Frontend Error Handling:

```javascript
const apiCall = async (url, options) => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        // Show error to user
        toast.error(error.message);
        throw error;
    }
};
```

---

## 📝 Notes

1. **Authentication**: Most endpoints require `Authorization: Bearer {token}` header
2. **Admin Endpoints**: Require admin token from `/admin/login`
3. **Pagination**: Use `?page=1&limit=10` for paginated endpoints
4. **File Uploads**: Use `Content-Type: multipart/form-data` with FormData
5. **Dates**: Use ISO 8601 format (`2025-01-15T00:00:00.000Z`)
6. **Phone Numbers**: Korean format (`01012345678` - 11 digits)
7. **Prices**: In Korean Won (KRW), integer values

---

## 🚀 Quick Start Checklist

- [ ] Register/Login user
- [ ] Get user token
- [ ] Store token in localStorage
- [ ] Fetch courses
- [ ] Get training schedules
- [ ] Add course to cart
- [ ] Create class application
- [ ] Validate and add students
- [ ] Submit application
- [ ] View enrollments

---

**Generated:** 2025-11-10  
**Total Lines of Code:** ~13,859 lines  
**API Version:** v1.0
