# 🛒 Shopping Cart & Class Application API Guide

## 📦 Quick Reference

### **Shopping Cart Flow:**

Browse Course → Add to Cart → View Cart → Proceed to Application → Submit Application

### **Base URL:**

```
https://class-crew.onrender.com/api/v1
```

---

## 🛒 SHOPPING CART APIs

### **1. Add Course to Cart**

```http
POST /cart/add
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
    "itemType": "course",
    "productId": "COURSE_ID",
    "trainingSchedule": "TRAINING_SCHEDULE_ID",
    "quantity": 1
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Course added to cart successfully",
  "data": {
    "items": [...],
    "totalPrice": 3400,
    "itemCount": 1
  }
}
```

---

### **2. Get Cart**

```http
GET /cart
Authorization: Bearer {token}
```

**Response:**

```json
{
    "status": "success",
    "data": {
        "items": [
            {
                "course": {
                    "_id": "691580448efde7ad4ecc5032",
                    "title": "REACT PROPS",
                    "price": 3400,
                    "mainImage": "/uploads/courses/..."
                },
                "courseSchedule": {
                    "_id": "6915a56c09172ef24f579b8b",
                    "scheduleName": "2024년 3월 정기과정",
                    "startDate": "2024-03-15",
                    "availableSeats": 30
                },
                "quantity": 1,
                "price": 3400
            }
        ],
        "totalPrice": 3400,
        "itemCount": 1
    }
}
```

---

### **3. Remove from Cart**

```http
DELETE /cart/remove/:productId?itemType=course&scheduleId=SCHEDULE_ID
Authorization: Bearer {token}
```

**Response:**

```json
{
    "status": "success",
    "message": "Item removed from cart successfully"
}
```

---

### **4. Clear Cart**

```http
DELETE /cart/clear
Authorization: Bearer {token}
```

---

## 📝 CLASS APPLICATION APIs

### **1. Get Multiple Courses (for Application)**

```http
GET /enrollments/courses?ids=COURSE_ID1,COURSE_ID2,COURSE_ID3
```

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": "691580448efde7ad4ecc5032",
      "title": "REACT PROPS",
      "price": 3400,
      "mainImage": "/uploads/courses/...",
      "trainingSchedules": [...]
    }
  ]
}
```

---

### **2. Create Class Application (Enrollment)**

```http
POST /enrollments
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
    "studentInfo": {
        "name": "홍길동",
        "email": "hong@example.com",
        "phone": "010-1234-5678",
        "company": "ABC Company",
        "department": "Development",
        "position": "Developer"
    },
    "courses": [
        {
            "courseId": "691580448efde7ad4ecc5032",
            "trainingScheduleId": "6915a56c09172ef24f579b8b",
            "price": 3400
        }
    ],
    "paymentInfo": {
        "method": "card",
        "amount": 3400
    },
    "termsAgreed": true
}
```

**Response:**

```json
{
    "status": "success",
    "message": "수강 신청이 완료되었습니다",
    "data": {
        "enrollmentId": "691234567890abcdef123456",
        "applicationNumber": "APP-20240313-001",
        "status": "pending",
        "totalAmount": 3400
    }
}
```

---
    
### **3. Get My Enrollments**

```http
GET /enrollments?page=1&limit=10
Authorization: Bearer {token}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "enrollments": [
      {
        "_id": "691234567890abcdef123456",
        "applicationNumber": "APP-20240313-001",
        "courses": [...],
        "status": "approved",
        "totalAmount": 3400,
        "createdAt": "2024-03-13T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1
    }
  }
}
```

---

## 🔄 Complete User Flow

### **Step 1: Browse & Add to Cart**

```javascript
// User clicks "Add to Cart" on course detail page
const addToCart = async (courseId, scheduleId) => {
    const response = await fetch(
        "https://class-crew.onrender.com/api/v1/cart/add",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                itemType: "course",
                productId: courseId,
                trainingSchedule: scheduleId,
                quantity: 1,
            }),
        }
    );
    return response.json();
};
```

---

### **Step 2: View Cart**

```javascript
// User navigates to cart page
const getCart = async () => {
    const response = await fetch(
        "https://class-crew.onrender.com/api/v1/cart",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.json();
};
```

---

### **Step 3: Proceed to Application**

```javascript
// User clicks "Proceed to Application" with selected courses
const selectedCourses = cartItems
    .filter((item) => item.selected)
    .map((item) => ({
        courseId: item.course._id,
        trainingScheduleId: item.courseSchedule._id,
        price: item.price,
    }));

// Navigate to application page with selected courses
router.push({
    pathname: "/class-application",
    query: {
        courses: JSON.stringify(selectedCourses),
    },
});
```

---

### **Step 4: Submit Application**

```javascript
// User fills form and submits application
const submitApplication = async (formData) => {
    const response = await fetch(
        "https://class-crew.onrender.com/api/v1/enrollments",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                studentInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    department: formData.department,
                    position: formData.position,
                },
                courses: selectedCourses,
                paymentInfo: {
                    method: formData.paymentMethod,
                    amount: totalAmount,
                },
                termsAgreed: formData.termsAgreed,
            }),
        }
    );
    return response.json();
};
```

---

### **Step 5: View Application Status**

```javascript
// User checks their applications
const getMyApplications = async () => {
    const response = await fetch(
        "https://class-crew.onrender.com/api/v1/enrollments?page=1&limit=10",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.json();
};
```

---

## 🎯 Frontend API Functions

### **Create `src/utils/api.ts`**

```typescript
// Cart APIs
export const cartAPI = {
    // Add course to cart
    addCourse: (courseId: string, scheduleId: string) =>
        fetch(`${API_BASE}/cart/add`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                itemType: "course",
                productId: courseId,
                trainingSchedule: scheduleId,
                quantity: 1,
            }),
        }).then((r) => r.json()),

    // Get cart
    getCart: () =>
        fetch(`${API_BASE}/cart`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        }).then((r) => r.json()),

    // Remove from cart
    remove: (productId: string, scheduleId: string) =>
        fetch(
            `${API_BASE}/cart/remove/${productId}?itemType=course&scheduleId=${scheduleId}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            }
        ).then((r) => r.json()),

    // Clear cart
    clear: () =>
        fetch(`${API_BASE}/cart/clear`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        }).then((r) => r.json()),
};

// Enrollment APIs
export const enrollmentAPI = {
    // Get courses for application
    getCourses: (courseIds: string[]) =>
        fetch(
            `${API_BASE}/enrollments/courses?ids=${courseIds.join(",")}`
        ).then((r) => r.json()),

    // Create enrollment/application
    create: (applicationData: ApplicationData) =>
        fetch(`${API_BASE}/enrollments`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(applicationData),
        }).then((r) => r.json()),

    // Get my enrollments
    getMyEnrollments: (page = 1, limit = 10) =>
        fetch(`${API_BASE}/enrollments?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        }).then((r) => r.json()),
};
```

---

## ⚠️ Important Notes

### **Field Names:**

- ✅ Use `trainingSchedule` (not `courseSchedule`)
- ✅ Use `productId` for course ID
- ✅ `itemType` must be `"course"` or `"product"`

### **Authentication:**

- All cart and enrollment APIs require `Authorization: Bearer {token}`
- Token is obtained after login

### **Validation:**

- Training schedule is **required** for courses
- All student info fields are **required**
- Terms agreement must be `true`
- Payment amount must match total course price

### **Error Handling:**

```javascript
const response = await cartAPI.addCourse(courseId, scheduleId);

