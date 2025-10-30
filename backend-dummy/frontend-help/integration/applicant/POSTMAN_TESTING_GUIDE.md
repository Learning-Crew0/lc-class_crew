# 🧪 Applicant - Postman Testing Guide

## Test 1: Submit Application
**Method:** `POST`  
**URL:** `{{BASE_URL}}/applicants`  
**Headers:** `Authorization: Bearer {{USER_TOKEN}}`

**Body (JSON):**
```json
{
  "course": "{{COURSE_ID}}",
  "fullName": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "9876543210",
  "education": "Bachelor's in Computer Science from MIT",
  "experience": "2 years as Junior Web Developer at Tech Corp",
  "motivation": "I want to transition into full-stack development and this course covers all the technologies I need to learn. I'm particularly interested in the React and Node.js modules."
}
```

**Tests Script:**
```javascript
pm.test("Application submitted", function () {
    var jsonData = pm.response.json();
    pm.environment.set("APPLICANT_ID", jsonData.data._id);
});
```

## Test 2: Get All Applicants (Admin)
**Method:** `GET`  
**URL:** `{{BASE_URL}}/applicants?course={{COURSE_ID}}&status=pending`  
**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

## Test 3: Get Single Applicant
**Method:** `GET`  
**URL:** `{{BASE_URL}}/applicants/{{APPLICANT_ID}}`

## Test 4: Update Application Status (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/applicants/{{APPLICANT_ID}}`  
**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "status": "approved"
}
```

## Test 5: Export Applicants (Admin)
**Method:** `GET`  
**URL:** `{{BASE_URL}}/applicants/export?course={{COURSE_ID}}`  
**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

## Test 6: Delete Applicant (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/applicants/{{APPLICANT_ID}}`

---

**Sample Applications:**
```json
{"fullName": "Bob Smith", "education": "Self-taught", "experience": "1 year freelance"}
{"fullName": "Carol White", "education": "Masters in CS", "experience": "5 years senior dev"}
```

**Total Tests:** 6 | **Time:** 10 minutes

