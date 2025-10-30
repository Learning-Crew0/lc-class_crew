# 🎨 Frontend Developer Guide - ClassCrew Backend APIs

## 📋 Welcome!

This document serves as the main navigation hub for all frontend integration guides. Each module has detailed documentation with API endpoints, request/response examples, and React implementation examples.

---

## 🗺️ Documentation Structure

```
📁 backend-dummy/
├── 📄 FRONTEND_INTEGRATION_GUIDE.md ⭐ START HERE
│   └── Complete system overview with module relationships
│
├── 📁 src/modules/
│   ├── 📁 user/
│   │   └── 📄 USER_API_TESTING_GUIDE.md
│   ├── 📁 banner/
│   │   └── 📄 BANNER_API_GUIDE.md
│   ├── 📁 thumbnail/
│   │   └── 📄 (Uses same pattern as Banner)
│   ├── 📁 category/
│   │   └── 📄 CATEGORY_API_GUIDE.md
│   ├── 📁 course/
│   │   └── 📄 (Includes Curriculum, Instructors, Reviews, etc.)
│   ├── 📁 cart/
│   │   └── 📄 CART_API_GUIDE.md
│   ├── 📁 order/
│   │   └── 📄 (Covered in Product/Cart/Order guide)
│   ├── 📁 product/
│   │   └── 📄 (Covered in Product/Cart/Order guide)
│   ├── 📁 productCategory/
│   │   └── 📄 (Covered in Product/Cart/Order guide)
│   └── 📁 class-operations/
│       └── 📄 (Applicants & Schedules)
│
└── 📄 PRODUCT_CART_ORDER_API_TESTING_GUIDE.md
    └── E-commerce system complete guide
```

---

## 🚀 Quick Start Guide

### Step 1: Read System Overview
👉 **[FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)**
- Complete system architecture
- Module relationships diagram
- Data flow examples
- Authentication setup

### Step 2: Setup Authentication
👉 **[User API Guide](./src/modules/user/USER_API_TESTING_GUIDE.md)**
- User registration & login
- Profile management
- JWT token handling
- Admin authentication

### Step 3: Choose Your Feature Area

#### 🎓 Building Course Features?
Read in this order:
1. **[Category API Guide](./src/modules/category/CATEGORY_API_GUIDE.md)** - Course categories
2. **Course API** (in FRONTEND_INTEGRATION_GUIDE.md) - Course listings
3. **Curriculum API** - Course modules and lessons
4. **Instructor API** - Course instructors
5. **Review API** - Course reviews
6. **Promotion API** - Course promotions
7. **Notice API** - Course notices

#### 🛒 Building E-Commerce Features?
Read in this order:
1. **Product Category API** - Product organization
2. **Product API** - Product listings
3. **[Cart API Guide](./src/modules/cart/CART_API_GUIDE.md)** - Shopping cart
4. **Order API** - Checkout & orders
5. **👉 [Complete E-Commerce Guide](./PRODUCT_CART_ORDER_API_TESTING_GUIDE.md)**

#### 🎨 Building Homepage/Media Features?
Read in this order:
1. **[Banner API Guide](./src/modules/banner/BANNER_API_GUIDE.md)** - Homepage banners
2. **Thumbnail API** - Image management

#### 📝 Building Class Management?
Read in this order:
1. **Applicant API** - Course applications
2. **Schedule API** - Class scheduling

---

## 🔗 Module Relationship Map

### Core System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION                          │
│  Register → Login → Get Token → Use Token in Headers        │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌────────────────┐    ┌────────────────┐
│ COURSE SYSTEM  │    │  E-COMMERCE    │
└────────────────┘    └────────────────┘

COURSE SYSTEM:
Category → Course → Curriculum
                 → Instructors
                 → Reviews
                 → Promotions
                 → Notices
                 → Applicants
                 → Schedule

