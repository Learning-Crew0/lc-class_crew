# 👤 User Authentication & Management API Testing Guide

Complete guide for testing all User-related endpoints via Postman.

---

## 📋 Table of Contents

1. [Authentication Routes (Public)](#authentication-routes-public)
2. [User Profile Routes (Protected)](#user-profile-routes-protected)
3. [Admin Routes (Protected - Admin Only)](#admin-routes-protected---admin-only)
4. [Testing Workflow](#testing-workflow)

---

## 🔑 Authentication Routes (Public)

### 1. Register New User

**Endpoint:** `POST /api/users/register`  
**Access:** Public

#### Request Body:
```json
{
  "email": "john.doe@example.com",
  "username": "johndoe",
  "password": "Password123",
  "fullName": "John Doe",
  "gender": "male",
  "memberType": "student",
  "phone": "1234567890",
  "dob": "2000-01-15",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": false
  },
  "profileImage": "https://example.com/avatar.jpg"
}
```

#### Success Response (201):
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "_id": "64abc123def456...",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "fullName": "John Doe",
      "gender": "male",
      "memberType": "student",
      "phone": "1234567890",
      "dob": "2000-01-15T00:00:00.000Z",
      "role": "user",
      "isActive": true,
      "isEmailVerified": false,
      "age": 24,
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Response (400):
```json
{
  "success": false,
  "message": "Email already registered",
  "error": "..."
}
```

---

### 2. Login User

**Endpoint:** `POST /api/users/login`  
**Access:** Public

#### Request Body:
```json
{
  "emailOrUsername": "john.doe@example.com",
  "password": "Password123"
}
```

OR

```json
{
  "emailOrUsername": "johndoe",
  "password": "Password123"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64abc123def456...",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "fullName": "John Doe",
      "gender": "male",
      "memberType": "student",
      "phone": "1234567890",
      "dob": "2000-01-15T00:00:00.000Z",
      "role": "user",
      "isActive": true,
      "isEmailVerified": true,
      "lastLogin": "2024-01-20T15:45:00.000Z",
      "age": 24
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Response (401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Forgot Password (Request Reset)

**Endpoint:** `POST /api/users/forgot-password`  
**Access:** Public

#### Request Body:
```json
{
  "email": "john.doe@example.com"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent.",
  "resetToken": "abc123..." // Only in development mode
}
```

---

### 4. Reset Password

**Endpoint:** `PUT /api/users/reset-password/:token`  
**Access:** Public

#### URL Parameters:
- `token` - The reset token received via email (or from development response)

#### Request Body:
```json
{
  "newPassword": "NewPassword456"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

#### Error Response (400):
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

### 5. Verify Email

**Endpoint:** `GET /api/users/verify-email/:token`  
**Access:** Public

#### URL Parameters:
- `token` - The verification token received via email

#### Success Response (200):
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Error Response (400):
```json
{
  "success": false,
  "message": "Invalid or expired verification token"
}
```

---

## 👤 User Profile Routes (Protected)

**⚠️ All routes below require authentication. Add this header:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

### 6. Get Current User Profile

**Endpoint:** `GET /api/users/profile`  
**Access:** Private (Any authenticated user)

#### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200):
```json
{
  "success": true,
  "data": {
    "_id": "64abc123def456...",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "gender": "male",
    "memberType": "student",
    "phone": "1234567890",
    "dob": "2000-01-15T00:00:00.000Z",
    "profileImage": "https://example.com/avatar.jpg",
    "role": "user",
    "isActive": true,
    "isEmailVerified": true,
    "lastLogin": "2024-01-20T15:45:00.000Z",
    "age": 24,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T15:45:00.000Z"
  }
}
```

---

### 7. Update User Profile

**Endpoint:** `PUT /api/users/profile`  
**Access:** Private (Any authenticated user)

#### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body (All fields optional):
```json
{
  "fullName": "John Michael Doe",
  "phone": "9876543210",
  "gender": "male",
  "dob": "2000-01-15",
  "profileImage": "https://example.com/new-avatar.jpg",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": true
  }
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "64abc123def456...",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "fullName": "John Michael Doe",
    "phone": "9876543210",
    // ... updated fields
  }
}
```

---

### 8. Change Password

**Endpoint:** `PUT /api/users/change-password`  
**Access:** Private (Any authenticated user)

#### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body:
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Error Response (401):
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## 🛡️ Admin Routes (Protected - Admin Only)

**⚠️ All routes below require admin role. Add this header:**

```
Authorization: Bearer ADMIN_JWT_TOKEN_HERE
```

---

### 9. Get All Users (Admin)

**Endpoint:** `GET /api/users`  
**Access:** Private/Admin

#### Query Parameters (all optional):
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `memberType` - Filter by member type (student, teacher, staff, admin)
- `isActive` - Filter by active status (true/false)
- `isEmailVerified` - Filter by verification status (true/false)
- `search` - Search by name, email, or username

#### Example Request:
```
GET /api/users?page=1&limit=10&memberType=student&isActive=true&search=john
```

#### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64abc123def456...",
        "email": "john.doe@example.com",
        "username": "johndoe",
        "fullName": "John Doe",
        "gender": "male",
        "memberType": "student",
        "phone": "1234567890",
        "role": "user",
        "isActive": true,
        "isEmailVerified": true,
        "age": 24
      },
      // ... more users
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 48,
      "limit": 10
    }
  }
}
```

---

### 10. Get User Statistics (Admin)

**Endpoint:** `GET /api/users/stats/overview`  
**Access:** Private/Admin

#### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200):
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 150,
      "active": 142,
      "verified": 128
    },
    "byMemberType": [
      {
        "_id": "student",
        "count": 100,
        "verified": 85,
        "active": 95
      },
      {
        "_id": "teacher",
        "count": 30,
        "verified": 28,
        "active": 29
      },
      {
        "_id": "staff",
        "count": 15,
        "verified": 12,
        "active": 14
      },
      {
        "_id": "admin",
        "count": 5,
        "verified": 5,
        "active": 5
      }
    ]
  }
}
```

---

### 11. Get User by ID (Admin)

**Endpoint:** `GET /api/users/:id`  
**Access:** Private/Admin

#### URL Parameters:
- `id` - User ID

#### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200):
```json
{
  "success": true,
  "data": {
    "_id": "64abc123def456...",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    // ... full user details
  }
}
```

---

### 12. Update User (Admin)

**Endpoint:** `PUT /api/users/:id`  
**Access:** Private/Admin

#### URL Parameters:
- `id` - User ID

#### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body (All fields optional):
```json
{
  "fullName": "Updated Name",
  "phone": "9876543210",
  "gender": "male",
  "dob": "2000-01-15",
  "profileImage": "https://example.com/avatar.jpg",
  "memberType": "teacher",
  "role": "admin",
  "isActive": true,
  "isEmailVerified": true
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "64abc123def456...",
    // ... updated user data
  }
}
```

---

### 13. Delete User (Admin)

**Endpoint:** `DELETE /api/users/:id`  
**Access:** Private/Admin

#### URL Parameters:
- `id` - User ID

#### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Error Response (400):
```json
{
  "success": false,
  "message": "You cannot delete your own account"
}
```

---

## 🔄 Testing Workflow

### Complete Testing Sequence:

#### 1️⃣ **User Registration & Authentication**

```bash
1. Register a new user → Save the token
2. Verify email (if token provided in dev mode)
3. Login with credentials → Get fresh token
4. Test forgot password flow
5. Test reset password with token
```

#### 2️⃣ **User Profile Management**

```bash
1. Get user profile (with auth token)
2. Update profile details
3. Change password
4. Login again with new password
```

#### 3️⃣ **Admin User Creation** (For Admin Testing)

```bash
1. Create a user via register endpoint
2. Manually update in MongoDB:
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin", isEmailVerified: true } }
   )
3. Login as admin → Save admin token
```

#### 4️⃣ **Admin Operations**

```bash
1. Get all users (with filters)
2. Get user statistics
3. Get specific user by ID
4. Update user details
5. Delete a user (not yourself)
```

---

## 🔐 Postman Setup Tips

### 1. Environment Variables

Create a Postman environment with these variables:

```
BASE_URL: http://localhost:5000/api
USER_TOKEN: (will be set after login)
ADMIN_TOKEN: (will be set after admin login)
USER_ID: (test user ID)
```

### 2. Pre-request Script (For Protected Routes)

Add this to your request pre-request script:

```javascript
pm.environment.set("USER_TOKEN", pm.environment.get("USER_TOKEN"));
```

### 3. Authorization Setup

In Postman Authorization tab:
- Type: Bearer Token
- Token: `{{USER_TOKEN}}` or `{{ADMIN_TOKEN}}`

### 4. Tests Script (Save Token After Login)

Add this to your login request "Tests" tab:

```javascript
var jsonData = pm.response.json();
if (jsonData.success && jsonData.data.token) {
    pm.environment.set("USER_TOKEN", jsonData.data.token);
}
```

---

## ✅ Validation Rules

### Password Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Email:
- Valid email format

### Phone:
- Exactly 10 digits

### Username:
- 3-30 characters

### Date of Birth:
- Must be in the past

### Agreements:
- `termsOfService` and `privacyPolicy` must be `true` during registration

---

## 📝 Notes

1. **JWT Token Expiry:** Tokens expire after 30 days by default
2. **Password Security:** Passwords are hashed using bcrypt (10 salt rounds)
3. **Token Reset:** Password reset tokens expire after 1 hour
4. **Email Verification:** Email verification tokens expire after 24 hours
5. **Development Mode:** In development, reset tokens are returned in the response for testing

---

## 🐛 Common Errors

### 401 Unauthorized
- Missing or invalid token
- Token expired
- User account deactivated

### 403 Forbidden
- Insufficient permissions (not admin)
- Email not verified (if route requires verification)

### 400 Bad Request
- Invalid input data
- Validation errors
- Duplicate email/username

### 404 Not Found
- User not found
- Invalid user ID

---

## 🎯 Quick Test Collection

### Postman Collection Import (JSON)

```json
{
  "info": {
    "name": "User API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/users/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"username\": \"testuser\",\n  \"password\": \"Password123\",\n  \"fullName\": \"Test User\",\n  \"gender\": \"male\",\n  \"memberType\": \"student\",\n  \"phone\": \"1234567890\",\n  \"dob\": \"2000-01-15\",\n  \"agreements\": {\n    \"termsOfService\": true,\n    \"privacyPolicy\": true\n  }\n}"
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/users/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"emailOrUsername\": \"test@example.com\",\n  \"password\": \"Password123\"\n}"
        }
      }
    }
  ]
}
```

---

**Happy Testing! 🚀**

