# 🎓 Course Management System - Complete Documentation

## 📋 Overview

Complete course management system for ClassCrew platform with comprehensive CRUD operations, file uploads, and enrollment tracking.

---

## 🗂 File Storage Configuration

### Storage Path

- **Production**: `/var/data/files` (mounted disk on Render)
- **Development**: `backend/uploads`

### Folder Structure

```
/var/data/files/
├── courses/          # Course images (mainImage, hoverImage)
├── instructors/      # Instructor profile images
├── promotions/       # Promotional images (multiple per course)
├── notices/          # Course notice images
├── reviews/          # Review avatar images
├── categories/       # Category icons
├── certificates/     # Generated certificates
└── temp/            # Temporary files
```

---

## 📊 Database Models

### 1. **Course Model** (`course.model.js`)

Main course entity with all course information.

**Key Fields:**

- `title`, `description`, `shortDescription`, `longDescription`
- `category` (ref: Category)
- `tagText`, `tagColor`, `tags[]`
- `price`, `priceText`
- `date`, `duration`, `location`, `hours`
- `target`, `recommendedAudience[]`
- `learningGoals`, `whatYouWillLearn[]`, `requirements[]`
- `mainImage`, `hoverImage`
- `level`, `language`
- `isActive`, `isFeatured`
- `enrollmentCount`, `averageRating`

**Virtuals:**

- `trainingSchedules`, `curriculum`, `instructors`, `promotions`, `reviews`, `notice`

---

### 2. **Category Model** (`category.model.js`)

Hierarchical course categorization.

**Key Fields:**

- `title`, `description`
- `parentCategory` (ref: Category)
- `level` (1-3 for hierarchy)
- `order`, `icon`
- `isActive`, `courseCount`

---

### 3. **TrainingSchedule Model** (`trainingSchedule.model.js`)

Multiple schedules per course with seat management.

**Key Fields:**

- `course` (ref: Course)
- `scheduleName`
- `startDate`, `endDate`
- `availableSeats`, `enrolledCount`
- `status` (upcoming | ongoing | completed | cancelled)
- `isActive`

**Virtuals:**

- `remainingSeats`, `isFull`

---

### 4. **Curriculum Model** (`curriculum.model.js`)

Course curriculum with modules and keywords.

**Key Fields:**

- `course` (ref: Course, unique)
- `keywords[]`
- `modules[]` with `name`, `content`, `order`

---

### 5. **Instructor Model** (`instructor.model.js`)

Instructor information per course.

**Key Fields:**

- `course` (ref: Course)
- `name`, `bio`, `professionalField`
- `certificates[]`, `attendanceHistory[]`, `education[]`
- `profileImage`

---

### 6. **Promotion Model** (`promotion.model.js`)

Multiple promotional images per course.

**Key Fields:**

- `course` (ref: Course)
- `title`, `description`
- `images[]` (multiple image URLs)
- `isActive`, `displayOrder`

---

### 7. **CourseReview Model** (`courseReview.model.js`)

User reviews for courses.

**Key Fields:**

- `course` (ref: Course)
- `user` (ref: User, optional)
- `reviewerName`, `text`, `avatar`
- `rating` (1-5)
- `isApproved`, `isVerifiedPurchase`

---

### 8. **CourseNotice Model** (`courseNotice.model.js`)

Course-specific announcements.

**Key Fields:**

- `course` (ref: Course, unique)
- `title`, `noticeImage`, `noticeDesc`
- `isActive`, `priority`, `expiresAt`

---

### 9. **Enrollment Model** (`enrollment.model.js`)

User enrollment tracking with progress and certificates.

**Key Fields:**

- `user` (ref: User)
- `course` (ref: Course)
- `schedule` (ref: TrainingSchedule)
- `enrollmentDate`, `enrollmentNumber` (unique)
- `order` (ref: Order)
- `paymentStatus`, `amountPaid`, `paymentMethod`
- `status` (수강예정 | 수강중 | 수료 | 미수료 | 취소)
- `progress` (0-100%)
- `startedAt`, `completedAt`, `lastAccessedAt`
- `certificateEligible`, `certificateIssued`, `certificateUrl`, `certificateIssuedAt`
- `attendanceRecords[]`
- `courseRating`, `review` (ref: CourseReview)
- `refundRequested`, `refundStatus`, `refundAmount`, `refundDate`, `refundReason`

