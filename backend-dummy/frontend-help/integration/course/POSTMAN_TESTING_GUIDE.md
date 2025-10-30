# 🧪 Course Module - Postman Testing Guide

## 📋 Overview
Complete Postman testing for Course, Curriculum, Instructor, Review, Promotion, and Notice endpoints.

---

## 🔧 Environment Variables
```
BASE_URL: http://localhost:5000/api
ADMIN_TOKEN: (from user login)
USER_TOKEN: (from user login)
CATEGORY_ID: (from category creation)
COURSE_ID: (from course creation)
```

---

## 🧪 Test Sequence

### Test 1: Get All Courses
**Method:** `GET`  
**URL:** `{{BASE_URL}}/courses?page=1&limit=10`

**Query Parameters:**
- page: 1
- limit: 10
- category: {{CATEGORY_ID}} (optional)
- level: Beginner (optional)

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Has courses array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.courses).to.be.an('array');
});
```

---

### Test 2: Create Course (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/courses`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
title: Complete Web Development Bootcamp
description: Learn HTML, CSS, JavaScript, React, Node.js from scratch
category: {{CATEGORY_ID}}
price: 4999
discountedPrice: 3999
duration: 6 months
level: Beginner
language: English
mainImage: [Upload file: course-main.jpg]
whatYouWillLearn[0]: HTML5 and CSS3
whatYouWillLearn[1]: JavaScript ES6+
whatYouWillLearn[2]: React.js
whatYouWillLearn[3]: Node.js and Express
requirements[0]: Basic computer knowledge
requirements[1]: Internet connection
isActive: true
```

**Tests Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Course created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("COURSE_ID", jsonData.data._id);
});
```

---

### Test 3: Get Single Course
**Method:** `GET`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}`

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Course details exist", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.title).to.exist;
    pm.expect(jsonData.data.category).to.exist;
});
```

---

### Test 4: Update Course (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
title: Complete Web Development Bootcamp 2024
discountedPrice: 2999
```

---

### Test 5: Create Curriculum (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/curriculum`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
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
          "videoUrl": "https://example.com/video1.mp4",
          "content": "Learn about HTML elements and tags",
          "isFree": true
        },
        {
          "lessonNumber": 2,
          "title": "HTML Attributes",
          "duration": "25 mins",
          "videoUrl": "https://example.com/video2.mp4",
          "content": "Understanding HTML attributes",
          "isFree": false
        }
      ]
    },
    {
      "moduleNumber": 2,
      "title": "CSS Styling",
      "description": "Learn CSS fundamentals",
      "lessons": [
        {
          "lessonNumber": 1,
          "title": "CSS Selectors",
          "duration": "35 mins",
          "videoUrl": "https://example.com/video3.mp4",
          "content": "Master CSS selectors",
          "isFree": false
        }
      ]
    }
  ]
}
```

**Tests Script:**
```javascript
pm.test("Status code is 200 or 201", function () {
    pm.expect([200, 201]).to.include(pm.response.code);
});
```

---

### Test 6: Get Curriculum
**Method:** `GET`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/curriculum`

**Tests Script:**
```javascript
pm.test("Has modules", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.modules).to.be.an('array');
    pm.expect(jsonData.data.modules.length).to.be.above(0);
});
```

---

### Test 7: Create Instructor (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/instructor`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Doe",
  "bio": "10+ years of web development experience. Worked at Google and Facebook.",
  "image": "https://i.pravatar.cc/300?img=12",
  "designation": "Senior Web Developer",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "github": "https://github.com/johndoe"
  },
  "expertise": ["JavaScript", "React", "Node.js", "MongoDB"],
  "yearsOfExperience": 12
}
```

---

### Test 8: Get Instructors
**Method:** `GET`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/instructor`

---

### Test 9: Add Promotion (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/promotions`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
title: Limited Time Offer
description: Get 50% off this month only!
promotions: [Upload multiple images - promo1.jpg, promo2.jpg]
startDate: 2024-01-01
endDate: 2024-01-31
isActive: true
```

---

### Test 10: Get Promotions
**Method:** `GET`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/promotions`

---

### Test 11: Create Notice (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/notice`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
title: Class Postponed
message: Next class will be held on Monday at 10 AM instead of Saturday
priority: high
noticeImage: [Upload file: notice.jpg]
isActive: true
```

---

### Test 12: Add Review (User)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/reviews`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "rating": 5,
  "comment": "Excellent course! The instructor explains everything clearly and the curriculum is very comprehensive. Highly recommended for beginners."
}
```

**Tests Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Review created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("REVIEW_ID", jsonData.data._id);
});
```

---

### Test 13: Get Reviews
**Method:** `GET`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/reviews?page=1&limit=10`

---

### Test 14: Delete Review (Admin/Owner)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/reviews/{{REVIEW_ID}}`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
```

---

### Test 15: Delete Promotion (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}/promotions/{{PROMOTION_ID}}`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### Test 16: Delete Course (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/courses/{{COURSE_ID}}`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

## 📝 Sample Data Sets

### Course 1: Web Development
```json
{
  "title": "Complete Web Development Bootcamp",
  "description": "Master web development from scratch",
  "price": 4999,
  "discountedPrice": 3999,
  "duration": "6 months",
  "level": "Beginner",
  "language": "English"
}
```

### Course 2: Mobile App Development
```json
{
  "title": "React Native Mobile Development",
  "description": "Build iOS and Android apps with React Native",
  "price": 5999,
  "discountedPrice": 4499,
  "duration": "4 months",
  "level": "Intermediate",
  "language": "English"
}
```

### Course 3: Data Science
```json
{
  "title": "Python for Data Science",
  "description": "Learn Python, Pandas, NumPy, Matplotlib",
  "price": 6999,
  "discountedPrice": 5499,
  "duration": "5 months",
  "level": "Beginner",
  "language": "English"
}
```

---

## ✅ Testing Checklist

**Course Endpoints:**
- [ ] Get all courses
- [ ] Get all courses with filters
- [ ] Get single course
- [ ] Create course (admin)
- [ ] Update course (admin)
- [ ] Delete course (admin)

**Curriculum Endpoints:**
- [ ] Create curriculum
- [ ] Get curriculum
- [ ] Update curriculum

**Instructor Endpoints:**
- [ ] Create instructor
- [ ] Get instructors
- [ ] Update instructor

**Review Endpoints:**
- [ ] Get reviews
- [ ] Add review (user)
- [ ] Delete review

**Promotion Endpoints:**
- [ ] Create promotion with images
- [ ] Get promotions
- [ ] Delete promotion

**Notice Endpoints:**
- [ ] Create notice with image
- [ ] Get notice
- [ ] Update notice

---

**Total Tests:** 16+  
**Estimated Time:** 20-25 minutes

