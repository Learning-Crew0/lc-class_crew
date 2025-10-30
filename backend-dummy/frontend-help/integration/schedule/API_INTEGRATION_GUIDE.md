# 📅 Schedule Module - API Integration Guide

## Base URL
```
/api/schedules
```

## 📋 Overview
Manages class schedules for courses.

## 🔗 Relationships
- **Schedule** → **Course** (N:1): Many schedules for one course

## 🎯 API Endpoints

### 1. Get All Schedules
```http
GET /api/schedules
```

**Query Parameters:**
- `course`: Filter by course ID
- `startDate`: Filter from date
- `endDate`: Filter to date

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "sched123",
      "course": {
        "_id": "course123",
        "title": "Web Development"
      },
      "title": "HTML Basics - Live Class",
      "description": "Introduction to HTML elements",
      "startTime": "2024-01-25T10:00:00.000Z",
      "endTime": "2024-01-25T12:00:00.000Z",
      "instructor": "John Doe",
      "meetingLink": "https://zoom.us/j/123456",
      "isRecurring": false,
      "status": "scheduled"
    }
  ]
}
```

### 2. Get Single Schedule
```http
GET /api/schedules/:id
```

### 3. Create Schedule (Admin)
```http
POST /api/schedules
Headers: Authorization: Bearer ADMIN_TOKEN
```

**Request Body:**
```json
{
  "course": "course123",
  "title": "HTML Basics - Live Class",
  "description": "Introduction to HTML",
  "startTime": "2024-01-25T10:00:00Z",
  "endTime": "2024-01-25T12:00:00Z",
  "instructor": "John Doe",
  "meetingLink": "https://zoom.us/j/123456",
  "isRecurring": false
}
```

### 4. Update Schedule (Admin)
```http
PUT /api/schedules/:id
```

### 5. Delete Schedule (Admin)
```http
DELETE /api/schedules/:id
```

## 💻 React Example

```javascript
const CourseSchedule = ({ courseId }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    axios.get(`/api/schedules?course=${courseId}`)
      .then(res => setSchedules(res.data.data));
  }, [courseId]);

  return (
    <div className="schedule-list">
      <h2>Upcoming Classes</h2>
      {schedules.map(schedule => (
        <div key={schedule._id} className="schedule-item">
          <h3>{schedule.title}</h3>
          <p>{schedule.description}</p>
          <p>📅 {new Date(schedule.startTime).toLocaleString()}</p>
          <p>👨‍🏫 Instructor: {schedule.instructor}</p>
          <p>⏱️ Duration: {
            Math.round((new Date(schedule.endTime) - new Date(schedule.startTime)) / 60000)
          } minutes</p>
          {schedule.meetingLink && (
            <a href={schedule.meetingLink} target="_blank" rel="noopener noreferrer">
              Join Class
            </a>
          )}
        </div>
      ))}
    </div>
  );
};
```

**Related Modules:** Course

