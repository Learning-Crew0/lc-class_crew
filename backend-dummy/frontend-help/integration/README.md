# 🚀 API Integration Directory

## 📋 Complete Module Reference

This directory contains detailed API integration guides for all backend modules.

---

## 📁 Available Modules

### 🔐 Authentication & Users
- **[User](./user/API_INTEGRATION_GUIDE.md)** - User authentication, profile management, admin operations
- **[Auth](./auth/)** - Basic auth (register, login)

### 📚 Course System
- **[Course](./course/API_INTEGRATION_GUIDE.md)** - Courses with curriculum, instructors, reviews, promotions, notices
- **[Category](./category/)** - Course categories
- **[Curriculum](./course/API_INTEGRATION_GUIDE.md#curriculum-endpoints)** - Course modules and lessons (part of Course)
- **[Instructor](./course/API_INTEGRATION_GUIDE.md#instructor-endpoints)** - Course instructors (part of Course)
- **[Review](./course/API_INTEGRATION_GUIDE.md#review-endpoints)** - Course reviews (part of Course)
- **[Promotion](./course/API_INTEGRATION_GUIDE.md#promotion-endpoints)** - Course promotions (part of Course)
- **[Notice](./course/API_INTEGRATION_GUIDE.md#notice-endpoints)** - Course notices (part of Course)

### 🛒 E-Commerce System
- **[Product](./product/)** - Products catalog
- **[ProductCategory](./productCategory/)** - Product categories
- **[Cart](./cart/)** - Shopping cart operations
- **[Order](./order/)** - Order management and tracking

### 🎨 Media & Content
- **[Banner](./banner/)** - Homepage banners
- **[Thumbnail](./thumbnail/)** - Image thumbnails

### 🎓 Class Operations
- **[Applicant](./applicant/)** - Course applications
- **[Schedule](./schedule/)** - Class schedules
- **[Partnership](./partnership/)** - Partnership management

---

## 🗺️ Quick Reference Table

| Module | Base URL | Auth Required | Admin Only | Key Features |
|--------|----------|---------------|------------|--------------|
| **User** | `/api/users` | Partial | Partial | Register, Login, Profile, Admin Management |
| **Auth** | `/api/auth` | No | No | Basic auth endpoints |
| **Category** | `/api/category` | No (read) | Yes (write) | Course categories CRUD |
| **Course** | `/api/courses` | No (read) | Yes (write) | Full course management |
| **Curriculum** | `/api/courses/:id/curriculum` | No (read) | Yes (write) | Modules, lessons |
| **Instructor** | `/api/courses/:id/instructor` | No (read) | Yes (write) | Instructor profiles |
| **Review** | `/api/courses/:id/reviews` | Yes (write) | No | User reviews |
| **Promotion** | `/api/courses/:id/promotions` | No (read) | Yes (write) | Course promotions |
| **Notice** | `/api/courses/:id/notice` | No (read) | Yes (write) | Course notices |
| **ProductCategory** | `/api/product-categories` | No (read) | Yes (write) | Product categories |
| **Product** | `/api/products` | No (read) | Yes (write) | Products catalog |
| **Cart** | `/api/cart` | Yes | No | Shopping cart |
| **Order** | `/api/orders` | Yes | Partial | Order management |
| **Banner** | `/api/banner` | No (read) | Yes (write) | Homepage banners |
| **Thumbnail** | `/api/thumbnail` | No (read) | Yes (write) | Image management |
| **Applicant** | `/api/applicants` | Yes | Yes | Course applications |
| **Schedule** | `/api/schedules` | No (read) | Yes (write) | Class schedules |

---

## 🔄 Module Relationships Diagram

```
USER
├── Cart (1:1)
├── Order (1:N)
├── Review (1:N)
└── Applicant (1:N)

CATEGORY
└── Course (1:N)

COURSE
├── Curriculum (1:1)
├── Instructor (1:N)
├── Review (1:N)
├── Promotion (1:N)
├── Notice (1:1)
├── Applicant (1:N)
└── Schedule (1:N)

PRODUCT_CATEGORY
└── Product (1:N)

PRODUCT
├── CartItem (N:M)
└── OrderItem (N:M)

CART
└── Products (N:M through items)

ORDER
└── Products (N:M through items)
```

---

## 🎯 Common API Patterns

### Pattern 1: List with Pagination
```javascript
GET /api/[module]?page=1&limit=10

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "total": 50,
      "limit": 10
    }
  }
}
```

### Pattern 2: CRUD Operations
```javascript
GET    /api/[module]     // List all
GET    /api/[module]/:id // Get one
POST   /api/[module]     // Create (Admin)
PUT    /api/[module]/:id // Update (Admin)
DELETE /api/[module]/:id // Delete (Admin)
```

### Pattern 3: Nested Resources
```javascript
GET  /api/courses/:id/curriculum      // Get curriculum
POST /api/courses/:id/curriculum      // Create/Update
GET  /api/courses/:id/reviews         // Get reviews
POST /api/courses/:id/reviews         // Add review
```

### Pattern 4: Filters & Search
```javascript
GET /api/[module]?category=id&search=text&isActive=true
```

---

## 🔐 Authentication Patterns

### Public Endpoints (No Auth)
- GET endpoints for: courses, products, categories, banners
- POST /api/users/register
- POST /api/users/login
- POST /api/auth/login

### Protected Endpoints (User Auth)
```javascript
Headers: {
  Authorization: 'Bearer YOUR_TOKEN'
}
```
- User profile operations
- Cart operations
- Order operations
- Creating reviews
- Applying to courses

### Admin Endpoints (Admin Auth)
```javascript
Headers: {
  Authorization: 'Bearer ADMIN_TOKEN'
}

User must have: role === 'admin'
```
- All CREATE, UPDATE, DELETE operations
- User management
- Course management
- Product management

---

## 📊 Response Format

All APIs follow consistent response format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🚀 Getting Started

### Step 1: Authentication
1. Start with [User Module](./user/API_INTEGRATION_GUIDE.md)
2. Implement login/register
3. Store JWT token
4. Use token for protected routes

### Step 2: Core Features
1. Implement [Category](./category/) browsing
2. Build [Course](./course/API_INTEGRATION_GUIDE.md) listing and details
3. Add curriculum, instructors, reviews display

### Step 3: E-Commerce
1. Implement [Product](./product/) catalog
2. Build [Cart](./cart/) functionality
3. Create [Order](./order/) checkout flow

### Step 4: Additional Features
1. Add [Banner](./banner/) carousel
2. Implement [Applicant](./applicant/) system
3. Show [Schedule](./schedule/)

---

## 💻 Implementation Examples

### API Service Layer Setup

```javascript
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
```

### Module Service Examples

```javascript
// src/services/userService.js
import API from './api';

export const userService = {
  register: (data) => API.post('/users/register', data),
  login: (data) => API.post('/users/login', data),
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data)
};

// src/services/courseService.js
export const courseService = {
  getAll: (params) => API.get('/courses', { params }),
  getById: (id) => API.get(`/courses/${id}`),
  getCurriculum: (id) => API.get(`/courses/${id}/curriculum`),
  getInstructors: (id) => API.get(`/courses/${id}/instructor`),
  getReviews: (id) => API.get(`/courses/${id}/reviews`),
  addReview: (id, data) => API.post(`/courses/${id}/reviews`, data)
};

// src/services/cartService.js
export const cartService = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart/add', data),
  update: (productId, data) => API.put(`/cart/update/${productId}`, data),
  remove: (productId) => API.delete(`/cart/remove/${productId}`),
  clear: () => API.delete('/cart/clear')
};

// src/services/orderService.js
export const orderService = {
  create: (data) => API.post('/orders/create', data),
  getAll: (params) => API.get('/orders', { params }),
  getById: (id) => API.get(`/orders/${id}`),
  track: (orderNumber) => API.get(`/orders/track/${orderNumber}`),
  cancel: (id, data) => API.put(`/orders/${id}/cancel`, data)
};
```

---

## 📝 File Upload Handling

For endpoints that require file uploads (images):

```javascript
// Creating FormData for file uploads
const formData = new FormData();
formData.append('title', 'Course Title');
formData.append('mainImage', fileInput.files[0]);
formData.append('price', 4999);

// Send with proper headers
await axios.post('/api/courses', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

---

## 🧪 Testing Endpoints

### Using Postman
1. Import environment variables:
   - `BASE_URL`: http://localhost:5000/api
   - `TOKEN`: (set after login)
   - `ADMIN_TOKEN`: (set after admin login)

2. Test sequence:
   - Register/Login → Get token
   - Test public endpoints (no token)
   - Test protected endpoints (with token)
   - Test admin endpoints (with admin token)

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"user@example.com","password":"Password123"}'

# Get courses
curl http://localhost:5000/api/courses

# Get cart (protected)
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚠️ Important Notes

1. **Token Storage:** Store JWT tokens in localStorage or sessionStorage
2. **Token Expiry:** Tokens expire after 30 days, handle 401 errors
3. **File Uploads:** Use FormData with multipart/form-data
4. **Pagination:** Implement for all list endpoints
5. **Error Handling:** Always check response.data.success
6. **CORS:** Backend handles CORS, ensure correct API URL

---

## 🐛 Common Issues

### Issue: 401 Unauthorized
**Solution:** Check if token is valid and included in Authorization header

### Issue: 404 Not Found
**Solution:** Verify endpoint URL matches documentation

### Issue: File upload fails
**Solution:** Check Content-Type is multipart/form-data and file size limits

### Issue: Data not populating
**Solution:** Check if relationship fields need to be populated in request

---

## 📞 Support

For detailed integration guides, check individual module folders:
- [User Guide](./user/API_INTEGRATION_GUIDE.md)
- [Course Guide](./course/API_INTEGRATION_GUIDE.md)
- More guides available in respective folders

---

**Last Updated:** October 27, 2025  
**API Version:** 1.0.0  
**Total Modules:** 13+

