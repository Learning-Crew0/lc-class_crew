# 📚 Class/Course API Endpoints - Quick Reference

**Base URL:** `https://class-crew.onrender.com/api/v1`  
**Date:** November 13, 2025

---

## 📖 Course Management

### Get All Courses

```
GET /courses
GET /public/courses
```

**Auth:** Public  
**Query:** `?category=xxx&search=xxx&page=1&limit=10`

### Get Course by ID

```
GET /courses/:id
```

**Auth:** Public  
**Returns:** Course details, learningGoals, targetAudience, price, images

### Create Course (Admin)

```
POST /courses
```

**Auth:** Admin Required  
**Body:** Course data + images (multipart/form-data)

### Update Course (Admin)

```
PUT /courses/:id
```

**Auth:** Admin Required  
**Body:** Course data + images (multipart/form-data)

### Delete Course (Admin)

```
DELETE /courses/:id
```

**Auth:** Admin Required

---

## 📅 Training Schedules

### Get Course Schedules

```
GET /courses/:courseId/training-schedules
```

**Auth:** Public  
**Returns:** Array of schedules with dates, seats, status

### Create Schedule (Admin)

```
POST /courses/:courseId/training-schedules
```

**Auth:** Admin Required  
**Body:**

```json
{
    "scheduleName": "2024년 3월 정기과정",
    "startDate": "2024-03-15T00:00:00.000Z",
    "endDate": "2024-03-16T23:59:59.000Z",
    "availableSeats": 30,
    "location": "러닝크루 성수 CLASS",
    "status": "upcoming",
    "isActive": true
}
```

### Update Schedule (Admin)

```
PUT /courses/:courseId/training-schedules/:scheduleId
```

**Auth:** Admin Required

### Delete Schedule (Admin)

```
DELETE /courses/:courseId/training-schedules/:scheduleId
```

**Auth:** Admin Required

---

## 📚 Curriculum

### Get Course Curriculum

```
GET /courses/:courseId/curriculum
```

**Auth:** Public  
**Returns:** keywords[], modules[{name, content, order}]

### Create/Update Curriculum (Admin)

```
POST /courses/:courseId/curriculum
```

**Auth:** Admin Required  
**Body:**

```json
{
    "keywords": ["keyword1", "keyword2"],
    "modules": [
        {
            "name": "Module 1",
            "content": "Content line 1\nContent line 2",
            "order": 1
        }
    ]
}
```

---

## 👨‍🏫 Instructors

### Get Course Instructors

```
GET /courses/:courseId/instructors
```

**Auth:** Public  
**Returns:** Array of instructors with education, expertise, certificates, experience

### Create Instructor (Admin)

```
POST /courses/:courseId/instructors
```

**Auth:** Admin Required  
**Body:** (multipart/form-data with optional image)

```json
{
    "name": "정상범",
    "title": "대표 강사",
    "bio": "러닝크루 파트너 강사",
    "education": ["교육 1", "교육 2"],
    "expertise": ["전문분야 1", "전문분야 2"],
    "certificates": ["자격증 1", "자격증 2"],
    "experience": ["경력 1", "경력 2"],
    "order": 0,
    "isActive": true
}
```

### Update Instructor (Admin)

```
PUT /courses/:courseId/instructors/:instructorId
```

**Auth:** Admin Required

### Delete Instructor (Admin)

```
DELETE /courses/:courseId/instructors/:instructorId
```

**Auth:** Admin Required

---

## 🎁 Promotions

### Get Course Promotions

```
GET /courses/:courseId/promotions
```

**Auth:** Public  
**Returns:** Array of promotions with images[]

### Create Promotion (Admin)

```
POST /courses/:courseId/promotions
```

**Auth:** Admin Required  
**Body:** (multipart/form-data with multiple images)

```json
{
    "title": "Promotion Title",
    "description": "Description",
    "images": ["image1.jpg", "image2.jpg"],
    "discountType": "percentage",
    "discountValue": 10,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "isActive": true
}
```

### Update Promotion (Admin)

```
PUT /courses/:courseId/promotions/:promotionId
```

**Auth:** Admin Required

### Delete Promotion (Admin)

```
DELETE /courses/:courseId/promotions/:promotionId
```

**Auth:** Admin Required

---

## 📢 Course Notice

### Get Course Notice

```
GET /courses/:courseId/notice
```

**Auth:** Public  
**Returns:** Notice object with title, content, noticeImage

### Create/Update Notice (Admin)

```
POST /courses/:courseId/notice
```

**Auth:** Admin Required  
**Body:** (multipart/form-data with optional image)

```json
{
    "title": "Notice Title",
    "content": "Notice content",
    "noticeImage": "/uploads/notices/notice.jpg",
    "isActive": true
}
```

---

## ⭐ Course Reviews

### Get Course Reviews

```
GET /courses/:courseId/reviews
```

**Auth:** Public  
**Returns:** Array of reviews with reviewerName, content, rating, avatar

### Create Review

```
POST /courses/:courseId/reviews
```

**Auth:** Optional (can be anonymous)  
**Body:** (multipart/form-data with optional avatar image)

```json
{
    "reviewerName": "홍길동",
    "content": "강의가 매우 유익했습니다.",
    "rating": 5,
    "isActive": true
}
```

### Update Review (Admin)

```
PUT /courses/:courseId/reviews/:reviewId
```

**Auth:** Admin Required

### Delete Review (Admin)

```
DELETE /courses/:courseId/reviews/:reviewId
```

**Auth:** Admin Required

---

## 📝 Enrollments

### Enroll in Schedule

```
POST /courses/:courseId/training-schedules/:scheduleId/enroll
```

**Auth:** User Required  
**Body:**

