# 📅 Training Schedule Bulk Upload Guide

## 📋 Overview

This guide explains how to bulk upload training schedules to courses using CSV or XLSX files. Training schedules allow courses to have multiple batches with different start dates, seat availability, and enrollment tracking.

---

## 🔌 API Endpoints

### **1. Bulk Upload Training Schedules**

**POST** `/api/training-schedules/bulk-upload`

Upload a CSV or XLSX file containing training schedule data for multiple courses.

**Request:**
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **File Field Name:** `file`
- **Max File Size:** 10MB
- **Accepted Formats:** `.csv`, `.xlsx`, `.xls`

**Response (Success):**
```json
{
  "success": true,
  "message": "Training schedules uploaded successfully",
  "summary": {
    "totalRows": 5,
    "uniqueCourses": 2,
    "successfullyUpdated": 2,
    "failed": 0
  },
  "details": {
    "updatedCourses": [
      {
        "courseId": "67123abc...",
        "courseName": "DevOps Fundamentals",
        "schedulesAdded": 3,
        "totalSchedules": 3
      }
    ],
    "failedCourses": [],
    "invalidSchedules": []
  }
}
```

---

### **2. Download Template**

**GET** `/api/training-schedules/bulk-upload/template?format=csv`

Download a sample CSV template for bulk upload.

**Query Parameters:**
- `format` (optional): `csv` (default) or `json`

---

### **3. Get Upload Instructions**

**GET** `/api/training-schedules/bulk-upload/instructions`

Get detailed instructions and field specifications for bulk upload.

---

## 📊 File Format

### **Required Columns:**

| Column Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `courseName` | String | ✅ Yes | - | Name of the course (must exist in database) |
| `scheduleName` | String | ✅ Yes | - | Name of the training schedule |
| `startDate` | Date | ❌ No | null | Start date (YYYY-MM-DD format) |
| `endDate` | Date | ❌ No | null | End date (YYYY-MM-DD format) |
| `status` | String | ❌ No | `upcoming` | Status of the schedule |
| `availableSeats` | Number | ❌ No | null | Number of available seats |
| `enrolledCount` | Number | ❌ No | `0` | Number of enrolled students |
| `isActive` | Boolean | ❌ No | `true` | Whether the schedule is active |

### **Status Options:**
- `upcoming` - Scheduled for future
- `ongoing` - Currently in progress
- `completed` - Finished
- `cancelled` - Cancelled

---

## 📝 Sample CSV Format

```csv
courseName,scheduleName,startDate,endDate,status,availableSeats,enrolledCount,isActive
DevOps Fundamentals,Morning Batch - January 2025,2025-01-15,2025-02-15,upcoming,30,0,true
DevOps Fundamentals,Evening Batch - January 2025,2025-01-20,2025-02-20,upcoming,25,5,true
Cloud Computing Basics,Weekend Batch - February 2025,2025-02-01,2025-03-01,upcoming,20,0,true
```

---

## 🎯 Validation Rules

### **Course Name:**
- ✅ **Required**
- ✅ Must exist in the database
- ✅ Case-insensitive matching

### **Schedule Name:**
- ✅ **Required**
- ✅ Should be descriptive (e.g., "Morning Batch - January 2025")

### **Dates:**
- Format: `YYYY-MM-DD` (e.g., `2025-01-15`)
- Start date must be before end date
- Optional fields

### **Status:**
- Must be one of: `upcoming`, `ongoing`, `completed`, `cancelled`
- Case-insensitive
- Default: `upcoming`

### **Numbers:**
- `availableSeats`: Non-negative integer
- `enrolledCount`: Non-negative integer, default `0`

### **Boolean:**
- `isActive`: `true`, `false`, `1`, `0`, or case-insensitive string `"true"`/`"false"`
- Default: `true`

---

## 🧪 Testing in Postman

### **Step 1: Bulk Upload Training Schedules**

1. **Method:** `POST`
2. **URL:** `http://localhost:5000/api/training-schedules/bulk-upload`
3. **Body:** Select `form-data`
4. **Add Field:**
   - **Key:** `file`
   - **Type:** `File`
   - **Value:** [Choose your CSV/XLSX file]

5. **Click Send**

### **Expected Response:**
```json
{
  "success": true,
  "message": "Training schedules uploaded successfully",
  "summary": {
    "totalRows": 3,
    "uniqueCourses": 2,
    "successfullyUpdated": 2,
    "failed": 0
  }
}
```

---

### **Step 2: Download Template**

1. **Method:** `GET`
2. **URL:** `http://localhost:5000/api/training-schedules/bulk-upload/template`
3. **Query Params (optional):** `format=csv`
4. **Click Send**

**Result:** CSV file will download automatically.

---

### **Step 3: Get Instructions**

1. **Method:** `GET`
2. **URL:** `http://localhost:5000/api/training-schedules/bulk-upload/instructions`
3. **Click Send**

**Result:** Detailed JSON with field specifications.

---

## ⚠️ Common Errors

### **1. Course Not Found**
```json
{
  "success": false,
  "message": "No valid training schedules to import...",
  "invalidSchedules": [
    {
      "courseName": "Unknown Course",
      "errors": [
        "Course \"Unknown Course\" does not exist in database"
      ]
    }
  ]
}
```

**Solution:** Ensure the course exists in the database before uploading schedules.

---

### **2. Invalid Date Format**
```json
{
  "invalidSchedules": [
    {
      "courseName": "DevOps Fundamentals",
      "errors": [
        "Schedule 1: Invalid start date format"
      ]
    }
  ]
}
```

