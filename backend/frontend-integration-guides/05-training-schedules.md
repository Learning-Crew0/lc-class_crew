# 🗓️ Training Schedules - Frontend Integration Guide

Complete guide for displaying and managing training schedules in your ClassCrew frontend application.

---

## 📋 Overview

Training schedules represent available dates/times for courses. Users must select a schedule when adding a course to their cart.

---

## 🔑 API Endpoints

### Get Course Schedules (Public)

**Endpoint:** `GET /courses/{courseId}/training-schedules`  
**Auth Required:** No

**Response:**
```javascript
{
  "success": true,
  "data": [
    {
      "_id": "schedule123",
      "scheduleName": "2025년 1월 3주차",
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-01-16T00:00:00.000Z",
      "availableSeats": 30,
      "enrolledCount": 5,
      "remainingSeats": 25,
      "isFull": false,
      "status": "upcoming", // upcoming | ongoing | completed | cancelled
      "isActive": true
    }
  ]
}
```

---

## 💻 Frontend Implementation

### Schedule Service

```javascript
// src/services/schedule.service.js

import apiClient from './api.client';

class ScheduleService {
    /**
     * Get schedules for a course
     */
    async getCourseSchedules(courseId) {
        try {
            const response = await apiClient.get(
                `/courses/${courseId}/training-schedules`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get available (active and not full) schedules
     */
    async getAvailableSchedules(courseId) {
        try {
            const schedules = await this.getCourseSchedules(courseId);
            return schedules.filter((s) => s.isActive && !s.isFull);
        } catch (error) {
            throw error;
        }
    }
}

export default new ScheduleService();
```

---

## 🎨 UI Components

### Schedule Selector Component

```javascript
// src/components/course/ScheduleSelector.jsx

import React from 'react';

const ScheduleSelector = ({ courseId, schedules, selectedSchedule, onChange }) => {
    const availableSchedules = schedules?.filter((s) => s.isActive && !s.isFull) || [];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (schedule) => {
        if (schedule.isFull) {
            return <span className="text-red-500 text-sm">마감</span>;
        }
        if (schedule.remainingSeats <= 5) {
            return <span className="text-orange-500 text-sm">마감 임박</span>;
        }
        return null;
    };

    if (availableSchedules.length === 0) {
        return (
            <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                현재 신청 가능한 일정이 없습니다.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {availableSchedules.map((schedule) => (
                <div
                    key={schedule._id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSchedule === schedule._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => onChange(schedule._id)}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">
                                {schedule.scheduleName}
                            </h4>
                            <p className="text-gray-600 text-sm">
                                {formatDate(schedule.startDate)} ~{' '}
                                {formatDate(schedule.endDate)}
                            </p>
                        </div>
                        <div className="text-right">
                            {getStatusBadge(schedule)}
                            <p className="text-sm text-gray-600 mt-1">
                                잔여석: {schedule.remainingSeats}석
                            </p>
                        </div>
                    </div>

                    {selectedSchedule === schedule._id && (
                        <div className="mt-2 text-blue-600 text-sm flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            선택됨
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ScheduleSelector;
```

### Schedule Calendar View (Optional)

```javascript
// src/components/course/ScheduleCalendar.jsx

import React, { useState } from 'react';

const ScheduleCalendar = ({ schedules, onScheduleClick }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getSchedulesForDate = (date) => {
        if (!date) return [];
        return schedules.filter((schedule) => {
            const startDate = new Date(schedule.startDate);
            return (
                startDate.getFullYear() === date.getFullYear() &&
                startDate.getMonth() === date.getMonth() &&
                startDate.getDate() === date.getDate()
            );
        });
    };

    const days = getDaysInMonth(currentMonth);

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    };

    const prevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    className="px-3 py-1 rounded hover:bg-gray-100"
                >
                    ←
                </button>
                <h3 className="font-bold text-lg">
                    {currentMonth.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                    })}
                </h3>
                <button
                    onClick={nextMonth}
                    className="px-3 py-1 rounded hover:bg-gray-100"
                >
                    →
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div
                        key={day}
                        className="text-center text-sm font-semibold text-gray-600"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                    const daySchedules = date ? getSchedulesForDate(date) : [];
                    return (
                        <div
                            key={index}
                            className={`aspect-square p-1 border rounded ${
                                date ? 'cursor-pointer hover:bg-blue-50' : ''
                            } ${daySchedules.length > 0 ? 'bg-blue-100' : ''}`}
                            onClick={() => {
                                if (daySchedules.length > 0) {
                                    onScheduleClick(daySchedules[0]);
                                }
                            }}
                        >
                            {date && (
                                <>
                                    <div className="text-sm">{date.getDate()}</div>
                                    {daySchedules.length > 0 && (
                                        <div className="text-xs text-blue-600">
                                            {daySchedules.length}개
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleCalendar;
```

### Schedule List (Simple View)

```javascript
// src/components/course/ScheduleList.jsx

import React from 'react';

const ScheduleList = ({ schedules, onSelectSchedule }) => {
    const formatDateRange = (startDate, endDate) => {
        const start = new Date(startDate).toLocaleDateString('ko-KR');
        const end = new Date(endDate).toLocaleDateString('ko-KR');
        return `${start} ~ ${end}`;
    };

    const getStatusColor = (schedule) => {
        if (schedule.status === 'completed') return 'bg-gray-100 text-gray-600';
        if (schedule.status === 'cancelled') return 'bg-red-100 text-red-600';
        if (schedule.status === 'ongoing') return 'bg-green-100 text-green-600';
        if (schedule.isFull) return 'bg-orange-100 text-orange-600';
        return 'bg-blue-100 text-blue-600';
    };

    const activeSchedules = schedules.filter(
        (s) => s.isActive && s.status === 'upcoming' && !s.isFull
    );

    if (activeSchedules.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                신청 가능한 일정이 없습니다.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {activeSchedules.map((schedule) => (
                <div
                    key={schedule._id}
                    className="p-3 border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => onSelectSchedule(schedule)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold">{schedule.scheduleName}</h4>
                            <p className="text-sm text-gray-600">
                                {formatDateRange(schedule.startDate, schedule.endDate)}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(schedule)}`}>
                                {schedule.status === 'upcoming' ? '예정' : schedule.status}
                            </span>
                            <p className="text-sm mt-1">
                                {schedule.remainingSeats}/{schedule.availableSeats}석
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScheduleList;
```

---

## ✅ Best Practices

1. **Show availability** - Display remaining seats clearly
2. **Visual indicators** - Use colors for full/almost full schedules
3. **Date formatting** - Use locale-specific formatting (ko-KR)
4. **Filter inactive** - Only show active and available schedules
5. **Mobile friendly** - Ensure schedule selection works on mobile

---

**Next:** [Products Integration →](./06-products.md)

