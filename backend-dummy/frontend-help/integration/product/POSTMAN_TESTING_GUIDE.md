# 🧪 Product Module - Postman Testing Guide

## 🔧 Environment Variables
```
BASE_URL: http://localhost:5000/api
ADMIN_TOKEN: (from admin login)
CATEGORY_ID: (from product category)
PRODUCT_ID: (from product creation)
```

---

## 🧪 Test Sequence

### Test 1: Get All Products
**Method:** `GET`  
**URL:** `{{BASE_URL}}/products?page=1&limit=10`

**Query Parameters:**
- page: 1
- limit: 10
- category: {{CATEGORY_ID}} (optional)
- minPrice: 500 (optional)
- maxPrice: 5000 (optional)
- search: javascript (optional)

---

### Test 2: Create Product (Admin)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/products`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "JavaScript Complete Guide Book",
  "description": "Comprehensive JavaScript book covering ES6+, async programming, and modern frameworks. Perfect for beginners and intermediate developers.",
  "category": "{{CATEGORY_ID}}",
  "baseCost": 999,
  "discountRate": 20,
  "availableQuantity": 100,
  "images": [
    "https://via.placeholder.com/500x500?text=JS+Book+Front",
    "https://via.placeholder.com/500x500?text=JS+Book+Back"
  ],
  "specifications": {
    "author": "John Doe",
    "pages": 500,
    "language": "English",
    "publisher": "Tech Press",
    "isbn": "978-1234567890"
  },
  "isActive": true
}
```

**Tests Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Product created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("PRODUCT_ID", jsonData.data._id);
});
```

---

### Test 3: Get Single Product
**Method:** `GET`  
**URL:** `{{BASE_URL}}/products/{{PRODUCT_ID}}`

---

### Test 4: Get Products by Category
**Method:** `GET`  
**URL:** `{{BASE_URL}}/products/category/{{CATEGORY_ID}}?page=1&limit=10`

---

### Test 5: Update Product (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/products/{{PRODUCT_ID}}`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "baseCost": 1299,
  "discountRate": 25,
  "availableQuantity": 150
}
```

---

### Test 6: Delete Product (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/products/{{PRODUCT_ID}}`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

## 📝 Sample Products

### Product 1: Book
```json
{
  "name": "React.js Handbook",
  "description": "Master React.js from basics to advanced",
  "baseCost": 1299,
  "discountRate": 15,
  "availableQuantity": 75
}
```

### Product 2: Course Access
```json
{
  "name": "Premium Course Bundle",
  "description": "Access to all premium courses",
  "baseCost": 9999,
  "discountRate": 30,
  "availableQuantity": 500
}
```

### Product 3: Merchandise
```json
{
  "name": "Developer T-Shirt",
  "description": "100% cotton developer themed t-shirt",
  "baseCost": 499,
  "discountRate": 10,
  "availableQuantity": 200
}
```

---

## ✅ Testing Checklist
- [ ] Get all products
- [ ] Get with filters
- [ ] Get by category
- [ ] Create product
- [ ] Get single product
- [ ] Update product
- [ ] Delete product

**Total Tests:** 6  
**Time:** 5-10 minutes

