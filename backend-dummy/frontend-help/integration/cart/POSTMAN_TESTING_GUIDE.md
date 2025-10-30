# 🧪 Cart Module - Postman Testing Guide

## 🔧 Environment Variables
```
BASE_URL: http://localhost:5000/api
USER_TOKEN: (from user login)
USER_ID: user123
PRODUCT_ID: (from product list)
```

---

## 🧪 Test Sequence

### Test 1: Get Cart
**Method:** `GET`  
**URL:** `{{BASE_URL}}/cart`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "totalAmount": 0,
    "itemCount": 0
  }
}
```

---

### Test 2: Add Item to Cart
**Method:** `POST`  
**URL:** `{{BASE_URL}}/cart/add`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "{{USER_ID}}",
  "productId": "{{PRODUCT_ID}}",
  "quantity": 2
}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Item added to cart", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.items.length).to.be.above(0);
});
```

---

### Test 3: Get Cart Summary
**Method:** `GET`  
**URL:** `{{BASE_URL}}/cart/summary`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
```

---

### Test 4: Update Cart Item Quantity
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/cart/update/{{PRODUCT_ID}}`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "{{USER_ID}}",
  "quantity": 3
}
```

---

### Test 5: Remove Item from Cart
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/cart/remove/{{PRODUCT_ID}}`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "{{USER_ID}}"
}
```

---

### Test 6: Clear Cart
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/cart/clear`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "{{USER_ID}}"
}
```

---

### Test 7: Clean Cart
**Method:** `POST`  
**URL:** `{{BASE_URL}}/cart/clean`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "{{USER_ID}}"
}
```

---

## ✅ Testing Checklist
- [ ] Get empty cart
- [ ] Add first item
- [ ] Add second item
- [ ] Get cart summary
- [ ] Update quantity
- [ ] Remove one item
- [ ] Clean cart (remove inactive)
- [ ] Clear entire cart

**Total Tests:** 7  
**Time:** 5-10 minutes

