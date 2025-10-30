# 🧪 Category (Course) - Postman Testing Guide

## Test 1: Get All Categories
**Method:** `GET`  
**URL:** `{{BASE_URL}}/category`

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
pm.test("Has categories", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
});
```

## Test 2: Create Category (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/category`  
**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body (JSON):**
```json
{
  "name": "Web Development",
  "description": "Learn modern web technologies including HTML, CSS, JavaScript, React, and Node.js",
  "image": "https://via.placeholder.com/400x300?text=Web+Development",
  "isActive": true
}
```

**Tests Script:**
```javascript
pm.test("Category created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("CATEGORY_ID", jsonData.data._id);
});
```

## Test 3: Get Single Category
**Method:** `GET`  
**URL:** `{{BASE_URL}}/category/{{CATEGORY_ID}}`

## Test 4: Update Category (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/category/{{CATEGORY_ID}}`

**Body:**
```json
{
  "name": "Advanced Web Development",
  "description": "Updated description"
}
```

## Test 5: Delete Category (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/category/{{CATEGORY_ID}}`

---

**Sample Categories:**
```json
{"name": "Web Development", "description": "HTML, CSS, JS, React"}
{"name": "Mobile Development", "description": "iOS, Android, React Native"}
{"name": "Data Science", "description": "Python, ML, AI"}
{"name": "DevOps", "description": "Docker, Kubernetes, CI/CD"}
```

**Total Tests:** 5 | **Time:** 5 minutes

