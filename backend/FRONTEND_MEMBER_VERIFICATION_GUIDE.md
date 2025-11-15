# Frontend Integration Guide - Member Verification API

## 🎯 Overview

This guide shows you how to integrate the **Member Verification API** into your personal and corporate inquiry forms. This endpoint verifies if a user is a registered member before they can submit an inquiry.

---

## 📍 API Endpoint

```
POST /api/v1/auth/verify-member
```

**Base URL:** `http://your-domain.com/api/v1` or `http://localhost:5000/api/v1` (development)

---

## 📤 Request Format

### Request Body

```json
{
  "phone": "01012345678",
  "email": "user@example.com",
  "name": "홍길동"
}
```

### Field Details

| Field   | Type   | Required | Description                                    | Example         |
|---------|--------|----------|------------------------------------------------|-----------------|
| `phone` | String | ✅ Yes   | User's phone number (removes spaces/dashes automatically) | `"01012345678"` or `"010-1234-5678"` |
| `email` | String | ✅ Yes   | User's email address (case-insensitive)       | `"user@example.com"` |
| `name`  | String | ✅ Yes   | User's full name (must match registration)    | `"홍길동"` |

---

## 📥 Response Formats

### ✅ Success (200) - Member Verified

```json
{
  "status": "success",
  "success": true,
  "message": "Member verified"
}
```

**Meaning:** User is a registered member and all information matches. ✅ **Allow inquiry submission.**

---

### ❌ Not Found (404) - Not a Member

```json
{
  "status": "error",
  "message": "가입되어 있지 않습니다"
}
```

**Meaning:** User is not registered in the system. ⚠️ **Show registration prompt.**

**Display to User:** "가입되어 있지 않습니다" (You are not registered)

---

### ❌ Info Mismatch (400) - Information Doesn't Match

```json
{
  "status": "error",
  "message": "일치하지 않습니다"
}
```

**Meaning:** User exists but provided information doesn't match. ⚠️ **Ask user to check their information.**

**Display to User:** "일치하지 않습니다" (Information doesn't match)

---

### ❌ Validation Error (400) - Missing Fields

```json
{
  "status": "error",
  "message": "Phone, email, and name are required"
}
```

**Meaning:** Request is missing required fields. ⚠️ **Show field validation errors.**

---

## 💻 Frontend Implementation

### 1. React/Next.js with Fetch API

```jsx
import { useState } from 'react';

const PersonalInquiryForm = () => {
  const [formData, setFormData] = useState({
    phone: { prefix: '010', middle: '', last: '' },
    email: { username: '', domain: '' },
    name: ''
  });
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verify member function
  const verifyMember = async () => {
    setLoading(true);
    setVerificationStatus(null);

    try {
      // Combine phone parts
      const phone = `${formData.phone.prefix}${formData.phone.middle}${formData.phone.last}`;
      // Combine email parts
      const email = `${formData.email.username}@${formData.email.domain}`;
      const name = formData.name;

      // Validate fields
      if (!phone || !email || !name) {
        alert('모든 필드를 입력해주세요');
        setLoading(false);
        return false;
      }

      const response = await fetch('/api/v1/auth/verify-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, email, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Member verified
        setVerificationStatus({ type: 'success', message: '회원 인증 성공' });
        return true;
      } else if (response.status === 404) {
        // ❌ Not a member
        setVerificationStatus({ 
          type: 'error', 
          message: '가입되어 있지 않습니다. 먼저 회원가입을 해주세요.' 
        });
        return false;
      } else if (response.status === 400) {
        // ❌ Info mismatch
        setVerificationStatus({ 
          type: 'error', 
          message: '입력하신 정보가 일치하지 않습니다. 다시 확인해주세요.' 
        });
        return false;
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus({ 
        type: 'error', 
        message: '인증 중 오류가 발생했습니다. 다시 시도해주세요.' 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify member first
    const isVerified = await verifyMember();

    if (isVerified) {
      // Proceed with inquiry submission
      await submitInquiry();
    }
  };

  const submitInquiry = async () => {
    // Your inquiry submission logic here
    try {
      const response = await fetch('/api/v1/public/inquiries/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('문의가 성공적으로 접수되었습니다');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Phone Input */}
      <div>
        <label>휴대전화번호</label>
        <select 
          value={formData.phone.prefix}
          onChange={(e) => setFormData({
            ...formData,
            phone: { ...formData.phone, prefix: e.target.value }
          })}
        >
          <option value="010">010</option>
          <option value="011">011</option>
          {/* ... other options */}
        </select>
        <input 
          type="text" 
          maxLength="4"
          value={formData.phone.middle}
          onChange={(e) => setFormData({
            ...formData,
            phone: { ...formData.phone, middle: e.target.value }
          })}
        />
        <input 
          type="text" 
          maxLength="4"
          value={formData.phone.last}
          onChange={(e) => setFormData({
            ...formData,
            phone: { ...formData.phone, last: e.target.value }
          })}
        />
      </div>

      {/* Email Input */}
      <div>
        <label>이메일</label>
        <input 
          type="text"
          value={formData.email.username}
          onChange={(e) => setFormData({
            ...formData,
            email: { ...formData.email, username: e.target.value }
          })}
        />
        <span>@</span>
        <select
          value={formData.email.domain}
          onChange={(e) => setFormData({
            ...formData,
            email: { ...formData.email, domain: e.target.value }
          })}
        >
          <option value="">선택</option>
          <option value="gmail.com">gmail.com</option>
          <option value="naver.com">naver.com</option>
          {/* ... other options */}
        </select>
      </div>

      {/* Name Input */}
      <div>
        <label>이름</label>
        <input 
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Verification Status Message */}
      {verificationStatus && (
        <div className={verificationStatus.type === 'success' ? 'success-message' : 'error-message'}>
          {verificationStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" disabled={loading}>
        {loading ? '확인 중...' : '문의 제출'}
      </button>
    </form>
  );
};

export default PersonalInquiryForm;
```

---

### 2. Axios Implementation

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
      return { 
        success: true, 
        message: '회원 인증 성공' 
      };
    }
  } catch (error) {
    if (error.response?.status === 404) {
      return { 
        success: false, 
        error: 'not_found',
        message: '가입되어 있지 않습니다' 
      };
    } else if (error.response?.status === 400) {
      return { 
        success: false, 
        error: 'mismatch',
        message: '일치하지 않습니다' 
      };
    }
    return { 
      success: false, 
      error: 'network',
      message: '인증 중 오류가 발생했습니다' 
    };
  }
};