**Virtuals:**

- `attendancePercentage`

---

## 🔌 API Endpoints

### **Category APIs**

| Method | Endpoint                  | Access | Description               |
| ------ | ------------------------- | ------ | ------------------------- |
| GET    | `/categories`             | Public | Get all categories        |
| GET    | `/categories/:id`         | Public | Get category by ID        |
| GET    | `/categories/:id/courses` | Public | Get category with courses |
| POST   | `/categories`             | Admin  | Create category           |
| PUT    | `/categories/:id`         | Admin  | Update category           |
| DELETE | `/categories/:id`         | Admin  | Delete category           |

---

### **Course APIs**

| Method | Endpoint       | Access | Description                    |
| ------ | -------------- | ------ | ------------------------------ |
| GET    | `/courses`     | Public | Get all courses (with filters) |
| GET    | `/courses/:id` | Public | Get course details             |
| POST   | `/courses`     | Admin  | Create course (with images)    |
| PUT    | `/courses/:id` | Admin  | Update course (with images)    |
| DELETE | `/courses/:id` | Admin  | Delete course                  |

---

### **Training Schedule APIs**

| Method | Endpoint                                                   | Access | Description              |
| ------ | ---------------------------------------------------------- | ------ | ------------------------ |
| GET    | `/courses/:courseId/training-schedules`                    | Public | Get schedules for course |
| POST   | `/courses/:courseId/training-schedules`                    | Admin  | Create schedule          |
| PUT    | `/courses/:courseId/training-schedules/:scheduleId`        | Admin  | Update schedule          |
| DELETE | `/courses/:courseId/training-schedules/:scheduleId`        | Admin  | Delete schedule          |
| POST   | `/courses/:courseId/training-schedules/:scheduleId/enroll` | User   | Enroll in schedule       |

---

### **Curriculum APIs**

| Method | Endpoint                        | Access | Description              |
| ------ | ------------------------------- | ------ | ------------------------ |
| GET    | `/courses/:courseId/curriculum` | Public | Get curriculum           |
| POST   | `/courses/:courseId/curriculum` | Admin  | Create/Update curriculum |

---

### **Instructor APIs**

| Method | Endpoint                                       | Access | Description                    |
| ------ | ---------------------------------------------- | ------ | ------------------------------ |
| GET    | `/courses/:courseId/instructors`               | Public | Get instructors                |
| POST   | `/courses/:courseId/instructors`               | Admin  | Create instructor (with image) |
| PUT    | `/courses/:courseId/instructors/:instructorId` | Admin  | Update instructor              |
| DELETE | `/courses/:courseId/instructors/:instructorId` | Admin  | Delete instructor              |

---

### **Promotion APIs**

| Method | Endpoint                                     | Access | Description                        |
| ------ | -------------------------------------------- | ------ | ---------------------------------- |
| GET    | `/courses/:courseId/promotions`              | Public | Get promotions                     |
| POST   | `/courses/:courseId/promotions`              | Admin  | Create promotion (multiple images) |
| PUT    | `/courses/:courseId/promotions/:promotionId` | Admin  | Update promotion                   |
| DELETE | `/courses/:courseId/promotions/:promotionId` | Admin  | Delete promotion/image             |

---

### **Review APIs**

| Method | Endpoint                               | Access | Description                 |
| ------ | -------------------------------------- | ------ | --------------------------- |
| GET    | `/courses/:courseId/reviews`           | Public | Get reviews                 |
| POST   | `/courses/:courseId/reviews`           | Public | Create review (with avatar) |
| PUT    | `/courses/:courseId/reviews/:reviewId` | Admin  | Update review (approve)     |
| DELETE | `/courses/:courseId/reviews/:reviewId` | Admin  | Delete review               |

---

### **Notice APIs**

| Method | Endpoint                    | Access | Description                       |
| ------ | --------------------------- | ------ | --------------------------------- |
| GET    | `/courses/:courseId/notice` | Public | Get notice                        |
| POST   | `/courses/:courseId/notice` | Admin  | Create/Update notice (with image) |

---

### **Enrollment APIs**

