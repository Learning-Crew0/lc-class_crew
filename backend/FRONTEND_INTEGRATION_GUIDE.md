# 🎨 Frontend Integration Guide - Category & Position Filtering

**Backend API:** `https://class-crew.onrender.com/api/v1/public`  
**Status:** ✅ Tested & Ready  
**Date:** November 15, 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Available Categories & Positions](#available-categories--positions)
3. [API Endpoints](#api-endpoints)
4. [React/Next.js Integration Examples](#reactnextjs-integration-examples)
5. [TypeScript Types](#typescript-types)
6. [Complete Component Examples](#complete-component-examples)
7. [Testing the API](#testing-the-api)

---

## 🎯 Overview

The backend provides a category and position-based filtering system for courses. You can:
- Display 5 categories in navbar
- Filter courses by category (navbar clicks)
- Show 9 positions in search dropdowns
- Filter courses by category AND/OR position (search)
- Get full course details with category/position info

---

## 📊 Available Categories & Positions

### 5 Categories (테마)

| Korean Name | English Name | Slug | Order |
|------------|--------------|------|-------|
| 리더십/직급/계층 | Leadership/Position/Level | `leadership` | 1 |
| 비즈니스 스킬 | Business Skills | `business-skills` | 2 |
| DX | Digital Transformation | `dx` | 3 |
| 라이프/커리어 | Life & Career | `life-career` | 4 |
| 스페셜 | Special | `special` | 5 |

### 9 Positions (직급/직책)

| Korean Name | English Name | Slug | Order |
|------------|--------------|------|-------|
| 임원 | Executive | `executive` | 1 |
| 차부장 | Manager/Deputy Manager | `manager` | 2 |
| 과장 | Assistant Manager | `assistant-manager` | 3 |
| 대리 | Associate | `associate` | 4 |
| 사원 | Staff | `staff` | 5 |
| 직책자 | Team Leader | `leader` | 6 |
| 신임 직책자 | New Team Leader | `new-leader` | 7 |
| 신규 입사자 | New Hire | `new-hire` | 8 |
| 기타 | Other | `other` | 9 |

---

## 🔌 API Endpoints

### Base URL
```
Production: https://class-crew.onrender.com/api/v1/public
Local: http://localhost:5000/api/v1/public
```

### 1. Get All Categories

**Endpoint:** `GET /categories`

**Response:**
```json
{
  "status": "success",
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "slug": "leadership",
        "koreanName": "리더십/직급/계층",
        "englishName": "Leadership/Position/Level",
        "order": 1
      },
      {
        "slug": "business-skills",
        "koreanName": "비즈니스 스킬",
        "englishName": "Business Skills",
        "order": 2
      },
      {
        "slug": "dx",
        "koreanName": "DX",
        "englishName": "Digital Transformation",
        "order": 3
      },
      {
        "slug": "life-career",
        "koreanName": "라이프/커리어",
        "englishName": "Life & Career",
        "order": 4
      },
      {
        "slug": "special",
        "koreanName": "스페셜",
        "englishName": "Special",
        "order": 5
      }
    ]
  }
}
```

---

### 2. Get All Positions

**Endpoint:** `GET /positions`

**Response:**
```json
{
  "status": "success",
  "message": "Positions retrieved successfully",
  "data": {
    "positions": [
      {
        "slug": "executive",
        "koreanName": "임원",
        "englishName": "Executive",
        "order": 1
      },
      // ... 8 more positions
    ]
  }
}
```

---

### 3. Get Courses by Category (Navbar Filtering)

**Endpoint:** `GET /courses/category/{slug}`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `sortBy` (optional, default: "createdAt")
- `order` (optional, default: "desc")

**Example:**
```
GET /courses/category/leadership?page=1&limit=10
```

**Response:**
```json
{
  "status": "success",
  "message": "카테고리별 코스를 성공적으로 조회했습니다",
  "data": {
    "courses": [
      {
        "_id": "673d9876abc123def4567890",
        "title": "성과관리 리더십",
        "shortDescription": "리더를 위한 성과관리 교육",
        "category": "leadership",
        "categoryInfo": {
          "slug": "leadership",
          "koreanName": "리더십/직급/계층",
          "englishName": "Leadership/Position/Level"
        },
        "position": "manager",
        "positionInfo": {
          "slug": "manager",
          "koreanName": "차부장",
          "englishName": "Manager/Deputy Manager"
        },
        "price": 600000,
        "priceText": "60만원(중식 및 교보재 포함)",
        "duration": "12시간",
        "image": "https://class-crew.onrender.com/uploads/courses/image.jpg",
        "tags": ["환급", "모여듣기"],
        "isActive": true,
        "isFeatured": false,
        "trainingSchedules": [...]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCourses": 25,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "categoryInfo": {
      "slug": "leadership",
      "koreanName": "리더십/직급/계층",
      "englishName": "Leadership/Position/Level"
    }
  }
}
```

---

### 4. Search Courses (Advanced Filtering)

**Endpoint:** `GET /courses/search`

**Query Parameters:**
- `category` (optional) - Category slug
- `position` (optional) - Position slug
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `sortBy` (optional, default: "createdAt")
- `order` (optional, default: "desc")

**Examples:**
```
# Filter by category only
GET /courses/search?category=dx

# Filter by position only
GET /courses/search?position=manager

# Filter by both (main use case)
GET /courses/search?category=leadership&position=executive

# With pagination
GET /courses/search?category=dx&position=manager&page=1&limit=20
```

**Response:**
```json
{
  "status": "success",
  "message": "코스 검색을 성공적으로 완료했습니다",
  "data": {
    "courses": [...],
    "pagination": {...},
    "appliedFilters": {
      "category": "leadership",
      "categoryName": "리더십/직급/계층",
      "position": "executive",
      "positionName": "임원"
    }
  }
}
```

---

### 5. Get Course by ID

**Endpoint:** `GET /courses/{courseId}`

**Response:**
```json
{
  "status": "success",
  "message": "코스 상세 정보를 성공적으로 조회했습니다",
  "data": {
    "_id": "673d9876abc123def4567890",
    "title": "성과관리 리더십",
    "categoryInfo": {
      "slug": "leadership",
      "koreanName": "리더십/직급/계층",
      "englishName": "Leadership/Position/Level"
    },
    "positionInfo": {
      "slug": "manager",
      "koreanName": "차부장",
      "englishName": "Manager/Deputy Manager"
    },
    // ... all other course fields
  }
}
```

---

## ⚛️ React/Next.js Integration Examples

### 1. Fetch Categories (for Navbar)

```javascript
// hooks/useCategories.js
import { useState, useEffect } from 'react';

const API_BASE = 'https://class-crew.onrender.com/api/v1/public';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/categories`);
        const result = await response.json();
        
        if (result.status === 'success') {
          setCategories(result.data.categories);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
```

**Usage in Navbar:**
```jsx
// components/Navbar.jsx
import { useCategories } from '@/hooks/useCategories';

export default function Navbar() {
  const { categories, loading } = useCategories();

  if (loading) return <div>Loading...</div>;

  return (
    <nav>
      {categories.map((category) => (
        <a
          key={category.slug}
          href={`/courses/${category.slug}`}
          className="nav-link"
        >
          {category.koreanName}
        </a>
      ))}
    </nav>
  );
}
```

---

### 2. Fetch Courses by Category (Category Page)

```javascript
// hooks/useCoursesByCategory.js
import { useState, useEffect } from 'react';

const API_BASE = 'https://class-crew.onrender.com/api/v1/public';

export const useCoursesByCategory = (categorySlug, page = 1, limit = 10) => {
  const [data, setData] = useState({ courses: [], pagination: null, categoryInfo: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/courses/category/${categorySlug}?page=${page}&limit=${limit}`
        );
        const result = await response.json();
        
        if (result.status === 'success') {
          setData({
            courses: result.data.courses,
            pagination: result.data.pagination,
            categoryInfo: result.data.categoryInfo,
          });
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCourses();
    }
  }, [categorySlug, page, limit]);

  return { ...data, loading, error };
};
```

**Usage:**
```jsx
// pages/courses/[slug].jsx
import { useRouter } from 'next/router';
import { useCoursesByCategory } from '@/hooks/useCoursesByCategory';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [page, setPage] = useState(1);
  
  const { courses, pagination, categoryInfo, loading } = useCoursesByCategory(slug, page, 10);

  if (loading) return <div>Loading courses...</div>;

  return (
    <div>
      <h1>{categoryInfo?.koreanName}</h1>
      <p>{categoryInfo?.englishName}</p>
      
      <div className="courses-grid">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
```

---

### 3. Search with Filters (Search Banner)

```javascript
// hooks/useSearchCourses.js
import { useState, useEffect } from 'react';

const API_BASE = 'https://class-crew.onrender.com/api/v1/public';

export const useSearchCourses = (filters) => {
  const [data, setData] = useState({ courses: [], pagination: null, appliedFilters: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchCourses = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.position) params.append('position', filters.position);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        
        const response = await fetch(`${API_BASE}/courses/search?${params}`);
        const result = await response.json();
        
        if (result.status === 'success') {
          setData({
            courses: result.data.courses,
            pagination: result.data.pagination,
            appliedFilters: result.data.appliedFilters,
          });
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    searchCourses();
  }, [filters.category, filters.position, filters.page, filters.limit]);

  return { ...data, loading, error };
};
```

**Usage in Search Component:**
```jsx
// components/SearchBanner.jsx
import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { usePositions } from '@/hooks/usePositions';
import { useSearchCourses } from '@/hooks/useSearchCourses';

export default function SearchBanner() {
  const { categories } = useCategories();
  const { positions } = usePositions();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [page, setPage] = useState(1);
  
  const { courses, pagination, appliedFilters, loading } = useSearchCourses({
    category: selectedCategory,
    position: selectedPosition,
    page,
    limit: 10,
  });

  return (
    <div>
      {/* Search Banner */}
      <div className="search-banner">
        <h2>추천CLASS찾기</h2>
        <p>나에게 꼭 맞는 교육을 찾아보세요</p>
        
        <div className="filters">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">테마 - 선택</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.koreanName}
              </option>
            ))}
          </select>

          {/* Position Dropdown */}
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            <option value="">직급/직책 - 선택</option>
            {positions.map((pos) => (
              <option key={pos.slug} value={pos.slug}>
                {pos.koreanName}
              </option>
            ))}
          </select>

          <button onClick={() => setPage(1)}>검색</button>
        </div>
      </div>

      {/* Applied Filters */}
      {appliedFilters && (
        <div className="applied-filters">
          {appliedFilters.categoryName && (
            <span>테마: {appliedFilters.categoryName}</span>
          )}
          {appliedFilters.positionName && (
            <span>직급/직책: {appliedFilters.positionName}</span>
          )}
        </div>
      )}

      {/* Results */}
      <div className="results">
        {loading ? (
          <div>검색 중...</div>
        ) : (
          <>
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

---

### 4. Fetch Positions Hook

```javascript
// hooks/usePositions.js
import { useState, useEffect } from 'react';

const API_BASE = 'https://class-crew.onrender.com/api/v1/public';

export const usePositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(`${API_BASE}/positions`);
        const result = await response.json();
        
        if (result.status === 'success') {
          setPositions(result.data.positions);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  return { positions, loading, error };
};
```

---

## 📘 TypeScript Types

```typescript
// types/category.ts
export interface Category {
  slug: string;
  koreanName: string;
  englishName: string;
  order: number;
}

export interface Position {
  slug: string;
  koreanName: string;
  englishName: string;
  order: number;
}

export interface CategoryInfo {
  slug: string;
  koreanName: string;
  englishName: string;
}

export interface PositionInfo {
  slug: string;
  koreanName: string;
  englishName: string;
}

export interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  longDescription?: string;
  category: string;
  categoryInfo: CategoryInfo;
  position: string;
  positionInfo: PositionInfo;
  price: number;
  priceText?: string;
  duration?: string;
  location?: string;
  image?: string;
  tags?: string[];
  tagText?: string;
  tagColor?: string;
  isActive: boolean;
  isFeatured: boolean;
  trainingSchedules?: TrainingSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: Pagination;
  categoryInfo?: CategoryInfo;
}

export interface SearchResponse {
  courses: Course[];
  pagination: Pagination;
  appliedFilters?: {
    category?: string;
    categoryName?: string;
    position?: string;
    positionName?: string;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}
```

**Usage:**
```typescript
// services/api.ts
import type { ApiResponse, Category, Position, CoursesResponse, SearchResponse } from '@/types/category';

const API_BASE = 'https://class-crew.onrender.com/api/v1/public';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/categories`);
  const result: ApiResponse<{ categories: Category[] }> = await response.json();
  return result.data.categories;
};

export const fetchPositions = async (): Promise<Position[]> => {
  const response = await fetch(`${API_BASE}/positions`);
  const result: ApiResponse<{ positions: Position[] }> = await response.json();
  return result.data.positions;
};

export const fetchCoursesByCategory = async (
  slug: string,
  page: number = 1,
  limit: number = 10
): Promise<CoursesResponse> => {
  const response = await fetch(
    `${API_BASE}/courses/category/${slug}?page=${page}&limit=${limit}`
  );
  const result: ApiResponse<CoursesResponse> = await response.json();
  return result.data;
};

export const searchCourses = async (
  filters: {
    category?: string;
    position?: string;
    page?: number;
    limit?: number;
  }
): Promise<SearchResponse> => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.position) params.append('position', filters.position);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));
  
  const response = await fetch(`${API_BASE}/courses/search?${params}`);
  const result: ApiResponse<SearchResponse> = await response.json();
  return result.data;
};
```

---

## 🧩 Complete Component Examples

### CourseCard Component

```jsx
// components/CourseCard.jsx
export default function CourseCard({ course }) {
  return (
    <div className="course-card">
      {course.image && (
        <img src={course.image} alt={course.title} />
      )}
      
      <div className="course-content">
        {/* Category & Position Tags */}
        <div className="tags">
          <span className="category-tag">
            {course.categoryInfo?.koreanName}
          </span>
          <span className="position-tag">
            {course.positionInfo?.koreanName}
          </span>
        </div>

        <h3>{course.title}</h3>
        
        {course.shortDescription && (
          <p>{course.shortDescription}</p>
        )}

        <div className="course-meta">
          {course.duration && (
            <span>⏱ {course.duration}</span>
          )}
          {course.location && (
            <span>📍 {course.location}</span>
          )}
        </div>

        <div className="course-price">
          {course.priceText || `${course.price.toLocaleString()}원`}
        </div>

        {course.tags && course.tags.length > 0 && (
          <div className="course-tags">
            {course.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <a href={`/class/${course._id}`} className="btn-detail">
          상세보기 →
        </a>
      </div>
    </div>
  );
}
```

---

### Pagination Component

```jsx
// components/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← 이전
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음 →
      </button>
    </div>
  );
}
```

---

## 🧪 Testing the API

### Test with cURL

```bash
# Get all categories
curl https://class-crew.onrender.com/api/v1/public/categories

# Get all positions
curl https://class-crew.onrender.com/api/v1/public/positions

# Get courses for 리더십/직급/계층
curl "https://class-crew.onrender.com/api/v1/public/courses/category/leadership"

# Search: DX courses for managers
curl "https://class-crew.onrender.com/api/v1/public/courses/search?category=dx&position=manager"

# Get course by ID
curl "https://class-crew.onrender.com/api/v1/public/courses/YOUR_COURSE_ID"
```

### Test with JavaScript (Browser Console)

```javascript
// Test categories endpoint
fetch('https://class-crew.onrender.com/api/v1/public/categories')
  .then(res => res.json())
  .then(data => console.log('Categories:', data.data.categories));

// Test positions endpoint
fetch('https://class-crew.onrender.com/api/v1/public/positions')
  .then(res => res.json())
  .then(data => console.log('Positions:', data.data.positions));

// Test category filtering
fetch('https://class-crew.onrender.com/api/v1/public/courses/category/leadership?page=1&limit=10')
  .then(res => res.json())
  .then(data => {
    console.log('Courses:', data.data.courses);
    console.log('Pagination:', data.data.pagination);
  });

// Test search with both filters
fetch('https://class-crew.onrender.com/api/v1/public/courses/search?category=dx&position=manager')
  .then(res => res.json())
  .then(data => {
    console.log('Search Results:', data.data.courses);
    console.log('Applied Filters:', data.data.appliedFilters);
  });
```

---

## 🎯 Quick Start Checklist

- [ ] **Step 1:** Fetch categories and display in navbar
  - Use: `GET /api/v1/public/categories`
  - Display: `category.koreanName`
  - Link to: `/courses/${category.slug}`

- [ ] **Step 2:** Create category page
  - Route: `/courses/[slug]`
  - Use: `GET /api/v1/public/courses/category/${slug}`
  - Display: Course cards with pagination

- [ ] **Step 3:** Fetch positions for search dropdown
  - Use: `GET /api/v1/public/positions`
  - Display: `position.koreanName`

- [ ] **Step 4:** Implement search functionality
  - Use: `GET /api/v1/public/courses/search?category=X&position=Y`
  - Display: Filtered results with applied filters shown

- [ ] **Step 5:** Create course detail page
  - Route: `/class/[id]`
  - Use: `GET /api/v1/public/courses/${id}`
  - Display: Full course details with category and position info

- [ ] **Step 6:** Admin panel integration
  - Populate category dropdown from `/categories`
  - Populate position dropdown from `/positions`
  - Send slugs when creating/updating courses

---

## 📞 Support

If you encounter any issues:
1. Check the API response in browser DevTools
2. Verify the endpoint URLs match the examples
3. Ensure you're using the correct slugs for filtering
4. Check pagination parameters

**Backend Status:** ✅ Running on port 5000  
**All endpoints tested and working!**

---

**Last Updated:** November 15, 2025  
**Version:** 1.0  
**Ready for Production:** ✅