**Solution:** Use `YYYY-MM-DD` format for dates (e.g., `2025-01-15`).

---

### **3. Invalid Status**
```json
{
  "invalidSchedules": [
    {
      "courseName": "DevOps Fundamentals",
      "errors": [
        "Schedule 1: Status must be one of: upcoming, ongoing, completed, cancelled"
      ]
    }
  ]
}
```

**Solution:** Use only valid status values.

---

### **4. Start Date After End Date**
```json
{
  "invalidSchedules": [
    {
      "courseName": "DevOps Fundamentals",
      "errors": [
        "Schedule 1: Start date must be before end date"
      ]
    }
  ]
}
```

**Solution:** Ensure `startDate` is before `endDate`.

---

### **5. Missing Required Field**
```json
{
  "invalidSchedules": [
    {
      "courseName": "DevOps Fundamentals",
      "errors": [
        "Schedule 1: Schedule name is required"
      ]
    }
  ]
}
```

**Solution:** Provide both `courseName` and `scheduleName` for each row.

---

## 💡 Important Notes

1. **Multiple Schedules Per Course:**
   - You can add multiple schedules to the same course in one file
   - All schedules in the file will be **added** to existing schedules (not replaced)

2. **Course Must Exist:**
   - The course must already exist in the database
   - Use the exact course name (case-insensitive)

3. **Column Names:**
   - Column names are case-insensitive
   - Supports variations like `coursename`, `CourseName`, `course_name`, etc.

4. **Date Format:**
   - Always use `YYYY-MM-DD` format
   - Examples: `2025-01-15`, `2025-12-31`

5. **Status Values:**
   - Case-insensitive
   - Can use `UPCOMING`, `upcoming`, or `Upcoming`

6. **File Size Limit:**
   - Maximum 10MB per upload

7. **Supported File Types:**
   - CSV (`.csv`)
   - Excel (`.xlsx`, `.xls`)

---

## 📋 Complete Example

### **CSV File: `training_schedules.csv`**

```csv
courseName,scheduleName,startDate,endDate,status,availableSeats,enrolledCount,isActive
DevOps Fundamentals,Morning Batch - Jan 2025,2025-01-15,2025-02-15,upcoming,30,0,true
DevOps Fundamentals,Evening Batch - Jan 2025,2025-01-20,2025-02-20,upcoming,25,5,true
DevOps Fundamentals,Weekend Batch - Feb 2025,2025-02-01,2025-03-01,upcoming,20,0,true
Cloud Computing Basics,Weekday Batch - Jan 2025,2025-01-10,2025-02-10,upcoming,40,10,true
Cloud Computing Basics,Weekend Batch - Feb 2025,2025-02-05,2025-03-05,upcoming,35,0,true
```

### **Result:**
- 2 courses updated
- DevOps Fundamentals: 3 schedules added
- Cloud Computing Basics: 2 schedules added

---

## 🔄 Workflow

1. **Prepare Data:**
   - Download template: `GET /api/training-schedules/bulk-upload/template`
   - Fill in your training schedule data
   - Ensure all courses exist in database

2. **Validate Data:**
   - Check course names match database
   - Verify date formats (YYYY-MM-DD)
   - Confirm status values are valid
   - Ensure required fields are filled

3. **Upload File:**
   - `POST /api/training-schedules/bulk-upload`
   - Attach CSV/XLSX file
   - Review response for any errors

4. **Handle Errors:**
   - Fix any invalid schedules
   - Re-upload corrected data

5. **Verify Results:**
   - Check `summary.successfullyUpdated` count
   - Review `updatedCourses` details
   - Verify schedules were added to correct courses

---

## 🛠️ Troubleshooting

### **No File Uploaded Error**
```json
{
  "success": false,
  "message": "No file uploaded. Please upload a CSV or XLSX file",
  "debug": {
    "hint": "In Postman: Body → form-data → Key: 'file' (Type: File)"
  }
}
```

**Solution:** 
- Ensure field name is `file` (not `files` or other names)
- Ensure file type is set to `File` in Postman

---

### **File Format Error**
```json
{
  "success": false,
  "message": "Invalid file type. Only CSV and XLSX files are allowed."
}
```

**Solution:** Upload only `.csv`, `.xlsx`, or `.xls` files.

---

### **Empty File**
```json
{
  "success": false,
  "message": "No valid training schedule data found in file"
}
```

**Solution:** 
- Ensure file has data rows (not just headers)
- Check column names match expected format
- Verify file is not corrupted

---

## 📞 Support

For issues or questions:
- Controller: `/backend-dummy/src/modules/course/trainingScheduleBulkUpload.controller.js`
- Routes: `/backend-dummy/src/modules/course/trainingScheduleBulkUpload.routes.js`
- File Parser: `/backend-dummy/src/services/trainingScheduleFileParser.service.js`
- Middleware: `/backend-dummy/src/middleware/trainingScheduleUpload.middleware.js`

---

## ✅ Quick Checklist

Before uploading:
- [ ] All courses exist in database
- [ ] File is CSV or XLSX format
- [ ] File size is under 10MB
- [ ] `courseName` column exists and is filled
- [ ] `scheduleName` column exists and is filled
- [ ] Date formats are `YYYY-MM-DD`
- [ ] Status values are valid (if provided)
- [ ] Numbers are non-negative (if provided)
- [ ] Column names match expected format

🎉 **Ready to upload!**