E-COMMERCE SYSTEM:
ProductCategory → Product → Cart → Order
```

### How Modules Connect

| From Module | To Module | Relationship | Field Name |
|-------------|-----------|--------------|------------|
| User | Cart | 1:1 | `cart.user` |
| User | Order | 1:N | `order.user` |
| User | Review | 1:N | `review.user` |
| User | Applicant | 1:N | `applicant.user` |
| Category | Course | 1:N | `course.category` |
| Course | Curriculum | 1:1 | `curriculum.course` |
| Course | Instructor | 1:N | `instructor.course` |
| Course | Review | 1:N | `review.course` |
| Course | Promotion | 1:N | `promotion.course` |
| Course | Notice | 1:N | `notice.course` |
| Course | Applicant | 1:N | `applicant.course` |
| Course | Schedule | 1:N | `schedule.course` |
| ProductCategory | Product | 1:N | `product.category` |
| Product | CartItem | N:M | `cartItem.product` |
| Product | OrderItem | N:M | `orderItem.product` |

---

## 🎯 Common Implementation Patterns

### 1. Authentication Flow

```javascript
// Step 1: Login
const response = await axios.post('/api/users/login', {
  emailOrUsername: 'user@example.com',
  password: 'Password123'
});

// Step 2: Store token
localStorage.setItem('token', response.data.data.token);

// Step 3: Use token in subsequent requests
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
};

// Step 4: Make authenticated requests
await axios.get('/api/cart', config);
await axios.get('/api/orders', config);
```

---

### 2. Fetch-Display Pattern

```javascript
// All list endpoints follow this pattern
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/endpoint');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

---

### 3. Pagination Pattern

```javascript
// All paginated endpoints accept these params
const [page, setPage] = useState(1);
const [limit] = useState(10);
const [totalPages, setTotalPages] = useState(1);

const fetchData = async () => {
  const response = await axios.get('/api/endpoint', {
    params: { page, limit }
  });
  
  setData(response.data.data.items); // or .courses, .products, etc.
  setTotalPages(response.data.data.pagination.totalPages);
};

// Pagination controls
<button onClick={() => setPage(page - 1)} disabled={page === 1}>
  Previous
</button>
<span>Page {page} of {totalPages}</span>
<button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
  Next
</button>
```

---

### 4. Filter & Search Pattern

```javascript
// Most list endpoints support filtering
const [filters, setFilters] = useState({
  category: '',
  search: '',
  minPrice: '',
  maxPrice: '',
  isActive: true
});

const fetchData = async () => {
  const response = await axios.get('/api/endpoint', {
    params: filters
  });
  setData(response.data.data);
};

// Update filters
useEffect(() => {
  fetchData();
}, [filters]);
```

---

### 5. CRUD Operations Pattern

```javascript
// CREATE
const create = async (data) => {
  const response = await axios.post('/api/endpoint', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

// READ
const getOne = async (id) => {
  const response = await axios.get(`/api/endpoint/${id}`);
  return response.data.data;
};

// UPDATE
const update = async (id, data) => {
  const response = await axios.put(`/api/endpoint/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

// DELETE
const remove = async (id) => {
  await axios.delete(`/api/endpoint/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
```

---

## 📦 API Response Structure

All API endpoints follow this consistent structure:

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful", // Optional
  "data": {
    // Response data here
  }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message" // Optional
}
```

### Paginated Response
```javascript
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ], // Could be 'courses', 'products', etc.
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48, // Could be 'totalCourses', 'totalProducts', etc.
      "limit": 10
    }
  }
}
```

---

## 🛠️ Frontend Setup Recommendations

### 1. Environment Variables

```bash
# .env.development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_JWT_SECRET=your-secret-key

# .env.production
REACT_APP_API_URL=https://api.classcrew.com/api
```

---

### 2. API Service Layer Structure

```javascript
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
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
  create: (data) => API.post('/courses', data),
  update: (id, data) => API.put(`/courses/${id}`, data),
  delete: (id) => API.delete(`/courses/${id}`)
};

// Similar for: cartService, orderService, productService, etc.
```

---

### 3. State Management (Redux Toolkit Example)

```javascript
// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await userService.login(credentials);
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

---

### 4. Protected Route Component

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

