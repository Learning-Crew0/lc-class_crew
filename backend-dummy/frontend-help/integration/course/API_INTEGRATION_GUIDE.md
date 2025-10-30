# 📚 Course Module - API Integration Guide

## Base URL
```
/api/courses
```

---

## 📋 Overview

The Course module is the central hub for managing courses and all related entities (curriculum, instructors, promotions, notices, reviews).

---

## 🔗 Module Relationships

- **Course** → **Category** (N:1): Each course belongs to one category
- **Course** → **Curriculum** (1:1): Each course has one curriculum
- **Course** → **Instructor** (1:N): Course can have multiple instructors
- **Course** → **Review** (1:N): Course can have multiple reviews
- **Course** → **Promotion** (1:N): Course can have multiple promotions
- **Course** → **Notice** (1:1): Course has one notice
- **Course** → **Applicant** (1:N): Course can have multiple applicants

---

## 🎯 COURSE ENDPOINTS

### 1. Get All Courses
```http
GET /api/courses
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category ID
- `level` (optional): Filter by level (Beginner, Intermediate, Advanced)
- `language` (optional): Filter by language
- `search` (optional): Search in title/description

**Example:**
```
GET /api/courses?category=cat123&page=1&limit=12&level=Beginner
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "course123",
        "title": "Complete Web Development",
        "description": "Learn HTML, CSS, JS",
        "category": {
          "_id": "cat123",
          "name": "Web Development"
        },
        "price": 4999,
        "discountedPrice": 3999,
        "duration": "6 months",
        "level": "Beginner",
        "language": "English",
        "mainImage": "https://cloudinary.com/image.jpg",
        "whatYouWillLearn": ["HTML", "CSS", "JavaScript"],
        "requirements": ["Basic computer knowledge"],
        "isActive": true,
        "enrollmentCount": 150,
        "averageRating": 4.5
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCourses": 50,
      "limit": 12
    }
  }
}
```

---

### 2. Get Single Course (Detail)
```http
GET /api/courses/:id
```

**URL Parameters:**
- `id`: Course ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "course123",
    "title": "Complete Web Development",
    "description": "Full course description",
    "category": {
      "_id": "cat123",
      "name": "Web Development",
      "description": "Learn web development"
    },
    "price": 4999,
    "discountedPrice": 3999,
    "duration": "6 months",
    "level": "Beginner",
    "language": "English",
    "mainImage": "https://cloudinary.com/main-image.jpg",
    "whatYouWillLearn": [
      "HTML5 and CSS3",
      "JavaScript ES6+",
      "Responsive Design",
      "React.js"
    ],
    "requirements": [
      "Basic computer knowledge",
      "Internet connection",
      "Desire to learn"
    ],
    "isActive": true,
    "enrollmentCount": 150,
    "averageRating": 4.5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Use Case:** Display full course details page

---

### 3. Create Course (Admin)
```http
POST /api/courses
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```javascript
{
  title: "Complete Web Development",
  description: "Full course description",
  category: "cat123",
  price: 4999,
  discountedPrice: 3999,
  duration: "6 months",
  level: "Beginner",
  language: "English",
  mainImage: [File], // Image file
  whatYouWillLearn: ["HTML", "CSS", "JavaScript"], // Array
  requirements: ["Basic computer knowledge"], // Array
  isActive: true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    // Created course object
  }
}
```

---

### 4. Update Course (Admin)
```http
PUT /api/courses/:id
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**URL Parameters:**
- `id`: Course ID

**Request Body (FormData - All fields optional):**
```javascript
{
  title: "Updated Title",
  price: 5999,
  mainImage: [File] // New image (optional)
}
```

---

### 5. Delete Course (Admin)
```http
DELETE /api/courses/:id
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## 📖 CURRICULUM ENDPOINTS

### 6. Get Course Curriculum
```http
GET /api/courses/:id/curriculum
```

