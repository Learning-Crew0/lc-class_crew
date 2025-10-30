 Course Module API Documentation

 Overview
The Course module provides comprehensive course management functionality including course CRUD operations, curriculum management, instructor details, promotional materials, notices, and reviews. This module handles complex relationships between courses and their associated data.

 Base URL

http://localhost:5000/api/courses


 Architecture Overview

 Data Relationships

Course (Main Entity - Independent)
├── Curriculum (1:1 relationship - depends on Course)
├── Instructor (1:1 relationship - depends on Course)
├── Promotion (1:N relationship - depends on Course)
├── Notice (1:1 relationship - depends on Course)
└── Reviews (1:N relationship - depends on Course)


 File Upload Handling
 ||Images:|| Handled via Cloudinary integration with local fallback
 ||Multiple Files:|| Batch upload support for promotions
 ||Cleanup:|| Automatic file cleanup on success/failure



 API Endpoints

 1. Course Management

 Create Course
||POST|| /

||Purpose:|| Create a new course with all basic information

||Request Body:||
json
{
  "title": "React Fundamentals",
  "category": "507f1f77bcf86cd799439011",
  "tagColor": "#FF5733",
  "tagText": "Programming",
  "tags": ["React", "JavaScript", "Frontend"],
  "processName": "REACT101",
  "shortDescription": "Learn React from scratch",
  "longDescription": "Comprehensive React course covering hooks, state management...",
  "target": "입사 3년차 미만 주니어, 신입사원",
  "duration": "12시간(1일차 8시간, 2일차 4시간)",
  "location": "러닝크루 성수 CLASS",
  "hours": 40,
  "price": 600000,
  "priceText": "60만원(중식 및 교보재 포함)",
  "mainImage": "https://cloudinary.com/course_image",
  "noticeImage": "https://cloudinary.com/notice_image",
  "field": "Web Development",
  "date": "20240115",
  "refundOptions": "30day money back guarantee",
  "learningGoals": "Build modern React applications",
  "recommendedAudience": ["Beginners", "Frontend Developers"],
  "isActive": true,
  "isFeatured": false
}


||File Upload:|| mainImage field (single file)

||Response (201):||
json
{
  "success": true,
  "course": {
    "_id": "course_id",
    "title": "React Fundamentals",
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Programming",
      "description": "Programming and Development Courses"
    },
    "tagColor": "#FF5733",
    "tagText": "Programming",
    "tags": ["React", "JavaScript", "Frontend"],
    "target": "입사 3년차 미만 주니어, 신입사원",
    "duration": "12시간(1일차 8시간, 2일차 4시간)",
    "location": "러닝크루 성수 CLASS",
    "price": 600000,
    "priceText": "60만원(중식 및 교보재 포함)",
    "mainImage": "https://cloudinary.com/course_image",
    "noticeImage": "https://cloudinary.com/notice_image",
    "isActive": true,
    "isFeatured": false,
    "createdAt": "20240101T00:00:00.000Z"
  }
}


 Get Course Detail
||GET|| /:id

||Purpose:|| Retrieve comprehensive course information with all related data

||Workflow:||
1. Validate course ID format
2. Fetch course from database
3. ||Parallel Fetch:|| Use Promise.allSettled to fetch related data:
    Curriculum
    Instructor
    Promotions
    Notice
    Reviews
4. Aggregate all data into single response
5. Return structured response

||Response (200):||
json
{
  "success": true,
  "course": {
    "_id": "course_id",
    "title": "React Fundamentals",
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Programming",
      "description": "Programming and Development Courses"
    },
    "tagColor": "#FF5733",
    "tagText": "Programming",
    "tags": ["React", "JavaScript", "Frontend"],
    "target": "입사 3년차 미만 주니어, 신입사원",
    "duration": "12시간(1일차 8시간, 2일차 4시간)",
    "location": "러닝크루 성수 CLASS",
    "price": 600000,
    "priceText": "60만원(중식 및 교보재 포함)",
    "isActive": true
  },
  "curriculum": {
    "courseId": "course_id",
    "keywords": ["React", "JavaScript", "Frontend"],
    "modules": [
      {
        "name": "Introduction to React",
        "content": "Basic concepts and setup"
      }
    ]
  },
  "instructor": {
    "courseId": "course_id",
    "name": "John Doe",
    "bio": "Senior React Developer",
    "professionalField": "Web Development"
  },
  "promotions": [
    {
      "courseId": "course_id",
      "images": ["https://cloudinary.com/image1", "https://cloudinary.com/image2"],
      "description": "Limited time offer!"
    }
  ],
  "notice": {
    "courseId": "course_id",
    "noticeImage": "https://cloudinary.com/notice",
    "noticeDesc": "Important announcement"
  },
  "reviews": [
    {
      "courseId": "course_id",
      "reviewerName": "Jane Smith",
      "text": "Excellent course!",
      "avatar": "https://cloudinary.com/avatar"
    }
  ]
}


 Update Course
