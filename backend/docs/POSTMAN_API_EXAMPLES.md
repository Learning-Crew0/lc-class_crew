# 📮 Postman API Testing Guide - Course Management System

Complete Postman form-data examples for all course management APIs.

---

## 🔐 Authentication

### 1. Admin Login
```
POST http://localhost:5000/api/v1/admin/login
Content-Type: application/json

Body (raw JSON):
{
  "username": "classcrew_admin",
  "password": "admin123"
}

Response:
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {...}
  }
}
```

### 2. User Registration
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

Body (raw JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "테스트 사용자",
  "gender": "male",
  "phone": "01012345678",
  "dob": "1990-01-15",
  "memberType": "job_seeker",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": false
  }
}
```

### 3. User Login
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

Body (raw JSON):
{
  "emailOrUsername": "testuser",
  "password": "password123"
}
```

**📝 Note:** Copy the `token` from login response and use it in Authorization header:
```
Authorization: Bearer <YOUR_TOKEN_HERE>
```

---

## 📂 Category APIs

### 1. Get All Categories (Public)
```
GET http://localhost:5000/api/v1/categories
Query Params:
- page: 1
- limit: 10
- isActive: true
```

### 2. Get Category by ID (Public)
```
GET http://localhost:5000/api/v1/categories/:categoryId
```

### 3. Get Category with Courses (Public)
```
GET http://localhost:5000/api/v1/categories/:categoryId/courses
```

### 4. Create Category (Admin)
```
POST http://localhost:5000/api/v1/categories
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "title": "IT & 프로그래밍",
  "description": "IT 및 소프트웨어 개발 관련 코스",
  "level": 1,
  "order": 1,
  "isActive": true
}
```

### 5. Update Category (Admin)
```
PUT http://localhost:5000/api/v1/categories/:categoryId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "title": "IT & 데이터 사이언스",
  "description": "업데이트된 설명",
  "order": 2
}
```

### 6. Delete Category (Admin)
```
DELETE http://localhost:5000/api/v1/categories/:categoryId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 🎓 Course APIs

### 1. Get All Courses (Public)
```
GET http://localhost:5000/api/v1/courses
Query Params:
- page: 1
- limit: 10
- category: <categoryId>
- level: beginner
- search: 성과관리
- isActive: true
- isFeatured: true
```

### 2. Get Course by ID (Public)
```
GET http://localhost:5000/api/v1/courses/:courseId
```

### 3. Create Course (Admin)
```
POST http://localhost:5000/api/v1/courses
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data

Body (form-data):
Key                    | Type | Value
-----------------------|------|--------------------------------------
title                  | Text | 성과관리 기획 실무
description            | Text | 성과관리의 모든 것을 배우는 코스
shortDescription       | Text | 성과관리 기획 완벽 마스터
longDescription        | Text | 실무에 바로 적용할 수 있는 성과관리 기획 전문 과정
category               | Text | <categoryId> (from created category)
tagText                | Text | 문해력
tagColor               | Text | text-blue-500
tags                   | Text | 환급,모여듣기,얼리버드 할인
price                  | Text | 600000
priceText              | Text | 60만원(중식 및 교재 포함)
date                   | Text | 일정 보기 및 선택
duration               | Text | 12시간(1일차 8시간, 2일차 4시간)
location               | Text | 러닝크루 성수 CLASS
hours                  | Text | 12
target                 | Text | 성과관리 담당자
recommendedAudience    | Text | 재직자,기업교육담당자
learningGoals          | Text | 성과관리 프로세스 이해,KPI 설정 방법
whatYouWillLearn       | Text | 성과관리 체계 수립,목표 설정 실습
requirements           | Text | 기본 업무 경험,노트북 지참
field                  | Text | 인사관리
processName            | Text | 성과관리 실무
refundOptions          | Text | 수강료 100% 환급 가능
level                  | Text | intermediate
language               | Text | Korean
isActive               | Text | true
isFeatured             | Text | false
mainImage              | File | [Select image file: course-main.jpg]
hoverImage             | File | [Select image file: course-hover.jpg]
```

### 4. Update Course (Admin)
```
PUT http://localhost:5000/api/v1/courses/:courseId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data

