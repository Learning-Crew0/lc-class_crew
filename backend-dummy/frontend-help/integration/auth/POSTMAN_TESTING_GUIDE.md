# 🧪 Auth - Postman Testing Guide

## Test 1: Register
**Method:** `POST`  
**URL:** `{{BASE_URL}}/auth/register`

**Body (JSON):**
```json
{
  "email": "newuser@test.com",
  "username": "newuser123",
  "password": "Password@123",
  "fullName": "New User"
}
```

**Tests Script:**
```javascript
pm.test("Registration successful", function () {
    var jsonData = pm.response.json();
    pm.environment.set("AUTH_TOKEN", jsonData.data.token);
});
```

## Test 2: Login
**Method:** `POST`  
**URL:** `{{BASE_URL}}/auth/login`

**Body (JSON):**
```json
{
  "email": "newuser@test.com",
  "password": "Password@123"
}
```

**Tests Script:**
```javascript
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.token).to.exist;
});
```

---

**Note:** This is a simpler auth module. For advanced features (profile management, password reset, etc.), use `/api/users` endpoints.

**Total Tests:** 2 | **Time:** 2 minutes

