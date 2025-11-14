# 🚀 Course APIs - Quick Reference Cheat Sheet

**All APIs are READY and IMPLEMENTED! ✅**

---

## 📖 Course Detail APIs

```typescript
// Get course main info
GET /courses/:id
Response: { _id, title, price, thumbnail, learningGoals, ... }

// Get curriculum
GET /courses/:courseId/curriculum
Response: { keywords: [], modules: [] }

// Get instructors
GET /courses/:courseId/instructors
Response: [{ name, education: [], expertise: [], ... }]

// Get promotions
GET /courses/:courseId/promotions
Response: [{ title, description, images: [] }]

// Get reviews
GET /courses/:courseId/reviews
Response: [{ user, rating, content, avatar, ... }]

// Get notice
GET /courses/:courseId/notice
Response: { content, noticeImage, isActive }

// Get training schedules
GET /courses/:courseId/training-schedules
Response: [{ startDate, endDate, totalSeats, availableSeats, ... }]
```

---

## 🛒 Cart APIs

```typescript
// Get cart
GET /cart
Headers: { Authorization: `Bearer ${token}` }
Response: { items: [], totalAmount, totalItems }

// Add to cart
POST /cart/add
Headers: { Authorization: `Bearer ${token}` }
Body: {
  itemType: "course",
  productId: "xxx",
  courseSchedule: "scheduleId"
}

// Remove from cart
DELETE /cart/remove/:productId?itemType=course&scheduleId=xxx
Headers: { Authorization: `Bearer ${token}` }

// Get selected courses for application
POST /cart/get-selected-courses
Headers: { Authorization: `Bearer ${token}` }
Body: { selectedProductIds: ["id1", "id2"] }

// Clear cart
DELETE /cart/clear
Headers: { Authorization: `Bearer ${token}` }
```

---

## 📝 Enrollment APIs

```typescript
// Enroll in schedule
POST /courses/:courseId/training-schedules/:scheduleId/enroll
Headers: { Authorization: `Bearer ${token}` }
Body: { paymentMethod: "카드", taxInvoice: "발행" }

// Get my enrollments
GET /enrollments
Headers: { Authorization: `Bearer ${token}` }
Response: [{ course, schedule, status, progress, ... }]

// Get enrollment details
GET /enrollments/:id
Headers: { Authorization: `Bearer ${token}` }

// Update progress
PATCH /enrollments/:id/progress
Headers: { Authorization: `Bearer ${token}` }
Body: { progress: 75 }

// Request refund
POST /enrollments/:id/refund
Headers: { Authorization: `Bearer ${token}` }
Body: { refundReason: "..." }

// Cancel enrollment
DELETE /enrollments/:id
Headers: { Authorization: `Bearer ${token}` }
```

---

## 🎯 Component Mapping

| Frontend Component     | Backend API                                 |
| ---------------------- | ------------------------------------------- |
| **ClassGoal**          | `GET /courses/:id` → uses `learningGoals`   |
| **Curriculum**         | `GET /courses/:courseId/curriculum`         |
| **Instructor**         | `GET /courses/:courseId/instructors`        |
| **Recommend**          | `GET /courses/:courseId/reviews`            |
| **Promotion**          | `GET /courses/:courseId/promotions`         |
| **Notice**             | `GET /courses/:courseId/notice`             |
| **Schedule Selection** | `GET /courses/:courseId/training-schedules` |

---

## 🔄 Complete Flow

```
1. Course Detail (/class/[id])
   GET /courses/:id
   GET /courses/:id/curriculum
   GET /courses/:id/instructors
   GET /courses/:id/promotions
   GET /courses/:id/reviews
   GET /courses/:id/notice
   GET /courses/:id/training-schedules
   ↓
   POST /cart/add { itemType: "course", productId, courseSchedule }

2. Shopping Cart (/shopping-basket)
   GET /cart
   ↓
   User selects courses
   ↓
   Navigate to /classapplication

3. Class Application (/classapplication)
   POST /cart/get-selected-courses { selectedProductIds: [] }
   ↓
   User fills form
   ↓
   For each course:
     POST /courses/:courseId/training-schedules/:scheduleId/enroll

4. Success Page
   GET /enrollments
```

---

## 💡 Quick Examples

### Add Course to Cart

```typescript
await addToCart({
    itemType: "course",
    productId: courseId,
    courseSchedule: scheduleId,
});
```

### Get Course Data for Detail Page

```typescript
const [course, curriculum, instructors, schedules] = await Promise.all([
    getCourseById(id),
    getCourseCurriculum(id),
    getCourseInstructors(id),
    getTrainingSchedules(id),
]);
```

### Enroll in Multiple Courses

```typescript
for (const course of selectedCourses) {
    await enrollInSchedule(course.id, course.scheduleId, {
        paymentMethod: "카드",
        taxInvoice: "발행",
    });
}
```

---

## ⚠️ Important Notes

1. **Authentication Required:**
    - All cart APIs
    - All enrollment APIs
    - Use: `localStorage.getItem("token")`

2. **No Authentication:**
    - All course detail APIs (public)
    - GET /courses
    - GET /courses/:id
    - All curriculum/instructor/promotion/review/notice APIs

3. **Course Schedule:**
    - Must select training schedule before adding course to cart
    - Schedule ID is required in cart for courses

4. **Multiple Enrollments:**
    - Loop through selectedCourses array
    - Call enroll API for each course
    - Handle errors individually

---

## 🎨 Frontend Code Template

```typescript
// Course Detail Page Component
const CourseDetailPage = ({ courseId }: { courseId: string }) => {
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, currRes, instrRes, schedRes] = await Promise.all([
          getCourseById(courseId),
          getCourseCurriculum(courseId),
          getCourseInstructors(courseId),
          getTrainingSchedules(courseId),
        ]);

        setCourse(courseRes.data);
        setCurriculum(currRes.data);
        setInstructors(instrRes.data);
        setSchedules(schedRes.data);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchData();
  }, [courseId]);

  const handleAddToCart = async () => {
    if (!selectedSchedule) {
      toast.error("수강 일정을 선택해주세요");
      return;
    }

    try {
      await addToCart({
        itemType: "course",
        productId: courseId,
        courseSchedule: selectedSchedule,
      });
      toast.success("장바구니에 추가되었습니다");
      router.push("/shopping-basket");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div>
      {/* ClassGoal uses course.learningGoals */}
      <ClassGoal goals={course?.learningGoals} />

      {/* Curriculum */}
      <Curriculum data={curriculum} />

      {/* Instructor */}
      <Instructor instructors={instructors} />

      {/* Schedule Selection */}
      <select onChange={(e) => setSelectedSchedule(e.target.value)}>
        <option value="">선택하세요</option>
        {schedules.map((s) => (
          <option key={s._id} value={s._id}>
            {s.startDate} ~ {s.endDate}
          </option>
        ))}
      </select>

      <button onClick={handleAddToCart}>CLASS 신청하기</button>
    </div>
  );
};
```

---

**All APIs are working and ready to integrate! 🎉**  
**No backend changes needed - just use these APIs! ✅**
