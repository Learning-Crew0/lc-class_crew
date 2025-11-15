# Account Settings & Change Password API Guide

## 🎯 Overview

This document describes the backend API endpoints for the **Account Settings Page** (`/mypage/account`) and **Change Password Page** (`/mypage/account/change-password`).

---

## 📍 API Endpoints

### 1. GET `/api/v1/user/profile`

**Authentication:** ✅ Required (Bearer Token)

**Description:** Get current user profile data for displaying in account settings.

### 2. PUT `/api/v1/user/profile`

**Authentication:** ✅ Required (Bearer Token)

**Description:** Update user profile information (account settings).

### 3. POST `/api/v1/user/change-password`

**Authentication:** ✅ Required (Bearer Token)

**Description:** Change user password.

---

## 1️⃣ Get User Profile

### GET `/api/v1/user/profile`

#### Request Headers

```http
Authorization: Bearer {your-jwt-token}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "프로필 조회 성공",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe123",
    "fullName": "홍길동",
    "gender": "남성",
    "phone": "01012345678",
    "dob": "1990-01-15T00:00:00.000Z",
    "memberType": "employed",
    "role": "user",
    "agreements": {
      "termsOfService": true,
      "privacyPolicy": true,
      "marketingConsent": false
    },
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-15T00:00:00.000Z"
  }
}
```

#### Response Fields

| Field                     | Type    | Description                      | Editable |
|---------------------------|---------|----------------------------------|----------|
| `_id`                     | String  | User ID                          | ❌ No    |
| `email`                   | String  | Email address                    | ❌ No    |
| `username`                | String  | User ID (login)                  | ❌ No    |
| `fullName`                | String  | Full name                        | ❌ No    |
| `gender`                  | String  | Gender ("남성" or "여성")        | ✅ Yes   |
| `phone`                   | String  | Mobile phone number              | ✅ Yes   |
| `dob`                     | String  | Date of birth (ISO 8601)         | ✅ Yes   |
| `memberType`              | String  | Member type                      | ✅ Yes   |
| `agreements.termsOfService` | Boolean | Terms of service agreement     | ✅ Yes   |
| `agreements.privacyPolicy`  | Boolean | Privacy policy agreement       | ✅ Yes   |
| `agreements.marketingConsent` | Boolean | Marketing consent (optional) | ✅ Yes   |

#### memberType Values

| Value                    | Korean                |
|--------------------------|-----------------------|
| `employed`               | 재직자                |
| `corporate_training_manager` | 기업 교육담당자      |
| `job_seeker`             | 구직자                |

---

## 2️⃣ Update User Profile

### PUT `/api/v1/user/profile`

#### Request Headers

```http
Authorization: Bearer {your-jwt-token}
Content-Type: application/json
```

#### Request Body

```json
{
  "gender": "남성",
  "phone": "01012345678",
  "dob": "1990-01-15",
  "memberType": "employed",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": false
  }
}
```

#### Request Fields (All Optional)

| Field                     | Type    | Validation                        | Required |
|---------------------------|---------|-----------------------------------|----------|
| `gender`                  | String  | Must be "남성" or "여성"          | ❌ Optional |
| `phone`                   | String  | 11 digits (01012345678)           | ❌ Optional |
| `dob`                     | Date    | Must be in the past               | ❌ Optional |
| `memberType`              | String  | One of 3 valid types              | ❌ Optional |
| `agreements`              | Object  | See below                         | ❌ Optional |
| `agreements.termsOfService` | Boolean | true or false                   | ❌ Optional |
| `agreements.privacyPolicy`  | Boolean | true or false                   | ❌ Optional |
| `agreements.marketingConsent` | Boolean | true or false                 | ❌ Optional |