Body (form-data):
Key                    | Type | Value
-----------------------|------|--------------------------------------
title                  | Text | 업데이트된 코스 제목
price                  | Text | 550000
tags                   | Text | 환급,모여듣기
mainImage              | File | [Select new image file - optional]
hoverImage             | File | [Select new image file - optional]
```

### 5. Delete Course (Admin)
```
DELETE http://localhost:5000/api/v1/courses/:courseId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📅 Training Schedule APIs

### 1. Get All Schedules for Course (Public)
```
GET http://localhost:5000/api/v1/courses/:courseId/training-schedules
```

### 2. Create Training Schedule (Admin)
```
POST http://localhost:5000/api/v1/courses/:courseId/training-schedules
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "scheduleName": "2025년 1월 주말반",
  "startDate": "2025-01-15T09:00:00.000Z",
  "endDate": "2025-01-16T18:00:00.000Z",
  "availableSeats": 30,
  "status": "upcoming",
  "isActive": true
}
```

### 3. Update Training Schedule (Admin)
```
PUT http://localhost:5000/api/v1/courses/:courseId/training-schedules/:scheduleId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "scheduleName": "2025년 1월 주말반 (조기마감)",
  "availableSeats": 25,
  "status": "ongoing"
}
```

### 4. Delete Training Schedule (Admin)
```
DELETE http://localhost:5000/api/v1/courses/:courseId/training-schedules/:scheduleId
Authorization: Bearer <ADMIN_TOKEN>
```

### 5. Enroll in Schedule (User)
```
POST http://localhost:5000/api/v1/courses/:courseId/training-schedules/:scheduleId/enroll
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "amountPaid": 600000,
  "paymentMethod": "card"
}
```

---

## 📚 Curriculum APIs

### 1. Get Curriculum (Public)
```
GET http://localhost:5000/api/v1/courses/:courseId/curriculum
```

### 2. Create/Update Curriculum (Admin)
```
POST http://localhost:5000/api/v1/courses/:courseId/curriculum
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "keywords": ["성과는기획이다", "리더의미션", "성과관리체계"],
  "modules": [
    {
      "name": "성과관리 이해하기",
      "content": "성과관리의 정의\n성과관리 프로세스\n성과관리 사례",
      "order": 1
    },
    {
      "name": "목표 설정 실습",
      "content": "SMART 목표 설정\nKPI 개발\n실습 및 피드백",
      "order": 2
    },
    {
      "name": "성과 평가 및 피드백",
      "content": "평가 기준 설정\n피드백 방법론\n평가 실습",
      "order": 3
    }
  ]
}
```

---

## 👨‍🏫 Instructor APIs

### 1. Get Instructors (Public)
```
GET http://localhost:5000/api/v1/courses/:courseId/instructors
```

### 2. Create Instructor (Admin)
```
POST http://localhost:5000/api/v1/courses/:courseId/instructors
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data

Body (form-data):
Key                    | Type | Value
-----------------------|------|--------------------------------------
name                   | Text | 김성과
bio                    | Text | 20년 경력의 성과관리 전문가
professionalField      | Text | 인사관리, 성과관리, 조직개발
certificates           | Text | 공인노무사,경영지도사,KPI 전문가
attendanceHistory      | Text | 삼성전자,현대자동차,LG전자
education              | Text | 서울대학교 경영학 박사,연세대학교 경영학 석사
profileImage           | File | [Select image file: instructor-profile.jpg]
```

### 3. Update Instructor (Admin)
```
PUT http://localhost:5000/api/v1/courses/:courseId/instructors/:instructorId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data

Body (form-data):
Key                    | Type | Value
-----------------------|------|--------------------------------------
bio                    | Text | 25년 경력의 성과관리 전문가
certificates           | Text | 공인노무사,경영지도사,KPI 전문가,조직문화컨설턴트
profileImage           | File | [Select new image file - optional]
```

