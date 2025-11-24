# Duplicate Enrollment Prevention - Changes Summary

## What Changed

### Backend Changes

#### File: `backend/src/services/enrollment.service.js`

**Function**: `enrollUserInSchedule` (lines 37-48)

**What was added:**
1. Enhanced duplicate enrollment check
2. Better error message in English
3. Excludes cancelled enrollments from duplicate check

**Before:**
```javascript
const existingEnrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
    schedule: scheduleId,
});

if (existingEnrollment) {
    throw ApiError.conflict("이미 해당 일정에 등록되어 있습니다");
}
```

**After:**
```javascript
// Check if user is already enrolled in this course with this schedule
const existingEnrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
    schedule: scheduleId,
    status: { $ne: "취소" }, // Exclude cancelled enrollments
});

if (existingEnrollment) {
    throw ApiError.conflict(
        "You have already enrolled in this course. Please check your enrollments."
    );
}
```

### Key Improvements

1. **Better Error Message**: Changed from Korean to English for broader accessibility
2. **Excludes Cancelled**: Users who cancelled can re-enroll
3. **Clear Action**: Message tells users what to do next

## How It Works

### Database Level Protection
The enrollment model has a unique compound index:
```javascript
enrollmentSchema.index({ user: 1, course: 1, schedule: 1 }, { unique: true });
```
This prevents duplicate enrollments at the database level.

### Application Level Check
Before creating an enrollment, the service checks if:
- User ID matches
- Course ID matches  
- Schedule ID matches
- Enrollment is NOT cancelled

If all conditions match, it throws a 409 Conflict error.

### Error Response
When duplicate enrollment is detected:
- **HTTP Status**: 409 (Conflict)
- **Message**: "You have already enrolled in this course. Please check your enrollments."
- **Response Format**:
```json
{
  "success": false,
  "statusCode": 409,
  "message": "You have already enrolled in this course. Please check your enrollments.",
  "error": "Conflict"
}
```

## Frontend Integration

See `DUPLICATE_ENROLLMENT_PREVENTION.md` for detailed frontend implementation guide.

### Quick Frontend Example

```javascript
try {
  await axios.post(`/api/v1/courses/${courseId}/schedules/${scheduleId}/enroll`, data);
  toast.success('Enrolled successfully!');
} catch (error) {
  if (error.response?.status === 409) {
    toast.error('You have already enrolled in this course!');
  }
}
```

## Testing

### Manual Testing Steps

1. **Login as a student**
2. **Enroll in a course** (note the courseId and scheduleId)
3. **Try to enroll again** in the same course + schedule
4. **Expected Result**: Error message "You have already enrolled in this course. Please check your enrollments."

### Test with cURL
```bash
# First enrollment (should succeed)
curl -X POST http://localhost:5000/api/v1/courses/COURSE_ID/schedules/SCHEDULE_ID/enroll \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amountPaid": 500000,
    "paymentMethod": "카드결제"
  }'

# Second enrollment (should fail with 409)
curl -X POST http://localhost:5000/api/v1/courses/COURSE_ID/schedules/SCHEDULE_ID/enroll \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amountPaid": 500000,
    "paymentMethod": "카드결제"
  }'
```

### Test Cancelled Enrollment Re-enrollment
```bash
# 1. Enroll in course
# 2. Cancel enrollment
curl -X POST http://localhost:5000/api/v1/enrollments/ENROLLMENT_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Try to enroll again (should succeed since previous was cancelled)
curl -X POST http://localhost:5000/api/v1/courses/COURSE_ID/schedules/SCHEDULE_ID/enroll \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amountPaid": 500000,
    "paymentMethod": "카드결제"
  }'
```

## Edge Cases Handled

1. ✅ **Multiple schedules**: User can enroll in different schedules of the same course
2. ✅ **Cancelled enrollments**: Users can re-enroll if they previously cancelled
3. ✅ **Database constraint**: Unique index prevents duplicates even if application check fails
4. ✅ **User identification**: Uses userId (from JWT token), not email, for accurate identification

## Notes

- The check uses `user` ID (ObjectId), not email, because MongoDB references work with IDs
- Email is unique per user, so checking userId is equivalent to checking email
- The model already has a unique compound index, so this is a double-layer of protection
- Cancelled enrollments (status: "취소") are excluded from the duplicate check

## Related Files

- `backend/src/models/enrollment.model.js` - Schema and indexes
- `backend/src/services/enrollment.service.js` - Business logic (MODIFIED)
- `backend/src/controllers/enrollment.controller.js` - API endpoints
- `backend/src/utils/apiError.util.js` - Error handling utility
- `backend/docs/DUPLICATE_ENROLLMENT_PREVENTION.md` - Frontend guide

## Future Enhancements

Consider adding:
1. Admin override to allow duplicate enrollments in special cases
2. Enrollment transfer between schedules
3. Wait-list feature for full courses
4. Notification when trying to enroll in full schedule