| Method | Endpoint                          | Access | Description              |
| ------ | --------------------------------- | ------ | ------------------------ |
| GET    | `/enrollments`                    | User   | Get my enrollments       |
| GET    | `/enrollments/:id`                | User   | Get enrollment details   |
| PATCH  | `/enrollments/:id/status`         | Admin  | Update enrollment status |
| PATCH  | `/enrollments/:id/progress`       | User   | Update progress          |
| POST   | `/enrollments/:id/refund`         | User   | Request refund           |
| PATCH  | `/enrollments/:id/refund/process` | Admin  | Process refund           |
| DELETE | `/enrollments/:id`                | User   | Cancel enrollment        |

---

## 🔐 Authentication & Authorization

### Access Levels

1. **Public**: No authentication required
2. **User**: Requires JWT authentication (`authenticate` middleware)
3. **Admin**: Requires JWT + admin role (`authenticate` + `isAdmin` middlewares)

### Middleware Chain Example

```javascript
router.post(
    "/courses",
    authenticate, // Verify JWT token
    isAdmin, // Check admin role
    courseUploads, // Handle file uploads
    validate(schema), // Validate request body
    controller.create // Execute controller
);
```

---

## 📤 File Upload Examples

### Course Creation with Images

```javascript
POST /api/v1/courses
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

FormData:
- title: "성과관리 기획 실무"
- description: "..."
- category: "65abc123..."
- price: 600000
- mainImage: <file>
- hoverImage: <file>
- tags: ["환급", "모여듣기"]
```

### Multiple Promotion Images

```javascript
POST /api/v1/courses/:courseId/promotions
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

FormData:
- title: "Early Bird Discount"
- images: <file1>
- images: <file2>
- images: <file3>
```

---

## ✅ Validation Schemas

All validators are located in `backend/src/validators/`:

- `category.validators.js`
- `course.validators.js`
- `trainingSchedule.validators.js`
- `curriculum.validators.js`
- `instructor.validators.js`
- `courseReview.validators.js`
- `courseNotice.validators.js`
- `enrollment.validators.js`

---

## 🎯 Key Features

### 1. **Smart Array Field Normalization**

Automatically converts comma-separated strings to arrays:

```javascript
tags: "환급,모여듣기,얼리버드 할인" → ["환급", "모여듣기", "얼리버드 할인"]
```

### 2. **Automatic Enrollment Number Generation**

```javascript
ENR - 1699999999999 - 00001;
```

### 3. **Seat Availability Management**

- Prevents over-enrollment
- Tracks remaining seats
- Auto-increments enrolled count

### 4. **Average Rating Calculation**

Automatically updates course `averageRating` on review create/update/delete.

### 5. **Category Course Count**

Auto-increments/decrements `courseCount` on course create/update/delete.

### 6. **File Cleanup on Deletion**

Automatically removes uploaded files when entities are deleted.

### 7. **Enrollment Progress Tracking**

- Progress percentage (0-100%)
- Last accessed timestamp
- Certificate eligibility
- Attendance records

---

## 🔄 Workflow Examples

### Course Creation Workflow

1. Admin creates category
2. Admin creates course (with images)
3. Admin adds training schedules
4. Admin adds curriculum
5. Admin adds instructor (with profile image)
6. Admin adds promotions (with multiple images)
7. Admin adds notice (optional)

### User Enrollment Workflow

1. User views courses
2. User selects course and schedule
3. User enrolls (payment required)
4. System creates enrollment record
5. System increments seat count
6. System updates course enrollment count

### Completion & Certificate Workflow

1. User progresses through course
2. Admin/System updates progress
3. Progress reaches 100% + requirements met
4. `certificateEligible` set to true
5. Certificate generated
6. `certificateIssued` set to true
7. User can download certificate

---

## 📝 Notes

1. **File Storage**: Configured for production deployment on Render with mounted disk at `/var/data/files`
2. **Old Models Removed**: `course.model.js` and `enrollment.model.js` replaced with new implementations
3. **Middleware**: All endpoints use `asyncHandler` and `ApiError` for consistent error handling
4. **Validation**: All user inputs validated using Joi schemas
5. **No Comments**: Code written cleanly without inline comments as requested

---

## 🚀 Next Steps

To use the course management system:

1. Ensure MongoDB is connected
2. Seed admin user (already configured)
3. Create categories via admin panel
4. Create courses with all required fields
5. Add training schedules
6. Users can now browse and enroll

---

**Status**: ✅ **Production Ready**
**Last Updated**: November 7, 2025
