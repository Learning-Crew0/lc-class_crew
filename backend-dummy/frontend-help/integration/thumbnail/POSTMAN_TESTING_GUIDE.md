# 🧪 Thumbnail - Postman Testing Guide

## Test 1: Get Thumbnails by Category
**Method:** `GET`  
**URL:** `{{BASE_URL}}/thumbnail?category=course`

**Query Parameters:**
- category: course
- category: product
- category: banner

## Test 2: Create Thumbnail (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/thumbnail`  
**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
title: Course Thumbnail 1
image: [Upload file: course-thumb.jpg]
category: course
isActive: true
```

## Test 3: Update Thumbnail (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/thumbnail/{{THUMBNAIL_ID}}`

## Test 4: Delete Thumbnail (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/thumbnail/{{THUMBNAIL_ID}}`

---

**Sample Data:**
```
Title: "Web Dev Thumbnail", Category: "course"
Title: "Product Image 1", Category: "product"
Title: "Banner Thumb", Category: "banner"
```

**Total Tests:** 4 | **Time:** 5 minutes

