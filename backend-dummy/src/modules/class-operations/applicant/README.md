# Applicant Module Documentation

## Overview
The Applicant module handles course application management in the ClassCrew system. It allows users to apply for courses, administrators to manage applications, and provides filtering and export functionality.

## Base URL
```
http://localhost:5000/api/applicants
```

## Routes Overview

### 1. Get All Applicants
**GET** `/`

#### Description
Retrieve a list of applicants with optional filtering by course, status, or user.

#### Query Parameters
- `courseId` (optional): Filter by specific course ID
- `status` (optional): Filter by application status (`pending`, `approved`, `rejected`)
- `userId` (optional): Filter by specific user ID

#### Request Example
```bash
curl -X GET "http://localhost:5000/api/applicants" \
  -H "Content-Type: application/json"
```

#### Response Example (200)
```json
{
  "success": true,
  "applicants": [
    {
      "_id": "60d5ecb74b401c001f8b4567",
      "userId": {
        "_id": "60d5ecb74b401c001f8b4568",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "courseId": {
        "_id": "60d5ecb74b401c001f8b4569",
        "title": "React Fundamentals"
      },
      "status": "pending",
      "appliedAt": "2023-01-15T10:30:00.000Z",
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Get Applicant by ID
**GET** `/:id`

#### Description
Retrieve a specific applicant by their ID.

#### Request Example
```bash
curl -X GET "http://localhost:5000/api/applicants/60d5ecb74b401c001f8b4567" \
  -H "Content-Type: application/json"
```

#### Response Example (200)
```json
{
  "success": true,
  "applicant": {
    "_id": "60d5ecb74b401c001f8b4567",
    "userId": {
      "_id": "60d5ecb74b401c001f8b4568",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "courseId": {
      "_id": "60d5ecb74b401c001f8b4569",
      "title": "React Fundamentals"
    },
    "status": "pending",
    "appliedAt": "2023-01-15T10:30:00.000Z",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:30:00.000Z"
  }
}
```

#### Response Example (404 - Not Found)
```json
{
  "success": false,
  "message": "Applicant not found"
}
```

### 3. Create New Applicant
**POST** `/`

#### Description
Create a new course application.

#### Request Body
```json
{
  "userId": "60d5ecb74b401c001f8b4568",
  "courseId": "60d5ecb74b401c001f8b4569"
}
```

#### Request Example
```bash
curl -X POST "http://localhost:5000/api/applicants" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "60d5ecb74b401c001f8b4568",
    "courseId": "60d5ecb74b401c001f8b4569"
  }'
```

#### Response Example (201 - Created)
```json
{
  "success": true,
  "message": "Applicant created successfully",
  "applicant": {
    "_id": "60d5ecb74b401c001f8b4567",
    "userId": "60d5ecb74b401c001f8b4568",
    "courseId": "60d5ecb74b401c001f8b4569",
    "status": "pending",
    "appliedAt": "2023-01-15T10:30:00.000Z",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:30:00.000Z"
  }
}
```

#### Response Example (400 - Bad Request)
```json
{
  "success": false,
  "message": "User ID and course ID are required"
}
```

```json
{
  "success": false,
  "message": "You have already applied for this course"
}
```

### 4. Update Applicant Status
**PUT** `/:id`

#### Description
Update an applicant's status (admin/instructor only).

#### Request Body
```json
{
  "status": "approved"
}
```

#### Request Example
```bash
curl -X PUT "http://localhost:5000/api/applicants/60d5ecb74b401c001f8b4567" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

#### Response Example (200)
```json
{
  "success": true,
  "message": "Applicant updated successfully",
  "applicant": {
    "_id": "60d5ecb74b401c001f8b4567",
    "userId": "60d5ecb74b401c001f8b4568",
    "courseId": "60d5ecb74b401c001f8b4569",
    "status": "approved",
    "appliedAt": "2023-01-15T10:30:00.000Z",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:35:00.000Z"
  }
}
```

#### Response Example (400 - Invalid Status)
```json
{
  "success": false,
  "message": "Invalid status"
}
```

### 5. Delete Applicant
**DELETE** `/:id`

#### Description
Delete an applicant record.

#### Request Example
```bash
curl -X DELETE "http://localhost:5000/api/applicants/60d5ecb74b401c001f8b4567" \
  -H "Content-Type: application/json"
```

#### Response Example (200)
```json
{
  "success": true,
  "message": "Applicant deleted successfully"
}
```

#### Response Example (404 - Not Found)
```json
{
  "success": false,
  "message": "Applicant not found"
}
```

### 6. Export Applicants to CSV
**GET** `/export`

#### Description
Export applicants data to CSV format with optional filtering.

#### Query Parameters
- `courseId` (optional): Filter by specific course ID
- `status` (optional): Filter by application status
- `userId` (optional): Filter by specific user ID

#### Request Example
```bash
curl -X GET "http://localhost:5000/api/applicants/export?status=pending&courseId=60d5ecb74b401c001f8b4569" \
  -H "Content-Type: application/json" \
  --output applicants_export.csv
```

#### Response
Downloads a CSV file with the following columns:
- `_id`
- `userId`
- `courseId`
- `status`
- `appliedAt`
- `createdAt`
- `updatedAt`

## Workflow

### Application Process
1. **User applies** for a course via `POST /`
2. **Application created** with `pending` status
3. **Admin/Instructor reviews** applications via `GET /` (filtered by status)
4. **Admin/Instructor approves/rejects** via `PUT /:id`
5. **User notified** of decision (handled outside this module)

### Status Management
- `pending`: Initial status when user applies
- `approved`: Application accepted
- `rejected`: Application declined

### Data Relationships
- Each applicant is linked to one user and one course
- Prevents duplicate applications for the same user-course combination
- Populated data includes user names/emails and course titles

## Error Handling
All endpoints include proper error handling:
- 400: Bad Request (missing fields, invalid status, duplicate application)
- 404: Not Found (applicant doesn't exist)
- 500: Internal Server Error (database issues, unexpected errors)

## Testing Checklist

### Setup
- [ ] Server running on port 5000
- [ ] Database connected
- [ ] Sample users and courses exist

### Manual Testing
- [ ] Create new applicant with valid userId and courseId
- [ ] Try creating duplicate applicant (should fail)
- [ ] Get all applicants
- [ ] Filter applicants by status
- [ ] Get specific applicant by ID
- [ ] Update applicant status
- [ ] Export applicants to CSV
- [ ] Delete applicant

### Edge Cases to Test
- [ ] Invalid ObjectId formats
- [ ] Non-existent userId/courseId
- [ ] Missing required fields
- [ ] Invalid status values
- [ ] Database connection issues

## Dependencies
- Express.js for routing
- Mongoose for MongoDB operations
- json2csv for export functionality

## Notes
- All operations are asynchronous
- Proper input validation is implemented
- MongoDB ObjectIds are used for relationships
- Timestamps are automatically managed
