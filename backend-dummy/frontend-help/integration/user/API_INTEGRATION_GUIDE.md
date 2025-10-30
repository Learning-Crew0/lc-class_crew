# 👤 User Module - API Integration Guide

## Base URL
```
/api/users
```

---

## 📋 Overview

The User module handles user authentication, profile management, and admin user operations.

---

## 🔗 Module Relationships

- **User** → **Cart** (1:1): Each user has one cart
- **User** → **Order** (1:N): User can have multiple orders
- **User** → **Review** (1:N): User can create multiple reviews
- **User** → **Applicant** (1:N): User can apply to multiple courses

---

## 🎯 API Endpoints

### PUBLIC ENDPOINTS (No Authentication Required)

#### 1. Register User
```http
POST /api/users/register
```

**Request Body:**
```json
{
  "email": "student@example.com",
  "username": "student123",
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

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64abc123...",
      "email": "student@example.com",
      "username": "student123",
      "fullName": "John Doe",
      "gender": "male",
      "memberType": "student",
      "role": "user",
      "isActive": true,
      "isEmailVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Field Validations:**
- `email`: Valid email format, unique
- `username`: 3-30 characters, unique
- `password`: Min 8 chars, must contain uppercase, lowercase, and number
- `phone`: Exactly 10 digits
- `memberType`: One of: `student`, `teacher`, `staff`, `admin`
- `gender`: One of: `male`, `female`, `other`
- `agreements.termsOfService`: Must be `true`
- `agreements.privacyPolicy`: Must be `true`

---

#### 2. Login User
```http
POST /api/users/login
```

**Request Body:**
```json
{
  "emailOrUsername": "student@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64abc123...",
      "email": "student@example.com",
      "username": "student123",
      "fullName": "John Doe",
      "role": "user",
      "memberType": "student",
      "lastLogin": "2024-01-20T15:45:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Use Case:** Store the token in localStorage/sessionStorage for subsequent requests

---

#### 3. Forgot Password
```http
POST /api/users/forgot-password
```

**Request Body:**
```json
{
  "email": "student@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent.",
  "resetToken": "abc123..." // Only in development mode
}
```

---

#### 4. Reset Password
```http
PUT /api/users/reset-password/:token
```

**URL Parameters:**
- `token`: Reset token received via email

**Request Body:**
```json
{
  "newPassword": "NewPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

---

#### 5. Verify Email
```http
GET /api/users/verify-email/:token
```

**URL Parameters:**
- `token`: Verification token received via email

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### PROTECTED ENDPOINTS (Requires Authentication)

**Authentication Header Required:**
```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
```

---

#### 6. Get User Profile
```http
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "email": "student@example.com",
    "username": "student123",
    "fullName": "John Doe",
    "gender": "male",
    "memberType": "student",
    "phone": "1234567890",
    "dob": "2000-01-15T00:00:00.000Z",
    "profileImage": "https://example.com/avatar.jpg",
    "role": "user",
    "isActive": true,
    "isEmailVerified": true,
    "age": 24,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T15:45:00.000Z"
  }
}
```

---

#### 7. Update User Profile
```http
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Request Body (All fields optional):**
```json
{
  "fullName": "John Michael Doe",
  "phone": "9876543210",
  "gender": "male",
  "dob": "2000-01-15",
  "profileImage": "https://example.com/new-avatar.jpg",
  "agreements": {
    "marketingConsent": true
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated user object
  }
}
```

**Note:** Cannot update `email`, `username`, `password`, `role` through this endpoint

---

#### 8. Change Password
```http
PUT /api/users/change-password
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Request Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### ADMIN ENDPOINTS (Requires Admin Role)

**Authentication Header + Admin Role Required:**

---

#### 9. Get All Users
```http
GET /api/users
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `memberType` (optional): Filter by type (`student`, `teacher`, `staff`, `admin`)
- `isActive` (optional): Filter by status (`true`, `false`)
- `isEmailVerified` (optional): Filter by verification (`true`, `false`)
- `search` (optional): Search by name, email, or username

**Example:**
```
GET /api/users?page=1&limit=10&memberType=student&search=john
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64abc123...",
        "email": "student@example.com",
        "username": "student123",
        "fullName": "John Doe",
        "memberType": "student",
        "isActive": true,
        "isEmailVerified": true
      }
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

#### 10. Get User Statistics
```http
GET /api/users/stats/overview
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Response (200):**
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
      }
    ]
  }
}
```

---

#### 11. Get User by ID
```http
GET /api/users/:id
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**URL Parameters:**
- `id`: User ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Full user object
  }
}
```

---

#### 12. Update User (Admin)
```http
PUT /api/users/:id
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**URL Parameters:**
- `id`: User ID

**Request Body (All fields optional):**
```json
{
  "fullName": "Updated Name",
  "memberType": "teacher",
  "role": "admin",
  "isActive": true,
  "isEmailVerified": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    // Updated user object
  }
}
```

---

#### 13. Delete User
```http
DELETE /api/users/:id
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**URL Parameters:**
- `id`: User ID

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Note:** Cannot delete own account

---

## 💻 Frontend Implementation Examples

### React - Login Component

```javascript
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/users/login', formData);
      
      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Email or Username"
        value={formData.emailOrUsername}
        onChange={(e) => setFormData({...formData, emailOrUsername: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

### React - Profile Component

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token invalid, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/users/profile', updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.data);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.fullName}</p>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <p>Member Type: {user.memberType}</p>
      <p>Age: {user.age}</p>
    </div>
  );
};
```

---

## 🔒 Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend returns JWT token
   ↓
3. Store token in localStorage
   ↓
4. Include token in all protected requests
   ↓
5. If token expires (401), redirect to login
```

---

## ✅ Integration Checklist

- [ ] Implement registration form
- [ ] Implement login form
- [ ] Store JWT token securely
- [ ] Add auth headers to API requests
- [ ] Handle token expiration
- [ ] Implement profile page
- [ ] Add password change functionality
- [ ] Implement forgot password flow
- [ ] Admin user management (if admin)

---

## 🐛 Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Email already registered | Use different email |
| 400 | Username already taken | Choose different username |
| 400 | Password validation failed | Check password requirements |
| 401 | Invalid credentials | Check email/username and password |
| 401 | Token expired | Re-login to get new token |
| 403 | Not authorized as admin | Need admin role |

---

**Related Modules:** Cart, Order, Review, Applicant

