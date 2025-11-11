# 🔐 All Routes Organized by Authentication Level

Complete list of all 130 API endpoints organized by authentication requirements.

**Last Updated:** 2025-11-11

---

## 🌐 PUBLIC ROUTES (25 endpoints)

**No authentication required - accessible to anyone**

### Authentication (6)

```
POST   /auth/register
POST   /auth/login
POST   /auth/find-id
POST   /auth/password-reset/initiate
POST   /auth/password-reset/verify-code
POST   /auth/password-reset/reset
```

### Categories (3)

```
GET    /categories
GET    /categories/:id
GET    /categories/:id/courses
```

### Courses (2)

```
GET    /courses
GET    /courses/:id
```

### Training Schedules (1)

```
GET    /courses/:courseId/training-schedules
```

### Curriculum (1)

```
GET    /courses/:courseId/curriculum
```

### Instructors (1)

```
GET    /courses/:courseId/instructors
```

### Promotions (1)

```
GET    /courses/:courseId/promotions
```

### Course Reviews (1)

```
GET    /courses/:courseId/reviews
```

### Course Notice (1)

```
GET    /courses/:courseId/notice
```

### Products (2)

```
GET    /products
GET    /products/:id
```

### Announcements (2)

```
GET    /announcements
GET    /announcements/:id
```

### FAQs (3)

```
GET    /faqs
GET    /faqs/category/:categoryKey
GET    /faqs/:id
```

### Settings (1)

```
GET    /settings
```

---

## 🔑 USER ROUTES (23 endpoints)

**Requires authentication - any logged-in user (not necessarily admin)**

### Shopping Cart (6)

```
GET    /cart
POST   /cart/add
PUT    /cart/update/:itemId
DELETE /cart/remove/:itemId
POST   /cart/clear
POST   /cart/clear/courses
```

### Class Applications (9)

```
POST   /class-applications/draft
POST   /class-applications/:applicationId/validate-student
POST   /class-applications/:applicationId/courses/:courseId/students
POST   /class-applications/:applicationId/courses/:courseId/bulk-upload
PUT    /class-applications/:applicationId/payment
POST   /class-applications/:applicationId/submit
GET    /class-applications
POST   /class-applications/:applicationId/cancel
GET    /class-applications/bulk-template
```

### Enrollments (2)

```
GET    /enrollments
GET    /enrollments/:id
```

### Course Reviews (3)

```
POST   /courses/:courseId/reviews
PUT    /courses/:courseId/reviews/:reviewId
DELETE /courses/:courseId/reviews/:reviewId
```

### Course History (3)

```
GET    /course-history
GET    /course-history/:id
GET    /course-history/certificate/:enrollmentId
```

---

## 🛡️ ADMIN ROUTES (82 endpoints)

**Requires admin authentication - admin users only**

### Admin Authentication & Profile (2)

```
GET    /admin/profile
PUT    /admin/password
```

### Admin Management (6)

```
GET    /admin/admins
GET    /admin/admins/:id
POST   /admin/admins
PUT    /admin/admins/:id
DELETE /admin/admins/:id
PATCH  /admin/admins/:id/status
```

### User Management (5)

```
GET    /admin/users
GET    /admin/users/:id
POST   /admin/users
PUT    /admin/users/:id
DELETE /admin/users/:id
```

### Category Management (3)

```
POST   /categories
PUT    /categories/:id
DELETE /categories/:id
```

### Course Management (5)

```
GET    /admin/courses
GET    /admin/courses/:id
POST   /admin/courses
PUT    /admin/courses/:id
DELETE /admin/courses/:id
```

### Training Schedules (3)

```
POST   /courses/:courseId/training-schedules
PUT    /courses/:courseId/training-schedules/:scheduleId
DELETE /courses/:courseId/training-schedules/:scheduleId
```

### Curriculum (3)

```
POST   /courses/:courseId/curriculum
PUT    /courses/:courseId/curriculum/:curriculumId
DELETE /courses/:courseId/curriculum/:curriculumId
```

### Instructors (3)

```
POST   /courses/:courseId/instructors
PUT    /courses/:courseId/instructors/:instructorId
DELETE /courses/:courseId/instructors/:instructorId
```

### Promotions (3)

```
POST   /courses/:courseId/promotions
PUT    /courses/:courseId/promotions/:promotionId
DELETE /courses/:courseId/promotions/:promotionId
```

### Course Notice (1)

```
POST   /courses/:courseId/notice
```

### Product Management (5)

```
GET    /admin/products
GET    /admin/products/:id
POST   /admin/products
PUT    /admin/products/:id
DELETE /admin/products/:id
```

### Enrollments Management (5)

```
PATCH  /enrollments/:id/approve
PATCH  /enrollments/:id/reject
POST   /enrollments/:id/completion
PATCH  /enrollments/:id/cancel
DELETE /enrollments/:id
```

### Announcements (8)