### 4. Delete Instructor (Admin)
```
DELETE http://localhost:5000/api/v1/courses/:courseId/instructors/:instructorId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📣 Promotion APIs

### 1. Get Promotions (Public)
```
GET http://localhost:5000/api/v1/courses/:courseId/promotions
```

### 2. Create Promotion (Admin)
```
POST http://localhost:5000/api/v1/courses/:courseId/promotions
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data

Body (form-data):
Key                    | Type | Value
-----------------------|------|--------------------------------------
title                  | Text | 얼리버드 할인 이벤트
description            | Text | 선착순 10명 30% 할인
isActive               | Text | true
displayOrder           | Text | 1
images                 | File | [Select image file 1: promo1.jpg]
images                 | File | [Select image file 2: promo2.jpg]
images                 | File | [Select image file 3: promo3.jpg]
```

**📝 Note:** For multiple images, add multiple `images` fields in form-data with different files.

### 3. Update Promotion (Admin)
```
PUT http://localhost:5000/api/v1/courses/:courseId/promotions/:promotionId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "title": "얼리버드 할인 연장!",
  "isActive": true,
  "displayOrder": 2
}
```

### 4. Delete Promotion/Image (Admin)
```
DELETE http://localhost:5000/api/v1/courses/:courseId/promotions/:promotionId
Authorization: Bearer <ADMIN_TOKEN>

Query Params (optional):
- imageUrl: /uploads/promotions/promo1.jpg
```

**📝 Note:** 
- Without `imageUrl`: Deletes entire promotion
- With `imageUrl`: Deletes specific image from promotion

---

## ⭐ Review APIs

### 1. Get Reviews (Public)
```
GET http://localhost:5000/api/v1/courses/:courseId/reviews
```

### 2. Create Review (Public)
```
POST http://localhost:5000/api/v1/courses/:courseId/reviews
Content-Type: multipart/form-data

Body (form-data):
Key                    | Type | Value
-----------------------|------|--------------------------------------
reviewerName           | Text | 김수강
text                   | Text | 정말 유익한 강의였습니다. 실무에 바로 적용할 수 있는 내용들이 많았고 강사님의 설명이 명쾌했습니다.
rating                 | Text | 5
avatar                 | File | [Select image file: avatar.jpg - optional]
```

### 3. Update Review (Admin - Approval)
```
PUT http://localhost:5000/api/v1/courses/:courseId/reviews/:reviewId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "isApproved": true
}
```

### 4. Delete Review (Admin)
```
DELETE http://localhost:5000/api/v1/courses/:courseId/reviews/:reviewId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📢 Notice APIs

### 1. Get Notice (Public)
```
GET http://localhost:5000/api/v1/courses/:courseId/notice
```

### 2. Create/Update Notice (Admin)
```
POST http://localhost:5000/api/v1/courses/:courseId/notice
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data

Body (form-data):
Key                    | Type | Value
-----------------------|------|--------------------------------------
title                  | Text | 중요 공지사항
noticeDesc             | Text | 코스 일정이 변경되었습니다. 자세한 내용은 이미지를 확인해주세요.
isActive               | Text | true
priority               | Text | 1
expiresAt              | Text | 2025-12-31T23:59:59.000Z
noticeImage            | File | [Select image file: notice.jpg]
```

---

## 🎯 Enrollment APIs

### 1. Get My Enrollments (User)
```
GET http://localhost:5000/api/v1/enrollments
Authorization: Bearer <USER_TOKEN>

Query Params:
- page: 1
- limit: 10
- status: 수강중
```

### 2. Get Enrollment Details (User)
```
GET http://localhost:5000/api/v1/enrollments/:enrollmentId
Authorization: Bearer <USER_TOKEN>
```

### 3. Update Enrollment Status (Admin)
```
PATCH http://localhost:5000/api/v1/enrollments/:enrollmentId/status
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "status": "수강중"
}

Status options: "수강예정" | "수강중" | "수료" | "미수료" | "취소"
```

### 4. Update Progress (User)
```
PATCH http://localhost:5000/api/v1/enrollments/:enrollmentId/progress
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "progress": 75
}
```