// Usage in routes
<Route path="/cart" element={
  <ProtectedRoute>
    <CartPage />
  </ProtectedRoute>
} />
```

---

## 📊 Module Priority for Development

### Phase 1: Core Authentication (Week 1)
- [ ] User registration
- [ ] Login/logout
- [ ] Profile management
- [ ] Protected routes

### Phase 2: Content Display (Week 2-3)
- [ ] Categories
- [ ] Courses
- [ ] Course details (curriculum, instructors)
- [ ] Reviews
- [ ] Banners

### Phase 3: E-Commerce (Week 4-5)
- [ ] Product categories
- [ ] Products
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Order management

### Phase 4: Class Operations (Week 6)
- [ ] Course applications
- [ ] Class schedules
- [ ] Notices & promotions

### Phase 5: Admin Features (Week 7-8)
- [ ] Admin dashboard
- [ ] User management
- [ ] Content management
- [ ] Bulk uploads

---

## 🔍 Testing Endpoints

### Using Postman

1. **Import Collection:**
   - Download Postman collection from `/docs`
   - Import into Postman

2. **Setup Environment:**
   ```
   BASE_URL: http://localhost:5000/api
   TOKEN: (will be set after login)
   ```

3. **Test Flow:**
   - Register/Login → Get token
   - Test protected endpoints with token
   - Test public endpoints without token

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"user@example.com","password":"Password123"}'

# Get Cart (Protected)
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ⚠️ Important Notes

1. **Authentication:**
   - All protected routes require JWT token
   - Token format: `Bearer ${token}`
   - Token stored in `localStorage`
   - Auto-redirect to login on 401 errors

2. **Error Handling:**
   - Always check `response.data.success`
   - Display `response.data.message` to users
   - Handle network errors gracefully

3. **File Uploads:**
   - Use `FormData` for file uploads
   - Set `Content-Type: multipart/form-data`
   - Supported formats: images (jpg, png), documents (pdf, csv)

4. **Pagination:**
   - Default: `page=1`, `limit=10`
   - Always show total pages/items
   - Implement prev/next navigation

5. **Stock Management:**
   - Check product stock before adding to cart
   - Disable quantity increase if stock limit reached
   - Show stock availability on product pages

---

## 📚 Additional Resources

- **API Testing:** [PRODUCT_CART_ORDER_API_TESTING_GUIDE.md](./PRODUCT_CART_ORDER_API_TESTING_GUIDE.md)
- **Bulk Upload:** [CATEGORY_BULK_UPLOAD_GUIDE.md](./CATEGORY_BULK_UPLOAD_GUIDE.md)
- **System Overview:** [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)

---

## 🤝 Support & Questions

If you encounter issues or have questions:

1. Check the specific module's API guide
2. Review the FRONTEND_INTEGRATION_GUIDE.md
3. Test endpoints in Postman
4. Check console for error messages
5. Verify authentication token is valid

---

## ✅ Development Checklist

### Before Starting Development
- [ ] Read FRONTEND_INTEGRATION_GUIDE.md
- [ ] Setup API service layer
- [ ] Configure environment variables
- [ ] Test authentication flow
- [ ] Understand module relationships

### During Development
- [ ] Use consistent error handling
- [ ] Implement loading states
- [ ] Add proper validation
- [ ] Handle edge cases (empty states, errors)
- [ ] Test with real API endpoints

### Before Deployment
- [ ] Test all CRUD operations
- [ ] Verify authentication works
- [ ] Check responsive design
- [ ] Test error scenarios
- [ ] Verify file uploads work
- [ ] Test pagination
- [ ] Check cart & order flow

---

**Last Updated:** October 24, 2025  
**API Version:** 1.0.0  
**Backend Status:** ✅ Production Ready

---

## 🎯 Quick Navigation

| Module | Guide | Status |
|--------|-------|--------|
| User & Auth | [USER_API_TESTING_GUIDE.md](./src/modules/user/USER_API_TESTING_GUIDE.md) | ✅ |
| Banner | [BANNER_API_GUIDE.md](./src/modules/banner/BANNER_API_GUIDE.md) | ✅ |
| Category | [CATEGORY_API_GUIDE.md](./src/modules/category/CATEGORY_API_GUIDE.md) | ✅ |
| Cart | [CART_API_GUIDE.md](./src/modules/cart/CART_API_GUIDE.md) | ✅ |
| E-Commerce | [PRODUCT_CART_ORDER_API_TESTING_GUIDE.md](./PRODUCT_CART_ORDER_API_TESTING_GUIDE.md) | ✅ |
| Course System | [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md) | ✅ |
| Complete Overview | [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md) | ⭐ |

**Ready to start building? Begin with [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)! 🚀**

