# 📝 Class Applications - Frontend Integration Guide

Complete guide for implementing the complex class application workflow in your ClassCrew frontend application.

---

## 📋 Overview

Class applications allow users to register themselves and/or multiple students (1-5 manual entry, 6+ via Excel upload) for selected courses. This is one of the most complex features in the system.

---

## 🔄 Application Flow

1. **Create Draft** - Select courses from cart
2. **Add Students** - For each course, validate and add 1-5 students
3. **Upload Bulk** - (Optional) Upload Excel file for 6+ students
4. **Payment Info** - Enter payment method and invoice details
5. **Submit** - Finalize application (creates enrollments, removes from cart)

---

## 🔑 API Endpoints

### Download Excel Template

**Endpoint:** `GET /class-applications/download-template`  
**Auth Required:** No

### Create Draft

**Endpoint:** `POST /class-applications/draft`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "courseIds": ["courseId1", "courseId2"]
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "_id": "app123",
    "user": "userId",
    "courses": [
      {
        "course": { /* course details */ },
        "trainingSchedule": { /* schedule details */ },
        "students": [],
        "price": 500000
      }
    ],
    "status": "draft",
    "paymentInfo": { "totalAmount": 1000000 }
  }
}
```

### Validate Student

**Endpoint:** `POST /class-applications/validate-student`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "email": "student@example.com",
  "phone": "01012345678",
  "name": "홍길동"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "userId": "user123",
    "exists": true,
    "user": {
      "_id": "user123",
      "fullName": "홍길동",
      "email": "student@example.com",
      "phone": "01012345678"
    }
  }
}
```

### Add Student to Course

**Endpoint:** `POST /class-applications/{applicationId}/add-student`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "courseId": "courseId",
  "studentData": {
    "userId": "user123",
    "name": "홍길동",
    "phone": {
      "prefix": "010",
      "middle": "1234",
      "last": "5678"
    },
    "email": {
      "username": "hong",
      "domain": "example.com"
    },
    "company": "ABC Company",
    "position": "Manager"
  }
}
```

### Upload Bulk Students (Excel)

**Endpoint:** `POST /class-applications/{applicationId}/upload-bulk-students`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

**FormData:**
```javascript
{
  courseId: "courseId",
  file: (Excel file)
}
```

### Update Payment Info

**Endpoint:** `PUT /class-applications/{applicationId}/payment`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "paymentMethod": "간편결제",
  "taxInvoiceRequired": true,
  "invoiceManager": {
    "name": "이재윤",
    "phone": {
      "prefix": "010",
      "middle": "6362",
      "last": "0714"
    },
    "email": {
      "username": "lee",
      "domain": "company.com"
    }
  }
}
```

### Submit Application

**Endpoint:** `POST /class-applications/{applicationId}/submit`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "agreements": {
    "paymentAndRefundPolicy": true,
    "refundPolicy": true
  }
}
```

**Response:** Generates application number, creates enrollments, removes courses from cart

---

## 💻 Frontend Implementation

### Application Service

```javascript
// src/services/classApplication.service.js

import apiClient from './api.client';

class ClassApplicationService {
    /**
     * Download Excel template
     */
    downloadTemplate() {
        window.open('/api/v1/class-applications/download-template', '_blank');
    }