**Note:** You can send only the fields you want to update. Other fields will remain unchanged.

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "프로필 수정 성공",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe123",
    "fullName": "홍길동",
    "gender": "남성",
    "phone": "01012345678",
    "dob": "1990-01-15T00:00:00.000Z",
    "memberType": "employed",
    "agreements": {
      "termsOfService": true,
      "privacyPolicy": true,
      "marketingConsent": false
    },
    "updatedAt": "2025-01-15T00:00:00.000Z"
  }
}
```

#### Error Responses

##### 400 Bad Request (Validation Error)

```json
{
  "success": false,
  "message": "올바른 휴대전화 번호를 입력해주세요"
}
```

##### 401 Unauthorized (No Token)

```json
{
  "success": false,
  "message": "인증 토큰이 필요합니다"
}
```

---

## 3️⃣ Change Password

### POST `/api/v1/user/change-password`

#### Request Headers

```http
Authorization: Bearer {your-jwt-token}
Content-Type: application/json
```

#### Request Body

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

#### Request Fields

| Field            | Type   | Validation                 | Required |
|------------------|--------|----------------------------|----------|
| `currentPassword` | String | Any string                 | ✅ Yes   |
| `newPassword`    | String | Min 8 characters           | ✅ Yes   |

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "비밀번호 변경 성공",
  "data": {
    "message": "비밀번호가 성공적으로 변경되었습니다"
  }
}
```

#### Error Responses

##### 400 Bad Request (Current Password Incorrect)

```json
{
  "success": false,
  "message": "현재 비밀번호가 올바르지 않습니다"
}
```

##### 400 Bad Request (Same Password)

```json
{
  "success": false,
  "message": "새 비밀번호는 현재 비밀번호와 달라야 합니다"
}
```

##### 400 Bad Request (Password Too Short)

```json
{
  "success": false,
  "message": "새 비밀번호는 8자 이상이어야 합니다"
}
```

---

## 💻 Frontend Implementation

### 1. Get User Profile (On Page Load)

```javascript
const getUserProfile = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/api/v1/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    return data.data; // User profile object
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
```

### 2. Update Profile

```javascript
const updateProfile = async (updates) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/api/v1/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return data.data; // Updated user profile
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Usage example
const handleSubmit = async (formData) => {
  const updates = {
    gender: formData.gender,
    phone: formData.phone,
    dob: formData.dob,
    memberType: formData.memberType,
    agreements: {
      termsOfService: formData.termsOfService,
      privacyPolicy: formData.privacyPolicy,
      marketingConsent: formData.marketingConsent,
    },
  };

  try {
    const result = await updateProfile(updates);
    alert('수정이 완료되었습니다.');
  } catch (error) {
    alert(error.message);
  }
};
```

### 3. Change Password

```javascript
const changePassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/api/v1/user/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Usage example
const handleChangePassword = async (formData) => {
  if (formData.newPassword !== formData.confirmPassword) {
    alert('신규 비밀번호가 일치하지 않습니다. 다시 확인해 주세요');
    return;
  }

  try {
    await changePassword(formData.currentPassword, formData.newPassword);
    alert('수정완료되었습니다');
    // Redirect or clear form
  } catch (error) {
    if (error.message.includes('현재 비밀번호')) {
      alert('현재 비밀번호가 일치하지 않습니다');
    } else {
      alert(error.message);
    }
  }
};
```

---

## 🎨 Complete React/Next.js Example

### Account Settings Page

```jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    gender: '',
    phone: '',
    dob: { year: '', month: '', day: '' },
    memberType: '',
    termsOfService: false,
    privacyPolicy: false,
    marketingConsent: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      const userData = data.data;

      // Parse DOB
      const dob = new Date(userData.dob);
      
      setUser(userData);
      setFormData({
        gender: userData.gender || '',
        phone: userData.phone || '',
        dob: {
          year: dob.getFullYear().toString(),
          month: (dob.getMonth() + 1).toString().padStart(2, '0'),
          day: dob.getDate().toString().padStart(2, '0'),
        },
        memberType: userData.memberType || '',
        termsOfService: userData.agreements?.termsOfService || false,
        privacyPolicy: userData.agreements?.privacyPolicy || false,
        marketingConsent: userData.agreements?.marketingConsent || false,
      });
    } catch (error) {
      console.error('Error:', error);
      alert('프로필을 불러오는 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.termsOfService || !formData.privacyPolicy) {
      alert('약관에 동의해주세요');
      return;
    }

    if (!formData.phone || !formData.gender || !formData.memberType) {
      alert('필수항목을 입력해주세요');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const dobString = `${formData.dob.year}-${formData.dob.month}-${formData.dob.day}`;

      const response = await fetch('/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender: formData.gender,
          phone: formData.phone,
          dob: dobString,
          memberType: formData.memberType,
          agreements: {
            termsOfService: formData.termsOfService,
            privacyPolicy: formData.privacyPolicy,
            marketingConsent: formData.marketingConsent,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      alert('수정이 완료되었습니다.');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {/* Disabled Fields */}
      <input
        type="email"
        value={user?.email || ''}
        disabled
        style={{ backgroundColor: '#f0f0f0' }}
      />
      <input
        type="text"
        value={user?.username || ''}
        disabled
        style={{ backgroundColor: '#f0f0f0' }}
      />
      <input
        type="text"
        value={user?.fullName || ''}
        disabled
        style={{ backgroundColor: '#f0f0f0' }}
      />

      {/* Editable Fields */}
      <select
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
      >
        <option value="">선택</option>
        <option value="남성">남성</option>
        <option value="여성">여성</option>
      </select>

      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
        maxLength={11}
      />

      {/* Date of Birth */}
      <input
        type="text"
        placeholder="YYYY"
        value={formData.dob.year}
        onChange={(e) => setFormData({
          ...formData,
          dob: { ...formData.dob, year: e.target.value }
        })}
      />

      {/* Terms */}
      <label>
        <input
          type="checkbox"
          checked={formData.termsOfService}
          onChange={(e) => setFormData({ ...formData, termsOfService: e.target.checked })}
        />
        이용약관 동의 *
      </label>

      <button type="submit">수정완료</button>
      <button type="button" onClick={() => router.push('/mypage/learning-status')}>
        취소
      </button>
    </form>
  );
}
```

---

## 🧪 Testing

### Using cURL

```bash
# Get Profile
curl -X GET http://localhost:5000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update Profile
curl -X PUT http://localhost:5000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "남성",
    "phone": "01012345678",
    "memberType": "employed",
    "agreements": {
      "termsOfService": true,
      "privacyPolicy": true
    }
  }'

# Change Password
curl -X POST http://localhost:5000/api/v1/user/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
  }'
```

### Using Test Script

```bash
cd backend
node scripts/test-account-settings.js
```

---

## ✅ Implementation Checklist

### Account Settings Page:
- [ ] Fetch user profile on page load
- [ ] Auto-fill all fields except password
- [ ] Disable email, username, fullName fields
- [ ] Enable gender, phone, dob, memberType, agreements
- [ ] Validate phone number (numeric only, 11 digits)
- [ ] Validate required terms (termsOfService, privacyPolicy)
- [ ] Show success/error modals
- [ ] Handle "취소" button (redirect to learning-status)
- [ ] Handle "수정완료" button (validate & submit)

### Change Password Page:
- [ ] All fields enabled
- [ ] Validate new password matches confirm password
- [ ] Validate minimum 8 characters
- [ ] Call API to change password
- [ ] Show success/error modals
- [ ] Handle "취소" button (redirect to account)
- [ ] Handle "수정완료" button (validate & submit)

---

## 📝 Notes

1. **Disabled Fields:** `email`, `username`, `fullName` cannot be changed (restricted by backend)

2. **Phone Validation:** Only numeric input, 11 digits, format: `01012345678`

3. **DOB Format:** Frontend sends as `"YYYY-MM-DD"`, backend stores as ISO 8601 date

4. **memberType Values:**
   - `employed` - 재직자
   - `corporate_training_manager` - 기업 교육담당자
   - `job_seeker` - 구직자

5. **Required Terms:** `termsOfService` and `privacyPolicy` must be `true`

6. **Password:** Not included in profile GET response (security)

---

**Last Updated:** 2025-01-15  
**Backend Version:** v1  
**Status:** ✅ Production Ready

