# 🔐 Complete Admin API Routes Reference

All admin endpoints with clear authentication requirements.

**Base URL:** `http://localhost:5000/api/v1`

**Authentication Levels:**

- 🌐 **PUBLIC** - No authentication required
- 🔑 **USER** - Requires `Authorization: Bearer {userToken}` (any logged-in user)
- 🛡️ **ADMIN** - Requires `Authorization: Bearer {adminToken}` (admin only)

---

## 📋 Quick Navigation

- [Authentication](#authentication)
- [Admin Management](#admin-management)
- [User Management](#user-management)
- [Category Management](#category-management)
- [Course Management](#course-management)
- [Training Schedule Management](#training-schedule-management)
- [Curriculum Management](#curriculum-management)
- [Instructor Management](#instructor-management)
- [Promotions Management](#promotions-management)
- [Course Reviews Management](#course-reviews-management)
- [Course Notice Management](#course-notice-management)
- [Product Management](#product-management)
- [Shopping Cart](#shopping-cart)
- [Class Applications](#class-applications)
- [Enrollments Management](#enrollments-management)
- [Announcements Management](#announcements-management)
- [FAQs Management](#faqs-management)
- [Inquiry Management](#inquiry-management)
- [Notice Management](#notice-management)
- [Banner Management](#banner-management)
- [File Upload Management](#file-upload-management)
- [Settings Management](#settings-management)
- [Course History](#course-history)

---

## 🔑 Authentication

### Admin Login (Public)

```
🌐 POST   /admin/login
Body: {
  "email": "admin@lcclasscrew.com",
  "password": "changeme123"
}
```

**Response:**

```json
{
    "success": true,
    "message": "관리자 로그인 성공",
    "data": {
        "token": "eyJhbGci...",
        "refreshToken": "eyJhbGci...",
        "admin": {
            "_id": "...",
            "email": "admin@lcclasscrew.com",
            "username": "admin",
            "fullName": "Admin User",
            "role": "admin"
        }
    }
}
```

### User Login (Public)

```
🌐 POST   /auth/login
Body: {
  "identifier": "user@example.com",
  "password": "password123"
}
```

### User Registration (Public)

```
🌐 POST   /auth/register
Body: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "phone": "01012345678",
  "gender": "male",
  "dob": "1990-01-01",
  "memberType": "job_seeker",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true
  }
}
```

### Password Reset & Find ID (Public)

```
🌐 POST   /auth/find-id
Body: { "name": "홍길동", "phoneNumber": "01012345678" }

🌐 POST   /auth/password-reset/initiate
Body: { "name": "홍길동", "phoneNumber": "01012345678" }

🌐 POST   /auth/password-reset/verify-code
Body: { "sessionId": "...", "verificationCode": "123456" }

🌐 POST   /auth/password-reset/reset
Body: { "resetToken": "...", "newPassword": "newPassword123" }
```

### Admin Profile Management

```
🛡️ GET    /admin/profile
🛡️ PUT    /admin/password
Body: { "currentPassword": "old", "newPassword": "new" }
```

---

## 👨‍💼 Admin Management

**All routes require 🛡️ ADMIN authentication**

### List All Admins

```
🛡️ GET    /admin/admins?page=1&limit=10
```

### Get Admin by ID

```
🛡️ GET    /admin/admins/:id
```

### Create New Admin

```
🛡️ POST   /admin/admins
Body: {
  "email": "newadmin@example.com",
  "password": "password123",
  "fullName": "New Admin",
  "username": "newadmin",
  "role": "admin"
}
```

### Update Admin

```
🛡️ PUT    /admin/admins/:id
Body: {
  "fullName": "Updated Name",
  "email": "updated@example.com"
}
```

### Delete Admin

```
🛡️ DELETE /admin/admins/:id
```

### Update Admin Status

```
🛡️ PATCH  /admin/admins/:id/status
Body: { "isActive": true }
```

---

## 👥 User Management

**All routes require 🛡️ ADMIN authentication**

### List All Users

```
🛡️ GET    /admin/users?page=1&limit=20&memberType=job_seeker&search=John
```

### Get User by ID

```
🛡️ GET    /admin/users/:id
```

### Create New User

```
🛡️ POST   /admin/users
Body: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "phone": "01012345678",
  "gender": "male",
  "dob": "1990-01-01",
  "memberType": "job_seeker",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true
  }
}
```

### Update User

```
🛡️ PUT    /admin/users/:id
Body: {
  "fullName": "Updated Name",
  "phone": "01098765432",
  "isActive": true
}
```

### Delete User

```
🛡️ DELETE /admin/users/:id
```

---

## 📁 Category Management

**Base Path:** `/categories`

### Public Routes

```
🌐 GET    /categories
         Get all categories (public)
         Query: ?page=1&limit=20&isActive=true

🌐 GET    /categories/:id
         Get category by ID (public)

🌐 GET    /categories/:id/courses
         Get category with all its courses (public)
```

### Admin Routes

```
🛡️ POST   /categories
         Create new category
         Body: {
           "title": "Programming",
           "description": "Programming courses",
           "parentCategory": null,
           "level": 1,
           "order": 0,
           "isActive": true
         }

🛡️ PUT    /categories/:id
         Update category
         Body: {
           "title": "Updated Title",
           "description": "Updated description",
           "order": 1
         }

🛡️ DELETE /categories/:id
         Delete category
         Note: Only if no courses are assigned
```

---

## 📚 Course Management

### Public Routes

```
🌐 GET    /courses
         Get all courses (public)
         Query: ?page=1&limit=20&category=programming&isActive=true&isFeatured=true

🌐 GET    /courses/:id
         Get course details (public)
```

### Admin Routes

```
🛡️ GET    /admin/courses
         Get all courses (admin view with all statuses)

🛡️ GET    /admin/courses/:id
         Get course by ID (admin view)

🛡️ POST   /admin/courses
         Create course
         Content-Type: multipart/form-data
         Fields:
           - title: "Python Programming"
           - description: "Complete Python course"
           - category: "programming"
           - level: "beginner"
           - price: 50000
           - hours: 40
           - language: "none"
           - instructor: "강사명"
           - mainImage: [file]
           - hoverImage: [file]
           - promotionImages: [file1, file2]
           - isActive: true
           - isFeatured: true

🛡️ PUT    /admin/courses/:id
         Update course
         Body: {
           "title": "Updated Title",
           "price": 60000,
           "isActive": true
         }

🛡️ DELETE /admin/courses/:id
         Delete course
```

---

## 📅 Training Schedule Management

**Base Path:** `/courses/:courseId/training-schedules`

### Public Routes

```
🌐 GET    /courses/:courseId/training-schedules
         Get all schedules for a course (public)
         Query: ?status=upcoming&isActive=true
```

### Admin Routes

```
🛡️ POST   /courses/:courseId/training-schedules
         Create training schedule
         Body: {
           "scheduleName": "2025년 1월 3주차",
           "startDate": "2025-01-15",
           "endDate": "2025-01-16",
           "availableSeats": 30,
           "status": "upcoming",
           "isActive": true
         }

🛡️ PUT    /courses/:courseId/training-schedules/:scheduleId
         Update training schedule
         Body: {
           "scheduleName": "Updated Schedule",
           "availableSeats": 40,
           "status": "ongoing"
         }

🛡️ DELETE /courses/:courseId/training-schedules/:scheduleId
         Delete training schedule
```

---

## 📖 Curriculum Management

**Base Path:** `/courses/:courseId/curriculum`

### Public Routes

```
🌐 GET    /courses/:courseId/curriculum
         Get course curriculum (public)
```

### Admin Routes

```
🛡️ POST   /courses/:courseId/curriculum
         Add curriculum item
         Body: {
           "title": "Introduction to Python",
           "description": "Learn Python basics",
           "order": 1,
           "duration": 120,
           "isFree": false
         }

🛡️ PUT    /courses/:courseId/curriculum/:curriculumId
         Update curriculum item

🛡️ DELETE /courses/:courseId/curriculum/:curriculumId
         Delete curriculum item
```

---

## 👨‍🏫 Instructor Management

**Base Path:** `/courses/:courseId/instructors`

### Public Routes

```
🌐 GET    /courses/:courseId/instructors
         Get course instructors (public)
```

### Admin Routes

```
🛡️ POST   /courses/:courseId/instructors
         Add instructor
         Body: {
           "name": "John Doe",
           "title": "Senior Developer",
           "bio": "Expert in Python",
           "profileImage": "url",
           "expertise": ["Python", "Django"],
           "order": 1
         }

🛡️ PUT    /courses/:courseId/instructors/:instructorId
         Update instructor

🛡️ DELETE /courses/:courseId/instructors/:instructorId
         Remove instructor
```

---

## 🎁 Promotions Management

**Base Path:** `/courses/:courseId/promotions`

### Public Routes

```
🌐 GET    /courses/:courseId/promotions
         Get course promotions (public)
```

### Admin Routes

```
🛡️ POST   /courses/:courseId/promotions
         Create promotion
         Body: {
           "title": "Early Bird Discount",
           "description": "Save 20%",
           "discountType": "percentage",
           "discountValue": 20,
           "startDate": "2025-01-01",
           "endDate": "2025-01-31",
           "isActive": true
         }

🛡️ PUT    /courses/:courseId/promotions/:promotionId
         Update promotion

🛡️ DELETE /courses/:courseId/promotions/:promotionId
         Delete promotion
```

---

## ⭐ Course Reviews Management

**Base Path:** `/courses/:courseId/reviews`

### Public Routes

```
🌐 GET    /courses/:courseId/reviews
         Get course reviews (public)
         Query: ?page=1&limit=10&sort=rating
```

### User Routes

```
🔑 POST   /courses/:courseId/reviews
         Create review (enrolled users only)
         Body: {
           "rating": 5,
           "comment": "Excellent course!",
           "courseId": "..."
         }

🔑 PUT    /courses/:courseId/reviews/:reviewId
         Update own review

🔑 DELETE /courses/:courseId/reviews/:reviewId
         Delete own review
```

---

## 📢 Course Notice Management

**Base Path:** `/courses/:courseId/notice`

### Public Routes

```
🌐 GET    /courses/:courseId/notice
         Get course notice (public)
```

### Admin Routes

```
🛡️ POST   /courses/:courseId/notice
         Create/update course notice
         Body: {
           "title": "Important Update",
           "content": "Class schedule changed...",
           "isActive": true
         }
```

---

## 🛍️ Product Management

### Public Routes

```
🌐 GET    /products
         Get all products (public)
         Query: ?page=1&limit=20&category=books&isActive=true

🌐 GET    /products/:id
         Get product by ID (public)
```

### Admin Routes

```
🛡️ GET    /admin/products
         Get all products (admin view)

🛡️ GET    /admin/products/:id
         Get product by ID (admin view)

🛡️ POST   /admin/products
         Create product
         Body: {
           "name": "Python Programming Book",
           "description": "Comprehensive guide",
           "category": "books",
           "price": 25000,
           "stock": 100,
           "images": ["url1", "url2"],
           "isActive": true,
           "isFeatured": false
         }

🛡️ PUT    /admin/products/:id
         Update product
         Body: {
           "name": "Updated Name",
           "price": 30000,
           "stock": 150
         }

🛡️ DELETE /admin/products/:id
         Delete product
```

---

## 🛒 Shopping Cart

**All routes require 🔑 USER authentication**

```
🔑 GET    /cart
         Get user's cart

🔑 POST   /cart/add
         Add item to cart
         Body: {
           "itemType": "course",
           "course": "courseId",
           "courseSchedule": "scheduleId",
           "quantity": 1
         }
         OR
         Body: {
           "itemType": "product",
           "product": "productId",
           "quantity": 2
         }

🔑 PUT    /cart/update/:itemId
         Update cart item quantity
         Body: { "quantity": 3 }

🔑 DELETE /cart/remove/:itemId
         Remove item from cart

🔑 POST   /cart/clear
         Clear entire cart

🔑 POST   /cart/clear/courses
         Clear only course items
```

---

## 📝 Class Applications

### User Routes

```
🔑 POST   /class-applications/draft
         Create draft application
         Body: {
           "courses": []
         }

🔑 POST   /class-applications/:applicationId/validate-student
         Validate student
         Body: {
           "email": "student@example.com",
           "phone": "01012345678",
           "name": "학생이름"
         }

🔑 POST   /class-applications/:applicationId/courses/:courseId/students
         Add student to course
         Body: {
           "userId": "studentUserId",
           "email": "student@example.com",
           "phone": "01012345678",
           "name": "학생이름"
         }

🔑 POST   /class-applications/:applicationId/courses/:courseId/bulk-upload
         Upload bulk students (Excel)
         Content-Type: multipart/form-data
         Field: participantsFile

🔑 PUT    /class-applications/:applicationId/payment
         Update payment info
         Body: {
           "paymentMethod": "card_payment",
           "paymentType": "personal",
           "invoiceManager": {
             "name": "Manager Name",
             "email": "manager@example.com",
             "phone": "01012345678"
           }
         }

🔑 POST   /class-applications/:applicationId/submit
         Submit application
         Body: {
           "agreements": {
             "paymentAndRefundPolicy": true,
             "refundPolicy": true
           }
         }

🔑 GET    /class-applications
         Get user's applications
         Query: ?status=submitted&page=1&limit=10

🔑 POST   /class-applications/:applicationId/cancel
         Cancel application

🔑 GET    /class-applications/bulk-template
         Download Excel template for bulk upload
```

---

## 🎓 Enrollments Management

### User Routes

```
🔑 GET    /enrollments
         Get my enrollments
         Query: ?status=active&page=1&limit=20

🔑 GET    /enrollments/:id
         Get enrollment details
```

### Admin Routes

```
🛡️ PATCH  /enrollments/:id/approve
         Approve enrollment
         Body: { "notes": "Approved" }

🛡️ PATCH  /enrollments/:id/reject
         Reject enrollment
         Body: { "reason": "Insufficient documents" }

🛡️ POST   /enrollments/:id/completion
         Mark as completed
         Body: {
           "completionDate": "2025-01-31",
           "grade": "A",
           "certificateIssued": true
         }

🛡️ PATCH  /enrollments/:id/cancel
         Cancel enrollment
         Body: { "reason": "User request" }

🛡️ DELETE /enrollments/:id
         Delete enrollment
```

---

## 📢 Announcements Management

### Public Routes

```
🌐 GET    /announcements
         Get all announcements (public)
         Query: ?page=1&limit=10&status=published&category=notice

🌐 GET    /announcements/:id
         Get announcement by ID (public/optional auth)
```

### Admin Routes

```
🛡️ POST   /announcements
         Create announcement
         Content-Type: multipart/form-data
         Fields:
           - title: "Important Notice"
           - content: "Please note..."
           - category: "notice"
           - authorName: "Admin Team"
           - tags: ["training", "schedule"]
           - isImportant: true
           - isPinned: false
           - status: "published"
           - attachments: [file1, file2]

🛡️ PUT    /announcements/:id
         Update announcement

🛡️ DELETE /announcements/:id
         Delete announcement

🛡️ PATCH  /announcements/:id/pin
         Toggle pin status
         Body: { "isPinned": true }

🛡️ DELETE /announcements/bulk-delete
         Bulk delete announcements
         Body: { "ids": ["id1", "id2", "id3"] }

🛡️ POST   /announcements/:id/attachments
         Add attachment
         Content-Type: multipart/form-data

🛡️ GET    /announcements/:id/attachments/:attachmentId
         Get attachment

🛡️ DELETE /announcements/:id/attachments/:attachmentId
         Delete attachment
```

---

## ❓ FAQs Management

### Public Routes

```
🌐 GET    /faqs
         Get all FAQs (public)
         Query: ?page=1&limit=20&category=payment&isActive=true

🌐 GET    /faqs/category/:categoryKey
         Get FAQs by category
         Example: /faqs/category/signup-login

🌐 GET    /faqs/:id
         Get FAQ by ID (public)
```

### Admin Routes

```
🛡️ GET    /admin/faqs
         Get all FAQs (admin view)

🛡️ GET    /admin/faqs/:id
         Get FAQ by ID (admin view)

🛡️ POST   /admin/faqs
         Create FAQ
         Body: {
           "question": "How do I reset my password?",
           "answer": "Click on 'Forgot Password'...",
           "category": "account",
           "tags": ["password", "reset"],
           "order": 1,
           "isActive": true,
           "isFeatured": false
         }

🛡️ PUT    /admin/faqs/:id
         Update FAQ
         Body: {
           "question": "Updated question?",
           "answer": "Updated answer",
           "order": 2
         }

🛡️ DELETE /admin/faqs/:id
         Delete FAQ
```

---

## 💬 Inquiry Management

**All admin routes require 🛡️ ADMIN authentication**

```
🛡️ GET    /admin/inquiries
         Get all inquiries
         Query: ?page=1&limit=20&status=pending

🛡️ GET    /admin/inquiries/:id
         Get inquiry by ID

🛡️ DELETE /admin/inquiries/:id
         Delete inquiry
```

---

## 📰 Notice Management

**All admin routes require 🛡️ ADMIN authentication**

```
🛡️ GET    /admin/notices
         Get all notices

🛡️ GET    /admin/notices/:id
         Get notice by ID

🛡️ POST   /admin/notices
         Create notice
         Body: {
           "title": "System Maintenance",
           "content": "System will be down...",
           "category": "system",
           "isPinned": true,
           "isActive": true
         }

🛡️ PUT    /admin/notices/:id
         Update notice

🛡️ DELETE /admin/notices/:id
         Delete notice
```

---

## 🎨 Banner Management

**All admin routes require 🛡️ ADMIN authentication**

```
🛡️ GET    /admin/banners
         Get all banners

🛡️ GET    /admin/banners/:id
         Get banner by ID

🛡️ POST   /admin/banners
         Create banner
         Body: {
           "title": "Summer Sale",
           "description": "Get 50% off",
           "imageUrl": "https://...",
           "linkUrl": "/courses",
           "position": "home-hero",
           "order": 1,
           "isActive": true,
           "startDate": "2024-06-01",
           "endDate": "2024-08-31"
         }

🛡️ PUT    /admin/banners/:id
         Update banner

🛡️ DELETE /admin/banners/:id
         Delete banner
```

---

## 📤 File Upload Management

**All routes require 🛡️ ADMIN authentication**

### Upload Single File

```
🛡️ POST   /admin/uploads/single
         Content-Type: multipart/form-data
         Field: file

         Response: {
           "success": true,
           "data": {
             "filename": "file-1234567890.jpg",
             "url": "/uploads/temp/file-1234567890.jpg",
             "size": 123456,
             "mimetype": "image/jpeg"
           }
         }
```

### Upload Multiple Files

```
🛡️ POST   /admin/uploads/multiple
         Content-Type: multipart/form-data
         Fields: files (array, max 10)

         Response: {
           "success": true,
           "data": {
             "files": [...]
           }
         }
```

### File Operations

```
🛡️ GET    /admin/uploads/:filename
         Get file info

🛡️ DELETE /admin/uploads/:filename
         Delete file
```

---

## ⚙️ Settings Management

### Public Route

```
🌐 GET    /settings
         Get all public settings
```

### Admin Routes

```
🛡️ GET    /admin/settings
         Get all settings (admin view)

🛡️ GET    /admin/settings/:key
         Get setting by key

🛡️ POST   /admin/settings
         Create setting
         Body: {
           "key": "site_name",
           "value": "ClassCrew Learning Platform",
           "type": "string",
           "category": "general",
           "description": "Name of the website"
         }

🛡️ PUT    /admin/settings/:key
         Update setting
         Body: {
           "value": "New Site Name",
           "description": "Updated description"
         }

🛡️ DELETE /admin/settings/:key
         Delete setting
```

---

## 📜 Course History

**All routes require 🔑 USER authentication**

```
🔑 GET    /course-history
         Get user's course history
         Query: ?page=1&limit=20&status=completed

🔑 GET    /course-history/:id
         Get specific course history entry

🔑 GET    /course-history/certificate/:enrollmentId
         Get certificate for completed course
```

---

## 📊 Complete Endpoint Summary

### Total Endpoints by Category

| Category            | Public | User | Admin | Total |
| ------------------- | ------ | ---- | ----- | ----- |
| Authentication      | 6      | 0    | 3     | 9     |
| Admin Management    | 0      | 0    | 6     | 6     |
| User Management     | 0      | 0    | 5     | 5     |
| Category Management | 3      | 0    | 3     | 6     |
| Course Management   | 2      | 0    | 5     | 7     |
| Training Schedules  | 1      | 0    | 3     | 4     |
| Curriculum          | 1      | 0    | 3     | 4     |
| Instructors         | 1      | 0    | 3     | 4     |
| Promotions          | 1      | 0    | 3     | 4     |
| Course Reviews      | 1      | 3    | 0     | 4     |
| Course Notice       | 1      | 0    | 1     | 2     |
| Product Management  | 2      | 0    | 5     | 7     |
| Shopping Cart       | 0      | 6    | 0     | 6     |
| Class Applications  | 0      | 9    | 0     | 9     |
| Enrollments         | 0      | 2    | 5     | 7     |
| Announcements       | 2      | 0    | 8     | 10    |
| FAQs                | 3      | 0    | 5     | 8     |
| Inquiry Management  | 0      | 0    | 3     | 3     |
| Notice Management   | 0      | 0    | 5     | 5     |
| Banner Management   | 0      | 0    | 5     | 5     |
| File Uploads        | 0      | 0    | 4     | 4     |
| Settings            | 1      | 0    | 5     | 6     |
| Course History      | 0      | 3    | 0     | 3     |

**Grand Total:** **130 Endpoints**

- 🌐 Public: 25
- 🔑 User: 23
- 🛡️ Admin: 82

---

## 🔐 Admin-Only Routes (requireAdmin Middleware)

All routes under `/admin/*` require admin authentication:

### Authentication & Profile

- POST `/admin/login` - ❌ No auth (login endpoint)
- GET `/admin/profile` - ✅ requireAdmin
- PUT `/admin/password` - ✅ requireAdmin

### Admin Management (6 routes)

- GET `/admin/admins` - ✅ requireAdmin
- GET `/admin/admins/:id` - ✅ requireAdmin
- POST `/admin/admins` - ✅ requireAdmin
- PUT `/admin/admins/:id` - ✅ requireAdmin
- DELETE `/admin/admins/:id` - ✅ requireAdmin
- PATCH `/admin/admins/:id/status` - ✅ requireAdmin

### User Management (5 routes)

- GET `/admin/users` - ✅ requireAdmin
- GET `/admin/users/:id` - ✅ requireAdmin
- POST `/admin/users` - ✅ requireAdmin
- PUT `/admin/users/:id` - ✅ requireAdmin
- DELETE `/admin/users/:id` - ✅ requireAdmin

### Category Management (3 routes)

- POST `/categories` - ✅ requireAdmin
- PUT `/categories/:id` - ✅ requireAdmin
- DELETE `/categories/:id` - ✅ requireAdmin

### Course Management (5 routes)

- GET `/admin/courses` - ✅ requireAdmin
- GET `/admin/courses/:id` - ✅ requireAdmin
- POST `/admin/courses` - ✅ requireAdmin
- PUT `/admin/courses/:id` - ✅ requireAdmin
- DELETE `/admin/courses/:id` - ✅ requireAdmin

### Training Schedules (3 routes)

- POST `/courses/:courseId/training-schedules` - ✅ requireAdmin
- PUT `/courses/:courseId/training-schedules/:scheduleId` - ✅ requireAdmin
- DELETE `/courses/:courseId/training-schedules/:scheduleId` - ✅ requireAdmin

### Curriculum (3 routes)

- POST `/courses/:courseId/curriculum` - ✅ requireAdmin
- PUT `/courses/:courseId/curriculum/:curriculumId` - ✅ requireAdmin
- DELETE `/courses/:courseId/curriculum/:curriculumId` - ✅ requireAdmin

### Instructors (3 routes)

- POST `/courses/:courseId/instructors` - ✅ requireAdmin
- PUT `/courses/:courseId/instructors/:instructorId` - ✅ requireAdmin
- DELETE `/courses/:courseId/instructors/:instructorId` - ✅ requireAdmin

### Promotions (3 routes)

- POST `/courses/:courseId/promotions` - ✅ requireAdmin
- PUT `/courses/:courseId/promotions/:promotionId` - ✅ requireAdmin
- DELETE `/courses/:courseId/promotions/:promotionId` - ✅ requireAdmin

### Course Notice (1 route)

- POST `/courses/:courseId/notice` - ✅ requireAdmin

### Products (5 routes)

- GET `/admin/products` - ✅ requireAdmin
- GET `/admin/products/:id` - ✅ requireAdmin
- POST `/admin/products` - ✅ requireAdmin
- PUT `/admin/products/:id` - ✅ requireAdmin
- DELETE `/admin/products/:id` - ✅ requireAdmin

### Enrollments (5 routes)

- PATCH `/enrollments/:id/approve` - ✅ requireAdmin
- PATCH `/enrollments/:id/reject` - ✅ requireAdmin
- POST `/enrollments/:id/completion` - ✅ requireAdmin
- PATCH `/enrollments/:id/cancel` - ✅ requireAdmin
- DELETE `/enrollments/:id` - ✅ requireAdmin

### Announcements (8 routes)

- POST `/announcements` - ✅ requireAdmin
- PUT `/announcements/:id` - ✅ requireAdmin
- DELETE `/announcements/:id` - ✅ requireAdmin
- PATCH `/announcements/:id/pin` - ✅ requireAdmin
- DELETE `/announcements/bulk-delete` - ✅ requireAdmin
- POST `/announcements/:id/attachments` - ✅ requireAdmin
- GET `/announcements/:id/attachments/:attachmentId` - ✅ requireAdmin
- DELETE `/announcements/:id/attachments/:attachmentId` - ✅ requireAdmin

### FAQs (5 routes)

- GET `/admin/faqs` - ✅ requireAdmin
- GET `/admin/faqs/:id` - ✅ requireAdmin
- POST `/admin/faqs` - ✅ requireAdmin
- PUT `/admin/faqs/:id` - ✅ requireAdmin
- DELETE `/admin/faqs/:id` - ✅ requireAdmin

### Inquiries (3 routes)

- GET `/admin/inquiries` - ✅ requireAdmin
- GET `/admin/inquiries/:id` - ✅ requireAdmin
- DELETE `/admin/inquiries/:id` - ✅ requireAdmin

### Notices (5 routes)

- GET `/admin/notices` - ✅ requireAdmin
- GET `/admin/notices/:id` - ✅ requireAdmin
- POST `/admin/notices` - ✅ requireAdmin
- PUT `/admin/notices/:id` - ✅ requireAdmin
- DELETE `/admin/notices/:id` - ✅ requireAdmin

### Banners (5 routes)

- GET `/admin/banners` - ✅ requireAdmin
- GET `/admin/banners/:id` - ✅ requireAdmin
- POST `/admin/banners` - ✅ requireAdmin
- PUT `/admin/banners/:id` - ✅ requireAdmin
- DELETE `/admin/banners/:id` - ✅ requireAdmin

### File Uploads (4 routes)

- POST `/admin/uploads/single` - ✅ requireAdmin
- POST `/admin/uploads/multiple` - ✅ requireAdmin
- GET `/admin/uploads/:filename` - ✅ requireAdmin
- DELETE `/admin/uploads/:filename` - ✅ requireAdmin

### Settings (5 routes)

- GET `/admin/settings` - ✅ requireAdmin
- GET `/admin/settings/:key` - ✅ requireAdmin
- POST `/admin/settings` - ✅ requireAdmin
- PUT `/admin/settings/:key` - ✅ requireAdmin
- DELETE `/admin/settings/:key` - ✅ requireAdmin

**Total Admin-Only Routes: 82**

---

## 🧪 Quick Test Script (cURL)

```bash
# 1. Admin Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lcclasscrew.com","password":"changeme123"}' \
  | jq -r '.data.token')

echo "Admin Token: $TOKEN"

# 2. Get Admin Profile
curl -X GET http://localhost:5000/api/v1/admin/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. List Categories (Public)
curl -X GET http://localhost:5000/api/v1/categories

# 4. Create Category (Admin)
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Programming",
    "description": "Programming courses",
    "level": 1,
    "order": 0
  }'

# 5. List Users (Admin)
curl -X GET "http://localhost:5000/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# 6. List Courses (Admin)
curl -X GET "http://localhost:5000/api/v1/admin/courses?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# 7. List Products (Admin)
curl -X GET "http://localhost:5000/api/v1/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔐 Default Admin Credentials

```
Email:    admin@lcclasscrew.com
Password: changeme123
```

**⚠️ IMPORTANT:** Change the default password immediately after first login!

To change password:

```bash
curl -X PUT http://localhost:5000/api/v1/admin/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "changeme123",
    "newPassword": "YourNewSecurePassword123!"
  }'
```

---

## 📚 Additional Resources

- **Frontend Integration Guide:** `FRONTEND_REQUIREMENTS_ADMIN_LOGIN.md`
- **Admin Login Fix Guide:** `frontend-integration-guides/ADMIN_LOGIN_FIX.md`
- **Complete Admin Guide:** `frontend-integration-guides/13-admin.md`
- **Postman Collection:** `ClassCrew_Complete_API_Collection_v2.postman_collection.json`

---

## 📝 Notes

### Authentication Middleware Hierarchy

1. **No Authentication** - Public endpoints (🌐)
2. **authenticate** - Requires valid JWT token (any user) (🔑)
3. **authenticate + requireAdmin** - Requires admin JWT token (🛡️)

### Route Pattern

```javascript
// Public route
router.get("/categories", controller.getAllCategories);

// User route (requires login)
router.get("/cart", authenticate, controller.getCart);

// Admin route (requires admin)
router.post(
    "/categories",
    authenticate,
    requireAdmin,
    controller.createCategory
);

// All admin/* routes have blanket requireAdmin
router.use("/admin", adminRoutes); // adminRoutes has: router.use(authenticate, requireAdmin)
```

### File Upload Limits

- Single file: 10 MB
- Multiple files: 10 MB per file, max 10 files
- Excel files: 5 MB

### Pagination

Most list endpoints support pagination:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

---

**Last Updated:** 2025-11-11  
**Total Endpoints:** 130 (25 Public, 23 User, 82 Admin)  
**Status:** ✅ Production Ready
