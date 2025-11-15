# Member Verification API Documentation

## Overview
This endpoint verifies if a user is a registered member by checking their phone, email, and name against the database. This is used for personal/corporate inquiry forms to ensure only registered members can submit.

---

## Endpoint

### POST `/api/v1/auth/verify-member`

**Authentication:** Not required (public endpoint)

**Description:** Verifies if a user is a registered member with matching credentials.

---

## Request

### Request Body

```json
{
  "phone": "01012345678",
  "email": "user@example.com",
  "name": "홍길동"
}
```

### Request Fields

| Field   | Type   | Required | Description                                    |
|---------|--------|----------|------------------------------------------------|
| `phone` | String | Yes      | User's phone number (can include spaces/dashes, will be normalized) |
| `email` | String | Yes      | User's email address (case-insensitive) |
| `name`  | String | Yes      | User's full name (must match `fullName` or `username` in database) |

---

## Responses

### Success (200 OK)
Member found and all information matches.

```json
{
  "status": "success",
  "success": true,
  "message": "Member verified"
}
```

---

### Not Found (404)
User is not registered in the system.

```json
{
  "status": "error",
  "message": "가입되어 있지 않습니다"
}
```

**Frontend Display:** "가입되어 있지 않습니다" (Not registered)

---

### Info Mismatch (400)
User exists but provided information doesn't match.

```json
{
  "status": "error",
  "message": "일치하지 않습니다"
}
```

**Frontend Display:** "일치하지 않습니다" (Information doesn't match)

---

### Validation Error (400)
Missing required fields.

```json
{
  "status": "error",
  "message": "Phone, email, and name are required"
}
```

---

## Frontend Integration Guide

### React/Next.js Example

```javascript
const verifyMember = async (phone, email, name) => {
  try {
    const response = await fetch('/api/v1/auth/verify-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, email, name }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Member verified - allow inquiry submission
      console.log('회원 인증 성공');
      return { success: true };
    } else if (response.status === 404) {
      // Not a member
      alert('가입되어 있지 않습니다');
      return { success: false, error: 'not_found' };
    } else if (response.status === 400) {
      // Info mismatch
      alert('일치하지 않습니다');
      return { success: false, error: 'mismatch' };
    }
  } catch (error) {
    console.error('Verification error:', error);
    alert('인증 중 오류가 발생했습니다');
    return { success: false, error: 'network_error' };
  }
};

// Usage in form
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const phone = formData.phone.prefix + formData.phone.middle + formData.phone.last;
  const email = formData.email.username + '@' + formData.email.domain;
  const name = formData.name;
  
  // Verify member first
  const verification = await verifyMember(phone, email, name);
  
  if (verification.success) {
    // Proceed with inquiry submission
    await submitInquiry(formData);
  } else {
    // Show error message based on error type
    if (verification.error === 'not_found') {
      // Show registration link or message
    } else if (verification.error === 'mismatch') {
      // Show error about mismatched info
    }
  }
};
```

---

## Axios Example

```javascript
import axios from 'axios';

const verifyMember = async (phone, email, name) => {
  try {
    const response = await axios.post('/api/v1/auth/verify-member', {
      phone,
      email,
      name,
    });

    if (response.data.success) {
      return { success: true };
    }
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: '가입되어 있지 않습니다' };
    } else if (error.response?.status === 400) {
      return { success: false, message: '일치하지 않습니다' };
    }
    return { success: false, message: '인증 중 오류가 발생했습니다' };
  }
};
```

---

## Testing

### Using cURL

```bash
# Test with valid member
curl -X POST http://localhost:5000/api/v1/auth/verify-member \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01012345678",
    "email": "user@example.com",
    "name": "홍길동"
  }'

# Test with non-existent member
curl -X POST http://localhost:5000/api/v1/auth/verify-member \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01099999999",
    "email": "nonexistent@example.com",
    "name": "Test User"
  }'

# Test with mismatched info
curl -X POST http://localhost:5000/api/v1/auth/verify-member \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01012345678",
    "email": "wrong@example.com",
    "name": "홍길동"
  }'
```

### Using Test Script

```bash
cd backend
node scripts/test-verify-member.js
```

**Note:** Update the test script with real user credentials from your database before running.

---

## Verification Logic

The endpoint performs the following checks:

1. **Phone Number Normalization**: Removes spaces, dashes, and other formatting characters
2. **Email Normalization**: Trims whitespace and converts to lowercase
3. **Name Normalization**: Trims whitespace
4. **Database Lookup**: Searches for user by phone number (checks both `phone` and `phoneNumber` fields)
5. **Email Match**: Compares normalized email with user's email (case-insensitive)
6. **Name Match**: Compares with both `fullName` and `username` fields
7. **Result**:
   - If user not found → 404 "가입되어 있지 않습니다"
   - If user found but info doesn't match → 400 "일치하지 않습니다"
   - If all checks pass → 200 "Member verified"

---

## Frontend Flow Recommendation

```
1. User fills in phone, email, name in inquiry form
2. User clicks "Verify Member" button (optional) or submits form
3. Call verifyMember API
4. Handle response:
   - SUCCESS (200) → Enable inquiry submission
   - NOT_FOUND (404) → Show "Please register first" message
   - MISMATCH (400) → Show "Information doesn't match" error
   - VALIDATION (400) → Show "Please fill all fields" error
5. If verified, proceed with inquiry submission
```

---

## Notes

- Phone numbers are normalized (spaces/dashes removed) for comparison
- Email comparison is case-insensitive
- Name can match either `fullName` or `username` field in database
- This endpoint does not require authentication
- No sensitive user information is returned in the response
- Can be called multiple times (no rate limiting currently)

---

## Integration Checklist

- [ ] Add API call to inquiry form submission flow
- [ ] Handle 404 response (not a member)
- [ ] Handle 400 response (info mismatch)
- [ ] Show appropriate error messages in Korean
- [ ] Add loading state during verification
- [ ] Test with various phone number formats (with/without dashes)
- [ ] Test with different email casing
- [ ] Add optional "Verify" button before submission (recommended UX)

---

## Related Endpoints

- `POST /api/v1/public/inquiries/personal` - Submit personal inquiry (requires member verification)
- `POST /api/v1/public/inquiries/corporate` - Submit corporate inquiry (requires member verification)
- `POST /api/v1/auth/register` - Register new member

---

## Support

For questions or issues, contact the backend team or refer to the main API documentation.