**URL Parameters:**
- `id`: Course ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "curr123",
    "course": "course123",
    "modules": [
      {
        "moduleNumber": 1,
        "title": "Introduction to HTML",
        "description": "Learn HTML basics",
        "lessons": [
          {
            "lessonNumber": 1,
            "title": "HTML Elements",
            "duration": "30 mins",
            "videoUrl": "https://video.mp4",
            "content": "Lesson content here",
            "isFree": true
          },
          {
            "lessonNumber": 2,
            "title": "HTML Attributes",
            "duration": "25 mins",
            "videoUrl": "https://video2.mp4",
            "isFree": false
          }
        ]
      },
      {
        "moduleNumber": 2,
        "title": "CSS Styling",
        "lessons": [...]
      }
    ],
    "totalDuration": "20 hours",
    "totalLessons": 45
  }
}
```

---

### 7. Create/Update Curriculum (Admin)
```http
POST /api/courses/:id/curriculum
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Request Body:**
```json
{
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Introduction to HTML",
      "description": "Learn HTML basics",
      "lessons": [
        {
          "lessonNumber": 1,
          "title": "HTML Elements",
          "duration": "30 mins",
          "videoUrl": "https://video.mp4",
          "content": "Lesson content",
          "isFree": true
        }
      ]
    }
  ]
}
```

---

## 👨‍🏫 INSTRUCTOR ENDPOINTS

### 8. Get Course Instructors
```http
GET /api/courses/:id/instructor
```

**URL Parameters:**
- `id`: Course ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "inst123",
      "course": "course123",
      "name": "John Doe",
      "bio": "10+ years of web development experience",
      "image": "https://cloudinary.com/instructor.jpg",
      "designation": "Senior Web Developer",
      "socialLinks": {
        "linkedin": "https://linkedin.com/in/john",
        "twitter": "https://twitter.com/john",
        "github": "https://github.com/john"
      },
      "expertise": ["JavaScript", "React", "Node.js"],
      "yearsOfExperience": 10
    }
  ]
}
```

---

### 9. Create/Update Instructor (Admin)
```http
POST /api/courses/:id/instructor
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Experienced developer",
  "image": "https://image.jpg",
  "designation": "Senior Developer",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/john"
  },
  "expertise": ["JavaScript", "React"],
  "yearsOfExperience": 10
}
```

---

## 🎉 PROMOTION ENDPOINTS

### 10. Get Course Promotions
```http
GET /api/courses/:id/promotions
```

**URL Parameters:**
- `id`: Course ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "promo123",
      "course": "course123",
      "title": "Limited Time Offer",
      "description": "Get 50% off this month",
      "images": [
        "https://promo1.jpg",
        "https://promo2.jpg"
      ],
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.000Z",
      "isActive": true
    }
  ]
}
```

---

### 11. Create/Update Promotions (Admin)
```http
POST /api/courses/:id/promotions
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```javascript
{
  title: "Limited Time Offer",
  description: "Get 50% off",
  promotions: [File, File, File], // Multiple images (max 8)
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  isActive: true
}
```

---

### 12. Delete Promotion (Admin)
```http
DELETE /api/courses/:id/promotions/:promotionId
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

---

## 📢 NOTICE ENDPOINTS

### 13. Create/Update Notice (Admin)
```http
POST /api/courses/:id/notice
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```javascript
{
  title: "Class Postponed",
  message: "Next class will be on Monday",
  priority: "high", // low, medium, high
  noticeImage: [File], // Image file (optional)
  isActive: true
}
```

---

## ⭐ REVIEW ENDPOINTS

### 14. Get Course Reviews
```http
GET /api/courses/:id/reviews
```

**URL Parameters:**
- `id`: Course ID

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "rev123",
        "course": "course123",
        "user": {
          "_id": "user123",
          "fullName": "Jane Student",
          "profileImage": "https://avatar.jpg"
        },
        "rating": 5,
        "comment": "Excellent course! Learned a lot.",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalReviews": 25
    }
  }
}
```

---

### 15. Add Review (Protected)
```http
POST /api/courses/:id/reviews
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great course!"
}
```

**Field Validations:**
- `rating`: Number between 1-5 (required)
- `comment`: String, max 500 characters

---

### 16. Delete Review (Admin/Owner)
```http
DELETE /api/courses/:id/reviews/:reviewId
```

**Headers:**
```
Authorization: Bearer TOKEN
```

---

## 💻 Frontend Implementation

