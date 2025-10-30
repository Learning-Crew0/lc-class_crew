# 🗺️ Module Connections - Visual Guide for Frontend Developers

## 📋 Overview

This document provides a visual representation of how all backend modules connect with each other, helping frontend developers understand data relationships and API call sequences.

---

## 🎯 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER AUTHENTICATION                            │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌───────────────┐           │
│  │ Register │→│  Login  │→│  Profile │→│ Change Password│           │
│  └──────────┘  └────┬────┘  └──────────┘  └───────────────┘           │
│                     │                                                    │
│                     ▼                                                    │
│              JWT Token (Bearer)                                         │
└─────────────────────┬───────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌───────────────┐ ┌─────────────┐ ┌───────────────┐
│ COURSE SYSTEM │ │ E-COMMERCE  │ │ MEDIA/ADMIN   │
└───────────────┘ └─────────────┘ └───────────────┘
```

---

## 📚 Course System Flow

### Hierarchical Structure

```
1. CATEGORY
   │
   ├─> Stores: name, description, image
   │
   └─> GET /api/category
       Returns: List of all categories
       
2. COURSE (belongs to Category)
   │
   ├─> References: category._id
   ├─> Stores: title, description, price, images, etc.
   │
   └─> GET /api/courses?category={categoryId}
       Returns: Courses in that category

3. CURRICULUM (1:1 with Course)
   │
   ├─> References: course._id
   ├─> Stores: modules[], lessons[], duration
   │
   └─> GET /api/curriculum/course/{courseId}
       Returns: All modules and lessons

4. INSTRUCTOR (N courses)
   │
   ├─> References: course._id
   ├─> Stores: name, bio, expertise, social links
   │
   └─> GET /api/instructors/course/{courseId}
       Returns: All instructors for course

5. REVIEW (N per course)
   │
   ├─> References: course._id, user._id
   ├─> Stores: rating, comment
   │
   └─> GET /api/reviews/course/{courseId}
       Returns: All reviews for course

6. PROMOTION (N per course)
   │
   ├─> References: course._id
   ├─> Stores: title, description, dates, images
   │
   └─> GET /api/promotions/course/{courseId}
       Returns: Active promotions

7. NOTICE (N per course)
   │
   ├─> References: course._id
   ├─> Stores: title, message, priority
   │
   └─> GET /api/notices/course/{courseId}
       Returns: Course notices
```

---

## 🛒 E-Commerce System Flow

### Product → Cart → Order Pipeline

```
1. PRODUCT CATEGORY
   │
   ├─> Stores: name, description, image
   │
   └─> GET /api/product-categories
       Returns: All product categories

2. PRODUCT (belongs to ProductCategory)
   │
   ├─> References: category._id
   ├─> Stores: name, price, stock, images
   │
   └─> GET /api/products?category={categoryId}
       Returns: Products in category

3. CART (1 per user)
   │
   ├─> References: user._id
   ├─> Contains: items[] (each item references product._id)
   ├─> Calculates: totalAmount, itemCount
   │
   └─> GET /api/cart (Protected)
       Returns: User's cart with all items

4. ORDER (N per user)
   │
   ├─> References: user._id
   ├─> Contains: items[] (snapshot of products), shippingAddress
   ├─> Stores: orderNumber, status, payment details
   │
   └─> GET /api/orders (Protected)
       Returns: User's orders
```

---

## 🔄 Data Flow Examples

### Example 1: User Browsing Courses

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ▼
┌─────────────────────────────────────┐
│ 1. Load Homepage                     │
│    GET /api/category                 │
│    GET /api/banner                   │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ 2. User Clicks "Web Development"    │
│    GET /api/courses?category=cat123 │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ 3. User Clicks Course Card          │
│    GET /api/courses/course123       │
│    ├─> Returns: Full course         │
│    ├─> With: category (populated)   │
│    └─> With: curriculum, reviews    │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ 4. User Views Curriculum Tab        │
│    GET /api/curriculum/course/...   │
│    Returns: All modules & lessons   │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ 5. User Reads Reviews               │
│    GET /api/reviews/course/...      │
│    Returns: All reviews with users  │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ 6. User Applies for Course          │
│    POST /api/applicants (Protected) │
│    Body: { course, fullName, ... }  │
└─────────────────────────────────────┘
```

---

