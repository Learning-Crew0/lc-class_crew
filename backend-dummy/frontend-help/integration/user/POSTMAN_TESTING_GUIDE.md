# 🧪 User Module - Postman Testing Guide

## 📋 Overview
Complete guide for testing all User API endpoints in Postman with sample data.

---

## 🔧 Postman Setup

### Environment Variables
Create a Postman environment with these variables:

```
BASE_URL: http://localhost:5000/api
USER_TOKEN: (will be set after login)
ADMIN_TOKEN: (will be set after admin login)
USER_ID: (test user ID)
```

---

## 🧪 Test Sequence

### Test 1: Register New User
**Method:** `POST`  
**URL:** `{{BASE_URL}}/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "student@test.com",
  "username": "student123",
  "password": "Student@123",
  "fullName": "John Student",
  "gender": "male",
  "memberType": "student",
  "phone": "9876543210",
  "dob": "2000-05-15",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": false
  },
  "profileImage": "https://i.pravatar.cc/150?img=1"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.token).to.exist;
    pm.environment.set("USER_TOKEN", jsonData.data.token);
    pm.environment.set("USER_ID", jsonData.data.user._id);
});
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64abc123...",
      "email": "student@test.com",
      "username": "student123",
      "fullName": "John Student",
      "role": "user",
      "isEmailVerified": false
    },
    "token": "eyJhbGc..."
  }
}
```

---

### Test 2: Login User
**Method:** `POST`  
**URL:** `{{BASE_URL}}/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "emailOrUsername": "student@test.com",
  "password": "Student@123"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.environment.set("USER_TOKEN", jsonData.data.token);
});
```

---

### Test 3: Get User Profile (Protected)
**Method:** `GET`  
**URL:** `{{BASE_URL}}/users/profile`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Profile data exists", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.email).to.exist;
    pm.expect(jsonData.data.fullName).to.exist;
});
```

---

### Test 4: Update User Profile
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/users/profile`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "fullName": "John Updated Student",
  "phone": "9123456789",
  "profileImage": "https://i.pravatar.cc/150?img=2"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Profile updated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.fullName).to.eql("John Updated Student");
});
```

---

### Test 5: Change Password
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/users/change-password`

**Headers:**
```
Authorization: Bearer {{USER_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "currentPassword": "Student@123",
  "newPassword": "NewStudent@456"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Password changed successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});
```

---

### Test 6: Forgot Password
**Method:** `POST`  
**URL:** `{{BASE_URL}}/users/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "student@test.com"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Save reset token if in development mode
var jsonData = pm.response.json();
if (jsonData.resetToken) {
    pm.environment.set("RESET_TOKEN", jsonData.resetToken);
}
```

---

### Test 7: Reset Password
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/users/reset-password/{{RESET_TOKEN}}`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "newPassword": "ResetPassword@789"
}
```

---

### Test 8: Verify Email
**Method:** `GET`  
**URL:** `{{BASE_URL}}/users/verify-email/{{VERIFICATION_TOKEN}}`

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

---

## 🛡️ Admin Tests

### Test 9: Register Admin User
**Method:** `POST`  
**URL:** `{{BASE_URL}}/users/register`

**Body (JSON):**
```json
{
  "email": "admin@test.com",
  "username": "admin123",
  "password": "Admin@123",
  "fullName": "Admin User",
  "gender": "male",
  "memberType": "admin",
  "phone": "9999999999",
  "dob": "1990-01-01",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true
  }
}
```

**Note:** After registration, manually update in database:
```javascript
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

Then login to get admin token.

---

### Test 10: Get All Users (Admin)
**Method:** `GET`  
**URL:** `{{BASE_URL}}/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Query Parameters:**
- page: 1
- limit: 10
- memberType: student (optional)
- search: john (optional)

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Has pagination", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.pagination).to.exist;
});
```

---

### Test 11: Get User Statistics (Admin)
**Method:** `GET`  
**URL:** `{{BASE_URL}}/users/stats/overview`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Has overview stats", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.overview.total).to.exist;
});
```

---

### Test 12: Get User by ID (Admin)
**Method:** `GET`  
**URL:** `{{BASE_URL}}/users/{{USER_ID}}`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### Test 13: Update User (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/users/{{USER_ID}}`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "memberType": "teacher",
  "isEmailVerified": true,
  "isActive": true
}
```

---

### Test 14: Delete User (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/users/{{USER_ID}}`

