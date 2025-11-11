# 👨‍🎓 Student Enrollments - Frontend Integration Guide

View and manage student enrollments, attendance, and certificates.

---

## 🔑 API Endpoints

### Get Student's Enrollments
```http
GET /enrollments/student/{userId}?page=1&limit=10&status=enrolled
Authorization: Bearer {token}
```

### Get Enrollment by ID
```http
GET /enrollments/{enrollmentId}
Authorization: Bearer {token}
```

### Cancel Enrollment
```http
POST /enrollments/{enrollmentId}/cancel
Content-Type: application/json

{
  "reason": "개인 사정"
}
```

---

## 💻 Service Implementation

```javascript
// src/services/enrollment.service.js

import apiClient from './api.client';

class EnrollmentService {
    async getStudentEnrollments(userId, filters = {}) {
        return await apiClient.get(`/enrollments/student/${userId}`, filters);
    }

    async getEnrollmentById(enrollmentId) {
        return await apiClient.get(`/enrollments/${enrollmentId}`);
    }

    async cancelEnrollment(enrollmentId, reason) {
        return await apiClient.post(`/enrollments/${enrollmentId}/cancel`, { reason });
    }
}

export default new EnrollmentService();
```

---

## 🎨 Component Example

```javascript
// src/pages/MyEnrollments.jsx

import React, { useState, useEffect } from 'react';
import enrollmentService from '../services/enrollment.service';
import { useAuth } from '../context/AuthContext';

const MyEnrollments = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        const data = await enrollmentService.getStudentEnrollments(user._id);
        setEnrollments(data.enrollments);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">내 수강 내역</h1>
            <div className="space-y-4">
                {enrollments.map((enrollment) => (
                    <div key={enrollment._id} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-bold text-lg">{enrollment.course.title}</h3>
                        <p className="text-gray-600">{enrollment.schedule.scheduleName}</p>
                        <span className={`inline-block px-3 py-1 rounded text-sm mt-2 ${
                            enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            enrollment.status === 'enrolled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {enrollment.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyEnrollments;
```

