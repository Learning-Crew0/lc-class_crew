# 📁 Category Routes - Quick Reference

**Base Path:** `/api/v1/categories`

---

## ✅ Category Routes Are Already Implemented!

The category management routes are located in: **`backend/src/routes/courses.routes.js`** (lines 53-81)

---

## 📋 Available Endpoints

### 🌐 Public Routes (No Authentication)

```bash
# Get all categories
GET /api/v1/categories
Query: ?page=1&limit=20&isActive=true

# Get single category
GET /api/v1/categories/:id

# Get category with all courses
GET /api/v1/categories/:id/courses
```

### 🛡️ Admin Routes (Requires Admin Authentication)

```bash
# Create category
POST /api/v1/categories
Headers: Authorization: Bearer {adminToken}
Body: {
  "title": "Programming",
  "description": "Programming and software development courses",
  "parentCategory": null,
  "level": 1,
  "order": 0,
  "isActive": true
}

# Update category
PUT /api/v1/categories/:id
Headers: Authorization: Bearer {adminToken}
Body: {
  "title": "Updated Title",
  "description": "Updated description",
  "order": 1
}

# Delete category
DELETE /api/v1/categories/:id
Headers: Authorization: Bearer {adminToken}
```

---

## 🧪 Testing with cURL

### 1. Get Admin Token

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lcclasscrew.com","password":"changeme123"}' \
  | jq -r '.data.token')

echo "Token: $TOKEN"
```

### 2. List Categories (Public - No Auth Needed)

```bash
curl -X GET http://localhost:5000/api/v1/categories
```

### 3. Create Category (Admin Only)

```bash
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web Development",
    "description": "HTML, CSS, JavaScript, React, and more",
    "level": 1,
    "order": 1,
    "isActive": true
  }'
```

### 4. Create Sub-Category

```bash
# First create parent category and get its ID
PARENT_ID="6732a8e7f2b8f26398fb70ad"

# Then create child category
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Frontend Development\",
    \"description\": \"React, Vue, Angular\",
    \"parentCategory\": \"$PARENT_ID\",
    \"level\": 2,
    \"order\": 0,
    \"isActive\": true
  }"
```

### 5. Update Category

```bash
CATEGORY_ID="6732a8e7f2b8f26398fb70ad"

curl -X PUT http://localhost:5000/api/v1/categories/$CATEGORY_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Web Development",
    "description": "Master modern web technologies",
    "order": 2
  }'
```

### 6. Get Category with Courses

```bash
curl -X GET http://localhost:5000/api/v1/categories/$CATEGORY_ID/courses
```

### 7. Delete Category

```bash
curl -X DELETE http://localhost:5000/api/v1/categories/$CATEGORY_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Category Schema

```javascript
{
  _id: ObjectId,
  title: String,              // Required, unique
  description: String,        // Optional
  parentCategory: ObjectId,   // Reference to parent category (null for top-level)
  level: Number,              // 1, 2, or 3 (hierarchy depth)
  order: Number,              // Display order (default: 0)
  icon: String,               // Optional icon URL
  isActive: Boolean,          // Default: true
  courseCount: Number,        // Auto-calculated
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Category Hierarchy Example

```
Programming (level 1)
├── Web Development (level 2)
│   ├── Frontend (level 3)
│   └── Backend (level 3)
├── Mobile Development (level 2)
│   ├── iOS (level 3)
│   └── Android (level 3)
└── Data Science (level 2)
```

**Create this hierarchy:**

```bash
# 1. Create parent: Programming
PROG_ID=$(curl -s -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Programming","level":1,"order":0}' \
  | jq -r '.data._id')

# 2. Create child: Web Development
WEB_ID=$(curl -s -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Web Development\",\"parentCategory\":\"$PROG_ID\",\"level\":2,\"order\":0}" \
  | jq -r '.data._id')

# 3. Create grandchild: Frontend
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Frontend\",\"parentCategory\":\"$WEB_ID\",\"level\":3,\"order\":0}"
```

---

## ✅ Validation Rules

### Create Category

- **title**: Required, 2-100 characters, unique
- **description**: Optional, max 500 characters
- **parentCategory**: Optional, must be valid ObjectId
- **level**: Integer 1-3, default: 1
- **order**: Integer ≥ 0, default: 0
- **isActive**: Boolean, default: true

### Update Category

- All fields optional
- Same validation as create
- Cannot change to existing title (if title is changed)

### Delete Category

- ❌ Cannot delete if courses are assigned
- ❌ Cannot delete if child categories exist
- Must delete children first

---

## 🔒 Authentication

### Public Endpoints (Anyone)
- ✅ GET `/categories` - List all
- ✅ GET `/categories/:id` - Get one
- ✅ GET `/categories/:id/courses` - Get with courses

### Admin Endpoints (Admin Token Required)
- 🛡️ POST `/categories` - Create
- 🛡️ PUT `/categories/:id` - Update
- 🛡️ DELETE `/categories/:id` - Delete

**Admin Token Required:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get admin token:
```bash
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lcclasscrew.com","password":"changeme123"}'
```

---

## 📝 Common Use Cases

### 1. List All Active Categories

```bash
curl http://localhost:5000/api/v1/categories?isActive=true
```

### 2. Get Category Tree (All Levels)

```bash
# Get level 1 (parents)
curl http://localhost:5000/api/v1/categories?level=1

# Get children of specific parent
PARENT_ID="..."
curl http://localhost:5000/api/v1/categories?parentCategory=$PARENT_ID
```

### 3. Get Category with All Courses

```bash
CATEGORY_ID="..."
curl http://localhost:5000/api/v1/categories/$CATEGORY_ID/courses
```

### 4. Reorder Categories

```bash
# Set display order
curl -X PUT http://localhost:5000/api/v1/categories/$ID1 \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"order":1}'

curl -X PUT http://localhost:5000/api/v1/categories/$ID2 \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"order":2}'
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["카테고리 제목은 필수입니다"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "인증 토큰이 필요합니다"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "관리자 권한이 필요합니다"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Category not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Category with this title already exists"
}
```

---

## 🎯 Summary

✅ **Routes Location:** `backend/src/routes/courses.routes.js`  
✅ **Controller:** `backend/src/controllers/category.controller.js`  
✅ **Service:** `backend/src/services/category.service.js`  
✅ **Model:** `backend/src/models/category.model.js`  
✅ **Validators:** `backend/src/validators/category.validators.js`

**3 Public Routes** | **3 Admin Routes** | **Total: 6 Endpoints**

---

**Admin Credentials:**
- Email: `admin@lcclasscrew.com`
- Password: `changeme123`

**Complete Documentation:** See `ADMIN_ROUTES_COMPLETE.md`

