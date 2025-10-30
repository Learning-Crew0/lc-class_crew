# 🎨 Frontend Integration Guide - Complete API Reference

## 📋 Table of Contents

1. [Overview & Architecture](#overview--architecture)
2. [Module Relationships](#module-relationships)
3. [Authentication & User Management](#authentication--user-management)
4. [Course Management](#course-management)
5. [E-Commerce System](#e-commerce-system)
6. [Media Management](#media-management)
7. [Class Operations](#class-operations)
8. [Data Flow Examples](#data-flow-examples)

---

## 🏗️ Overview & Architecture

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication
Most protected routes require a JWT token in the Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 🔗 Module Relationships

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER MODULE                          │
│  (Authentication, Profile, Admin Management)                 │
└──────────────────┬──────────────────────────────────────────┘
                   │ (owns/creates)
                   ├─────────────────────────────────────────┐
                   │                                         │
        ┌──────────▼──────────┐                 ┌───────────▼─────────┐
        │   COURSE SYSTEM     │                 │  E-COMMERCE SYSTEM  │
        │  ┌───────────────┐  │                 │  ┌──────────────┐  │
        │  │   Category    │  │                 │  │  Product     │  │
        │  └───────┬───────┘  │                 │  │  Category    │  │
        │          │           │                 │  └──────┬───────┘  │
        │  ┌───────▼───────┐  │                 │         │          │
        │  │    Course     │◄─┼─────┐           │  ┌──────▼───────┐  │
        │  └───┬───────────┘  │     │           │  │   Product    │  │
        │      │               │     │           │  └──────┬───────┘  │
        │  ┌───▼───────────┐  │     │           │         │          │
        │  │  Curriculum   │  │     │           │  ┌──────▼───────┐  │
        │  │  Instructor   │  │     │           │  │     Cart     │  │
        │  │  Promotion    │  │     │           │  └──────┬───────┘  │
        │  │  Notice       │  │     │           │         │          │
        │  │  Review       │  │     │           │  ┌──────▼───────┐  │
        │  └───────────────┘  │     │           │  │    Order     │  │
        └─────────────────────┘     │           │  └──────────────┘  │
                                    │           └─────────────────────┘
        ┌───────────────────────────┘
        │
        │  ┌─────────────────────────────────────────────────┐
        └──┤           CLASS OPERATIONS                      │
           │  ┌──────────────┐    ┌──────────────┐          │
           │  │  Applicant   │    │  Schedule    │          │
           │  └──────────────┘    └──────────────┘          │
           └─────────────────────────────────────────────────┘

        ┌─────────────────────────────────────────────────────┐
        │              MEDIA MANAGEMENT                        │
        │  ┌──────────────┐    ┌──────────────┐              │
        │  │    Banner    │    │  Thumbnail   │              │
        │  └──────────────┘    └──────────────┘              │
        └─────────────────────────────────────────────────────┘
```

### Key Relationships

1. **User → Course**: Users can browse, enroll, and review courses
2. **Category → Course**: Courses belong to categories (1:N)
3. **Course → Curriculum**: Each course has one curriculum (1:1)
4. **Course → Reviews**: Courses have multiple reviews (1:N)
5. **Course → Promotions**: Courses have multiple promotions (1:N)
6. **Course → Notices**: Courses have multiple notices (1:N)
7. **Course → Instructors**: Courses have multiple instructors (1:N)
8. **User → Cart**: Each user has one cart (1:1)
9. **Cart → Products**: Cart contains multiple products (N:M)
10. **User → Orders**: Users have multiple orders (1:N)
11. **Order → Products**: Orders contain multiple products (N:M)
12. **ProductCategory → Products**: Products belong to categories (1:N)
13. **Course → Applicants**: Courses have multiple applicants (1:N)
14. **Course → Schedule**: Courses have schedules (1:N)

---

## 👤 Authentication & User Management

### Module: `/api/users`

#### 1. Register User (Public)
```javascript
POST /api/users/register

// Request
{
  "email": "student@example.com",
  "username": "student123",
  "password": "Password123",
  "fullName": "John Student",
  "gender": "male",
  "memberType": "student", // student, teacher, staff, admin
  "phone": "1234567890",
  "dob": "2000-01-15",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": false
  },
  "profileImage": "https://example.com/avatar.jpg"
}

// Response
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGc..."
  }
}
```

#### 2. Login (Public)
```javascript
POST /api/users/login

// Request
{
  "emailOrUsername": "student@example.com",
  "password": "Password123"
}

// Response
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGc..."
  }
}
```

#### 3. Get Profile (Protected)
```javascript
GET /api/users/profile
Headers: { Authorization: "Bearer ${token}" }

// Response
{
  "success": true,
  "data": { /* user profile */ }
}
```

#### 4. Update Profile (Protected)
```javascript
PUT /api/users/profile
Headers: { Authorization: "Bearer ${token}" }

// Request
{
  "fullName": "Updated Name",
  "phone": "9876543210",
  "profileImage": "https://new-image.jpg"
}
```

---

## 📚 Course Management

### Module Flow: Category → Course → Curriculum/Instructors/Reviews

### 1. Categories (`/api/category`)

#### Get All Categories
```javascript
GET /api/category

// Response
{
  "success": true,
  "data": [
    {
      "_id": "cat123",
      "name": "Web Development",
      "description": "Learn web development",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Category (Admin)
```javascript
POST /api/category
Headers: { Authorization: "Bearer ${adminToken}" }

// Request
{
  "name": "Web Development",
  "description": "Learn web development",
  "isActive": true
}
```

#### Bulk Upload Categories (Admin)
```javascript
POST /api/categories/bulk-upload
Headers: { 
  Authorization: "Bearer ${adminToken}",
  Content-Type: "multipart/form-data"
}

// Request (FormData)
file: category_template.csv

// CSV Format:
name,description,isActive
Web Development,Learn web dev,true
Mobile Development,Learn mobile dev,true
```

---

### 2. Courses (`/api/courses`)

#### Get All Courses
```javascript
GET /api/courses?page=1&limit=10&category=cat123

// Response
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "course123",
        "title": "Complete Web Development",
        "description": "Full course description",
        "category": {
          "_id": "cat123",
          "name": "Web Development"
        },
        "price": 4999,
        "discountedPrice": 3999,
        "duration": "6 months",
        "level": "Beginner",
        "language": "English",
        "mainImage": "https://image.jpg",
        "whatYouWillLearn": ["HTML", "CSS", "JavaScript"],
        "requirements": ["Basic computer knowledge"],
        "isActive": true,
        "enrollmentCount": 150,
        "averageRating": 4.5
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCourses": 50
    }
  }
}
```

#### Get Single Course
```javascript
GET /api/courses/:id

// Response - Full course details with populated relationships
{
  "success": true,
  "data": {
    "_id": "course123",
    "title": "Complete Web Development",
    "category": { /* category object */ },
    "curriculum": { /* curriculum object */ },
    "instructors": [ /* instructor array */ ],
    "reviews": [ /* review array */ ],
    "promotions": [ /* promotion array */ ],
    "notices": [ /* notice array */ ]
  }
}
```

#### Create Course (Admin)
```javascript
POST /api/courses
Headers: { Authorization: "Bearer ${adminToken}" }

// Request
{
  "title": "Complete Web Development",
  "description": "Full course description",
  "category": "cat123",
  "price": 4999,
  "discountedPrice": 3999,
  "duration": "6 months",
  "level": "Beginner",
  "language": "English",
  "mainImage": "https://image.jpg",
  "whatYouWillLearn": ["HTML", "CSS", "JavaScript"],
  "requirements": ["Basic computer knowledge"],
  "isActive": true
}
```

---

### 3. Curriculum (`/api/curriculum`)

#### Get Course Curriculum
```javascript
GET /api/curriculum/course/:courseId

// Response
{
  "success": true,
  "data": {
    "_id": "curr123",
    "course": "course123",
    "modules": [
      {
        "moduleNumber": 1,
        "title": "Introduction to HTML",
        "description": "Learn HTML basics",
        "lessons": [
          {
            "lessonNumber": 1,
            "title": "HTML Elements",
            "duration": "30 mins",
            "videoUrl": "https://video.mp4",
            "isFree": true
          }
        ]
      }
    ],
    "keywords": ["html", "css", "javascript"],
    "totalDuration": "20 hours"
  }
}
```

---

### 4. Instructors (`/api/instructors`)

#### Get Course Instructors
```javascript
GET /api/instructors/course/:courseId

// Response
{
  "success": true,
  "data": [
    {
      "_id": "inst123",
      "course": "course123",
      "name": "John Doe",
      "bio": "Experienced developer",
      "image": "https://image.jpg",
      "designation": "Senior Developer",
      "socialLinks": {
        "linkedin": "https://linkedin.com/in/john",
        "twitter": "https://twitter.com/john",
        "github": "https://github.com/john"
      },
      "expertise": ["JavaScript", "React", "Node.js"],
      "yearsOfExperience": 10
    }
  ]
}
```

---

### 5. Reviews (`/api/reviews`)

#### Get Course Reviews
```javascript
GET /api/reviews/course/:courseId?page=1&limit=10

// Response
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "rev123",
        "course": "course123",
        "user": {
          "_id": "user123",
          "fullName": "Jane Student",
          "profileImage": "https://image.jpg"
        },
        "rating": 5,
        "comment": "Excellent course!",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

#### Create Review (Protected)
```javascript
POST /api/reviews
Headers: { Authorization: "Bearer ${token}" }

// Request
{
  "course": "course123",
  "rating": 5,
  "comment": "Excellent course!"
}
```

---

### 6. Promotions (`/api/promotions`)

#### Get Course Promotions
```javascript
GET /api/promotions/course/:courseId

// Response
{
  "success": true,
  "data": [
    {
      "_id": "promo123",
      "course": "course123",
      "title": "Limited Time Offer",
      "description": "Get 50% off",
      "images": ["https://image1.jpg", "https://image2.jpg"],
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.000Z",
      "isActive": true
    }
  ]
}
```

---

### 7. Notices (`/api/notices`)

#### Get Course Notices
```javascript
GET /api/notices/course/:courseId

// Response
{
  "success": true,
  "data": [
    {
      "_id": "notice123",
      "course": "course123",
      "title": "Class Postponed",
      "message": "Next class will be on Monday",
      "priority": "high", // low, medium, high
      "isActive": true,
      "createdAt": "2024-01-20T00:00:00.000Z"
    }
  ]
}
```

---

## 🛒 E-Commerce System

### Module Flow: ProductCategory → Product → Cart → Order

### 1. Product Categories (`/api/product-categories`)

#### Get All Product Categories
```javascript
GET /api/product-categories

// Response
{
  "success": true,
  "data": [
    {
      "_id": "pcat123",
      "name": "Books",
      "description": "Educational books",
      "image": "https://image.jpg",
      "isActive": true,
      "productCount": 25
    }
  ]
}
```

#### Create Product Category (Admin)
```javascript
POST /api/product-categories
Headers: { Authorization: "Bearer ${adminToken}" }

// Request
{
  "name": "Books",
  "description": "Educational books",
  "image": "https://image.jpg",
  "isActive": true
}
```

---

### 2. Products (`/api/products`)

#### Get All Products
```javascript
GET /api/products?page=1&limit=10&category=pcat123&minPrice=100&maxPrice=5000

// Response
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "prod123",
        "name": "JavaScript Book",
        "description": "Complete JS guide",
        "category": {
          "_id": "pcat123",
          "name": "Books"
        },
        "price": 999,
        "discountPrice": 799,
        "stock": 50,
        "images": ["https://image1.jpg", "https://image2.jpg"],
        "specifications": {
          "author": "John Doe",
          "pages": 500,
          "language": "English"
        },
        "tags": ["javascript", "programming"],
        "isActive": true,
        "averageRating": 4.5,
        "reviewCount": 25
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalProducts": 25
    }
  }
}
```

#### Get Products by Category
```javascript
GET /api/products/category/:categoryId?page=1&limit=10

// Same response structure as above
```

#### Get Single Product
```javascript
GET /api/products/:id

// Response - Full product details
{
  "success": true,
  "data": {
    "_id": "prod123",
    "name": "JavaScript Book",
    // ... all product fields
    "category": { /* full category object */ },
    "relatedProducts": [ /* similar products */ ]
  }
}
```

---

### 3. Cart (`/api/cart`)

#### Get User Cart
```javascript
GET /api/cart
Headers: { Authorization: "Bearer ${token}" }

// Response
{
  "success": true,
  "data": {
    "_id": "cart123",
    "user": "user123",
    "items": [
      {
        "product": {
          "_id": "prod123",
          "name": "JavaScript Book",
          "price": 999,
          "discountPrice": 799,
          "images": ["https://image.jpg"],
          "stock": 50
        },
        "quantity": 2,
        "priceAtTime": 799,
        "subtotal": 1598
      }
    ],
    "totalAmount": 1598,
    "itemCount": 2
  }
}
```

#### Add to Cart
```javascript
POST /api/cart/add
Headers: { Authorization: "Bearer ${token}" }

// Request
{
  "productId": "prod123",
  "quantity": 2
}

// Response
{
  "success": true,
  "message": "Product added to cart",
  "data": { /* updated cart */ }
}
```

#### Update Cart Item
```javascript
PUT /api/cart/update/:productId
Headers: { Authorization: "Bearer ${token}" }

// Request
{
  "quantity": 3
}
```

#### Remove from Cart
```javascript
DELETE /api/cart/remove/:productId
Headers: { Authorization: "Bearer ${token}" }
```

#### Clear Cart
```javascript
DELETE /api/cart/clear
Headers: { Authorization: "Bearer ${token}" }
```

---

### 4. Orders (`/api/orders`)

#### Get User Orders
```javascript
GET /api/orders?page=1&limit=10&status=pending
Headers: { Authorization: "Bearer ${token}" }

// Response
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "order123",
        "orderNumber": "ORD-20240120-001",
        "user": "user123",
        "items": [
          {
            "product": {
              "_id": "prod123",
              "name": "JavaScript Book"
            },
            "quantity": 2,
            "price": 799,
            "subtotal": 1598
          }
        ],
        "subtotal": 1598,
        "tax": 287.64,
        "shippingCharge": 50,
        "discount": 0,
        "totalAmount": 1935.64,
        "status": "pending", // pending, confirmed, shipped, delivered, cancelled
        "paymentStatus": "pending",
        "paymentMethod": "card",
        "shippingAddress": {
          "fullName": "John Doe",
          "phone": "1234567890",
          "addressLine1": "123 Main St",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400001"
        },
        "createdAt": "2024-01-20T10:00:00.000Z"
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

#### Create Order (Checkout)
```javascript
POST /api/orders/create
Headers: { Authorization: "Bearer ${token}" }

// Request
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "1234567890",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "card" // card, upi, cod
}

// Response
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": { /* order object */ },
    "paymentDetails": { /* payment gateway info */ }
  }
}
```

#### Get Single Order
```javascript
GET /api/orders/:id
Headers: { Authorization: "Bearer ${token}" }
```

#### Cancel Order
```javascript
PUT /api/orders/:id/cancel
Headers: { Authorization: "Bearer ${token}" }
```

#### Track Order
```javascript
GET /api/orders/:id/track
Headers: { Authorization: "Bearer ${token}" }

// Response
{
  "success": true,
  "data": {
    "orderNumber": "ORD-20240120-001",
    "status": "shipped",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-20T10:00:00.000Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-01-20T11:00:00.000Z"
      },
      {
        "status": "shipped",
        "timestamp": "2024-01-21T09:00:00.000Z",
        "trackingNumber": "TRACK123456"
      }
    ]
  }
}
```

---

## 📸 Media Management

### 1. Banners (`/api/banner`)

#### Get All Banners
```javascript
GET /api/banner

// Response
{
  "success": true,
  "data": [
    {
      "_id": "banner123",
      "title": "New Course Launch",
      "description": "Check out our latest courses",
      "image": "https://banner-image.jpg",
      "link": "/courses/new-course",
      "isActive": true,
      "displayOrder": 1,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.000Z"
    }
  ]
}
```

#### Create Banner (Admin)
```javascript
POST /api/banner
Headers: { 
  Authorization: "Bearer ${adminToken}",
  Content-Type: "multipart/form-data"
}

// Request (FormData)
title: "New Course Launch"
description: "Check out our latest courses"
image: [File]
link: "/courses/new-course"
isActive: true
displayOrder: 1
```

---

### 2. Thumbnails (`/api/thumbnail`)

#### Get All Thumbnails
```javascript
GET /api/thumbnail

// Response
{
  "success": true,
  "data": [
    {
      "_id": "thumb123",
      "title": "Course Thumbnail",
      "image": "https://thumbnail.jpg",
      "altText": "Course image",
      "category": "course",
      "isActive": true
    }
  ]
}
```

---

## 🎓 Class Operations

### 1. Applicants (`/api/applicants`)

#### Submit Application
```javascript
POST /api/applicants
Headers: { Authorization: "Bearer ${token}" }

// Request
{
  "course": "course123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "education": "Bachelor's in Computer Science",
  "experience": "2 years",
  "motivation": "I want to learn web development",
  "resume": "https://resume-url.pdf"
}

// Response
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "app123",
    "applicationNumber": "APP-20240120-001",
    "status": "pending" // pending, approved, rejected
  }
}
```

#### Get My Applications
```javascript
GET /api/applicants/my-applications
Headers: { Authorization: "Bearer ${token}" }

// Response
{
  "success": true,
  "data": [
    {
      "_id": "app123",
      "course": {
        "_id": "course123",
        "title": "Complete Web Development"
      },
      "status": "pending",
      "submittedAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Schedules (`/api/schedules`)

#### Get Course Schedule
```javascript
GET /api/schedules/course/:courseId

// Response
{
  "success": true,
  "data": [
    {
      "_id": "sched123",
      "course": "course123",
      "title": "Live Class - HTML Basics",
      "description": "Introduction to HTML",
      "startTime": "2024-01-25T10:00:00.000Z",
      "endTime": "2024-01-25T12:00:00.000Z",
      "meetingLink": "https://zoom.us/j/123456",
      "instructor": {
        "_id": "inst123",
        "name": "John Doe"
      },
      "isRecurring": false,
      "status": "scheduled" // scheduled, ongoing, completed, cancelled
    }
  ]
}
```

---

## 🔄 Data Flow Examples

### Example 1: User Browsing to Course Enrollment

```javascript
// 1. User browses categories
GET /api/category
// Returns: List of all categories

// 2. User selects a category and views courses
GET /api/courses?category=cat123
// Returns: Courses in that category

// 3. User clicks on a specific course
GET /api/courses/course123
// Returns: Full course details with curriculum, instructors, reviews

// 4. User views course curriculum
GET /api/curriculum/course/course123
// Returns: All modules and lessons

// 5. User reads reviews
GET /api/reviews/course/course123
// Returns: All reviews for the course

// 6. User applies for the course (if authenticated)
POST /api/applicants
Body: { course: "course123", fullName: "...", ... }
// Returns: Application confirmation

// 7. User checks schedule
GET /api/schedules/course/course123
// Returns: Upcoming classes
```

---

### Example 2: E-Commerce Shopping Flow

```javascript
// 1. User browses product categories
GET /api/product-categories
// Returns: All product categories

// 2. User views products in a category
GET /api/products/category/pcat123
// Returns: Products in that category

// 3. User views product details
GET /api/products/prod123
// Returns: Full product details

// 4. User adds product to cart (authenticated)
POST /api/cart/add
Body: { productId: "prod123", quantity: 2 }
// Returns: Updated cart

// 5. User views cart
GET /api/cart
// Returns: Cart with all items and totals

// 6. User updates quantity
PUT /api/cart/update/prod123
Body: { quantity: 3 }
// Returns: Updated cart

// 7. User proceeds to checkout
POST /api/orders/create
Body: { shippingAddress: {...}, paymentMethod: "card" }
// Returns: Order details and payment info

// 8. User tracks order
GET /api/orders/order123/track
// Returns: Order status and tracking info
```

---

### Example 3: Admin Course Management Flow

```javascript
// 1. Admin creates a category
POST /api/category
Body: { name: "Web Development", description: "..." }
// Returns: Created category

// 2. Admin bulk uploads courses
POST /api/courses/bulk-upload
Body: FormData with CSV file
// Returns: Upload summary

// 3. Admin adds curriculum for a course
POST /api/curriculums/bulk-upload
Body: FormData with CSV file
// Returns: Upload summary

// 4. Admin adds instructors
POST /api/instructors/bulk-upload
Body: FormData with CSV file
// Returns: Upload summary

// 5. Admin creates promotions
POST /api/promotions/bulk-upload
Body: FormData with CSV file
// Returns: Upload summary

// 6. Admin adds notices
POST /api/notices/bulk-upload
Body: FormData with CSV file
// Returns: Upload summary
```

---

## 📊 Complete Module Summary

### Authentication Required Modules
| Module | Endpoint | Auth Required | Admin Only |
|--------|----------|---------------|------------|
| User Register | POST /api/users/register | ❌ | ❌ |
| User Login | POST /api/users/login | ❌ | ❌ |
| User Profile | GET /api/users/profile | ✅ | ❌ |
| User Management | GET /api/users | ✅ | ✅ |
| Categories | GET /api/category | ❌ | ❌ |
| Create Category | POST /api/category | ✅ | ✅ |
| Courses | GET /api/courses | ❌ | ❌ |
| Create Course | POST /api/courses | ✅ | ✅ |
| Products | GET /api/products | ❌ | ❌ |
| Create Product | POST /api/products | ✅ | ✅ |
| Cart | GET /api/cart | ✅ | ❌ |
| Orders | GET /api/orders | ✅ | ❌ |
| Applicants | POST /api/applicants | ✅ | ❌ |
| Schedules | GET /api/schedules | ❌ | ❌ |
| Banners | GET /api/banner | ❌ | ❌ |
| Create Banner | POST /api/banner | ✅ | ✅ |

---

## 🛠️ Frontend Implementation Tips

### 1. State Management (Redux/Context Example)

```javascript
// User State
{
  user: {
    isAuthenticated: false,
    token: null,
    profile: null
  }
}

// Course State
{
  courses: {
    list: [],
    selected: null,
    filters: { category: null, search: "" }
  }
}

// Cart State
{
  cart: {
    items: [],
    totalAmount: 0,
    itemCount: 0
  }
}

// Order State
{
  orders: {
    list: [],
    selected: null
  }
}
```

### 2. API Service Layer Example

```javascript
// api/userService.js
export const userService = {
  register: (data) => axios.post('/api/users/register', data),
  login: (data) => axios.post('/api/users/login', data),
  getProfile: (token) => axios.get('/api/users/profile', {
    headers: { Authorization: `Bearer ${token}` }
  })
};

// api/courseService.js
export const courseService = {
  getAll: (params) => axios.get('/api/courses', { params }),
  getById: (id) => axios.get(`/api/courses/${id}`),
  getCurriculum: (courseId) => axios.get(`/api/curriculum/course/${courseId}`)
};

// api/cartService.js
export const cartService = {
  get: (token) => axios.get('/api/cart', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  add: (data, token) => axios.post('/api/cart/add', data, {
    headers: { Authorization: `Bearer ${token}` }
  })
};
```

### 3. Error Handling

```javascript
// All API responses follow this structure:
{
  "success": true/false,
  "message": "Success/Error message",
  "data": { /* response data */ },
  "error": "Error details" // only on failure
}

// Handle errors consistently:
try {
  const response = await api.get('/endpoint');
  if (response.data.success) {
    // Handle success
    return response.data.data;
  }
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.data.message);
  } else {
    // Network error
    console.error('Network error');
  }
}
```

---

## 📝 Quick Reference Links

- [User API Testing Guide](./src/modules/user/USER_API_TESTING_GUIDE.md)
- [Product, Cart, Order API Guide](./PRODUCT_CART_ORDER_API_TESTING_GUIDE.md)
- [Category Bulk Upload Guide](./CATEGORY_BULK_UPLOAD_GUIDE.md)

---

**Last Updated:** October 24, 2025  
**Version:** 1.0.0

