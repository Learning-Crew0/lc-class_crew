# 🧪 Schedule - Postman Testing Guide

## Test 1: Get All Schedules
**Method:** `GET`  
**URL:** `{{BASE_URL}}/schedules?course={{COURSE_ID}}`

## Test 2: Create Schedule (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/schedules`  
**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body (JSON):**
```json
{
  "course": "{{COURSE_ID}}",
  "title": "Introduction to HTML - Live Class",
  "description": "We'll cover HTML basics, elements, and attributes. Bring your questions!",
  "startTime": "2024-02-01T10:00:00Z",
  "endTime": "2024-02-01T12:00:00Z",
  "instructor": "John Doe",
  "meetingLink": "https://zoom.us/j/123456789",
  "isRecurring": false
}
```

**Tests Script:**
```javascript
pm.test("Schedule created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("SCHEDULE_ID", jsonData.data._id);
});
```

## Test 3: Get Single Schedule
**Method:** `GET`  
**URL:** `{{BASE_URL}}/schedules/{{SCHEDULE_ID}}`

## Test 4: Update Schedule (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/schedules/{{SCHEDULE_ID}}`

**Body:**
```json
{
  "title": "HTML Basics - Rescheduled",
  "startTime": "2024-02-02T10:00:00Z",
  "endTime": "2024-02-02T12:00:00Z"
}
```

## Test 5: Delete Schedule (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/schedules/{{SCHEDULE_ID}}`

---

**Sample Schedules:**
```json
{"title": "CSS Workshop", "startTime": "2024-02-05T14:00:00Z", "duration": "2 hours"}
{"title": "JavaScript Q&A", "startTime": "2024-02-10T16:00:00Z", "duration": "1 hour"}
```

**Total Tests:** 5 | **Time:** 5 minutes

