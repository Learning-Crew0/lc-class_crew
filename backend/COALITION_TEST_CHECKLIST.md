# ✅ Coalition API Testing Checklist

Complete testing guide to verify all Coalition endpoints are working correctly.

---

## 🔐 Pre-Testing Setup

- [ ] Backend server is running (`npm run dev`)
- [ ] MongoDB is connected
- [ ] Admin user exists in database
- [ ] Test files are prepared for upload
- [ ] Postman collection imported (optional)

---

## 📝 Test Case 1: Create Coalition Application (Public)

**Endpoint:** `POST /api/v1/coalitions`  
**Auth:** None (Public)

### Test 1.1: Valid Application Submission
**Input:**
```
name: "홍길동"
affiliation: "ABC Corporation"
field: "Education Technology"
contact: "01012345678"
email: "hong@example.com"
file: [Valid PDF file]
```

**Expected Result:**
- [ ] Status: 201 Created
- [ ] Response contains all submitted fields
- [ ] `status` is "pending"
- [ ] `_id` is generated
- [ ] `createdAt` and `updatedAt` are set
- [ ] File is saved in `backend/uploads/coalitions/`
- [ ] File URL is correct in response

### Test 1.2: Missing Required Fields
**Input:**
```
name: "Test User"
(other fields missing)
```

**Expected Result:**
- [ ] Status: 400 Bad Request
- [ ] Error message: "All fields are required"
- [ ] `errors` object lists missing fields

### Test 1.3: Missing File Upload
**Input:**
```
name: "Test User"
affiliation: "Test Corp"
field: "Testing"
contact: "01012345678"
email: "test@example.com"
(file missing)
```

**Expected Result:**
- [ ] Status: 400 Bad Request
- [ ] Error message mentions file is required

### Test 1.4: Invalid Phone Number
**Input:**
```
contact: "123456" (invalid format)
(other fields valid)
```

**Expected Result:**
- [ ] Status: 400 Bad Request
- [ ] Error message mentions phone format

**Test variations:**
- [ ] 10 digits: "0101234567" → Should fail
- [ ] 12 digits: "010123456789" → Should fail
- [ ] With dashes: "010-1234-5678" → Should fail
- [ ] Valid: "01012345678" → Should pass

### Test 1.5: Invalid Email
**Input:**
```
email: "invalid-email" (no @ or domain)
(other fields valid)
```

**Expected Result:**
- [ ] Status: 400 Bad Request
- [ ] Error message mentions email format

**Test variations:**
- [ ] No @: "testexample.com" → Should fail
- [ ] No domain: "test@" → Should fail
- [ ] No TLD: "test@example" → Should fail
- [ ] Valid: "test@example.com" → Should pass

### Test 1.6: Duplicate Email
**Input:**
```
email: "hong@example.com" (same as Test 1.1)
(other fields valid but different)
```

**Expected Result:**
- [ ] Status: 409 Conflict
- [ ] Error message mentions duplicate email

### Test 1.7: Invalid File Type
**Input:**
```
file: [.exe file or other non-allowed type]
(other fields valid)
```

**Expected Result:**
- [ ] Status: 400 Bad Request
- [ ] Error message mentions invalid file type

**Test allowed types:**
- [ ] PDF → Should pass
- [ ] DOC/DOCX → Should pass
- [ ] PPT/PPTX → Should pass
- [ ] XLS/XLSX → Should pass
- [ ] JPG/JPEG/PNG → Should pass
- [ ] ZIP → Should pass
- [ ] HWP → Should pass
- [ ] EXE → Should fail
- [ ] MP4 → Should fail

### Test 1.8: File Size Limit
**Input:**
```
file: [16MB file] (exceeds 15MB limit)
(other fields valid)
```

**Expected Result:**
- [ ] Status: 400 Bad Request
- [ ] Error message mentions file size limit

---

## 🔐 Authentication Tests

### Test 2.1: Admin Login
**Endpoint:** `POST /api/v1/auth/login`

**Input:**
```json
{
  "email": "admin@lcclasscrew.com",
  "password": "changeme123"
}
```

**Expected Result:**
- [ ] Status: 200 OK
- [ ] Response contains `token`
- [ ] Token is valid JWT
- [ ] Save token for subsequent tests

### Test 2.2: Invalid Credentials
**Input:**
```json
{
  "email": "admin@lcclasscrew.com",
  "password": "wrongpassword"
}
```

**Expected Result:**
- [ ] Status: 401 Unauthorized
- [ ] Error message indicates invalid credentials

---

## 👨‍💼 Admin Endpoint Tests

**Setup:** Use admin token from Test 2.1 for all admin tests

### Test 3.1: Get All Applications
**Endpoint:** `GET /api/v1/coalitions?page=1&limit=10`  
**Auth:** Bearer Token (Admin)

