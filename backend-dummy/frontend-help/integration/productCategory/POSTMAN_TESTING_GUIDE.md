# 🧪 Product Category - Postman Testing Guide

## Test 1: Get All Product Categories
**Method:** `GET`  
**URL:** `{{BASE_URL}}/product-categories`

## Test 2: Create Category (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/product-categories`  
**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body (JSON):**
```json
{
  "title": "Books",
  "description": "Educational books and study materials",
  "order": 1,
  "isActive": true
}
```

## Test 3: Get Single Category
**Method:** `GET`  
**URL:** `{{BASE_URL}}/product-categories/{{CATEGORY_ID}}`

## Test 4: Update Category (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/product-categories/{{CATEGORY_ID}}`  
**Body:** `{"title": "Updated Books", "order": 2}`

## Test 5: Delete Category (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/product-categories/{{CATEGORY_ID}}`

---

**Sample Categories:**
```json
{"title": "Books", "description": "Educational books", "order": 1}
{"title": "Courses", "description": "Online courses", "order": 2}
{"title": "Merchandise", "description": "Developer merchandise", "order": 3}
```

**Total Tests:** 5 | **Time:** 5 minutes