### React - Course List with Filters

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/courses', { params: filters });
      
      if (response.data.success) {
        setCourses(response.data.data.courses);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="filters">
        <select 
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value, page: 1})}
        >
          <option value="">All Categories</option>
          {/* Populate from categories API */}
        </select>

        <select
          value={filters.level}
          onChange={(e) => setFilters({...filters, level: e.target.value, page: 1})}
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {loading ? (
        <div>Loading courses...</div>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <div key={course._id} className="course-card">
              <img src={course.mainImage} alt={course.title} />
              <h3>{course.title}</h3>
              <p>{course.category.name}</p>
              <div className="price">
                {course.discountedPrice < course.price && (
                  <span className="original">₹{course.price}</span>
                )}
                <span className="current">₹{course.discountedPrice}</span>
              </div>
              <p>⭐ {course.averageRating} ({course.enrollmentCount} students)</p>
              <button onClick={() => window.location.href = `/courses/${course._id}`}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <div className="pagination">
          <button 
            disabled={filters.page === 1}
            onClick={() => setFilters({...filters, page: filters.page - 1})}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button 
            disabled={filters.page === pagination.totalPages}
            onClick={() => setFilters({...filters, page: filters.page + 1})}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
```

---

### React - Course Detail Page

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const CourseDetail = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseRes = await axios.get(`/api/courses/${courseId}`);
      setCourse(courseRes.data.data);

      // Fetch related data in parallel
      const [curriculumRes, instructorsRes, reviewsRes] = await Promise.all([
        axios.get(`/api/courses/${courseId}/curriculum`),
        axios.get(`/api/courses/${courseId}/instructor`),
        axios.get(`/api/courses/${courseId}/reviews`)
      ]);

      setCurriculum(curriculumRes.data.data);
      setInstructors(instructorsRes.data.data);
      setReviews(reviewsRes.data.data.reviews);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className="course-detail">
      <div className="course-header">
        <img src={course.mainImage} alt={course.title} />
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="meta">
          <span>⭐ {course.averageRating}</span>
          <span>👥 {course.enrollmentCount} students</span>
          <span>🕒 {course.duration}</span>
          <span>📊 {course.level}</span>
        </div>
      </div>

      <div className="tabs">
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('curriculum')}>Curriculum</button>
        <button onClick={() => setActiveTab('instructors')}>Instructors</button>
        <button onClick={() => setActiveTab('reviews')}>Reviews</button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div>
            <h2>What you'll learn</h2>
            <ul>
              {course.whatYouWillLearn.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h2>Requirements</h2>
            <ul>
              {course.requirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'curriculum' && curriculum && (
          <div>
            {curriculum.modules.map(module => (
              <div key={module.moduleNumber} className="module">
                <h3>Module {module.moduleNumber}: {module.title}</h3>
                <p>{module.description}</p>
                <ul>
                  {module.lessons.map(lesson => (
                    <li key={lesson.lessonNumber}>
                      {lesson.title} - {lesson.duration}
                      {lesson.isFree && <span> (Free)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'instructors' && (
          <div>
            {instructors.map(instructor => (
              <div key={instructor._id} className="instructor-card">
                <img src={instructor.image} alt={instructor.name} />
                <h3>{instructor.name}</h3>
                <p>{instructor.designation}</p>
                <p>{instructor.bio}</p>
                <div className="expertise">
                  {instructor.expertise.map((skill, idx) => (
                    <span key={idx}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {reviews.map(review => (
              <div key={review._id} className="review">
                <img src={review.user.profileImage} alt={review.user.fullName} />
                <h4>{review.user.fullName}</h4>
                <div>⭐ {review.rating}/5</div>
                <p>{review.comment}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar">
        <div className="price-card">
          <div className="price">
            {course.discountedPrice < course.price && (
              <span className="original">₹{course.price}</span>
            )}
            <span className="current">₹{course.discountedPrice}</span>
          </div>
          <button className="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};
```

---

## ✅ Integration Checklist

- [ ] Fetch and display course list with filters
- [ ] Implement pagination
- [ ] Create course detail page
- [ ] Display curriculum with modules/lessons
- [ ] Show instructors
- [ ] Display reviews
- [ ] Add review functionality (protected)
- [ ] Show promotions/notices
- [ ] Implement enroll button
- [ ] Admin: Create/Update/Delete courses

---

## 🐛 Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 404 | Course not found | Check course ID |
| 400 | Invalid category | Ensure category exists |
| 400 | Image upload failed | Check file size/format |
| 401 | Authentication required | Include valid token |
| 403 | Admin access required | Need admin role |

---

**Related Modules:** Category, Curriculum, Instructor, Review, Promotion, Notice, Applicant

