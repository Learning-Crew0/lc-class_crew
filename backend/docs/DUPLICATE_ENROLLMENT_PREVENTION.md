# Duplicate Enrollment Prevention - Frontend Guide

## Overview

This guide explains how to handle duplicate enrollment prevention on the frontend when a student tries to enroll in a course they're already registered for.

## Backend Implementation

### What's Been Implemented

The backend now checks if a student is already enrolled in a course before allowing a new enrollment:

- **Check Location**: `backend/src/services/enrollment.service.js` (lines 37-48)
- **Error Response**: Returns HTTP 409 (Conflict) status
- **Error Message**: "You have already enrolled in this course. Please check your enrollments."
- **Excludes**: Cancelled enrollments (status: "취소") are not counted

### API Endpoint

```
POST /api/v1/courses/:courseId/schedules/:scheduleId/enroll
```

### Error Response Format

When a duplicate enrollment is detected:

```json
{
    "success": false,
    "statusCode": 409,
    "message": "You have already enrolled in this course. Please check your enrollments.",
    "error": "Conflict"
}
```

## Frontend Implementation Guide

### 1. Handle Error Response (Recommended Approach)

When making an enrollment request, catch the 409 error and show a user-friendly message:

#### React/JavaScript Example

```javascript
import axios from "axios";
import { toast } from "react-toastify"; // or your preferred notification library

const enrollInCourse = async (courseId, scheduleId, enrollmentData) => {
    try {
        const response = await axios.post(
            `/api/v1/courses/${courseId}/schedules/${scheduleId}/enroll`,
            enrollmentData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        // Success
        toast.success("Successfully enrolled in the course!");
        return response.data;
    } catch (error) {
        // Handle duplicate enrollment error
        if (error.response?.status === 409) {
            toast.error("You have already enrolled in this course!");
            // Optionally redirect to enrollments page
            // navigate('/my-enrollments');
        } else if (error.response?.status === 400) {
            toast.error(error.response.data.message || "Enrollment failed");
        } else {
            toast.error("An error occurred. Please try again.");
        }
        throw error;
    }
};
```

#### Fetch API Example

```javascript
const enrollInCourse = async (courseId, scheduleId, enrollmentData) => {
    try {
        const response = await fetch(
            `/api/v1/courses/${courseId}/schedules/${scheduleId}/enroll`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(enrollmentData),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 409) {
                alert("You have already enrolled in this course!");
                // Or show a modal with options
                return null;
            }
            throw new Error(data.message || "Enrollment failed");
        }

        return data;
    } catch (error) {
        console.error("Enrollment error:", error);
        throw error;
    }
};
```

### 2. Prevent Duplicate Enrollment UI (Proactive Approach)

Check if the user is already enrolled BEFORE showing the enroll button:

#### Step 1: Fetch User's Enrollments

```javascript
const fetchUserEnrollments = async () => {
    try {
        const response = await axios.get("/api/v1/enrollments/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data.data.enrollments;
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return [];
    }
};
```

#### Step 2: Check if Already Enrolled

```javascript
const isAlreadyEnrolled = (courseId, userEnrollments) => {
    return userEnrollments.some(
        (enrollment) =>
            enrollment.course._id === courseId && enrollment.status !== "취소" // Not cancelled
    );
};
```

#### Step 3: Conditional Button Rendering

```jsx
import React, { useEffect, useState } from "react";

const CourseEnrollButton = ({ courseId, scheduleId, courseName }) => {
    const [enrollments, setEnrollments] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkEnrollment = async () => {
            const userEnrollments = await fetchUserEnrollments();
            setEnrollments(userEnrollments);
            setIsEnrolled(isAlreadyEnrolled(courseId, userEnrollments));
            setLoading(false);
        };
        checkEnrollment();
    }, [courseId]);

    const handleEnroll = async () => {
        // Your enrollment logic here
        await enrollInCourse(courseId, scheduleId, enrollmentData);
    };

    if (loading) {
        return <button disabled>Loading...</button>;
    }

    if (isEnrolled) {
        return (
            <div className="enrollment-status">
                <button disabled className="btn-enrolled">
                    ✓ Already Enrolled
                </button>
                <p className="text-info">
                    You are already enrolled in this course.
                    <a href="/my-enrollments">View My Enrollments</a>
                </p>
            </div>
        );
    }

    return (
        <button onClick={handleEnroll} className="btn-enroll">
            Enroll Now
        </button>
    );
};
```

### 3. Enhanced UI with Modal

Show a modal when duplicate enrollment is detected:

```jsx
import React, { useState } from "react";
import Modal from "./Modal"; // Your modal component

const EnrollmentHandler = ({ courseId, scheduleId }) => {
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    const handleEnroll = async () => {
        try {
            await enrollInCourse(courseId, scheduleId, enrollmentData);
            toast.success("Enrollment successful!");
        } catch (error) {
            if (error.response?.status === 409) {
                setShowDuplicateModal(true);
            }
        }
    };

    return (
        <>
            <button onClick={handleEnroll}>Enroll Now</button>

            <Modal
                isOpen={showDuplicateModal}
                onClose={() => setShowDuplicateModal(false)}
            >
                <div className="duplicate-enrollment-modal">
                    <h3>Already Enrolled</h3>
                    <p>You have already enrolled in this course.</p>
                    <div className="modal-actions">
                        <button
                            onClick={() =>
                                (window.location.href = "/my-enrollments")
                            }
                        >
                            View My Enrollments
                        </button>
                        <button onClick={() => setShowDuplicateModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
```

### 4. Course Detail Page - Full Example

```jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CourseDetailPage = ({ courseId }) => {
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseAndCheckEnrollment();
    }, [courseId]);

    const fetchCourseAndCheckEnrollment = async () => {
        try {
            // Fetch course details
            const courseResponse = await axios.get(
                `/api/v1/courses/${courseId}`
            );
            setCourse(courseResponse.data.data);

            // Check if user is enrolled
            const enrollmentsResponse = await axios.get(
                "/api/v1/enrollments/me",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const userEnrollments = enrollmentsResponse.data.data.enrollments;
            const enrolled = userEnrollments.some(
                (e) => e.course._id === courseId && e.status !== "취소"
            );
            setIsEnrolled(enrolled);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollClick = async (scheduleId) => {
        if (!localStorage.getItem("token")) {
            toast.info("Please login to enroll");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                `/api/v1/courses/${courseId}/schedules/${scheduleId}/enroll`,
                {
                    amountPaid: course.price,
                    paymentMethod: "카드결제",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success("Successfully enrolled!");
            setIsEnrolled(true);
            navigate("/my-enrollments");
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error("You have already enrolled in this course!", {
                    position: "top-center",
                    autoClose: 5000,
                });
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Enrollment failed. Please try again.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!course) return <div>Course not found</div>;

    return (
        <div className="course-detail">
            <h1>{course.title}</h1>
            <p>{course.description}</p>

            <div className="enrollment-section">
                {isEnrolled ? (
                    <div className="already-enrolled-banner">
                        <span className="check-icon">✓</span>
                        <span>You are enrolled in this course</span>
                        <button onClick={() => navigate("/my-enrollments")}>
                            View My Enrollments
                        </button>
                    </div>
                ) : (
                    <div className="schedule-list">
                        <h3>Available Schedules</h3>
                        {course.schedules?.map((schedule) => (
                            <div key={schedule._id} className="schedule-card">
                                <h4>{schedule.scheduleName}</h4>
                                <p>
                                    Start:{" "}
                                    {new Date(
                                        schedule.startDate
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                    End:{" "}
                                    {new Date(
                                        schedule.endDate
                                    ).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() =>
                                        handleEnrollClick(schedule._id)
                                    }
                                    disabled={schedule.isFull}
                                >
                                    {schedule.isFull ? "Full" : "Enroll Now"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetailPage;
```

## CSS Styling Examples

### Enrolled Status Badge

```css
.already-enrolled-banner {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 20px 0;
}

.check-icon {
    font-size: 24px;
    color: #28a745;
}

.btn-enrolled {
    background: #6c757d;
    color: white;
    cursor: not-allowed;
    opacity: 0.6;
}

.enrollment-status .text-info {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
}

.enrollment-status .text-info a {
    color: #007bff;
    text-decoration: underline;
    margin-left: 5px;
}
```

## Best Practices

1. **Always Check Authentication First**
    - Verify user is logged in before making enrollment requests
    - Redirect to login if not authenticated

2. **Show Clear Feedback**
    - Use toast notifications for quick feedback
    - Use modals for important messages
    - Disable the enroll button and show status if already enrolled

3. **Handle All Error Cases**
    - 409: Already enrolled
    - 400: Bad request (full schedule, invalid data)
    - 401: Unauthorized
    - 404: Course/schedule not found

4. **Improve UX**
    - Proactively check enrollment status before showing the enroll button
    - Provide a link to "My Enrollments" page
    - Show loading states during API calls
    - Disable buttons during processing to prevent double-clicks

5. **Error Messages**
    - Keep them user-friendly and actionable
    - Provide next steps (e.g., "View your enrollments")
    - Avoid technical jargon

## Testing Checklist

- [ ] User cannot enroll twice in the same course + schedule
- [ ] Proper error message is shown
- [ ] UI shows "Already Enrolled" status correctly
- [ ] Cancelled enrollments don't prevent re-enrollment
- [ ] Toast/modal appears on duplicate enrollment attempt
- [ ] Link to enrollments page works
- [ ] Loading states work correctly
- [ ] Button is disabled when already enrolled

## Additional Features to Consider

1. **Show Enrollment Details**

    ```jsx
    if (isEnrolled) {
        const enrollmentDetails = enrollments.find(
            (e) => e.course._id === courseId
        );
        return (
            <div>
                <p>Enrolled on: {enrollmentDetails.enrollmentDate}</p>
                <p>Status: {enrollmentDetails.status}</p>
                <p>Progress: {enrollmentDetails.progress}%</p>
            </div>
        );
    }
    ```

2. **Allow Re-enrollment for Different Schedules**
    - If a user is enrolled in Schedule A, they might want to enroll in Schedule B
    - Check specific schedule enrollment, not just course

3. **Email Verification Before Enrollment**
    - Check if email is verified before allowing enrollment
    - Show verification prompt if needed

## API Reference

### Check User Enrollments

```
GET /api/v1/enrollments/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "_id": "enrollment_id",
        "course": {
          "_id": "course_id",
          "title": "Course Name"
        },
        "status": "수강중",
        "enrollmentDate": "2025-01-15"
      }
    ]
  }
}
```

### Enroll in Course

```
POST /api/v1/courses/:courseId/schedules/:scheduleId/enroll
Authorization: Bearer <token>

Body:
{
  "amountPaid": 500000,
  "paymentMethod": "카드결제"
}

Success Response (201):
{
  "success": true,
  "data": { ... enrollment data ... },
  "message": "수강 신청이 성공적으로 완료되었습니다"
}

Error Response (409):
{
  "success": false,
  "statusCode": 409,
  "message": "You have already enrolled in this course. Please check your enrollments.",
  "error": "Conflict"
}
```

## Support

For backend issues or questions, contact the backend team or refer to:

- `backend/src/models/enrollment.model.js` - Enrollment schema
- `backend/src/services/enrollment.service.js` - Enrollment business logic
- `backend/src/controllers/enrollment.controller.js` - API endpoints