### Example 2: Shopping Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 1. Browse Products                    │
│    GET /api/product-categories        │
│    GET /api/products                  │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 2. View Product Details              │
│    GET /api/products/prod123         │
│    Returns: Full product with stock  │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 3. Add to Cart (Must be logged in)  │
│    POST /api/cart/add (Protected)    │
│    Body: { productId, quantity }     │
│    Headers: { Authorization: Bearer }│
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 4. View Cart                         │
│    GET /api/cart (Protected)         │
│    Returns: All cart items + totals  │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 5. Update Quantity                   │
│    PUT /api/cart/update/prod123      │
│    Body: { quantity: 3 }             │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 6. Proceed to Checkout               │
│    POST /api/orders/create           │
│    Body: { shippingAddress, ... }    │
│    Backend: Creates order + clears   │
│             cart automatically       │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 7. Track Order                       │
│    GET /api/orders/:id/track         │
│    Returns: Order status & history   │
└──────────────────────────────────────┘
```

---

### Example 3: Admin Course Setup

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 1. Login as Admin                    │
│    POST /api/users/login             │
│    Must have: role = "admin"         │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 2. Create/Upload Categories          │
│    POST /api/category (Admin)        │
│    OR                                 │
│    POST /api/categories/bulk-upload  │
│    File: categories.csv              │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 3. Create/Upload Courses             │
│    POST /api/courses (Admin)         │
│    Body: { title, category, ... }    │
│    OR                                 │
│    POST /api/courses/bulk-upload     │
│    File: courses.csv                 │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 4. Add Curriculum                    │
│    POST /api/curriculums/bulk-upload │
│    File: curriculum.csv              │
│    Contains: modules, lessons, etc.  │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 5. Add Instructors                   │
│    POST /api/instructors/bulk-upload │
│    File: instructors.csv             │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ 6. Add Promotions/Notices            │
│    POST /api/promotions/bulk-upload  │
│    POST /api/notices/bulk-upload     │
└──────────────────────────────────────┘
```

---

## 🔗 Foreign Key Relationships

### Visual Reference Table

```
┌─────────────────┬──────────────┬────────────────┬─────────────────┐
│ Module          │ Field        │ References     │ Relationship    │
├─────────────────┼──────────────┼────────────────┼─────────────────┤
│ Course          │ category     │ Category._id   │ Many-to-One     │
│ Curriculum      │ course       │ Course._id     │ One-to-One      │
│ Instructor      │ course       │ Course._id     │ Many-to-One     │
│ Review          │ course       │ Course._id     │ Many-to-One     │
│ Review          │ user         │ User._id       │ Many-to-One     │
│ Promotion       │ course       │ Course._id     │ Many-to-One     │
│ Notice          │ course       │ Course._id     │ Many-to-One     │
│ Applicant       │ course       │ Course._id     │ Many-to-One     │
│ Applicant       │ user         │ User._id       │ Many-to-One     │
│ Schedule        │ course       │ Course._id     │ Many-to-One     │
│ Product         │ category     │ ProdCat._id    │ Many-to-One     │
│ Cart            │ user         │ User._id       │ One-to-One      │
│ Cart.items      │ product      │ Product._id    │ Many-to-Many    │
│ Order           │ user         │ User._id       │ Many-to-One     │
│ Order.items     │ product      │ Product._id    │ Many-to-Many    │
└─────────────────┴──────────────┴────────────────┴─────────────────┘
```

---

## 📊 API Call Patterns by Page

### Homepage

```javascript
// Simultaneous calls on page load
Promise.all([
  axios.get('/api/banner?isActive=true'),
  axios.get('/api/category'),
  axios.get('/api/courses?limit=6') // Featured courses
]);
```

### Course Listing Page

```javascript
// With filters
const [category, setCategory] = useState('');
const [page, setPage] = useState(1);

// Fetch when category or page changes
useEffect(() => {
  axios.get('/api/courses', {
    params: { category, page, limit: 12 }
  });
}, [category, page]);
```

### Course Detail Page

```javascript
// Sequential calls (course first, then details)
const courseId = params.id;

// Step 1: Get course
const course = await axios.get(`/api/courses/${courseId}`);

// Step 2: Get related data in parallel
Promise.all([
  axios.get(`/api/curriculum/course/${courseId}`),
  axios.get(`/api/instructors/course/${courseId}`),
  axios.get(`/api/reviews/course/${courseId}`),
  axios.get(`/api/promotions/course/${courseId}`),
  axios.get(`/api/notices/course/${courseId}`)
]);
```

### Product Page

```javascript
// Similar pattern to courses
axios.get('/api/products', {
  params: { 
    category: selectedCategory,
    page,
    minPrice,
    maxPrice
  }
});
```

### Cart Page

```javascript
// Single call (cart includes populated products)
axios.get('/api/cart', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Checkout Page

```javascript
// Step 1: Show cart summary
const cart = await axios.get('/api/cart', config);

// Step 2: Create order
await axios.post('/api/orders/create', {
  shippingAddress: { /* ... */ },
  paymentMethod: 'card'
}, config);

