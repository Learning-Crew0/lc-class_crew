# Training Schedule Guide

## Overview
Training schedules are required for courses. Users must select a schedule when adding a course to their cart.

## Flow

### 1️⃣ Admin: Create Course
```http
POST /api/v1/courses
Authorization: Bearer {adminToken}
Content-Type: multipart/form-data
```

### 2️⃣ Admin: Add Training Schedules to Course
```http
POST /api/v1/courses/{courseId}/training-schedules
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "scheduleName": "2025년 1월 3주차",
  "startDate": "2025-01-15",
  "endDate": "2025-01-16",
  "availableSeats": 30,
  "status": "upcoming",
  "isActive": true
}
```

### 3️⃣ User: Get Available Schedules for Course
```http
GET /api/v1/courses/{courseId}/training-schedules
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "schedule123",
      "scheduleName": "2025년 1월 3주차",
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-01-16T00:00:00.000Z",
      "availableSeats": 30,
      "enrolledCount": 0,
      "remainingSeats": 30,
      "isFull": false,
      "status": "upcoming",
      "isActive": true
    }
  ]
}
```

### 4️⃣ User: Add Course to Cart (with Selected Schedule)
```http
POST /api/v1/cart/add
Authorization: Bearer {userToken}
Content-Type: application/json

{
  "itemType": "course",
  "productId": "{courseId}",
  "courseSchedule": "{scheduleId}"
}
```

## Frontend Implementation

### Course Details Page - Schedule Dropdown

```jsx
import { useState, useEffect } from 'react';

function CourseDetails({ courseId }) {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  
  useEffect(() => {
    // Fetch available schedules
    fetch(`/api/v1/courses/${courseId}/training-schedules`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSchedules(data.data);
          // Auto-select first available schedule
          if (data.data.length > 0) {
            setSelectedSchedule(data.data[0]._id);
          }
        }
      });
  }, [courseId]);
  
  const addToCart = async () => {
    if (!selectedSchedule) {
      alert('일정을 선택해주세요');
      return;
    }
    
    const response = await fetch('/api/v1/cart/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemType: 'course',
        productId: courseId,
        courseSchedule: selectedSchedule
      })
    });
    
    const result = await response.json();
    if (result.success) {
      alert('장바구니에 추가되었습니다');
    }
  };
  
  return (
    <div>
      <h2>교육일정</h2>
      <select 
        value={selectedSchedule} 
        onChange={(e) => setSelectedSchedule(e.target.value)}
      >
        <option value="">일정 보기 및 선택</option>
        {schedules
          .filter(s => s.isActive && !s.isFull)
          .map(schedule => (
            <option key={schedule._id} value={schedule._id}>
              {schedule.scheduleName} 
              ({new Date(schedule.startDate).toLocaleDateString('ko-KR')} ~ 
              {new Date(schedule.endDate).toLocaleDateString('ko-KR')})
              - 잔여석: {schedule.remainingSeats}석
            </option>
          ))
        }
      </select>
      
      <div className="tags">
        <button className="tag">환급</button>
        <button className="tag">모여듣기</button>
        <button className="tag">얼리버드 할인</button>
        <button className="tag">그룹할인</button>
      </div>
      
      <button onClick={addToCart}>장바구니 담기</button>
    </div>
  );
}
```

## Database Schema

### TrainingSchedule Model
```javascript
{
  course: ObjectId,              // Reference to Course
  scheduleName: String,          // "2025년 1월 3주차"
  startDate: Date,               // 2025-01-15
  endDate: Date,                 // 2025-01-16
  availableSeats: Number,        // 30
  enrolledCount: Number,         // 0
  status: String,                // "upcoming" | "ongoing" | "completed" | "cancelled"
  isActive: Boolean              // true
}
```

### Virtuals
- `remainingSeats`: `availableSeats - enrolledCount`
- `isFull`: `enrolledCount >= availableSeats`

## Common Errors

### ❌ "Training schedule not found"
**Cause**: No training schedules exist for the course, or wrong scheduleId provided.

**Solution**: 
1. Admin must create training schedules first
2. User must select a valid schedule from the dropdown

### ❌ "Training schedule is fully booked"
**Cause**: Selected schedule has no remaining seats.

**Solution**: User should select a different schedule with available seats.

### ❌ "Training schedule is not available"
**Cause**: Schedule's `isActive` is false.

**Solution**: Admin should activate the schedule or user should select a different one.

## Testing with Postman

See updated Postman collection section "Training Schedules" for complete test flow.