**Headers:**
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

**⚠️ Warning:** This will permanently delete the user. Use a test user ID.

---

## 🧪 Error Testing

### Test 15: Login with Invalid Credentials
**Method:** `POST`  
**URL:** `{{BASE_URL}}/users/login`

**Body:**
```json
{
  "emailOrUsername": "student@test.com",
  "password": "WrongPassword123"
}
```

**Expected:** 401 Unauthorized

---

### Test 16: Access Profile Without Token
**Method:** `GET`  
**URL:** `{{BASE_URL}}/users/profile`

**Headers:** (no Authorization header)

**Expected:** 401 Unauthorized

---

### Test 17: Register with Existing Email
**Method:** `POST`  
**URL:** `{{BASE_URL}}/users/register`

**Body:** (use same email as Test 1)

**Expected:** 400 Bad Request

---

### Test 18: Invalid Password Format
**Method:** `POST`  
**URL:** `{{BASE_URL}}/users/register`

**Body:**
```json
{
  "email": "test2@test.com",
  "username": "test2",
  "password": "weak",
  "fullName": "Test User",
  "gender": "male",
  "memberType": "student",
  "phone": "1234567890",
  "dob": "2000-01-01",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true
  }
}
```

**Expected:** 400 Bad Request (Password too weak)

---

## 📝 Sample Data Sets

### Student User
```json
{
  "email": "student1@test.com",
  "username": "student001",
  "password": "Student@123",
  "fullName": "Alice Student",
  "gender": "female",
  "memberType": "student",
  "phone": "9876543211",
  "dob": "2001-03-20"
}
```

### Teacher User
```json
{
  "email": "teacher1@test.com",
  "username": "teacher001",
  "password": "Teacher@123",
  "fullName": "Bob Teacher",
  "gender": "male",
  "memberType": "teacher",
  "phone": "9876543212",
  "dob": "1985-07-15"
}
```

### Staff User
```json
{
  "email": "staff1@test.com",
  "username": "staff001",
  "password": "Staff@123",
  "fullName": "Carol Staff",
  "gender": "female",
  "memberType": "staff",
  "phone": "9876543213",
  "dob": "1992-11-10"
}
```

---

## ✅ Testing Checklist

- [ ] Register new user (student)
- [ ] Register new user (teacher)
- [ ] Register new user (staff)
- [ ] Register new user (admin)
- [ ] Login with email
- [ ] Login with username
- [ ] Get user profile
- [ ] Update profile
- [ ] Change password
- [ ] Forgot password
- [ ] Reset password
- [ ] Verify email
- [ ] Admin: Get all users
- [ ] Admin: Get user by ID
- [ ] Admin: Update user
- [ ] Admin: Delete user
- [ ] Admin: Get statistics
- [ ] Error: Invalid credentials
- [ ] Error: Missing token
- [ ] Error: Duplicate email
- [ ] Error: Weak password

---

## 🎯 Postman Collection Structure

```
User API Tests
├── Public Routes
│   ├── 1. Register User
│   ├── 2. Login User
│   ├── 3. Forgot Password
│   ├── 4. Reset Password
│   └── 5. Verify Email
├── Protected Routes (User)
│   ├── 6. Get Profile
│   ├── 7. Update Profile
│   └── 8. Change Password
├── Admin Routes
│   ├── 9. Get All Users
│   ├── 10. Get Statistics
│   ├── 11. Get User by ID
│   ├── 12. Update User
│   └── 13. Delete User
└── Error Cases
    ├── 14. Invalid Login
    ├── 15. No Token
    ├── 16. Duplicate Email
    └── 17. Weak Password
```

---

## 🚀 Quick Start

1. Import environment variables
2. Run Test 1 (Register)
3. Run Test 2 (Login) - saves token automatically
4. Run Tests 3-8 (uses saved token)
5. Create admin user (Test 9 + DB update)
6. Login as admin
7. Run Admin Tests 10-14

---

**Total Tests:** 18+  
**Estimated Time:** 15-20 minutes  
**Prerequisites:** Backend server running on localhost:5000

