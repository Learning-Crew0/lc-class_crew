# 📅 Training Schedule Feature - Complete Guide

## 🎯 Overview

The Training Schedule feature allows courses to have multiple training sessions/batches. Users can browse courses, select a specific training schedule (e.g., "일정 보기 및 선택"), and apply for that particular schedule.

---

## 📊 Training Schedule Model

### **Schema Structure:**

```javascript
trainingSchedules: [
  {
    scheduleName: String (required),      // e.g., "일정 보기 및 선택", "Weekend Batch", "Evening Session"
    startDate: Date,                       // Start date of the training
    endDate: Date,                         // End date of the training
    status: String (enum),                 // "upcoming", "ongoing", "completed", "cancelled"
    availableSeats: Number,                // Total seats available
    enrolledCount: Number (default: 0),   // Number of students enrolled
    isActive: Boolean (default: true),     // Is this schedule active/visible
  }
]
```

### **Status Options:**
- `upcoming` - Training hasn't started yet
- `ongoing` - Training is currently in progress
- `completed` - Training has finished
- `cancelled` - Training has been cancelled

---

## 🔌 API Endpoints

### **1. Get Training Schedules for a Course**

**GET** `/api/courses/:id/training-schedules`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "courseId": "67123abc...",
    "courseTitle": "Mastering Blockchain",
    "trainingSchedules": [
      {
        "_id": "67124xyz...",
        "scheduleName": "일정 보기 및 선택",
        "startDate": "2025-12-01T00:00:00.000Z",
        "endDate": "2025-12-31T00:00:00.000Z",
        "status": "upcoming",
        "availableSeats": 30,
        "enrolledCount": 15,
        "isActive": true
      }
    ]
  }
}
```

---

### **2. Add Training Schedule (Admin Only)**

**POST** `/api/courses/:id/training-schedules`

**Access:** Protected (Admin)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body:**
```json
{
  "scheduleName": "일정 보기 및 선택",
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "status": "upcoming",
  "availableSeats": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "Training schedule added successfully",
  "data": {
    "_id": "67124xyz...",
    "scheduleName": "일정 보기 및 선택",
    "startDate": "2025-12-01T00:00:00.000Z",
    "endDate": "2025-12-31T00:00:00.000Z",
    "status": "upcoming",
    "availableSeats": 30,
    "enrolledCount": 0,
    "isActive": true
  }
}
```

---

### **3. Update Training Schedule (Admin Only)**

**PUT** `/api/courses/:id/training-schedules/:scheduleId`

**Access:** Protected (Admin)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body:**
```json
{
  "status": "ongoing",
  "enrolledCount": 20,
  "availableSeats": 35
}
```

**Response:**
```json
{
  "success": true,
  "message": "Training schedule updated successfully",
  "data": {
    "_id": "67124xyz...",
    "scheduleName": "일정 보기 및 선택",
    "status": "ongoing",
    "enrolledCount": 20,
    "availableSeats": 35
  }
}
```

---

### **4. Delete Training Schedule (Admin Only)**

**DELETE** `/api/courses/:id/training-schedules/:scheduleId`

**Access:** Protected (Admin)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Training schedule deleted successfully"
}
```

---

### **5. Enroll in Training Schedule**

**POST** `/api/courses/:id/training-schedules/:scheduleId/enroll`

