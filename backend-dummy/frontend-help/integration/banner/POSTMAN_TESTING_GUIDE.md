# 🧪 Banner - Postman Testing Guide

## Test 1: Get All Banners
**Method:** `GET`  
**URL:** `{{BASE_URL}}/banner`

## Test 2: Create Banner (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/banner`  
**Headers:** 
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
title: New Course Launch 2024
description: Enroll in our latest web development bootcamp with 50% discount
image: [Upload file: banner1.jpg]
link: /courses/web-dev-2024
order: 1
isActive: true
```

**Tests Script:**
```javascript
pm.test("Banner created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("BANNER_ID", jsonData.data._id);
});
```

## Test 3: Update Banner (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/banner/{{BANNER_ID}}`

**Body (form-data):**
```
title: Updated Banner Title
order: 2
```

## Test 4: Delete Banner (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/banner/{{BANNER_ID}}`

---

**Sample Data:**
```
Banner 1: "Summer Sale - 50% Off" → /courses?discount=50
Banner 2: "New AI Course Launched" → /courses/ai-masterclass
Banner 3: "Free Workshop This Weekend" → /workshops/free
```

**Total Tests:** 4 | **Time:** 5 minutes

