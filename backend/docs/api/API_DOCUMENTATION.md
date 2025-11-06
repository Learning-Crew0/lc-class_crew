# LC Class Crew - API Documentation

## Authentication & User Management

### Base URL
```
http://localhost:5000/api/v1
```

## Public Endpoints

### 1. User Registration
**POST** `/auth/register`

Register a new user with complete Korean schema validation.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username123",
  "password": "SecurePass123!",
  "fullName": "홍길동",
  "gender": "남성",
  "phone": "01012345678",
  "dob": "1990-01-15",
  "memberType": "재직자",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": false
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다",
  "data": {
    "user": {
      "_id": "6789...",
      "id": "6789...",
      "email": "user@example.com",
      "username": "username123",
      "fullName": "홍길동",
      "memberType": "재직자",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- Email: Valid email format, max 254 characters
- Username: 3-50 characters, unique
- Password: Min 8 characters
- Full Name: 2-100 characters (Korean name)
- Gender: "남성" or "여성"
- Phone: 11 digits starting with 01 (e.g., "01012345678")
- DOB: Date in the past (format: YYYY-MM-DD)
- Member Type: "재직자" | "기업교육담당자" | "취업준비생"
- Agreements: termsOfService and privacyPolicy must be true

---

### 2. User Login
**POST** `/auth/login`

Login with email or username.

**Request Body:**
```json
{
  "emailOrUsername": "username123",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "user": {
      "_id": "6789...",
      "id": "6789...",
      "email": "user@example.com",
      "username": "username123",
      "fullName": "홍길동",
      "gender": "남성",
      "phone": "01012345678",
      "dob": "1990-01-15T00:00:00.000Z",
      "memberType": "재직자",
      "role": "user",
      "isVerified": false,
      "profilePicture": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- 401: "사용자 ID 또는 비밀번호가 올바르지 않습니다"
- 403: "비활성화된 계정입니다"

---

## User Protected Endpoints
**Requires:** `Authorization: Bearer <token>`

### 3. Get User Profile
**GET** `/user/profile`

Get current authenticated user's profile.

**Response (200):**
```json
{
  "success": true,
  "message": "프로필 조회 성공",
  "data": {
    "_id": "6789...",
    "email": "user@example.com",
    "username": "username123",
    "fullName": "홍길동",
    "gender": "남성",
    "phone": "01012345678",
    "dob": "1990-01-15T00:00:00.000Z",
    "memberType": "재직자",
    "role": "user",
    "agreements": {
      "termsOfService": true,
      "privacyPolicy": true,
      "marketingConsent": false
    },
    "isActive": true,
    "isVerified": false,
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Update User Profile
**PUT** `/user/profile`

Update user profile (restricted fields: password, email, username, role, memberType, agreements).

**Request Body:**
```json
{
  "fullName": "홍길동",
  "phone": "01098765432",
  "profilePicture": "https://example.com/profile.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "프로필 수정 성공",
  "data": {
    "_id": "6789...",
    "fullName": "홍길동",
    "phone": "01098765432",
    "profilePicture": "https://example.com/profile.jpg"
  }
}
```

---

### 5. Change Password
**POST** `/user/change-password`

Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "비밀번호 변경 성공",
  "data": {
    "message": "비밀번호가 성공적으로 변경되었습니다"
  }
}
```

**Error Responses:**
- 400: "현재 비밀번호가 올바르지 않습니다"
- 400: "새 비밀번호는 현재 비밀번호와 달라야 합니다"

---

## Admin Endpoints

### 6. Admin Login
**POST** `/admin/login`

Admin authentication with email or username.

**Request Body:**
```json
{
  "username": "admin",
  "password": "AdminPass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "관리자 로그인 성공",
  "data": {
    "admin": {
      "_id": "6789...",
      "id": "6789...",
      "email": "admin@classcrew.com",
      "username": "admin",
      "fullName": "관리자",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Admin Protected Endpoints
**Requires:** `Authorization: Bearer <admin_token>`

### 7. Get Admin Profile
**GET** `/admin/profile`

Get current admin profile.

**Response (200):**
```json
{
  "success": true,
  "message": "관리자 프로필 조회 성공",
  "data": {
    "admin": {
      "_id": "6789...",
      "email": "admin@classcrew.com",
      "username": "admin",
      "fullName": "관리자",
      "role": "admin",
      "isActive": true,
      "lastLogin": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 8. Update Admin Password
**PUT** `/admin/password`

Change admin password.

**Request Body:**
```json
{
  "currentPassword": "OldAdminPass123!",
  "newPassword": "NewAdminPass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "비밀번호 변경 성공",
  "data": {
    "message": "비밀번호가 성공적으로 변경되었습니다"
  }
}
```

---

### 9. Get All Admins
**GET** `/admin/admins?page=1&limit=10`

Get paginated list of all admins.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: "createdAt")
- `sortOrder` (optional): "asc" or "desc" (default: "desc")

**Response (200):**
```json
{
  "success": true,
  "message": "관리자 목록 조회 성공",
  "data": {
    "admins": [
      {
        "_id": "6789...",
        "email": "admin@classcrew.com",
        "username": "admin",
        "fullName": "관리자",
        "role": "admin",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalAdmins": 1,
      "limit": 10
    }
  }
}
```

---

### 10. Get Admin by ID
**GET** `/admin/admins/:id`

Get specific admin details.

**Response (200):**
```json
{
  "success": true,
  "message": "관리자 조회 성공",
  "data": {
    "admin": {
      "_id": "6789...",
      "email": "admin@classcrew.com",
      "username": "admin",
      "fullName": "관리자",
      "role": "admin",
      "isActive": true,
      "lastLogin": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 11. Create Admin
**POST** `/admin/admins`

Create a new admin account.

**Request Body:**
```json
{
  "email": "newadmin@classcrew.com",
  "username": "newadmin",
  "password": "AdminPass123!",
  "fullName": "신규 관리자",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "관리자 생성 성공",
  "data": {
    "admin": {
      "_id": "6789...",
      "email": "newadmin@classcrew.com",
      "username": "newadmin",
      "fullName": "신규 관리자",
      "role": "admin",
      "isActive": true
    }
  }
}
```

---

### 12. Update Admin
**PUT** `/admin/admins/:id`

Update admin details (restricted: password, role, username).

**Request Body:**
```json
{
  "email": "updated@classcrew.com",
  "fullName": "수정된 관리자"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "관리자 수정 성공",
  "data": {
    "admin": {
      "_id": "6789...",
      "email": "updated@classcrew.com",
      "fullName": "수정된 관리자"
    }
  }
}
```

---

### 13. Update Admin Status
**PATCH** `/admin/admins/:id/status`

Activate or deactivate an admin account.

**Request Body:**
```json
{
  "isActive": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "관리자가 비활성화되었습니다",
  "data": {
    "admin": {
      "_id": "6789...",
      "isActive": false
    }
  }
}
```

**Note:** Cannot change own account status.

---

### 14. Delete Admin
**DELETE** `/admin/admins/:id`

Delete an admin account.

**Response (200):**
```json
{
  "success": true,
  "message": "관리자 삭제 성공",
  "data": {
    "message": "관리자가 성공적으로 삭제되었습니다"
  }
}
```

**Note:** Cannot delete own account.

---

### 15. Get All Users
**GET** `/admin/users?page=1&limit=10&search=홍길동&memberType=재직자&isActive=true`

Get paginated list of all users with filtering.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `sortBy` (optional): Sort field
- `sortOrder` (optional): "asc" or "desc"
- `search` (optional): Search by name, email, username, or phone
- `memberType` (optional): Filter by member type
- `isActive` (optional): Filter by active status

**Response (200):**
```json
{
  "success": true,
  "message": "사용자 목록 조회 성공",
  "data": {
    "users": [
      {
        "_id": "6789...",
        "email": "user@example.com",
        "username": "username123",
        "fullName": "홍길동",
        "gender": "남성",
        "phone": "01012345678",
        "memberType": "재직자",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

### 16. Get User by ID
**GET** `/admin/users/:id`

Get specific user details.

**Response (200):**
```json
{
  "success": true,
  "message": "사용자 조회 성공",
  "data": {
    "user": {
      "_id": "6789...",
      "email": "user@example.com",
      "username": "username123",
      "fullName": "홍길동",
      "gender": "남성",
      "phone": "01012345678",
      "dob": "1990-01-15T00:00:00.000Z",
      "memberType": "재직자",
      "agreements": {
        "termsOfService": true,
        "privacyPolicy": true,
        "marketingConsent": false
      },
      "isActive": true,
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 17. Create User (Admin)
**POST** `/admin/users`

Create a new user account (same schema as registration).

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "Password123!",
  "fullName": "새 사용자",
  "gender": "여성",
  "phone": "01087654321",
  "dob": "1995-05-20",
  "memberType": "취업준비생",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": true
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "사용자 생성 성공",
  "data": {
    "user": {
      "_id": "6789...",
      "email": "newuser@example.com",
      "username": "newuser",
      "fullName": "새 사용자"
    }
  }
}
```

---

### 18. Update User (Admin)
**PUT** `/admin/users/:id`

Update user details (restricted: password, role).

**Request Body:**
```json
{
  "fullName": "수정된 이름",
  "phone": "01011112222",
  "memberType": "재직자"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "사용자 수정 성공",
  "data": {
    "user": {
      "_id": "6789...",
      "fullName": "수정된 이름",
      "phone": "01011112222",
      "memberType": "재직자"
    }
  }
}
```

---

### 19. Toggle User Status
**PATCH** `/admin/users/:id/toggle-status`

Activate or deactivate a user account.

**Request Body:**
```json
{
  "isActive": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "사용자가 비활성화되었습니다",
  "data": {
    "user": {
      "_id": "6789...",
      "isActive": false
    }
  }
}
```

---

### 20. Delete User
**DELETE** `/admin/users/:id`

Delete a user account.

**Response (200):**
```json
{
  "success": true,
  "message": "사용자 삭제 성공",
  "data": {
    "message": "사용자가 성공적으로 삭제되었습니다"
  }
}
```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message in Korean",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

### Common HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid credentials or token)
- **403** - Forbidden (no permission)
- **404** - Not Found
- **409** - Conflict (duplicate entry)
- **500** - Internal Server Error

---

## Member Types

```javascript
{
  "재직자": "Currently employed",
  "기업교육담당자": "Corporate training manager",
  "취업준비생": "Job seeker"
}
```

## Gender Types

```javascript
{
  "남성": "Male",
  "여성": "Female"
}
```

---

## Testing Examples

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test1234!",
    "fullName": "테스트",
    "gender": "남성",
    "phone": "01012345678",
    "dob": "1990-01-01",
    "memberType": "재직자",
    "agreements": {
      "termsOfService": true,
      "privacyPolicy": true
    }
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser",
    "password": "Test1234!"
  }'
```

**Get profile (with token):**
```bash
curl -X GET http://localhost:5000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Phone numbers must be exactly 11 digits starting with 01
3. Passwords must be at least 8 characters
4. Email and username uniqueness is enforced
5. Admin accounts cannot modify/delete themselves
6. All validation messages are in Korean for better UX
7. JWT tokens are used for authentication
8. Refresh tokens are provided for token renewal (implement refresh endpoint separately)