if (response.status === "success") {
    // Success
    toast.success(response.message);
} else {
    // Error
    toast.error(response.message);
}
```

---

## 📊 Response Status Codes

| Code | Meaning      | Action                    |
| ---- | ------------ | ------------------------- |
| 200  | Success      | Process response          |
| 201  | Created      | Item added successfully   |
| 400  | Bad Request  | Check request data        |
| 401  | Unauthorized | Redirect to login         |
| 404  | Not Found    | Course/schedule not found |
| 500  | Server Error | Show error message        |

---

## 🧪 Testing with cURL

### **Add to Cart:**

```bash
curl -X POST "https://class-crew.onrender.com/api/v1/cart/add" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "course",
    "productId": "691580448efde7ad4ecc5032",
    "trainingSchedule": "6915a56c09172ef24f579b8b",
    "quantity": 1
  }'
```

### **Get Cart:**

```bash
curl -X GET "https://class-crew.onrender.com/api/v1/cart" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Create Application:**

```bash
curl -X POST "https://class-crew.onrender.com/api/v1/enrollments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentInfo": {
      "name": "홍길동",
      "email": "hong@example.com",
      "phone": "010-1234-5678"
    },
    "courses": [{
      "courseId": "691580448efde7ad4ecc5032",
      "trainingScheduleId": "6915a56c09172ef24f579b8b",
      "price": 3400
    }],
    "paymentInfo": {
      "method": "card",
      "amount": 3400
    },
    "termsAgreed": true
  }'
```

---

## ✅ Integration Checklist

- [ ] Add `cartAPI` functions to frontend
- [ ] Add `enrollmentAPI` functions to frontend
- [ ] Implement cart page UI
- [ ] Implement application form UI
- [ ] Add error handling for all API calls
- [ ] Add loading states during API calls
- [ ] Test complete flow from cart to application
- [ ] Handle authentication errors (redirect to login)

---

## 📚 Related Documentation

- **Full API List:** `CLASS_API_ENDPOINTS.md`
- **Course Detail APIs:** `CLASS_DETAIL_PAGE_BACKEND_STATUS.md`
- **Data Population:** `DATA_POPULATION_COMPLETE_GUIDE.md`

---

**All APIs are production-ready!** 🚀
