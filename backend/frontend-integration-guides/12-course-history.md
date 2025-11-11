# 📚 Course History - Frontend Integration Guide

Allow users to check their course history and download certificates without login.

---

## 🔑 API Endpoints

### Check Personal History (Public)
```http
POST /course-history/personal
Content-Type: application/json

{
  "phoneNumber": "01012345678",
  "email": "hong@example.com",
  "name": "홍길동"
}
```

### Get Certificate (Public)
```http
GET /course-history/certificate/{enrollmentId}
```

---

## 💻 Service Implementation

```javascript
// src/services/courseHistory.service.js

import apiClient from './api.client';

class CourseHistoryService {
    async checkPersonalHistory(phoneNumber, email, name) {
        return await apiClient.post('/course-history/personal', {
            phoneNumber,
            email,
            name,
        });
    }

    getCertificateUrl(enrollmentId) {
        return `/api/v1/course-history/certificate/${enrollmentId}`;
    }
}

export default new CourseHistoryService();
```

---

## 🎨 Component Example

```javascript
// src/pages/CourseHistory.jsx

import React, { useState } from 'react';
import courseHistoryService from '../services/courseHistory.service';

const CourseHistoryPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await courseHistoryService.checkPersonalHistory(
                formData.phone,
                formData.email,
                formData.name
            );
            setHistory(data);
        } catch (error) {
            alert(error.message || '조회 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">수강 이력 조회</h1>

            {!history ? (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="이름"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="전화번호 (01012345678)"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                        <input
                            type="email"
                            placeholder="이메일"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? '조회 중...' : '조회하기'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">
                        {history.userInfo.name}님의 수강 이력
                    </h2>
                    <p className="text-gray-600 mb-6">
                        총 {history.totalCourses}개 강좌 수강 (수료: {history.completedCourses}개)
                    </p>

                    <div className="space-y-3">
                        {history.courseHistory.map((item) => (
                            <div key={item.enrollmentId} className="border-b pb-3">
                                <h3 className="font-bold">{item.courseName}</h3>
                                <p className="text-sm text-gray-600">{item.trainingDate}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {item.status}
                                    </span>
                                    {item.certificateAvailable && (
                                        <a
                                            href={courseHistoryService.getCertificateUrl(item.enrollmentId)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            수료증 다운로드
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setHistory(null)}
                        className="mt-6 text-blue-600 hover:underline"
                    >
                        다시 조회하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseHistoryPage;
```