**Expected Result:**
- [ ] Status: 200 OK
- [ ] Response contains `coalitions` array
- [ ] Response contains `pagination` object
- [ ] `pagination.total` matches database count
- [ ] `pagination.totalPages` is calculated correctly
- [ ] `pagination.hasNextPage` is correct
- [ ] `pagination.hasPrevPage` is correct

### Test 3.2: Get All Applications - No Token
**Endpoint:** `GET /api/v1/coalitions`  
**Auth:** None

**Expected Result:**
- [ ] Status: 401 Unauthorized
- [ ] Error message: "No token provided"

### Test 3.3: Get All Applications - Invalid Token
**Endpoint:** `GET /api/v1/coalitions`  
**Auth:** Bearer invalid_token

**Expected Result:**
- [ ] Status: 401 Unauthorized
- [ ] Error message: "Invalid or expired token"

### Test 3.4: Pagination
**Endpoint:** `GET /api/v1/coalitions?page=1&limit=2`

**Expected Result:**
- [ ] Returns exactly 2 items (if available)
- [ ] Page 2 returns next 2 items
- [ ] Last page returns remaining items

### Test 3.5: Filter by Status
**Test variations:**
- [ ] `?status=pending` → Returns only pending
- [ ] `?status=approved` → Returns only approved
- [ ] `?status=rejected` → Returns only rejected
- [ ] `?status=invalid` → Returns all or error

### Test 3.6: Search Functionality
**Test variations:**
- [ ] `?search=홍길동` → Finds by name
- [ ] `?search=ABC` → Finds by affiliation
- [ ] `?search=example.com` → Finds by email
- [ ] `?search=Education` → Finds by field
- [ ] Case-insensitive search works

### Test 3.7: Sorting
**Test variations:**
- [ ] `?sortBy=createdAt&sortOrder=desc` → Newest first
- [ ] `?sortBy=createdAt&sortOrder=asc` → Oldest first
- [ ] `?sortBy=name&sortOrder=asc` → Alphabetical
- [ ] `?sortBy=status&sortOrder=asc` → By status

---

## 🔍 Get Single Application

### Test 4.1: Get by Valid ID
**Endpoint:** `GET /api/v1/coalitions/:id`  
**Auth:** Bearer Token (Admin)

**Expected Result:**
- [ ] Status: 200 OK
- [ ] Returns complete application details
- [ ] All fields are present
- [ ] `adminNotes` is included (if set)

### Test 4.2: Get by Invalid ID
**Endpoint:** `GET /api/v1/coalitions/invalid_id`

**Expected Result:**
- [ ] Status: 404 Not Found
- [ ] Error message: "Coalition application not found"

### Test 4.3: Get without Authentication
**Endpoint:** `GET /api/v1/coalitions/:id`  
**Auth:** None

**Expected Result:**
- [ ] Status: 401 Unauthorized

---

## 📊 Statistics Endpoint

### Test 5.1: Get Statistics
**Endpoint:** `GET /api/v1/coalitions/stats`  
**Auth:** Bearer Token (Admin)

**Expected Result:**
- [ ] Status: 200 OK
- [ ] `total` count is correct
- [ ] `byStatus.pending` count is correct
- [ ] `byStatus.approved` count is correct
- [ ] `byStatus.rejected` count is correct
- [ ] `today` count is correct
- [ ] `thisWeek` count is correct
- [ ] `thisMonth` count is correct
- [ ] `recentApplications` array has max 5 items
- [ ] `topFields` array has max 5 items
- [ ] `topFields` is sorted by count (descending)

### Test 5.2: Statistics without Authentication
**Endpoint:** `GET /api/v1/coalitions/stats`  
**Auth:** None

**Expected Result:**
- [ ] Status: 401 Unauthorized

---

## ✏️ Update Status

### Test 6.1: Update to Approved
**Endpoint:** `PATCH /api/v1/coalitions/:id/status`  
**Auth:** Bearer Token (Admin)

**Input:**
```json
{
  "status": "approved",
  "adminNotes": "Great profile. Approved."
}
```

**Expected Result:**
- [ ] Status: 200 OK
- [ ] Application status is updated to "approved"
- [ ] `adminNotes` is saved
- [ ] `updatedAt` is updated
- [ ] Response contains updated data

### Test 6.2: Update to Rejected
**Input:**
```json
{
  "status": "rejected",
  "adminNotes": "Does not meet requirements."
}
```

**Expected Result:**
- [ ] Status: 200 OK
- [ ] Application status is updated to "rejected"
- [ ] `adminNotes` is saved

### Test 6.3: Update to Pending
**Input:**
```json
{
  "status": "pending"
}
```

**Expected Result:**
- [ ] Status: 200 OK
- [ ] Application status is updated to "pending"
- [ ] `adminNotes` can be optional

### Test 6.4: Invalid Status
**Input:**
```json
{
  "status": "invalid_status"
}
```

**Expected Result:**
- [ ] Status: 400 Bad Request
- [ ] Error message mentions invalid status