// Step 3: Cart automatically cleared by backend
```

---

## 🎨 Component Structure Recommendations

### Course Detail Page Example

```javascript
<CoursePage>
  <CourseHeader course={course} />
  
  <Tabs>
    <Tab name="Overview">
      <CourseOverview 
        description={course.description}
        whatYouWillLearn={course.whatYouWillLearn}
        requirements={course.requirements}
      />
    </Tab>
    
    <Tab name="Curriculum">
      <CourseCurriculum courseId={course._id} />
      {/* Fetches: GET /api/curriculum/course/{id} */}
    </Tab>
    
    <Tab name="Instructors">
      <CourseInstructors courseId={course._id} />
      {/* Fetches: GET /api/instructors/course/{id} */}
    </Tab>
    
    <Tab name="Reviews">
      <CourseReviews courseId={course._id} />
      {/* Fetches: GET /api/reviews/course/{id} */}
    </Tab>
  </Tabs>
  
  <CourseSidebar>
    <CoursePrice price={course.price} discounted={course.discountedPrice} />
    <EnrollButton courseId={course._id} />
    <CourseNotices courseId={course._id} />
    {/* Fetches: GET /api/notices/course/{id} */}
  </CourseSidebar>
</CoursePage>
```

---

## 🔐 Authentication Requirements

### Public Endpoints (No Token Required)

```
✅ GET  /api/category
✅ GET  /api/courses
✅ GET  /api/courses/:id
✅ GET  /api/curriculum/course/:id
✅ GET  /api/instructors/course/:id
✅ GET  /api/reviews/course/:id
✅ GET  /api/products
✅ GET  /api/products/:id
✅ GET  /api/banner
✅ POST /api/users/register
✅ POST /api/users/login
```

### Protected Endpoints (Token Required)

```
🔒 GET    /api/users/profile
🔒 PUT    /api/users/profile
🔒 GET    /api/cart
🔒 POST   /api/cart/add
🔒 PUT    /api/cart/update/:id
🔒 DELETE /api/cart/remove/:id
🔒 GET    /api/orders
🔒 POST   /api/orders/create
🔒 POST   /api/applicants
🔒 POST   /api/reviews
```

### Admin Only Endpoints (Token + Admin Role)

```
👑 POST   /api/category
👑 PUT    /api/category/:id
👑 DELETE /api/category/:id
👑 POST   /api/courses
👑 PUT    /api/courses/:id
👑 DELETE /api/courses/:id
👑 POST   /api/products
👑 PUT    /api/products/:id
👑 DELETE /api/products/:id
👑 POST   /api/*/bulk-upload
👑 GET    /api/users (all users)
👑 PUT    /api/users/:id
👑 DELETE /api/users/:id
```

---

## 📦 Data Embedding vs Separate Calls

### When Data is Embedded (Populated)

```javascript
// GET /api/courses/:id
// Returns course WITH embedded data:
{
  _id: "course123",
  title: "Web Development",
  category: {
    _id: "cat123",
    name: "Web Development" // ✅ Embedded
  },
  // curriculum, instructors, reviews also embedded
}

// ✅ Good: Use embedded data for display
// ❌ Don't: Make separate call to /api/category/:id
```

### When to Make Separate Calls

```javascript
// Course page shows basic info initially
const course = await get('/api/courses/:id');

// User clicks "Curriculum" tab
// ✅ Good: Fetch detailed curriculum now
const curriculum = await get('/api/curriculum/course/:id');

// Reason: Curriculum has nested modules/lessons
// Too heavy to embed in main course call
```

---

## 🎯 Quick Reference: What Connects to What

```
Category
└─> Courses

Course
├─> Curriculum (1:1)
├─> Instructors (1:N)
├─> Reviews (1:N)
├─> Promotions (1:N)
├─> Notices (1:N)
├─> Applicants (1:N)
└─> Schedules (1:N)

User
├─> Cart (1:1)
├─> Orders (1:N)
├─> Reviews (1:N)
└─> Applicants (1:N)

ProductCategory
└─> Products (1:N)

Product
├─> Cart Items (N:M)
└─> Order Items (N:M)

Cart
└─> Products (N:M through items)

Order
└─> Products (N:M through items, snapshot)
```

---

## ✅ Frontend Implementation Checklist

### For Each Module:

- [ ] Create service layer functions
- [ ] Implement list view component
- [ ] Implement detail view component
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement pagination (if needed)
- [ ] Add filters/search (if needed)
- [ ] Handle authentication
- [ ] Test CRUD operations
- [ ] Handle relationships (embedded vs separate)

---

**Last Updated:** October 24, 2025  
**Version:** 1.0.0

**Next Steps:**
1. Read [FRONTEND_DEVELOPER_README.md](./FRONTEND_DEVELOPER_README.md)
2. Review specific module guides
3. Start with authentication implementation
4. Build features in recommended order

**Happy Coding! 🚀**