||PUT|| /:id

||Purpose:|| Update course information

||Workflow:||
1. Validate course ID and course existence
2. Handle image upload if provided
3. Parse and validate recommendedAudience array
4. Update course document
5. Return updated course

||Request Body:|| Same as create, with optional fields

 Delete Course
||DELETE|| /:id

||Purpose:|| Delete course and all related data

||Workflow:||
1. Validate course ID and existence
2. ||Cascade Delete:|| Remove all related documents:
    Curriculum
    Instructor
    Promotions
    Notice
    Reviews
3. Return success confirmation

 2. Curriculum Management

 Create/Update Curriculum
||POST|| /:id/curriculum

||Purpose:|| Manage course curriculum (modules and keywords)

||Workflow:||
1. Validate course existence
2. Parse modules (JSON string or array)
3. Parse keywords array
4. Upsert curriculum (create if not exists, update if exists)
5. Return curriculum data

||Request Body:||
json
{
  "keywords": ["React", "JavaScript", "Frontend"],
  "modules": [
    {
      "name": "Introduction to React",
      "content": "Basic concepts and setup"
    },
    {
      "name": "Components and Props",
      "content": "Building reusable components"
    }
  ]
}


 Get Curriculum
||GET|| /:id/curriculum

||Purpose:|| Retrieve course curriculum

 3. Instructor Management

 Create/Update Instructor
||POST|| /:id/instructor

||Purpose:|| Manage course instructor information

||Workflow:||
1. Validate course existence
2. Parse certificates and attendanceHistory arrays
3. Upsert instructor data
4. Return instructor information

||Request Body:||
json
{
  "name": "John Doe",
  "bio": "Senior React Developer with 10+ years experience",
  "professionalField": "Web Development",
  "certificates": ["React Certified", "AWS Certified"],
  "attendanceHistory": ["React Conference 2023", "JS Summit 2022"]
}


 Get Instructor
||GET|| /:id/instructor

||Purpose:|| Retrieve course instructor information

 4. Promotion Management

 Create/Update Promotions
||POST|| /:id/promotions

||Purpose:|| Add promotional images and descriptions

||Workflow:||
1. Validate course existence
2. ||Batch Upload:|| Handle multiple image files
3. ||Parallel Processing:|| Upload each file individually
4. ||Error Resilience:|| Continue if individual uploads fail
5. Upsert promotion data with image URLs
6. Return promotion information

||File Upload:|| promotions field (multiple files, max 8)

||Request Body:||
json
{
  "description": "Limited time offer  50% off!"
}


 Delete Promotion
||DELETE|| /:id/promotions/:promotionId

||Purpose:|| Delete promotion or specific promotion image

||Workflow:||
1. Validate course and promotion IDs
2. Verify promotion belongs to course (authorization)
3. If imageUrl query param provided: remove specific image
4. Otherwise: delete entire promotion
5. Return confirmation

||Query Parameters:||
 imageUrl (optional): Remove specific image from promotion

 5. Notice Management

 Create/Update Notice
||POST|| /:id/notice

||Purpose:|| Manage course notices with images

||Workflow:||
1. Validate course existence
2. ||File Upload:|| Handle single notice image
3. ||Robust Error Handling:|| Cleanup on upload failure
4. Upsert notice data
5. Return notice information

||File Upload:|| noticeImage field (single file)

||Request Body:||
json
{
  "noticeDesc": "Important: Class schedule changed"
}


 6. Review Management

 Add Review
||POST|| /:id/reviews

||Purpose:|| Add student review for course

||Workflow:||
1. Validate course existence
2. Create review document
3. Return created review

||Request Body:||
json
{
  "reviewerName": "Jane Smith",
  "avatar": "https://cloudinary.com/avatar_url",
  "text": "Excellent course! Very comprehensive."
}


 Get Reviews