```json
{
    "paymentMethod": "카드",
    "taxInvoice": "발행"
}
```

### Get My Enrollments

```
GET /enrollments
```

**Auth:** User Required  
**Query:** `?status=수강중&page=1&limit=10`

### Get Enrollment by ID

```
GET /enrollments/:id
```

**Auth:** User Required

### Update Enrollment Status (Admin)

```
PATCH /enrollments/:id/status
```

**Auth:** Admin Required  
**Body:**

```json
{
    "status": "수강중"
}
```

### Update Progress

```
PATCH /enrollments/:id/progress
```

**Auth:** User Required  
**Body:**

```json
{
    "progress": 75
}
```

### Request Refund

```
POST /enrollments/:id/refund
```

**Auth:** User Required  
**Body:**

```json
{
    "refundReason": "개인사유"
}
```

### Process Refund (Admin)

```
PATCH /enrollments/:id/refund/process
```

**Auth:** Admin Required  
**Body:**

```json
{
    "status": "approved",
    "processedBy": "admin-id"
}
```

### Cancel Enrollment

```
DELETE /enrollments/:id
```

**Auth:** User Required

---

## 🛒 Shopping Cart

### Get Cart

```
GET /cart
```

**Auth:** User Required

### Add to Cart

```
POST /cart/add
```

**Auth:** User Required  
**Body:**

```json
{
    "itemType": "course",
    "productId": "course-id",
    "courseSchedule": "schedule-id",
    "quantity": 1
}
```

### Update Cart Item

```
PUT /cart/update/:productId
```

**Auth:** User Required  
**Body:**

```json
{
    "quantity": 2
}
```

### Remove from Cart

```
DELETE /cart/remove/:productId
```

**Auth:** User Required  
**Query:** `?itemType=course&scheduleId=xxx`

### Get Selected Courses for Application

```
POST /cart/get-selected-courses
```

**Auth:** User Required  
**Body:**

```json
{
    "selectedProductIds": ["id1", "id2"]
}
```

### Clear Cart

```
DELETE /cart/clear
```

**Auth:** User Required

---

## 📂 Categories

### Get All Categories

```
GET /categories
```

**Auth:** Public

### Get Category by ID

```
GET /categories/:id
```

**Auth:** Public

### Get Category with Courses

```
GET /categories/:id/courses
```

**Auth:** Public

### Create Category (Admin)

```
POST /categories
```

**Auth:** Admin Required

### Update Category (Admin)

```
PUT /categories/:id
```

**Auth:** Admin Required

### Delete Category (Admin)

```
DELETE /categories/:id
```

**Auth:** Admin Required

---

## 🎨 Banners

### Get Homepage Banners

```
GET /public/banners?position=home-hero
```

**Auth:** Public  
**Positions:** home-hero, home-secondary, courses, products, sidebar

### Create Banner (Admin)

```
POST /admin/banners
```

**Auth:** Admin Required

### Update Banner (Admin)

```
PUT /admin/banners/:id
```

**Auth:** Admin Required

### Delete Banner (Admin)

```
DELETE /admin/banners/:id
```

**Auth:** Admin Required

---

## 🔗 Complete User Flow

```
1. Browse Courses
   GET /courses

2. View Course Detail
   GET /courses/:id
   GET /courses/:id/training-schedules
   GET /courses/:id/curriculum
   GET /courses/:id/instructors
   GET /courses/:id/promotions
   GET /courses/:id/reviews
   GET /courses/:id/notice

3. Add to Cart
   POST /cart/add

4. View Cart
   GET /cart

5. Proceed to Application
   POST /cart/get-selected-courses

6. Enroll
   POST /courses/:id/training-schedules/:scheduleId/enroll

7. View Enrollments
   GET /enrollments
```

---

## 📝 Quick Examples

### Get Course with ID

```bash
curl https://class-crew.onrender.com/api/v1/courses/691580448efde7ad4ecc5032
```

### Get Training Schedules

```bash
curl https://class-crew.onrender.com/api/v1/courses/691580448efde7ad4ecc5032/training-schedules
```

### Add Course to Cart (with auth)

```bash
curl -X POST https://class-crew.onrender.com/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "course",
    "productId": "691580448efde7ad4ecc5032",
    "courseSchedule": "schedule-id"
  }'
```

### Create Training Schedule (admin)

```bash
curl -X POST https://class-crew.onrender.com/api/v1/courses/COURSE_ID/training-schedules \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduleName": "2024년 3월 정기과정",
    "startDate": "2024-03-15T00:00:00.000Z",
    "endDate": "2024-03-16T23:59:59.000Z",
    "availableSeats": 30,
    "isActive": true
  }'
```

---

## 🔑 Authentication

### Public Endpoints (No Auth)

- All GET course APIs
- GET curriculum, instructors, promotions, reviews, notice
- GET banners
- GET categories

### User Auth Required

- POST /cart/add
- GET /cart
- POST enrollment
- GET /enrollments

### Admin Auth Required

- POST/PUT/DELETE courses
- POST/PUT/DELETE schedules
- POST/PUT/DELETE curriculum
- POST/PUT/DELETE instructors
- POST/PUT/DELETE promotions
- POST/PUT/DELETE reviews
- POST/PUT/DELETE notices
- POST/PUT/DELETE banners

---

## 📊 Response Format

All endpoints return:

```json
{
    "success": true,
    "message": "Success message in Korean",
    "data": {
        /* response data */
    },
    "pagination": {
        /* if applicable */
    }
}
```

Error format:

```json
{
    "success": false,
    "message": "Error message",
    "errors": ["Detailed error 1", "Detailed error 2"]
}
```

---

**Status:** ✅ All APIs Implemented  
**Last Updated:** November 13, 2025  
**Total Endpoints:** 45+