### Test 6.5: Update without Authentication
**Endpoint:** `PATCH /api/v1/coalitions/:id/status`  
**Auth:** None

**Expected Result:**
- [ ] Status: 401 Unauthorized

### Test 6.6: Update Non-existent Application
**Endpoint:** `PATCH /api/v1/coalitions/invalid_id/status`

**Expected Result:**
- [ ] Status: 404 Not Found

---

## 🗑️ Delete Application

### Test 7.1: Delete Existing Application
**Endpoint:** `DELETE /api/v1/coalitions/:id`  
**Auth:** Bearer Token (Admin)

**Expected Result:**
- [ ] Status: 200 OK
- [ ] Success message returned
- [ ] Application removed from database
- [ ] Associated file is deleted from disk
- [ ] Subsequent GET returns 404

### Test 7.2: Delete Non-existent Application
**Endpoint:** `DELETE /api/v1/coalitions/invalid_id`

**Expected Result:**
- [ ] Status: 404 Not Found

### Test 7.3: Delete without Authentication
**Endpoint:** `DELETE /api/v1/coalitions/:id`  
**Auth:** None

**Expected Result:**
- [ ] Status: 401 Unauthorized

---

## 🔄 Integration Tests

### Test 8.1: Complete Application Flow
1. [ ] Create application (public)
2. [ ] Verify in database
3. [ ] Get all applications (admin)
4. [ ] Get single application (admin)
5. [ ] Update status to approved (admin)
6. [ ] Verify status changed
7. [ ] Get statistics (admin)
8. [ ] Verify counts updated
9. [ ] Delete application (admin)
10. [ ] Verify deletion

### Test 8.2: Multiple Applications
1. [ ] Create 3 applications with different fields
2. [ ] Verify pagination works
3. [ ] Filter by status
4. [ ] Search by different criteria
5. [ ] Sort by different fields
6. [ ] Verify statistics reflect all applications

### Test 8.3: Edge Cases
- [ ] Very long names (99 characters) → Should pass
- [ ] Very long names (101 characters) → Should fail
- [ ] Special characters in names → Should pass
- [ ] Empty strings (after trim) → Should fail
- [ ] Unicode characters (Korean, Chinese) → Should pass
- [ ] Email case sensitivity (Test@Example.com) → Should be normalized to lowercase

---

## 📁 File System Tests

### Test 9.1: File Storage
- [ ] Files are saved in correct directory: `backend/uploads/coalitions/`
- [ ] Filenames are unique (timestamp + random)
- [ ] Original filename is preserved in database
- [ ] File URL is accessible

### Test 9.2: File Deletion
- [ ] Deleting application removes file from disk
- [ ] File deletion doesn't affect other files

---

## 🔒 Security Tests

### Test 10.1: Authorization
- [ ] Public endpoints work without token
- [ ] Admin endpoints require token
- [ ] Invalid tokens are rejected
- [ ] Expired tokens are rejected
- [ ] Non-admin users cannot access admin endpoints

### Test 10.2: Data Validation
- [ ] SQL injection attempts are sanitized
- [ ] XSS attempts are sanitized
- [ ] Path traversal in filenames is prevented

---

## 📊 Performance Tests

### Test 11.1: Load Testing
- [ ] Create 100 applications
- [ ] Get all with pagination
- [ ] Verify response time < 1 second
- [ ] Statistics calculation is fast

### Test 11.2: Database Indexes
- [ ] Email lookup is fast (unique index)
- [ ] Status filtering is fast (compound index)
- [ ] Sorting by createdAt is fast (index)

---

## ✅ Final Verification

- [ ] All public endpoints work
- [ ] All admin endpoints work
- [ ] All validation rules work
- [ ] All error cases handled
- [ ] Files upload and delete correctly
- [ ] Statistics calculate correctly
- [ ] Pagination works correctly
- [ ] Filtering works correctly
- [ ] Sorting works correctly
- [ ] Search works correctly
- [ ] Authentication works correctly
- [ ] Authorization works correctly
- [ ] Database constraints work
- [ ] No memory leaks
- [ ] No console errors
- [ ] API documentation is accurate

---

## 📝 Test Results

**Date:** ___________  
**Tester:** ___________  
**Environment:** ☐ Development  ☐ Staging  ☐ Production

**Overall Status:** ☐ PASS  ☐ FAIL

**Issues Found:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

## 🎯 Automated Testing

For CI/CD, create Jest tests for all endpoints:

```javascript
// tests/coalition.test.js

describe('Coalition API', () => {
  describe('POST /coalitions', () => {
    it('should create application with valid data', async () => {
      // Test code
    });
    
    it('should reject invalid phone number', async () => {
      // Test code
    });
    
    // More tests...
  });
  
  // More test suites...
});
```

Run tests:
```bash
npm test
```

---

**Testing Complete! 🎉**



