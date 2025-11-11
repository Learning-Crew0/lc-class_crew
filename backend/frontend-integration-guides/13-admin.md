# 🔐 Admin APIs - Frontend Integration Guide

Admin dashboard and management endpoints.

---

## 🔑 API Endpoints

### Get Dashboard Stats
```http
GET /admin/dashboard/stats
Authorization: Bearer {adminToken}
```

### Get All Users
```http
GET /admin/users?page=1&limit=20&memberType=individual
Authorization: Bearer {adminToken}
```

### Toggle User Status
```http
PATCH /admin/users/{userId}/toggle-status
Authorization: Bearer {adminToken}
```

---

## 💻 Service Implementation

```javascript
// src/services/admin.service.js

import apiClient from './api.client';

class AdminService {
    async getDashboardStats() {
        return await apiClient.get('/admin/dashboard/stats');
    }

    async getUsers(filters = {}) {
        return await apiClient.get('/admin/users', filters);
    }

    async toggleUserStatus(userId) {
        return await apiClient.patch(`/admin/users/${userId}/toggle-status`);
    }
}

export default new AdminService();
```

---

## 🎨 Component Example

```javascript
// src/pages/admin/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin.service';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const data = await adminService.getDashboardStats();
        setStats(data);
    };

    if (!stats) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm">총 사용자</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm">총 강좌</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm">총 신청</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalApplications}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm">총 수강생</h3>
                    <p className="text-3xl font-bold text-orange-600">{stats.totalEnrollments}</p>
                </div>
            </div>

            {/* Add more admin components here */}
        </div>
    );
};

export default AdminDashboard;
```

### User Management Component

```javascript
// src/pages/admin/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin.service';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ page: 1, limit: 20 });

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        const data = await adminService.getUsers(filters);
        setUsers(data.users);
    };

    const handleToggleStatus = async (userId) => {
        if (!confirm('사용자 상태를 변경하시겠습니까?')) return;

        try {
            await adminService.toggleUserStatus(userId);
            await fetchUsers();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">사용자 관리</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">이름</th>
                            <th className="px-6 py-3 text-left">이메일</th>
                            <th className="px-6 py-3 text-left">회원 유형</th>
                            <th className="px-6 py-3 text-left">상태</th>
                            <th className="px-6 py-3 text-left">작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t">
                                <td className="px-6 py-4">{user.fullName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.memberType}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        user.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.isActive ? '활성' : '비활성'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleStatus(user._id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        상태 변경
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
```

---

## ✅ Admin Routes

```javascript
// src/routes/AdminRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import CourseManagement from '../pages/admin/CourseManagement';

const AdminRoutes = () => {
    return (
        <ProtectedRoute adminOnly={true}>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/courses" element={<CourseManagement />} />
            </Routes>
        </ProtectedRoute>
    );
};

export default AdminRoutes;
```