### 5. Request Refund (User)
```
POST http://localhost:5000/api/v1/enrollments/:enrollmentId/refund
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "refundReason": "개인 사정으로 인한 수강 취소",
  "refundAmount": 600000
}
```

### 6. Process Refund (Admin)
```
PATCH http://localhost:5000/api/v1/enrollments/:enrollmentId/refund/process
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

Body (raw JSON):
{
  "refundStatus": "approved"
}

Refund status options: "approved" | "rejected" | "completed"
```

### 7. Cancel Enrollment (User)
```
DELETE http://localhost:5000/api/v1/enrollments/:enrollmentId
Authorization: Bearer <USER_TOKEN>
```

---

## 📋 Complete Test Workflow

### Step 1: Setup
1. Login as admin → Get admin token
2. Register as user → Get user token

### Step 2: Create Category (Admin)
```
POST /categories
→ Save categoryId from response
```

### Step 3: Create Course (Admin)
```
POST /courses
Use: categoryId from Step 2
Upload: mainImage, hoverImage
→ Save courseId from response
```

### Step 4: Add Training Schedule (Admin)
```
POST /courses/:courseId/training-schedules
Use: courseId from Step 3
→ Save scheduleId from response
```

### Step 5: Add Curriculum (Admin)
```
POST /courses/:courseId/curriculum
Use: courseId from Step 3
```

### Step 6: Add Instructor (Admin)
```
POST /courses/:courseId/instructors
Use: courseId from Step 3
Upload: profileImage
```

### Step 7: Add Promotions (Admin)
```
POST /courses/:courseId/promotions
Use: courseId from Step 3
Upload: multiple promotion images
```

### Step 8: Add Notice (Admin)
```
POST /courses/:courseId/notice
Use: courseId from Step 3
Upload: noticeImage
```

### Step 9: Browse Courses (Public)
```
GET /courses
GET /courses/:courseId
```

### Step 10: Add Review (Public)
```
POST /courses/:courseId/reviews
Upload: avatar (optional)
```

### Step 11: Enroll in Course (User)
```
POST /courses/:courseId/training-schedules/:scheduleId/enroll
Use: courseId and scheduleId
→ Save enrollmentId from response
```

### Step 12: Track Progress (User)
```
GET /enrollments
PATCH /enrollments/:enrollmentId/progress
```

---

## 🔧 Tips for Testing

### 1. Environment Variables in Postman
Create these variables:
```
baseUrl: http://localhost:5000/api/v1
adminToken: <paste admin token>
userToken: <paste user token>
categoryId: <paste after creating category>
courseId: <paste after creating course>
scheduleId: <paste after creating schedule>
enrollmentId: <paste after enrolling>
```

Use in requests:
```
{{baseUrl}}/courses/{{courseId}}
Authorization: Bearer {{adminToken}}
```

### 2. File Upload in Postman
1. Select "form-data" in Body tab
2. Hover over "Key" field
3. Change dropdown from "Text" to "File"
4. Click "Select Files" button in Value field
5. Choose your file

### 3. Multiple File Upload
For promotions with multiple images:
1. Add key `images` (type: File)
2. Select first file
3. Add another key `images` (type: File)
4. Select second file
5. Repeat for all images

### 4. Testing Array Fields
Arrays can be sent as comma-separated strings:
```
tags: 환급,모여듣기,얼리버드 할인
```
Backend will automatically convert to array.

### 5. Response Status Codes
- `200 OK` - Success (GET, PUT, PATCH)
- `201 Created` - Resource created (POST)
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - No permission
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry
- `500 Internal Server Error` - Server error

---

## 📁 Sample Test Images

For testing, prepare these image files:
- `course-main.jpg` (16:9 ratio, ~1920x1080)
- `course-hover.jpg` (16:9 ratio, ~1920x1080)
- `instructor-profile.jpg` (square, ~500x500)
- `promo1.jpg`, `promo2.jpg`, `promo3.jpg` (various sizes)
- `notice.jpg` (banner style, ~1200x300)
- `avatar.jpg` (square, ~200x200)

---

**Status**: ✅ Ready for Testing  
**Base URL**: `http://localhost:5000/api/v1`  
**Total APIs**: 43 endpoints