**Access:** Protected (Logged-in users)

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in training schedule",
  "data": {
    "scheduleId": "67124xyz...",
    "scheduleName": "일정 보기 및 선택",
    "enrolledCount": 16,
    "availableSeats": 30
  }
}
```

**Error (No Seats):**
```json
{
  "success": false,
  "message": "No seats available for this training schedule"
}
```

---

### **6. Get Courses by Schedule Criteria**

**GET** `/api/courses/schedules/search`

**Access:** Public

**Query Parameters:**
- `status` - Filter by status (upcoming, ongoing, completed, cancelled)
- `startDate` - Filter schedules starting after this date
- `endDate` - Filter schedules ending before this date
- `available` - Filter only schedules with available seats (true/false)

**Example:**
```
GET /api/courses/schedules/search?status=upcoming&available=true
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "67123abc...",
      "title": "Mastering Blockchain",
      "shortDescription": "Learn blockchain fundamentals",
      "mainImage": "https://...",
      "price": 2499,
      "priceText": "₹2499",
      "category": {
        "_id": "67100xyz...",
        "name": "Design"
      },
      "trainingSchedules": [
        {
          "_id": "67124xyz...",
          "scheduleName": "일정 보기 및 선택",
          "startDate": "2025-12-01T00:00:00.000Z",
          "endDate": "2025-12-31T00:00:00.000Z",
          "status": "upcoming",
          "availableSeats": 30,
          "enrolledCount": 15,
          "isActive": true
        }
      ]
    }
  ]
}
```

---

## 🎨 Frontend Integration

### **User Flow:**

1. **Browse Courses** - User sees courses with training schedules
2. **View Schedules** - Click on course to see all available training schedules
3. **Select Schedule** - User selects "일정 보기 및 선택" or any specific schedule
4. **Apply/Enroll** - Click "Apply for Class" to enroll in that schedule
5. **Confirmation** - System enrolls user and increments `enrolledCount`

---

### **Frontend Components to Update:**

#### **1. Course Card Component:**
```jsx
// Show if course has training schedules
{course.trainingSchedules && course.trainingSchedules.length > 0 && (
  <div className="training-badge">
    {course.trainingSchedules.length} Training Schedules Available
  </div>
)}
```

#### **2. Course Detail Page:**
```jsx
// Display all training schedules
<div className="training-schedules">
  <h3>교육일정 Training schedule</h3>
  <select name="trainingSchedule" onChange={handleScheduleSelect}>
    <option value="">일정 보기 및 선택</option>
    {course.trainingSchedules?.map(schedule => (
      <option key={schedule._id} value={schedule._id}>
        {schedule.scheduleName} - {formatDate(schedule.startDate)} to {formatDate(schedule.endDate)}
        ({schedule.availableSeats - schedule.enrolledCount} seats left)
      </option>
    ))}
  </select>
  
  <button onClick={handleApply}>Apply for Class</button>
</div>
```

#### **3. API Integration:**
```typescript
// Get training schedules for a course
export const getCourseTrainingSchedules = (courseId: string) => {
  return apiCall(`/courses/${courseId}/training-schedules`);
};

// Enroll in a schedule
export const enrollInSchedule = (courseId: string, scheduleId: string) => {
  return apiCall(`/courses/${courseId}/training-schedules/${scheduleId}/enroll`, 'POST');
};

// Get courses with available schedules
export const getCoursesWithSchedules = (filters: any) => {
  const params = new URLSearchParams(filters);
  return apiCall(`/courses/schedules/search?${params}`);
};
```

---

## 📝 Example Usage

### **Create a Course with Training Schedules:**

```json
POST /api/courses

{
  "title": "Mastering Blockchain",
  "category": "67100xyz...",
  "shortDescription": "Learn blockchain fundamentals",
  "price": 2499,
  "priceText": "₹2499",
  "duration": "11 weeks",
  "location": "In-person (Bangalore)",
  "trainingSchedules": [
    {
      "scheduleName": "일정 보기 및 선택",
      "startDate": "2025-12-01",
      "endDate": "2025-12-31",
      "status": "upcoming",
      "availableSeats": 30
    },
    {
      "scheduleName": "Weekend Batch",
      "startDate": "2026-01-15",
      "endDate": "2026-02-28",
      "status": "upcoming",
      "availableSeats": 25
    }
  ]
}
```

---

## ✅ Key Features

1. ✅ **Multiple Schedules per Course** - One course can have many training batches
2. ✅ **Seat Management** - Track available seats and enrolled count
3. ✅ **Status Tracking** - Know if training is upcoming, ongoing, or completed
4. ✅ **Enrollment Protection** - Prevents enrollment when seats are full
5. ✅ **Search/Filter** - Find courses by schedule criteria
6. ✅ **Admin Control** - Only admins can add/update/delete schedules
7. ✅ **User Enrollment** - Logged-in users can enroll in specific schedules

---

## 🔒 Validation Rules

- ✅ `scheduleName` is **required**
- ✅ `status` must be one of: `upcoming`, `ongoing`, `completed`, `cancelled`
- ✅ `enrolledCount` cannot exceed `availableSeats`
- ✅ Only active schedules (`isActive: true`) are shown to users
- ✅ Only active courses can have enrollment

---

Your training schedule system is ready! 🎓✨