```
POST   /announcements
PUT    /announcements/:id
DELETE /announcements/:id
PATCH  /announcements/:id/pin
DELETE /announcements/bulk-delete
POST   /announcements/:id/attachments
GET    /announcements/:id/attachments/:attachmentId
DELETE /announcements/:id/attachments/:attachmentId
```

### FAQs (5)

```
GET    /admin/faqs
GET    /admin/faqs/:id
POST   /admin/faqs
PUT    /admin/faqs/:id
DELETE /admin/faqs/:id
```

### Inquiries (3)

```
GET    /admin/inquiries
GET    /admin/inquiries/:id
DELETE /admin/inquiries/:id
```

### Notices (5)

```
GET    /admin/notices
GET    /admin/notices/:id
POST   /admin/notices
PUT    /admin/notices/:id
DELETE /admin/notices/:id
```

### Banners (5)

```
GET    /admin/banners
GET    /admin/banners/:id
POST   /admin/banners
PUT    /admin/banners/:id
DELETE /admin/banners/:id
```

### File Uploads (4)

```
POST   /admin/uploads/single
POST   /admin/uploads/multiple
GET    /admin/uploads/:filename
DELETE /admin/uploads/:filename
```

### Settings (5)

```
GET    /admin/settings
GET    /admin/settings/:key
POST   /admin/settings
PUT    /admin/settings/:key
DELETE /admin/settings/:key
```

---

## 📊 Summary Statistics

| Auth Level | Count   | Percentage |
| ---------- | ------- | ---------- |
| 🌐 Public  | 25      | 19.2%      |
| 🔑 User    | 23      | 17.7%      |
| 🛡️ Admin   | 82      | 63.1%      |
| **TOTAL**  | **130** | **100%**   |

---

## 🔐 How Authentication Works

### 1. Public Routes (🌐)

- No authentication required
- Anyone can access
- Example: Browse courses, view FAQs

### 2. User Routes (🔑)

- Requires valid JWT token
- Any logged-in user (normal user or admin)
- Header: `Authorization: Bearer {userToken}`
- Example: Manage cart, apply for classes

### 3. Admin Routes (🛡️)

- Requires valid admin JWT token
- Only users with `role: "admin"`
- Header: `Authorization: Bearer {adminToken}`
- Example: Create courses, manage users

---

## 🎯 Quick Reference

### Get Admin Token

```bash
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lcclasscrew.com","password":"changeme123"}'
```

### Get User Token

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"user@example.com","password":"password123"}'
```

### Use Token in Request

```bash
# User request
curl -X GET http://localhost:5000/api/v1/cart \
  -H "Authorization: Bearer {userToken}"

# Admin request
curl -X GET http://localhost:5000/api/v1/admin/users \
  -H "Authorization: Bearer {adminToken}"
```

---

## 🔒 Middleware Stack

### Route Protection in Code

**Public Route:**

```javascript
router.get("/courses", coursesController.getAllCourses);
```

**User Route:**

```javascript
router.get("/cart", authenticate, cartController.getCart);
```

**Admin Route (Method 1):**

```javascript
router.post(
    "/categories",
    authenticate,
    requireAdmin,
    categoryController.create
);
```

**Admin Route (Method 2 - Blanket Protection):**

```javascript
// In admin.routes.js
router.use(authenticate, requireAdmin); // All routes below are admin-only
router.get("/users", usersController.getAllUsers);
```

---

## 📝 Middleware Files

- **Authentication:** `backend/src/middlewares/auth.middleware.js`
- **Admin Check:** `backend/src/middlewares/admin.middleware.js`
- **Validation:** `backend/src/middlewares/validate.middleware.js`

---

## 🚨 Common Errors

### 401 Unauthorized

```json
{
    "success": false,
    "message": "인증 토큰이 필요합니다"
}
```

**Cause:** No token provided or invalid token  
**Fix:** Provide valid `Authorization: Bearer {token}` header

### 403 Forbidden

```json
{
    "success": false,
    "message": "관리자 권한이 필요합니다"
}
```

**Cause:** User token used for admin route  
**Fix:** Use admin token with `role: "admin"`

### 404 Not Found

```json
{
    "status": "error",
    "message": "Cannot GET /api/v1/wrong-route"
}
```

**Cause:** Route does not exist  
**Fix:** Check route path and HTTP method

---

## 📚 Related Documents

- **Complete Admin Routes:** `ADMIN_ROUTES_COMPLETE.md` (detailed docs)
- **Category Routes:** `CATEGORY_ROUTES_QUICK_REF.md` (category-specific)
- **Frontend Requirements:** `FRONTEND_REQUIREMENTS_ADMIN_LOGIN.md`
- **Postman Collection:** `ClassCrew_Complete_API_Collection_v2.postman_collection.json`

---

**Default Admin Credentials:**

- Email: `admin@lcclasscrew.com`
- Password: `changeme123`

⚠️ **Change default password after first login!**
