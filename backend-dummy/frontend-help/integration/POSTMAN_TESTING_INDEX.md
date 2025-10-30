# 🧪 Postman API Testing Index

> **Central hub for all API testing guides across modules**

---

## 📋 Quick Navigation

| Module | Testing Guide | Key Features | Auth Required |
|--------|---------------|--------------|---------------|
| **User** | [View Guide](./user/POSTMAN_TESTING_GUIDE.md) | Registration, Login, Profile, Admin | Mixed |
| **Auth** | [View Guide](./auth/POSTMAN_TESTING_GUIDE.md) | Login, Refresh Token | No |
| **Category** | [View Guide](./category/POSTMAN_TESTING_GUIDE.md) | Course Categories CRUD | Yes (Admin) |
| **Course** | [View Guide](./course/POSTMAN_TESTING_GUIDE.md) | Courses + Curriculum + Reviews + More | Mixed |
| **Cart** | [View Guide](./cart/POSTMAN_TESTING_GUIDE.md) | Shopping Cart Operations | Yes |
| **Order** | [View Guide](./order/POSTMAN_TESTING_GUIDE.md) | Order Management & Tracking | Yes |
| **Product** | [View Guide](./product/POSTMAN_TESTING_GUIDE.md) | Product CRUD & Filters | Mixed |
| **Product Category** | [View Guide](./productCategory/POSTMAN_TESTING_GUIDE.md) | Product Categories CRUD | Yes (Admin) |
| **Banner** | [View Guide](./banner/POSTMAN_TESTING_GUIDE.md) | Banner Management | Mixed |
| **Thumbnail** | [View Guide](./thumbnail/POSTMAN_TESTING_GUIDE.md) | Thumbnail Management | Mixed |
| **Applicant** | [View Guide](./applicant/POSTMAN_TESTING_GUIDE.md) | Class Applications | Mixed |
| **Schedule** | [View Guide](./schedule/POSTMAN_TESTING_GUIDE.md) | Schedule Management | Mixed |
| **Partnership** | [View Guide](./partnership/POSTMAN_TESTING_GUIDE.md) | Partnership Requests | Mixed |

---

## 🚀 Getting Started

### 1. **Initial Setup**

Before testing any API, set up your Postman environment:

```
BASE_URL: http://localhost:5000/api
TOKEN: (Will be set after login)
USER_ID: (Will be set after login)
```

### 2. **Authentication Flow**

Most APIs require authentication. Follow this sequence:

1. **Register a User** → `POST /api/users/register`
2. **Login** → `POST /api/users/login` (Get `token`)
3. **Set Token in Headers** → `Authorization: Bearer {{TOKEN}}`
4. **Test Protected Routes** → Use the token for all subsequent requests

### 3. **Testing Workflow by Module**

#### **For E-commerce Flow:**
```
1. Categories → Create product categories
2. Products → Create products in categories
3. Cart → Add products to cart
4. Order → Place order from cart
```

#### **For Course Management:**
```
1. Category → Create course categories
2. Course → Create courses
3. Curriculum → Add modules/lessons
4. Instructor → Assign instructors
5. Review → Add reviews
6. Promotion → Create promotions
```

---

## 📊 Testing Priority Guide

### **Phase 1: Core Authentication**
- [ ] User Registration
- [ ] User Login
- [ ] Get Profile
- [ ] Update Profile

### **Phase 2: Course System**
- [ ] Create Category
- [ ] Create Course
- [ ] Add Curriculum
- [ ] Get All Courses

### **Phase 3: E-commerce**
- [ ] Create Product Category
- [ ] Create Product
- [ ] Add to Cart
- [ ] Place Order

### **Phase 4: Additional Features**
- [ ] Banners
- [ ] Thumbnails
- [ ] Applicants
- [ ] Schedules
- [ ] Partnerships

---

## 🔑 Common Headers

### **For Public Routes:**
```json
{
  "Content-Type": "application/json"
}
```