||GET|| /:id/reviews

||Purpose:|| Retrieve all reviews for a course

||Response:||
json
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id",
      "courseId": "course_id",
      "reviewerName": "Jane Smith",
      "text": "Excellent course!",
      "createdAt": "20240101T00:00:00.000Z"
    }
  ]
}


 Delete Review
||DELETE|| /:id/reviews/:reviewId

||Purpose:|| Delete specific review

||Workflow:||
1. Validate course and review IDs
2. Verify review belongs to course (authorization)
3. Delete review document
4. Return confirmation



 Error Handling

 Common Error Responses

||400 Bad Request:||
json
{
  "success": false,
  "message": "Invalid course ID format"
}


||404 Not Found:||
json
{
  "success": false,
  "message": "Course not found"
}


||403 Forbidden:||
json
{
  "success": false,
  "message": "Resource does not belong to this course"
}


||500 Server Error:||
json
{
  "success": false,
  "message": "Server error",
  "error": "Detailed error message (development only)"
}


 File Upload Error Handling

||Upload Failures:||
 Individual file failures don't break entire batch uploads
 Automatic cleanup of temporary files on errors
 Graceful fallback to local file serving if Cloudinary fails



 Security Considerations

 Authorization
 ||Course Context:|| All operations require valid course ID
 ||Resource Ownership:|| Verify resources belong to specified course
 ||Input Validation:|| ObjectId format validation prevents injection attacks

 File Upload Security
 ||File Type Validation:|| (Handled by multer middleware)
 ||Size Limits:|| Configurable file size restrictions
 ||Path Traversal:|| Secure file path handling



 Performance Optimizations

 Database Queries
 ||Lean Queries:|| Use .lean() for read operations
 ||Parallel Fetching:|| Promise.allSettled for related data
 ||Indexing:|| Assumes proper MongoDB indexing on courseId fields

 File Upload
 ||Concurrent Uploads:|| Multiple files uploaded in parallel
 ||Cleanup:|| Immediate cleanup of temporary files
 ||Fallback Strategy:|| Local file serving if cloud storage fails



 API Workflow Examples

 Complete Course Creation Workflow

1. ||Create Course||
   bash
   POST /api/courses
   Body: { title, category, cost, etc. }
   Files: course image
   

2. ||Add Instructor||
   bash
   POST /api/courses/:id/instructor
   Body: { name, bio, certificates }
   

3. ||Add Curriculum||
   bash
   POST /api/courses/:id/curriculum
   Body: { keywords, modules }
   

4. ||Add Promotions||
   bash
   POST /api/courses/:id/promotions
   Body: { description }
   Files: promotional images
   

5. ||Add Notice||
   bash
   POST /api/courses/:id/notice
   Body: { noticeDesc }
   Files: notice image
   

 Course Discovery and Enrollment

1. ||Browse Courses||
   bash
   GET /api/courses/:id (for specific course details)
   

2. ||Check Reviews||
   bash
   GET /api/courses/:id/reviews
   

3. ||View Curriculum||
   bash
   GET /api/courses/:id/curriculum
   



 Dependencies

 ||Express.js:|| Web framework
 ||Mongoose:|| MongoDB ODM
 ||Multer:|| File upload middleware
 ||Cloudinary:|| Image storage and optimization
 ||File System:|| Local file operations

 Environment Variables

env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret




 Testing Guide

 Manual Testing Checklist

 [ ] Create course with valid data
 [ ] Update course with new information
 [ ] Add curriculum with modules and keywords
 [ ] Add instructor information
 [ ] Upload promotional images
 [ ] Add course notice with image
 [ ] Add student reviews
 [ ] Delete course (cascades to all related data)
 [ ] Test error cases (invalid IDs, missing course, etc.)

 API Client Testing

||Create Course:||
bash
curl X POST "http://localhost:5000/api/courses" \
  F "title=React Course" \
  F "category=Programming" \
  F "cost=299.99" \
  F "image=@courseimage.jpg"


||Get Course Details:||
bash
curl X GET "http://localhost:5000/api/courses/COURSE_ID"


||Add Review:||
bash
curl X POST "http://localhost:5000/api/courses/COURSE_ID/reviews" \
  H "ContentType: application/json" \
  d '{
    "reviewerName": "John Doe",
    "text": "Great course!"
  }'


This documentation provides comprehensive coverage of the Course module's functionality, workflows, and implementation details.
