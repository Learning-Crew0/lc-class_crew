# 🧪 Order Module - Postman Testing Guide

## 🔧 Environment Variables
```
BASE_URL: http://localhost:5000/api
USER_TOKEN: (from login)
ADMIN_TOKEN: (from admin login)
USER_ID: user123
ORDER_ID: (from order creation)
ORDER_NUMBER: (from order creation)
```

---

## 🧪 Test Sequence

### Test 1: Create Order (Checkout)
**Method:** `POST`  
**URL:** `{{BASE_URL}}/orders/create`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "{{USER_ID}}",
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "card",
  "notes": "Please deliver before 6 PM"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Order created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("ORDER_ID", jsonData.data._id);
    pm.environment.set("ORDER_NUMBER", jsonData.data.orderNumber);
});
```

---

### Test 2: Get User Orders
**Method:** `GET`  
**URL:** `{{BASE_URL}}/orders?userId={{USER_ID}}&page=1&limit=10`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
```

---

### Test 3: Get Single Order
**Method:** `GET`  
**URL:** `{{BASE_URL}}/orders/{{ORDER_ID}}?userId={{USER_ID}}`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
```

---

### Test 4: Track Order by Number
**Method:** `GET`  
**URL:** `{{BASE_URL}}/orders/track/{{ORDER_NUMBER}}`

**No authentication required**

---

### Test 5: Get Order Statistics
**Method:** `GET`  
**URL:** `{{BASE_URL}}/orders/stats/{{USER_ID}}`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
```

---

### Test 6: Cancel Order
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/orders/{{ORDER_ID}}/cancel`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "{{USER_ID}}",
  "reason": "Changed my mind"
}
```

---

### Test 7: Update Order Status (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/orders/{{ORDER_ID}}/status`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "confirmed",
  "trackingNumber": "TRACK123456789"
}
```

---

### Test 8: Get All Orders (Admin)
**Method:** `GET`  
**URL:** `{{BASE_URL}}/orders/admin/all?page=1&limit=10&status=pending`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

## ✅ Testing Checklist
- [ ] Create order from cart
- [ ] Get user orders
- [ ] Get single order
- [ ] Track order by number
- [ ] Get order statistics
- [ ] Cancel order
- [ ] Admin: Update status
- [ ] Admin: Get all orders

**Total Tests:** 8  
**Time:** 10-15 minutes

