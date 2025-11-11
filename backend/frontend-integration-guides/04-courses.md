# 📚 Courses - Frontend Integration Guide

Complete guide for implementing course browsing, searching, and management in your ClassCrew frontend application.

---

## 📋 Overview

Courses are the core product of ClassCrew. This guide covers listing, filtering, searching, and displaying course details.

---

## 🔑 API Endpoints

### Get All Courses (Public)

**Endpoint:** `GET /courses`  
**Auth Required:** No

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `category` (categoryId)
- `level` (beginner | intermediate | advanced | all)
- `search` (keyword)
- `isFeatured` (true | false)
- `isActive` (true | false)

**Response:**
```javascript
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "course123",
        "title": "Leadership Development",
        "description": "Comprehensive leadership training...",
        "price": 500000,
        "category": {
          "_id": "cat1",
          "title": "Leadership"
        },
        "mainImage": "/uploads/courses/main.png",
        "hoverImage": "/uploads/courses/hover.png",
        "hours": 12,
        "level": "beginner",
        "isActive": true,
        "isFeatured": true,
        "trainingSchedules": [...]
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

### Get Course by ID (Public)

**Endpoint:** `GET /courses/{courseId}`  
**Auth Required:** No

**Response:** Full course details with populated fields (category, schedules, curriculum, instructors, reviews)

### Get Featured Courses (Public)

**Endpoint:** `GET /courses?isFeatured=true&limit=6`

---

## 💻 Frontend Implementation

### Course Service

```javascript
// src/services/course.service.js

import apiClient from './api.client';

class CourseService {
    /**
     * Get all courses with filters
     */
    async getCourses(filters = {}) {
        try {
            const params = {
                page: filters.page || 1,
                limit: filters.limit || 10,
                ...filters,
            };
            const response = await apiClient.get('/courses', params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get course by ID
     */
    async getCourseById(courseId) {
        try {
            const response = await apiClient.get(`/courses/${courseId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get featured courses
     */
    async getFeaturedCourses(limit = 6) {
        try {
            const response = await apiClient.get('/courses', {
                isFeatured: true,
                limit,
            });
            return response.data.courses;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Search courses
     */
    async searchCourses(keyword, filters = {}) {
        try {
            const response = await apiClient.get('/courses', {
                search: keyword,
                ...filters,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get courses by category
     */
    async getCoursesByCategory(categoryId, page = 1, limit = 10) {
        try {
            const response = await apiClient.get('/courses', {
                category: categoryId,
                page,
                limit,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new CourseService();
```

---

## 🎨 UI Components

### Course List Page

```javascript
// src/pages/Courses.jsx

import React, { useState, useEffect } from 'react';
import courseService from '../services/course.service';
import CourseCard from '../components/course/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import CourseFilters from '../components/course/CourseFilters';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        category: '',
        level: '',
        search: '',
    });

    useEffect(() => {
        fetchCourses();
    }, [filters]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await courseService.getCourses(filters);
            setCourses(data.courses);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters({
            ...filters,
            ...newFilters,
            page: 1, // Reset to page 1 when filters change
        });
    };

    const handlePageChange = (page) => {
        setFilters({ ...filters, page });
        window.scrollTo(0, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">강좌 목록</h1>

            <CourseFilters
                filters={filters}
                onChange={handleFilterChange}
            />

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600">
                                조건에 맞는 강좌가 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {courses.map((course) => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    )}

                    {pagination && pagination.pages > 1 && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CoursesPage;
```

### Course Card Component

```javascript
// src/components/course/CourseCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const [isHovered, setIsHovered] = useState(false);

    const imageUrl = isHovered && course.hoverImage
        ? course.hoverImage
        : course.mainImage;

    return (
        <Link
            to={`/courses/${course._id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-48 overflow-hidden bg-gray-200">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                {course.isFeatured && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        추천
                    </span>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    {course.category && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            {course.category.title}
                        </span>
                    )}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {getLevelLabel(course.level)}
                    </span>
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        <span>⏱️ {course.hours}시간</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                        {course.price.toLocaleString()}원
                    </div>
                </div>
            </div>
        </Link>
    );
};

const getLevelLabel = (level) => {
    const labels = {
        beginner: '초급',
        intermediate: '중급',
        advanced: '고급',
        all: '전체',
    };
    return labels[level] || level;
};

export default CourseCard;
```

### Course Filters Component

```javascript
// src/components/course/CourseFilters.jsx

import React, { useState, useEffect } from 'react';
import categoryService from '../../services/category.service';

const CourseFilters = ({ filters, onChange }) => {
    const [categories, setCategories] = useState([]);
    const [searchInput, setSearchInput] = useState(filters.search || '');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onChange({ search: searchInput });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="강좌 검색..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        검색
                    </button>
                </div>
            </form>

            <div className="flex flex-wrap gap-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">카테고리</label>
                    <select
                        value={filters.category}
                        onChange={(e) => onChange({ category: e.target.value })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">전체</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">난이도</label>
                    <select
                        value={filters.level}
                        onChange={(e) => onChange({ level: e.target.value })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">전체</option>
                        <option value="beginner">초급</option>
                        <option value="intermediate">중급</option>
                        <option value="advanced">고급</option>
                        <option value="all">전체 레벨</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CourseFilters;
```

### Course Detail Page

```javascript
// src/pages/CourseDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/course.service';
import cartService from '../services/cart.service';
import LoadingSpinner from '../components/LoadingSpinner';
import ScheduleSelector from '../components/course/ScheduleSelector';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const data = await courseService.getCourseById(id);
            setCourse(data);
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedSchedule) {
            alert('일정을 선택해주세요.');
            return;
        }

        setAddingToCart(true);
        try {
            await cartService.addCourseToCart(course._id, selectedSchedule);
            alert('장바구니에 추가되었습니다!');
            navigate('/cart');
        } catch (error) {
            alert(error.message || '장바구니 추가 중 오류가 발생했습니다.');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!course) return <div>강좌를 찾을 수 없습니다.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Image */}
                <div>
                    <img
                        src={course.mainImage}
                        alt={course.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>

                {/* Right: Details */}
                <div>
                    {course.category && (
                        <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded">
                            {course.category.title}
                        </span>
                    )}

                    <h1 className="text-3xl font-bold mt-4 mb-4">{course.title}</h1>

                    <p className="text-gray-600 mb-6">{course.description}</p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">난이도</p>
                                <p className="font-semibold">{course.level}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">교육 시간</p>
                                <p className="font-semibold">{course.hours}시간</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">가격</p>
                                <p className="font-semibold text-xl text-blue-600">
                                    {course.price.toLocaleString()}원
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">
                            교육 일정 선택
                        </label>
                        <ScheduleSelector
                            courseId={course._id}
                            schedules={course.trainingSchedules}
                            selectedSchedule={selectedSchedule}
                            onChange={setSelectedSchedule}
                        />
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart || !selectedSchedule}
                        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
                    >
                        {addingToCart ? '추가 중...' : '장바구니에 추가'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
```

---

## ✅ Best Practices

1. **Lazy load images** - Optimize page load time
2. **Implement search debouncing** - Reduce API calls
3. **Cache course data** - Store in React context or Redux
4. **Handle empty states** - Show helpful messages when no courses found
5. **Mobile responsive** - Ensure cards look good on all devices

---

**Next:** [Training Schedules →](./05-training-schedules.md)