    /**
     * Create draft application
     */
    async createDraft(courseIds) {
        try {
            const response = await apiClient.post('/class-applications/draft', {
                courseIds,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Validate student
     */
    async validateStudent(email, phone, name) {
        try {
            const response = await apiClient.post(
                '/class-applications/validate-student',
                { email, phone, name }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Add student to course
     */
    async addStudent(applicationId, courseId, studentData) {
        try {
            const response = await apiClient.post(
                `/class-applications/${applicationId}/add-student`,
                { courseId, studentData }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Upload bulk students
     */
    async uploadBulkStudents(applicationId, courseId, file) {
        try {
            const formData = new FormData();
            formData.append('courseId', courseId);
            formData.append('file', file);

            const response = await apiClient.post(
                `/class-applications/${applicationId}/upload-bulk-students`,
                formData,
                true // isFormData
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update payment info
     */
    async updatePayment(applicationId, paymentData) {
        try {
            const response = await apiClient.put(
                `/class-applications/${applicationId}/payment`,
                paymentData
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Submit application
     */
    async submitApplication(applicationId, agreements) {
        try {
            const response = await apiClient.post(
                `/class-applications/${applicationId}/submit`,
                { agreements }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get application by ID
     */
    async getApplicationById(applicationId) {
        try {
            const response = await apiClient.get(
                `/class-applications/${applicationId}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user's applications
     */
    async getUserApplications(userId, filters = {}) {
        try {
            const response = await apiClient.get(
                `/class-applications/user/${userId}`,
                filters
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new ClassApplicationService();
```

---

## 🎨 UI Components

### Multi-Step Application Form

```javascript
// src/pages/ClassApplication.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classApplicationService from '../services/classApplication.service';
import StepIndicator from '../components/application/StepIndicator';
import CourseSelection from '../components/application/CourseSelection';
import StudentEntry from '../components/application/StudentEntry';
import PaymentInfo from '../components/application/PaymentInfo';
import ReviewSubmit from '../components/application/ReviewSubmit';

const ClassApplication = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { courseIds } = location.state || {};

    const [currentStep, setCurrentStep] = useState(1);
    const [applicationId, setApplicationId] = useState(null);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(false);

    const steps = [
        { number: 1, title: '강좌 확인', component: CourseSelection },
        { number: 2, title: '수강생 정보', component: StudentEntry },
        { number: 3, title: '결제 정보', component: PaymentInfo },
        { number: 4, title: '확인 및 제출', component: ReviewSubmit },
    ];

    useEffect(() => {
        if (!courseIds || courseIds.length === 0) {
            alert('선택된 강좌가 없습니다.');
            navigate('/cart');
            return;
        }
        createDraftApplication();
    }, []);

    const createDraftApplication = async () => {
        setLoading(true);
        try {
            const app = await classApplicationService.createDraft(courseIds);
            setApplicationId(app._id);
            setApplication(app);
        } catch (error) {
            alert(error.message || '신청서 생성 실패');
            navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    const refreshApplication = async () => {
        try {
            const app = await classApplicationService.getApplicationById(applicationId);
            setApplication(app);
        } catch (error) {
            console.error('Error refreshing application:', error);
        }
    };

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const CurrentStepComponent = steps[currentStep - 1].component;

    if (loading || !application) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">강좌 신청</h1>

            <StepIndicator steps={steps} currentStep={currentStep} />

            <div className="mt-8">
                <CurrentStepComponent
                    application={application}
                    applicationId={applicationId}
                    onNext={handleNext}
                    onBack={handleBack}
                    onRefresh={refreshApplication}
                />
            </div>
        </div>
    );
};

export default ClassApplication;
```

### Student Entry Component

```javascript
// src/components/application/StudentEntry.jsx

import React, { useState } from 'react';
import classApplicationService from '../../services/classApplication.service';

const StudentEntry = ({ application, applicationId, onNext, onBack, onRefresh }) => {
    const [selectedCourse, setSelectedCourse] = useState(application.courses[0]?.course._id);
    const [studentData, setStudentData] = useState({
        name: '',
        phone: { prefix: '010', middle: '', last: '' },
        email: { username: '', domain: '' },
        company: '',
        position: '',
    });
    const [validating, setValidating] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleValidateAndAdd = async () => {
        // Validate fields
        if (!studentData.name || !studentData.phone.middle || !studentData.phone.last) {
            alert('필수 항목을 입력해주세요.');
            return;
        }

        setValidating(true);
        try {
            // Validate student
            const phone = `${studentData.phone.prefix}${studentData.phone.middle}${studentData.phone.last}`;
            const email = `${studentData.email.username}@${studentData.email.domain}`;

            const validation = await classApplicationService.validateStudent(
                email,
                phone,
                studentData.name
            );

            // Add student
            await classApplicationService.addStudent(applicationId, selectedCourse, {
                ...studentData,
                userId: validation.userId,
            });

            // Refresh application
            await onRefresh();

            // Clear form
            setStudentData({
                name: '',
                phone: { prefix: '010', middle: '', last: '' },
                email: { username: '', domain: '' },
                company: '',
                position: '',
            });

            alert('수강생이 추가되었습니다.');
        } catch (error) {
            alert(error.message || '수강생 추가 실패');
        } finally {
            setValidating(false);
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await classApplicationService.uploadBulkStudents(
                applicationId,
                selectedCourse,
                file
            );
            await onRefresh();
            alert('대량 등록이 완료되었습니다.');
        } catch (error) {
            alert(error.message || '파일 업로드 실패');
        } finally {
            setUploading(false);
        }
    };

    const currentCourse = application.courses.find(
        (c) => c.course._id === selectedCourse
    );
    const studentCount = currentCourse?.students?.length || 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">수강생 정보 입력</h2>

            {/* Course Tabs */}
            <div className="flex gap-2 mb-6 border-b">
                {application.courses.map((courseItem) => (
                    <button
                        key={courseItem.course._id}
                        onClick={() => setSelectedCourse(courseItem.course._id)}
                        className={`px-4 py-2 font-semibold ${
                            selectedCourse === courseItem.course._id
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-600'
                        }`}
                    >
                        {courseItem.course.title}
                        <span className="ml-2 text-sm">
                            ({courseItem.students?.length || 0}명)
                        </span>
                    </button>
                ))}
            </div>

            <div className="mb-6">
                <p className="text-sm text-gray-600">
                    • 1-5명: 아래 양식으로 직접 입력
                </p>
                <p className="text-sm text-gray-600">
                    • 6명 이상: Excel 파일 업로드
                </p>
            </div>

            {/* Manual Entry Form (1-5 students) */}
            {studentCount < 6 && (
                <div className="mb-8">
                    <h3 className="font-bold mb-4">수강생 추가 ({studentCount}/5)</h3>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="이름 *"
                            value={studentData.name}
                            onChange={(e) =>
                                setStudentData({ ...studentData, name: e.target.value })
                            }
                            className="px-3 py-2 border rounded-lg"
                        />

                        <div className="flex gap-2">
                            <input
                                value={studentData.phone.prefix}
                                disabled
                                className="w-16 px-2 py-2 border rounded-lg bg-gray-100"
                            />
                            <input
                                type="text"
                                maxLength={4}
                                placeholder="1234"
                                value={studentData.phone.middle}
                                onChange={(e) =>
                                    setStudentData({
                                        ...studentData,
                                        phone: {
                                            ...studentData.phone,
                                            middle: e.target.value,
                                        },
                                    })
                                }
                                className="flex-1 px-3 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                maxLength={4}
                                placeholder="5678"
                                value={studentData.phone.last}
                                onChange={(e) =>
                                    setStudentData({
                                        ...studentData,
                                        phone: { ...studentData.phone, last: e.target.value },
                                    })
                                }
                                className="flex-1 px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="이메일"
                                value={studentData.email.username}
                                onChange={(e) =>
                                    setStudentData({
                                        ...studentData,
                                        email: {
                                            ...studentData.email,
                                            username: e.target.value,
                                        },
                                    })
                                }
                                className="flex-1 px-3 py-2 border rounded-lg"
                            />
                            <span className="flex items-center">@</span>
                            <input
                                type="text"
                                placeholder="example.com"
                                value={studentData.email.domain}
                                onChange={(e) =>
                                    setStudentData({
                                        ...studentData,
                                        email: {
                                            ...studentData.email,
                                            domain: e.target.value,
                                        },
                                    })
                                }
                                className="flex-1 px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="회사명"
                            value={studentData.company}
                            onChange={(e) =>
                                setStudentData({ ...studentData, company: e.target.value })
                            }
                            className="px-3 py-2 border rounded-lg"
                        />

                        <input
                            type="text"
                            placeholder="직급"
                            value={studentData.position}
                            onChange={(e) =>
                                setStudentData({ ...studentData, position: e.target.value })
                            }
                            className="px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <button
                        onClick={handleValidateAndAdd}
                        disabled={validating || studentCount >= 5}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {validating ? '추가 중...' : '수강생 추가'}
                    </button>
                </div>
            )}

            {/* Bulk Upload (6+ students) */}
            <div className="mb-8">
                <h3 className="font-bold mb-2">대량 등록 (6명 이상)</h3>
                <p className="text-sm text-gray-600 mb-4">
                    <button
                        onClick={() =>
                            classApplicationService.downloadTemplate()
                        }
                        className="text-blue-600 underline"
                    >
                        Excel 템플릿 다운로드
                    </button>
                </p>

                <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleBulkUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                    이전
                </button>
                <button
                    onClick={onNext}
                    disabled={studentCount === 0}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default StudentEntry;
```

---

## ✅ Best Practices

1. **Multi-step wizard** - Clear step indicator with validation
2. **Save as draft** - Allow users to save progress
3. **Student validation** - Verify students exist in system
4. **Bulk upload support** - Provide Excel template for 6+ students
5. **Real-time updates** - Refresh application data after each step
6. **Error handling** - Show clear error messages for validation failures

---

**Next:** [Student Enrollments →](./09-student-enrollments.md)