// Usage
const handleFormSubmit = async (formData) => {
  const phone = `${formData.phone.prefix}${formData.phone.middle}${formData.phone.last}`;
  const email = `${formData.email.username}@${formData.email.domain}`;
  
  const result = await verifyMember(phone, email, formData.name);
  
  if (result.success) {
    // Proceed with inquiry submission
    submitInquiry(formData);
  } else {
    // Show error message
    alert(result.message);
  }
};
```

---

### 3. Separate Verification Button (Recommended UX)

```jsx
const PersonalInquiryFormWithVerify = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleVerifyClick = async () => {
    setVerifying(true);
    const phone = `${formData.phone.prefix}${formData.phone.middle}${formData.phone.last}`;
    const email = `${formData.email.username}@${formData.email.domain}`;
    
    const response = await fetch('/api/v1/auth/verify-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email, name: formData.name }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        alert('회원 인증이 완료되었습니다');
      }
    } else {
      const error = await response.json();
      alert(error.message);
    }
    setVerifying(false);
  };

  return (
    <form>
      {/* Form fields... */}
      
      {/* Verify Button */}
      <button 
        type="button" 
        onClick={handleVerifyClick}
        disabled={verifying || isVerified}
      >
        {isVerified ? '✅ 인증 완료' : verifying ? '확인 중...' : '회원 인증'}
      </button>

      {/* Submit Button - Disabled until verified */}
      <button 
        type="submit" 
        disabled={!isVerified}
      >
        문의 제출
      </button>
    </form>
  );
};
```

---

## 🎨 UI/UX Recommendations

### 1. **Two-Step Process (Recommended)**
```
Step 1: Fill form → Click "회원 인증" button → Show success/error
Step 2: If verified → Enable "문의 제출" button
```

### 2. **Automatic Verification on Submit**
```
Step 1: Fill form → Click "문의 제출"
Step 2: Auto-verify → If success, submit; if fail, show error
```

### 3. **Real-time Verification**
```
Verify as user fills form (on blur events)
Show green checkmark when verified
```

---

## 📱 Complete Form Example (Personal Inquiry)

```jsx
'use client';

import { useState } from 'react';
import styles from './PersonalInquiryForm.module.css';

