# 📚 Course System - Complete Frontend Integration Guide

**Status:** ✅ **ALL BACKEND APIs READY**  
**Date:** November 13, 2025  
**Base URL:** `https://class-crew.onrender.com/api/v1`  
**Local URL:** `http://localhost:5000/api/v1`

---

## 📋 Table of Contents

1. [Complete API Overview](#complete-api-overview)
2. [Frontend Components Mapping](#frontend-components-mapping)
3. [Course Detail Page Integration](#course-detail-page-integration)
4. [Shopping Cart Integration](#shopping-cart-integration)
5. [Class Application Integration](#class-application-integration)
6. [Complete User Flow](#complete-user-flow)
7. [Frontend API Functions](#frontend-api-functions)
8. [Error Handling](#error-handling)

---

## 🔌 Complete API Overview

### ✅ ALREADY IMPLEMENTED - Course APIs

| Method | Endpoint                                | Auth   | Description                  |
| ------ | --------------------------------------- | ------ | ---------------------------- |
| GET    | `/courses`                              | Public | Get all courses with filters |
| GET    | `/courses/:id`                          | Public | Get single course details    |
| GET    | `/courses/:courseId/curriculum`         | Public | Get course curriculum        |
| GET    | `/courses/:courseId/instructors`        | Public | Get course instructors       |
| GET    | `/courses/:courseId/promotions`         | Public | Get course promotions        |
| GET    | `/courses/:courseId/reviews`            | Public | Get course reviews           |
| GET    | `/courses/:courseId/notice`             | Public | Get course notice            |
| GET    | `/courses/:courseId/training-schedules` | Public | Get training schedules       |

### ✅ ALREADY IMPLEMENTED - Cart APIs

| Method | Endpoint                     | Auth     | Description                          |
| ------ | ---------------------------- | -------- | ------------------------------------ |
| GET    | `/cart`                      | Required | Get user's cart                      |
| POST   | `/cart/add`                  | Required | Add course/product to cart           |
| PUT    | `/cart/update/:productId`    | Required | Update cart item quantity            |
| DELETE | `/cart/remove/:productId`    | Required | Remove item from cart                |
| POST   | `/cart/get-selected-courses` | Required | Get selected courses for application |
| DELETE | `/cart/clear`                | Required | Clear entire cart                    |

### ✅ ALREADY IMPLEMENTED - Enrollment APIs

| Method | Endpoint                                                   | Auth     | Description            |
| ------ | ---------------------------------------------------------- | -------- | ---------------------- |
| POST   | `/courses/:courseId/training-schedules/:scheduleId/enroll` | Required | Enroll in a schedule   |
| GET    | `/enrollments`                                             | Required | Get my enrollments     |
| GET    | `/enrollments/:id`                                         | Required | Get enrollment details |
| PATCH  | `/enrollments/:id/progress`                                | Required | Update progress        |
| POST   | `/enrollments/:id/refund`                                  | Required | Request refund         |
| DELETE | `/enrollments/:id`                                         | Required | Cancel enrollment      |

---

## 🗺️ Frontend Components Mapping

### Course Detail Page (`/class/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│ Course Detail Page (/class/[id])                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. ClassGoal Component                                      │
│    API: GET /courses/:id                                    │
│    Uses: course.learningGoals                               │
│                                                             │
│ 2. Curriculum Component                                     │
│    API: GET /courses/:courseId/curriculum                   │
│    Uses: curriculum.keywords, curriculum.modules            │
│                                                             │
│ 3. Instructor Component                                     │
│    API: GET /courses/:courseId/instructors                  │
│    Uses: instructor.name, education, expertise, etc.        │
│                                                             │
│ 4. Recommend Component                                      │
│    API: GET /courses/:courseId/reviews                      │
│    Uses: reviews array                                      │
│                                                             │
│ 5. Promotion Component                                      │
│    API: GET /courses/:courseId/promotions                   │
│    Uses: promotions.images                                  │
│                                                             │
│ 6. Notice Component                                         │
│    API: GET /courses/:courseId/notice                       │
│    Uses: notice.content, notice.image                       │
│                                                             │
│ 7. Schedule Selection & Add to Cart                         │
│    API: GET /courses/:courseId/training-schedules           │
│    API: POST /cart/add                                      │
│    Uses: schedules array, selected schedule                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📖 Course Detail Page Integration

### 1. Get Course Details

**API:** `GET /courses/:id`

**Frontend Usage:**

```typescript
// src/app/class/[id]/page.tsx

useEffect(() => {
    const fetchCourseDetails = async () => {
        const response = await getCourseById(courseId);
        if (response.success) {
            setCourse(response.data);
        }
    };
    fetchCourseDetails();
}, [courseId]);
```

**Response Structure:**

```typescript
interface CourseDetail {
    _id: string;
    title: string;
    description: string;
    price: number;
    discountRate: number;
    finalPrice: number;
    thumbnail: string;
    mainImage: string;
    hoverImage: string;
    duration: string;
    difficulty: string;
    category: {
        _id: string;
        name: string;
    };
    learningGoals: string[]; // For ClassGoal component
    targetAudience: string[];
    prerequisites: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
```

---

### 2. Get Curriculum

**API:** `GET /courses/:courseId/curriculum`

**Frontend Component:** `Curriculum`

**Usage:**

```typescript
// src/components/CourseDetail/Curriculum.tsx

useEffect(() => {
    const fetchCurriculum = async () => {
        const response = await getCourseCurriculum(courseId);
        if (response.success) {
            setCurriculum(response.data);
        }
    };
    fetchCurriculum();
}, [courseId]);
```

**Response Structure:**

```typescript
interface Curriculum {
    _id: string;
    course: string;
    keywords: string[]; // ["커뮤니케이션", "리더십", "소통"]
    modules: Array<{
        _id: string;
        name: string; // "Module 1: 기본 개념"
        content: string; // "상세 설명..."
        order: number;
    }>;
}
```

**Frontend Display:**

```tsx
<div className="curriculum">
    <h3>Keywords</h3>
    <div className="keywords">
        {curriculum.keywords.map((keyword, index) => (
            <span key={index} className="keyword">
                {keyword}
            </span>
        ))}
    </div>

    <h3>Modules</h3>
    {curriculum.modules.map((module, index) => (
        <div key={module._id} className="module">
            <h4>{module.name}</h4>
            <p>{module.content}</p>
        </div>
    ))}
</div>
```

---

### 3. Get Instructors

**API:** `GET /courses/:courseId/instructors`

**Frontend Component:** `Instructor`

**Usage:**

```typescript
// src/components/CourseDetail/Instructor.tsx

useEffect(() => {
    const fetchInstructors = async () => {
        const response = await getCourseInstructors(courseId);
        if (response.success) {
            setInstructors(response.data);
        }
    };
    fetchInstructors();
}, [courseId]);
```

**Response Structure:**

```typescript
interface Instructor {
    _id: string;
    name: string;
    profileImage: string;
    education: string[]; // ["서울대학교 경영학과", "하버드 MBA"]
    expertise: string[]; // ["리더십", "커뮤니케이션"]
    certificates: string[]; // ["공인 코치", "MBA"]
    experience: string[]; // ["삼성전자 10년", "구글 5년"]
    bio: string;
}
```

**Frontend Display:**

```tsx
{
    instructors.map((instructor) => (
        <div key={instructor._id} className="instructor">
            <img src={instructor.profileImage} alt={instructor.name} />
            <h3>{instructor.name}</h3>

            <div className="education">
                <h4>Education</h4>
                <ul>
                    {instructor.education.map((edu, idx) => (
                        <li key={idx}>{edu}</li>
                    ))}
                </ul>
            </div>

            <div className="expertise">
                <h4>Expertise</h4>
                {instructor.expertise.map((exp, idx) => (
                    <span key={idx}>{exp}</span>
                ))}
            </div>
        </div>
    ));
}
```

---

### 4. Get Reviews

**API:** `GET /courses/:courseId/reviews`

**Frontend Component:** `Recommend`

**Usage:**

```typescript
// src/components/CourseDetail/Recommend.tsx

useEffect(() => {
    const fetchReviews = async () => {
        const response = await getCourseReviews(courseId);
        if (response.success) {
            setReviews(response.data);
        }
    };
    fetchReviews();
}, [courseId]);
```

**Response Structure:**

```typescript
interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    rating: number; // 1-5
    content: string;
    avatar: string;
    isVerified: boolean;
    createdAt: string;
}
```

**Frontend Display:**

```tsx
<div className="reviews">
    {reviews.map((review) => (
        <div key={review._id} className="review">
            <img src={review.avatar} alt={review.user.name} />
            <div className="review-content">
                <h4>{review.user.name}</h4>
                <div className="rating">{"⭐".repeat(review.rating)}</div>
                <p>{review.content}</p>
                <span className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    ))}
</div>
```

---

### 5. Get Promotions

**API:** `GET /courses/:courseId/promotions`

**Frontend Component:** `Promotion`

**Usage:**

```typescript
// src/components/CourseDetail/Promotion.tsx

useEffect(() => {
    const fetchPromotions = async () => {
        const response = await getCoursePromotions(courseId);
        if (response.success) {
            setPromotions(response.data);
        }
    };
    fetchPromotions();
}, [courseId]);
```

**Response Structure:**

```typescript
interface Promotion {
    _id: string;
    course: string;
    title: string;
    description: string;
    images: string[]; // Array of image URLs
    startDate: string;
    endDate: string;
    isActive: boolean;
}
```

**Frontend Display:**

```tsx
<div className="promotions">
    {promotions.map((promo) => (
        <div key={promo._id} className="promotion">
            <h3>{promo.title}</h3>
            <p>{promo.description}</p>
            <div className="promo-images">
                {promo.images.map((image, idx) => (
                    <img key={idx} src={image} alt={`Promo ${idx + 1}`} />
                ))}
            </div>
        </div>
    ))}
</div>
```

---

### 6. Get Notice

**API:** `GET /courses/:courseId/notice`

**Frontend Component:** `Notice`

**Usage:**

```typescript
// src/components/CourseDetail/Notice.tsx

useEffect(() => {
    const fetchNotice = async () => {
        const response = await getCourseNotice(courseId);
        if (response.success && response.data) {
            setNotice(response.data);
        }
    };
    fetchNotice();
}, [courseId]);
```

**Response Structure:**

```typescript
interface Notice {
    _id: string;
    course: string;
    content: string;
    noticeImage: string;
    isActive: boolean;
    createdAt: string;
}
```

**Frontend Display:**

```tsx
{
    notice && (
        <div className="notice">
            {notice.noticeImage && (
                <img src={notice.noticeImage} alt="Notice" />
            )}
            <div className="notice-content">
                <p>{notice.content}</p>
            </div>
        </div>
    );
}
```

---

### 7. Get Training Schedules

**API:** `GET /courses/:courseId/training-schedules`

**Frontend Usage:**

```typescript
// src/app/class/[id]/page.tsx

useEffect(() => {
    const fetchSchedules = async () => {
        const response = await getTrainingSchedules(courseId);
        if (response.success) {
            setSchedules(response.data);
        }
    };
    fetchSchedules();
}, [courseId]);
```

**Response Structure:**

```typescript
interface TrainingSchedule {
    _id: string;
    course: string;
    startDate: string; // "2025-09-14"
    endDate: string; // "2025-10-14"
    totalSeats: number;
    availableSeats: number;
    enrolledStudents: number;
    location: string;
    instructor: string;
    status: "scheduled" | "ongoing" | "completed" | "cancelled";
}
```

**Frontend Display:**

```tsx
<div className="schedule-selection">
    <h3>수강 일정 선택</h3>
    <select onChange={(e) => setSelectedSchedule(e.target.value)}>
        <option value="">일정을 선택하세요</option>
        {schedules.map((schedule) => (
            <option
                key={schedule._id}
                value={schedule._id}
                disabled={schedule.availableSeats === 0}
            >
                {schedule.startDate} ~ {schedule.endDate}(
                {schedule.availableSeats}/{schedule.totalSeats}석 남음)
            </option>
        ))}
    </select>
</div>
```

---

### 8. Add Course to Cart

**API:** `POST /cart/add`

**Frontend Usage:**

```typescript
// src/app/class/[id]/page.tsx

const handleAddToCart = async () => {
    if (!selectedSchedule) {
        toast.error("수강 일정을 선택해주세요");
        return;
    }

    const response = await addToCart({
        itemType: "course",
        productId: courseId,
        courseSchedule: selectedSchedule,
    });

    if (response.success) {
        toast.success("장바구니에 추가되었습니다");
        router.push("/shopping-basket");
    }
};
```

**Request Body:**

```typescript
interface AddToCartRequest {
    itemType: "course" | "product";
    productId: string; // Course ID
    courseSchedule: string; // Schedule ID (required for courses)
    quantity?: number; // For products only
}
```

---

## 🛒 Shopping Cart Integration

### 1. Get Cart

**API:** `GET /cart`

**Frontend Usage:**

```typescript
// src/app/shopping-basket/page.tsx

useEffect(() => {
    const fetchCart = async () => {
        const response = await getCart();
        if (response.success) {
            setCartItems(response.data.items);
            setTotalAmount(response.data.totalAmount);
        }
    };
    fetchCart();
}, []);
```

**Response Structure:**

```typescript
interface Cart {
    user: string;
    items: Array<{
        _id: string;
        itemType: "course" | "product";
        product: {
            _id: string;
            title: string;
            thumbnail: string;
            price: number;
            discountRate: number;
            finalPrice: number;
        };
        courseSchedule?: {
            _id: string;
            startDate: string;
            endDate: string;
        };
        quantity: number;
        price: number;
        addedAt: string;
    }>;
    totalAmount: number;
    totalItems: number;
}
```

**Frontend Display:**

```tsx
<div className="cart-items">
    {cartItems.map((item) => (
        <div key={item._id} className="cart-item">
            <img src={item.product.thumbnail} alt={item.product.title} />
            <div className="item-details">
                <h3>{item.product.title}</h3>
                {item.courseSchedule && (
                    <p>
                        {item.courseSchedule.startDate} ~{" "}
                        {item.courseSchedule.endDate}
                    </p>
                )}
                <p className="price">₩{item.price.toLocaleString()}</p>
            </div>
            <button onClick={() => handleRemove(item._id)}>삭제</button>
        </div>
    ))}
    <div className="total">
        <h3>Total: ₩{totalAmount.toLocaleString()}</h3>
    </div>
</div>
```

---

### 2. Remove from Cart

**API:** `DELETE /cart/remove/:productId`

**Frontend Usage:**

```typescript
// src/app/shopping-basket/page.tsx

const handleRemove = async (
    productId: string,
    itemType: string,
    scheduleId?: string
) => {
    const response = await removeFromCart(productId, itemType, scheduleId);
    if (response.success) {
        toast.success("삭제되었습니다");
        fetchCart(); // Refresh cart
    }
};
```

**Query Parameters:**

```typescript
?itemType=course&scheduleId=xxx
or
?itemType=product
```

---

### 3. Get Selected Courses for Application

**API:** `POST /cart/get-selected-courses`

**Frontend Usage:**

```typescript
// src/app/classapplication/page.tsx

useEffect(() => {
    const fetchSelectedCourses = async () => {
        // Get selected course IDs from cart (user checked checkboxes)
        const selectedIds = getSelectedProductIds(); // From your state

        const response = await getSelectedCoursesForApplication(selectedIds);
        if (response.success) {
            setSelectedCourses(response.data.courses);
        }
    };
    fetchSelectedCourses();
}, []);
```

**Request Body:**

```typescript
{
    selectedProductIds: ["productId1", "productId2"];
}
```

**Response:**

```typescript
{
  success: true,
  data: {
    courses: Array<{
      _id: string;
      title: string;
      thumbnail: string;
      price: number;
      finalPrice: number;
      schedule: {
        _id: string;
        startDate: string;
        endDate: string;
      };
    }>;
  }
}
```

---

### 4. Navigate to Application

**Frontend Usage:**

```typescript
// src/app/shopping-basket/page.tsx

const handleProceedToApplication = () => {
    // Navigate to application with selected courses
    // The application page will use POST /cart/get-selected-courses
    router.push("/classapplication");
};
```

---

## 📝 Class Application Integration

### 1. Enroll in Schedule

**API:** `POST /courses/:courseId/training-schedules/:scheduleId/enroll`

**Frontend Usage:**

```typescript
// src/app/classapplication/page.tsx

const handleSubmit = async () => {
    // Validate all fields first
    if (!validateForm()) return;

    // Enroll in each selected course
    for (const course of selectedCourses) {
        const enrollmentData = {
            // Student info will be taken from user profile
            // or you can include it here if needed
            paymentMethod: paymentMethod,
            taxInvoice: taxInvoice,
        };

        const response = await enrollInSchedule(
            course._id,
            course.schedule._id,
            enrollmentData
        );

        if (!response.success) {
            toast.error(`${course.title} 수강 신청 실패`);
            return;
        }
    }

    toast.success("수강 신청이 완료되었습니다!");
    router.push("/classapplication/success");
};
```

**Request Body:**

```typescript
interface EnrollmentRequest {
    paymentMethod?: string;
    taxInvoice?: "발행" | "미발행";
    // User info is automatically taken from authenticated user
}
```

**Response:**

```typescript
{
  success: true,
  message: "수강 신청이 성공적으로 완료되었습니다",
  data: {
    _id: string;
    enrollmentNumber: string;
    user: string;
    course: {
      _id: string;
      title: string;
    };
    schedule: {
      _id: string;
      startDate: string;
      endDate: string;
    };
    enrollmentDate: string;
    status: "수강예정";
    paymentStatus: "pending";
  }
}
```

---

### 2. Get My Enrollments

**API:** `GET /enrollments`

**Frontend Usage:**

```typescript
// src/app/my-courses/page.tsx

useEffect(() => {
    const fetchMyEnrollments = async () => {
        const response = await getMyEnrollments();
        if (response.success) {
            setEnrollments(response.data);
        }
    };
    fetchMyEnrollments();
}, []);
```

**Response:**

```typescript
{
  success: true,
  data: Array<{
    _id: string;
    enrollmentNumber: string;
    course: {
      _id: string;
      title: string;
      thumbnail: string;
    };
    schedule: {
      startDate: string;
      endDate: string;
    };
    status: "수강예정" | "수강중" | "수료" | "미수료" | "취소";
    progress: number; // 0-100
    enrollmentDate: string;
  }>;
}
```

---

## 🔄 Complete User Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ Step 1: Browse Courses (/courses)                                   │
│                                                                      │
│ API: GET /courses                                                    │
│ Action: User browses courses                                         │
│ Result: Display course list with filters                            │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 2: View Course Detail (/class/[id])                            │
│                                                                      │
│ APIs:                                                                │
│  - GET /courses/:id                     (Main course info)          │
│  - GET /courses/:id/curriculum          (Curriculum component)      │
│  - GET /courses/:id/instructors         (Instructor component)      │
│  - GET /courses/:id/promotions          (Promotion component)       │
│  - GET /courses/:id/reviews             (Review component)          │
│  - GET /courses/:id/notice              (Notice component)          │
│  - GET /courses/:id/training-schedules  (Schedule selection)        │
│                                                                      │
│ Action: User views course, selects schedule                         │
│ Button: "CLASS 신청하기"                                              │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 3: Add to Cart                                                  │
│                                                                      │
│ API: POST /cart/add                                                  │
│ Body: {                                                              │
│   itemType: "course",                                                │
│   productId: courseId,                                               │
│   courseSchedule: scheduleId                                         │
│ }                                                                    │
│                                                                      │
│ Action: Course added to cart                                         │
│ Redirect: /shopping-basket                                           │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 4: Shopping Cart (/shopping-basket)                            │
│                                                                      │
│ API: GET /cart                                                       │
│                                                                      │
│ Actions:                                                             │
│  - View cart items (courses + products)                             │
│  - Select items for enrollment                                      │
│  - Remove items (DELETE /cart/remove/:id)                           │
│  - Update quantities for products (PUT /cart/update/:id)            │
│                                                                      │
│ Button: "수강신청"                                                    │
│ Redirect: /classapplication                                          │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 5: Class Application (/classapplication)                       │
│                                                                      │
│ API: POST /cart/get-selected-courses                                │
│ Body: { selectedProductIds: [...] }                                 │
│                                                                      │
│ Display:                                                             │
│  - Course tabs (each selected course)                               │
│  - Schedule for each course                                         │
│  - Student information form (pre-filled from user profile)          │
│  - Payment method selection                                         │
│  - Terms agreement                                                  │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 6: Submit Enrollment                                            │
│                                                                      │
│ For each selected course:                                            │
│ API: POST /courses/:courseId/training-schedules/:scheduleId/enroll  │
│                                                                      │
│ Body: {                                                              │
│   paymentMethod: "간편결제",                                         │
│   taxInvoice: "발행"                                                 │
│ }                                                                    │
│                                                                      │
│ Result: Enrollment created, seats decremented                       │
│ Redirect: /classapplication/success                                 │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 7: Success Page (/classapplication/success)                    │
│                                                                      │
│ Display:                                                             │
│  - Enrollment confirmation                                           │
│  - Enrolled courses                                                 │
│  - Payment info (static for now)                                    │
│                                                                      │
│ API: GET /enrollments                                                │
│ Action: Fetch enrollments to show                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Frontend API Functions

Add these functions to `src/utils/api.ts`:

```typescript
// ========================
// COURSE APIs
// ========================

export const getAllCourses = async (filters?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}): Promise<ApiResponse> => {
    const queryString = new URLSearchParams(filters as any).toString();
    return apiCall(`/courses?${queryString}`);
};

export const getCourseById = async (courseId: string): Promise<ApiResponse> => {
    return apiCall(`/courses/${courseId}`);
};

export const getCourseCurriculum = async (
    courseId: string
): Promise<ApiResponse> => {
    return apiCall(`/courses/${courseId}/curriculum`);
};

export const getCourseInstructors = async (
    courseId: string
): Promise<ApiResponse> => {
    return apiCall(`/courses/${courseId}/instructors`);
};

export const getCoursePromotions = async (
    courseId: string
): Promise<ApiResponse> => {
    return apiCall(`/courses/${courseId}/promotions`);
};

export const getCourseReviews = async (
    courseId: string
): Promise<ApiResponse> => {
    return apiCall(`/courses/${courseId}/reviews`);
};

export const getCourseNotice = async (
    courseId: string
): Promise<ApiResponse> => {
    return apiCall(`/courses/${courseId}/notice`);
};

export const getTrainingSchedules = async (
    courseId: string
): Promise<ApiResponse> => {
    return apiCall(`/courses/${courseId}/training-schedules`);
};

// ========================
// CART APIs
// ========================

export const getCart = async (): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall("/cart", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const addToCart = async (data: {
    itemType: "course" | "product";
    productId: string;
    courseSchedule?: string;
    quantity?: number;
}): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall("/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });
};

export const updateCartItem = async (
    productId: string,
    quantity: number
): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall(`/cart/update/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ quantity }),
    });
};

export const removeFromCart = async (
    productId: string,
    itemType: "course" | "product",
    scheduleId?: string
): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    const queryString = scheduleId
        ? `?itemType=${itemType}&scheduleId=${scheduleId}`
        : `?itemType=${itemType}`;

    return apiCall(`/cart/remove/${productId}${queryString}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const getSelectedCoursesForApplication = async (
    selectedProductIds: string[]
): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall("/cart/get-selected-courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ selectedProductIds }),
    });
};

export const clearCart = async (): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall("/cart/clear", {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

// ========================
// ENROLLMENT APIs
// ========================

export const enrollInSchedule = async (
    courseId: string,
    scheduleId: string,
    data: {
        paymentMethod?: string;
        taxInvoice?: string;
    }
): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall(
        `/courses/${courseId}/training-schedules/${scheduleId}/enroll`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        }
    );
};

export const getMyEnrollments = async (filters?: {
    status?: string;
    page?: number;
    limit?: number;
}): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    const queryString = filters
        ? `?${new URLSearchParams(filters as any).toString()}`
        : "";

    return apiCall(`/enrollments${queryString}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const getEnrollmentById = async (
    enrollmentId: string
): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall(`/enrollments/${enrollmentId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const updateEnrollmentProgress = async (
    enrollmentId: string,
    progress: number
): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall(`/enrollments/${enrollmentId}/progress`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ progress }),
    });
};

export const requestRefund = async (
    enrollmentId: string,
    reason: string
): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall(`/enrollments/${enrollmentId}/refund`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ refundReason: reason }),
    });
};

export const cancelEnrollment = async (
    enrollmentId: string
): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return apiCall(`/enrollments/${enrollmentId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};
```

---

## 🚨 Error Handling

### Common Errors

```typescript
// src/utils/errorHandler.ts

export const handleApiError = (error: any) => {
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 400:
                toast.error(data.message || "잘못된 요청입니다");
                break;
            case 401:
                toast.error("로그인이 필요합니다");
                router.push("/login");
                break;
            case 403:
                toast.error("권한이 없습니다");
                break;
            case 404:
                toast.error("요청한 데이터를 찾을 수 없습니다");
                break;
            case 409:
                toast.error(data.message || "이미 존재하는 데이터입니다");
                break;
            case 500:
                toast.error(
                    "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요"
                );
                break;
            default:
                toast.error("알 수 없는 오류가 발생했습니다");
        }
    } else {
        toast.error("네트워크 오류가 발생했습니다");
    }
};
```

### Usage in Components

```typescript
try {
    const response = await getCourseById(courseId);
    if (response.success) {
        setCourse(response.data);
    } else {
        toast.error(response.message);
    }
} catch (error) {
    handleApiError(error);
}
```

---

## ✅ Implementation Checklist

### Course Detail Page

- [x] Get course details
- [x] Get curriculum
- [x] Get instructors
- [x] Get promotions
- [x] Get reviews
- [x] Get notice
- [x] Get training schedules
- [x] Add to cart functionality

### Shopping Cart

- [x] Display cart items
- [x] Remove from cart
- [x] Update quantities (products only)
- [x] Clear cart
- [x] Get selected courses for application
- [x] Proceed to application

### Class Application

- [x] Enroll in schedule
- [x] Multiple course enrollment
- [x] Payment method selection
- [x] Terms agreement
- [x] Success page

### My Courses

- [x] View enrollments
- [x] Track progress
- [x] Request refund
- [x] Cancel enrollment

---

## 🎯 Quick Reference

### Most Common API Calls

```typescript
// Course Detail Page
const course = await getCourseById(id);
const curriculum = await getCourseCurriculum(id);
const instructors = await getCourseInstructors(id);
const schedules = await getTrainingSchedules(id);

// Add to Cart
await addToCart({
    itemType: "course",
    productId: courseId,
    courseSchedule: scheduleId,
});

// Cart Page
const cart = await getCart();
await removeFromCart(productId, "course", scheduleId);

// Application Page
const courses = await getSelectedCoursesForApplication([id1, id2]);
await enrollInSchedule(courseId, scheduleId, { paymentMethod: "카드" });

// My Courses
const enrollments = await getMyEnrollments();
await updateEnrollmentProgress(enrollmentId, 75);
```

---

## 📝 Notes

1. **Authentication:** Most APIs require Bearer token from `localStorage.getItem("token")`
2. **Error Handling:** Always wrap API calls in try-catch and use proper error handling
3. **Loading States:** Show loading indicators while fetching data
4. **Empty States:** Handle cases where data arrays are empty
5. **Pagination:** Implement pagination for list views
6. **Caching:** Consider caching frequently accessed data

---

**Last Updated:** November 13, 2025  
**All APIs Status:** ✅ **FULLY IMPLEMENTED**  
**Frontend Integration:** 🟢 **READY TO USE**