### **For Protected Routes:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### **For Admin Routes:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer ADMIN_JWT_TOKEN"
}
```

### **For File Uploads:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```
*Note: Don't set Content-Type for multipart/form-data - Postman sets it automatically*

---

## 🎯 Quick Test Scenarios

### **Scenario 1: New User Journey**
```
1. POST /api/users/register
2. POST /api/users/login
3. GET /api/courses
4. POST /api/cart/add
5. POST /api/orders
```

### **Scenario 2: Admin Course Setup**
```
1. POST /api/users/login (admin)
2. POST /api/categories
3. POST /api/courses
4. POST /api/courses/:id/curriculum
5. POST /api/courses/:id/instructors
```

### **Scenario 3: E-commerce Setup**
```
1. POST /api/users/login (admin)
2. POST /api/product-categories
3. POST /api/products
4. POST /api/banners
5. POST /api/thumbnails
```

---

## 📝 Common Response Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| **200** | Success | Request completed successfully |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Validation error, missing fields |
| **401** | Unauthorized | Missing/invalid token |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Duplicate entry (email, username) |
| **500** | Server Error | Backend error, check logs |

---

## 🧰 Postman Collection Setup

### **Create Environment Variables:**

1. Go to **Environments** in Postman
2. Create new environment: `ClassCrew Dev`
3. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `BASE_URL` | `http://localhost:5000/api` | - |
| `TOKEN` | - | (Auto-set after login) |
| `USER_ID` | - | (Auto-set after login) |
| `ADMIN_TOKEN` | - | (Set manually) |
| `COURSE_ID` | - | (Set as needed) |
| `PRODUCT_ID` | - | (Set as needed) |
| `ORDER_ID` | - | (Set as needed) |

### **Pre-request Script (For Login):**

Add this to your Login request's **Tests** tab to auto-save token:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("TOKEN", response.token);
    pm.environment.set("USER_ID", response.data._id);
}
```

---

## 🔍 Debugging Tips

### **If API Returns 401 Unauthorized:**
- Check if token is set: `{{TOKEN}}`
- Verify token hasn't expired (24h default)
- Re-login to get fresh token

### **If API Returns 400 Bad Request:**
- Check request body matches schema
- Verify all required fields are present
- Check data types (strings vs numbers)

### **If API Returns 404 Not Found:**
- Verify endpoint URL is correct
- Check if resource ID exists
- Ensure base URL is correct

### **If API Returns 500 Server Error:**
- Check backend console logs
- Verify MongoDB is running
- Check environment variables

---

## 📚 Module-Specific Notes

### **User Module:**
- Register first, then login to get token
- Admin routes require `role: "admin"`
- Email verification is optional in dev

### **Course Module:**
- Requires category ID (foreign key)
- Curriculum needs course ID
- Reviews need both course and user ID

### **Cart Module:**
- Auto-calculates totals
- Checks product stock
- One cart per user

### **Order Module:**
- Requires shipping address
- Auto-generates order number
- Updates product stock on creation

### **Product Module:**
- Image upload uses multipart/form-data
- Supports pagination & filtering
- Requires product category ID

---

## 🎓 Testing Best Practices

1. **Always test in order**: Public → Protected → Admin routes
2. **Save IDs**: After creating resources, save their IDs for future tests
3. **Use variables**: Leverage Postman environment variables
4. **Test edge cases**: Try invalid data, missing fields, etc.
5. **Check responses**: Verify data structure matches expected schema
6. **Clean up**: Delete test data after testing (if needed)

---

## 📞 Support

- **Integration Guides**: See individual module folders
- **API Reference**: Check `API_INTEGRATION_GUIDE.md` in each module
- **Backend Issues**: Check server logs at `backend-dummy/`

---

## ✅ Testing Checklist Template

Use this for each module:

```
Module: _____________

□ Read testing guide
□ Set up environment variables
□ Test public endpoints
□ Get authentication token
□ Test protected endpoints (user)
□ Test protected endpoints (admin)
□ Test error cases
□ Document any bugs
□ Clean up test data
```

---

**Happy Testing! 🚀**

*Last Updated: {{ date }}*