export default function PersonalInquiryForm() {
  const [formData, setFormData] = useState({
    phone: { prefix: '010', middle: '', last: '' },
    email: { username: '', domain: 'gmail.com' },
    name: ''
  });
  
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Verify member
  const verifyMember = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const phone = `${formData.phone.prefix}${formData.phone.middle}${formData.phone.last}`;
    const email = `${formData.email.username}@${formData.email.domain}`;
    const { name } = formData;

    if (!phone || phone.length < 10 || !email || !name) {
      setMessage({ type: 'error', text: '모든 필드를 정확히 입력해주세요' });
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch('/api/v1/auth/verify-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsVerified(true);
        setMessage({ type: 'success', text: '✅ 회원 인증이 완료되었습니다' });
        return true;
      } else if (response.status === 404) {
        setMessage({ type: 'error', text: '가입되어 있지 않습니다. 먼저 회원가입을 해주세요.' });
      } else if (response.status === 400) {
        setMessage({ type: 'error', text: '입력하신 정보가 일치하지 않습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '인증 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Submit inquiry
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      const verified = await verifyMember();
      if (!verified) return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/public/inquiries/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ 문의가 접수되었습니다\n문의번호: ${data.inquiryId}`);
        // Reset form
        setFormData({
          phone: { prefix: '010', middle: '', last: '' },
          email: { username: '', domain: 'gmail.com' },
          name: ''
        });
        setIsVerified(false);
        setMessage({ type: '', text: '' });
      } else {
        const error = await response.json();
        alert(`❌ 오류: ${error.message}`);
      }
    } catch (error) {
      alert('제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>개인 문의</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Phone Number */}
        <div className={styles.formGroup}>
          <label>휴대전화번호 *</label>
          <div className={styles.phoneInput}>
            <select
              value={formData.phone.prefix}
              onChange={(e) => setFormData({
                ...formData,
                phone: { ...formData.phone, prefix: e.target.value }
              })}
              disabled={isVerified}
            >
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
              <option value="017">017</option>
              <option value="018">018</option>
              <option value="019">019</option>
            </select>
            <input
              type="text"
              maxLength="4"
              placeholder="1234"
              value={formData.phone.middle}
              onChange={(e) => setFormData({
                ...formData,
                phone: { ...formData.phone, middle: e.target.value.replace(/\D/g, '') }
              })}
              disabled={isVerified}
            />
            <input
              type="text"
              maxLength="4"
              placeholder="5678"
              value={formData.phone.last}
              onChange={(e) => setFormData({
                ...formData,
                phone: { ...formData.phone, last: e.target.value.replace(/\D/g, '') }
              })}
              disabled={isVerified}
            />
          </div>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label>이메일 *</label>
          <div className={styles.emailInput}>
            <input
              type="text"
              placeholder="example"
              value={formData.email.username}
              onChange={(e) => setFormData({
                ...formData,
                email: { ...formData.email, username: e.target.value }
              })}
              disabled={isVerified}
            />
            <span>@</span>
            <select
              value={formData.email.domain}
              onChange={(e) => setFormData({
                ...formData,
                email: { ...formData.email, domain: e.target.value }
              })}
              disabled={isVerified}
            >
              <option value="gmail.com">gmail.com</option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
              <option value="hanmail.net">hanmail.net</option>
              <option value="kakao.com">kakao.com</option>
            </select>
          </div>
        </div>

        {/* Name */}
        <div className={styles.formGroup}>
          <label>이름 *</label>
          <input
            type="text"
            placeholder="홍길동"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isVerified}
          />
        </div>

        {/* Verification Status */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          {!isVerified && (
            <button
              type="button"
              onClick={verifyMember}
              disabled={loading}
              className={styles.verifyButton}
            >
              {loading ? '확인 중...' : '회원 인증'}
            </button>
          )}
          
          <button
            type="submit"
            disabled={!isVerified || loading}
            className={styles.submitButton}
          >
            {loading ? '제출 중...' : '문의 제출'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## 🔍 Testing Checklist

- [ ] Test with valid member credentials → Should return 200
- [ ] Test with non-existent phone → Should return 404
- [ ] Test with wrong email → Should return 400
- [ ] Test with wrong name → Should return 400
- [ ] Test with missing fields → Should return 400
- [ ] Test phone with spaces/dashes (e.g., "010-1234-5678") → Should work
- [ ] Test email with different casing → Should work
- [ ] Test form submission flow end-to-end
- [ ] Check loading states and disabled buttons
- [ ] Verify error messages display correctly

---

## 🚨 Important Notes

1. **Restart Backend Server**: After adding this endpoint, make sure to restart your backend server for the route to be available.

2. **Phone Number Formats**: The API accepts various phone formats:
   - `"01012345678"` ✅
   - `"010-1234-5678"` ✅
   - `"010 1234 5678"` ✅

3. **Email Case**: Email comparison is case-insensitive:
   - `"User@Example.com"` === `"user@example.com"` ✅

4. **Name Matching**: Name must match either:
   - `fullName` field in User model
   - `username` field in User model

5. **No Rate Limiting**: Currently no rate limiting on this endpoint. Consider adding it in production.

---

## 🔗 Related APIs

- `POST /api/v1/public/inquiries/personal` - Submit personal inquiry
- `POST /api/v1/public/inquiries/corporate` - Submit corporate inquiry
- `POST /api/v1/auth/register` - Register new member

---

## 📞 Support

If you encounter any issues, please:
1. Check that your backend server is running
2. Verify the endpoint URL is correct
3. Check browser console for errors
4. Review request/response in Network tab

For backend issues, contact the backend team or check `backend/MEMBER_VERIFICATION_API.md` for technical details.

---

## ✅ Implementation Summary

1. **Add API call** to your inquiry form
2. **Verify member** before submission (either on button click or form submit)
3. **Handle responses** (200, 404, 400)
4. **Show appropriate messages** in Korean
5. **Disable/enable** submit button based on verification status
6. **Test thoroughly** with different scenarios

**You're all set!** 🎉

