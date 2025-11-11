# 👤 User Management - Frontend Integration Guide

Complete guide for managing user profiles and account settings in your ClassCrew frontend application.

---

## 📋 Overview

User management endpoints allow authenticated users to view and update their profiles, change passwords, and manage account settings.

---

## 🔑 API Endpoints

### Get User Profile

**Endpoint:** `GET /user/profile`  
**Auth Required:** Yes

**Response:**
```javascript
{
  "success": true,
  "data": {
    "_id": "userId123",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "01012345678",
    "memberType": "individual",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Update Profile

**Endpoint:** `PUT /user/profile`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "fullName": "John Updated",
  "phone": "01098765432",
  "memberType": "corporate_trainer"
}
```

### Change Password

**Endpoint:** `POST /user/change-password`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

---

## 💻 Frontend Implementation

### User Service

```javascript
// src/services/user.service.js

import apiClient from './api.client';

class UserService {
    /**
     * Get current user profile
     */
    async getProfile() {
        try {
            const response = await apiClient.get('/user/profile');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        try {
            const response = await apiClient.put('/user/profile', profileData);
            
            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await apiClient.post('/user/change-password', {
                currentPassword,
                newPassword,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user by ID (for viewing other users)
     */
    async getUserById(userId) {
        try {
            const response = await apiClient.get(`/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();
```

---

## 🎨 UI Components

### User Profile Page

```javascript
// src/pages/UserProfile.jsx

import React, { useState, useEffect } from 'react';
import userService from '../services/user.service';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setUser(data);
        } catch (err) {
            setError('프로필을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;
    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">내 프로필</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-600 text-sm">이름</label>
                        <p className="text-lg font-semibold">{user.fullName}</p>
                    </div>
                    
                    <div>
                        <label className="text-gray-600 text-sm">아이디</label>
                        <p className="text-lg font-semibold">{user.username}</p>
                    </div>

                    <div>
                        <label className="text-gray-600 text-sm">이메일</label>
                        <p className="text-lg font-semibold">{user.email}</p>
                    </div>

                    <div>
                        <label className="text-gray-600 text-sm">전화번호</label>
                        <p className="text-lg font-semibold">{user.phone || '-'}</p>
                    </div>

                    <div>
                        <label className="text-gray-600 text-sm">회원 유형</label>
                        <p className="text-lg font-semibold">
                            {getMemberTypeLabel(user.memberType)}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-600 text-sm">가입일</label>
                        <p className="text-lg font-semibold">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <a
                        href="/profile/edit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        프로필 수정
                    </a>
                    <a
                        href="/profile/change-password"
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                        비밀번호 변경
                    </a>
                </div>
            </div>
        </div>
    );
};

const getMemberTypeLabel = (type) => {
    const types = {
        individual: '개인 회원',
        corporate_trainer: '기업 교육 담당자',
        employee: '재직자',
        job_seeker: '구직자',
    };
    return types[type] || type;
};

export default UserProfile;
```

### Edit Profile Component

```javascript
// src/components/user/EditProfileForm.jsx

import React, { useState, useEffect } from 'react';
import userService from '../../services/user.service';
import ErrorAlert from '../ErrorAlert';
import SuccessAlert from '../SuccessAlert';

const EditProfileForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        memberType: 'individual',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const user = await userService.getProfile();
            setFormData({
                fullName: user.fullName,
                phone: user.phone || '',
                memberType: user.memberType,
            });
        } catch (err) {
            setError('프로필을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setFetchingProfile(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await userService.updateProfile(formData);
            setSuccess('프로필이 성공적으로 업데이트되었습니다.');
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000);
        } catch (err) {
            setError(err.message || '프로필 업데이트 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProfile) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">프로필 수정</h2>

            {error && <ErrorAlert message={error} onClose={() => setError('')} />}
            {success && <SuccessAlert message={success} />}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">이름</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">전화번호</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="01012345678"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">회원 유형</label>
                    <select
                        name="memberType"
                        value={formData.memberType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="individual">개인 회원</option>
                        <option value="corporate_trainer">기업 교육 담당자</option>
                        <option value="employee">재직자</option>
                        <option value="job_seeker">구직자</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? '저장 중...' : '저장'}
                    </button>
                    <a
                        href="/profile"
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 text-center"
                    >
                        취소
                    </a>
                </div>
            </form>
        </div>
    );
};

export default EditProfileForm;
```

### Change Password Component

```javascript
// src/components/user/ChangePasswordForm.jsx

import React, { useState } from 'react';
import userService from '../../services/user.service';
import ErrorAlert from '../ErrorAlert';
import SuccessAlert from '../SuccessAlert';

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('모든 필드를 입력해주세요.');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return false;
        }

        if (formData.newPassword.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다.');
            return false;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            await userService.changePassword(
                formData.currentPassword,
                formData.newPassword
            );
            setSuccess('비밀번호가 성공적으로 변경되었습니다.');
            
            // Clear form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000);
        } catch (err) {
            setError(err.message || '비밀번호 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">비밀번호 변경</h2>

            {error && <ErrorAlert message={error} onClose={() => setError('')} />}
            {success && <SuccessAlert message={success} />}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">현재 비밀번호</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">새 비밀번호</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="최소 6자 이상"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">새 비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="새 비밀번호 재입력"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? '변경 중...' : '비밀번호 변경'}
                    </button>
                    <a
                        href="/profile"
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 text-center"
                    >
                        취소
                    </a>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
```

---

## ✅ Best Practices

1. **Update localStorage** - When profile is updated, sync with localStorage
2. **Validate inputs** - Phone number format, password strength
3. **Show success messages** - Confirm successful operations
4. **Handle errors** - Show specific error messages
5. **Redirect after updates** - Better UX after successful operations

---

**Next:** [Courses Integration →](./04-courses.md)

