# 🎯 Frontend Enquiry Integration Guide

## ❌ Problem

Getting validation errors when submitting enquiry from frontend:

```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    "Name is required",
    "Email is required",
    "Phone is required",
    ...
  ]
}
```

---

## ✅ Solution

The backend expects **JSON format**, not FormData. Follow this exact implementation:

---

## 📋 Required Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | ✅ Yes | 2-100 characters |
| `email` | string | ✅ Yes | Valid email format |
| `phone` | string | ✅ Yes | Korean (01012345678) or Indian (917879973266) |
| `category` | string | ✅ Yes | See enum below |
| `subject` | string | ✅ Yes | Max 200 characters |
| `message` | string | ✅ Yes | 10-2000 characters |
| `agreeToTerms` | boolean | ✅ Yes | Must be `true` |
| `company` | string | ❌ No | Max 200 characters |
| `countryCode` | string | ❌ No | Default: "82" |
| `attachmentUrl` | string | ❌ No | Upload file first, then use URL |
| `attachmentOriginalName` | string | ❌ No | Original filename |

---

## 🎨 Category Enum (Use English Keys!)

```javascript
// ❌ WRONG - Don't send Korean
const category = "일반문의";

// ✅ CORRECT - Send English enum
const category = "General Question";
```

**Valid Categories:**

| English (Send This) | Korean (Display) |
|---------------------|------------------|
| `"General Question"` | 일반문의 |
| `"Technical Support"` | 기술지원 |
| `"Program Inquiry"` | 프로그램문의 |
| `"Payment Issue"` | 결제문제 |
| `"Partnership"` | 제휴문의 |
| `"Other"` | 기타 |

---

## 🚀 Complete Frontend Implementation

### **1. React/Next.js Example**

```typescript
// services/enquiry.service.ts

interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  countryCode?: string;
  category: string;
  subject: string;
  message: string;
  attachmentUrl?: string;
  attachmentOriginalName?: string;
  agreeToTerms: boolean;
}

export const submitEnquiry = async (data: EnquiryFormData) => {
  try {
    const response = await fetch('https://class-crew.onrender.com/api/v1/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // ⚠️ MUST be application/json
        // Optional: Include auth token if user is logged in
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || '',
        countryCode: data.countryCode || '82',
        category: data.category,  // ⚠️ Must be English enum value
        subject: data.subject,
        message: data.message,
        agreeToTerms: data.agreeToTerms,  // ⚠️ Must be boolean true
        attachmentUrl: data.attachmentUrl || '',
        attachmentOriginalName: data.attachmentOriginalName || '',
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit enquiry');
    }

    return result;
  } catch (error) {
    console.error('Enquiry submission error:', error);
    throw error;
  }
};
```

---

### **2. React Component Example**

```typescript
// components/EnquiryForm.tsx

import { useState } from 'react';
import { submitEnquiry } from '@/services/enquiry.service';

// Category mapping for UI
const CATEGORY_MAP = {
  '일반문의': 'General Question',
  '기술지원': 'Technical Support',
  '프로그램문의': 'Program Inquiry',
  '결제문제': 'Payment Issue',
  '제휴문의': 'Partnership',
  '기타': 'Other',
};

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    subject: '',
    message: '',
    agreeToTerms: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // ⚠️ Convert Korean category to English enum
      const categoryEnglish = CATEGORY_MAP[formData.category as keyof typeof CATEGORY_MAP];
      
      if (!categoryEnglish) {
        throw new Error('Invalid category selected');
      }

      // ⚠️ Validate required fields
      if (!formData.name || !formData.email || !formData.phone || 
          !formData.category || !formData.subject || !formData.message) {
        throw new Error('모든 필수 항목을 입력해주세요.');
      }

      if (!formData.agreeToTerms) {
        throw new Error('개인정보 수집 및 이용에 동의해주세요.');
      }

      // ⚠️ Send with English category
      const result = await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        category: categoryEnglish,  // ✅ English enum
        subject: formData.subject,
        message: formData.message,
        agreeToTerms: formData.agreeToTerms,  // ✅ Boolean
      });

      setSuccess(`문의가 접수되었습니다. 티켓번호: ${result.data.ticketNumber}`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        category: '',
        subject: '',
        message: '',
        agreeToTerms: false,
      });

    } catch (err: any) {
      setError(err.message || '문의 접수에 실패했습니다.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="이름*"
        required
      />

      {/* Email */}
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="이메일*"
        required
      />

      {/* Phone */}
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="휴대전화* (01012345678)"
        required
      />

      {/* Company (Optional) */}
      <input
        type="text"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        placeholder="회사명 (선택)"
      />

      {/* Category - Display Korean, send English */}
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">문의 유형 선택*</option>
        <option value="일반문의">일반문의</option>
        <option value="기술지원">기술지원</option>
        <option value="프로그램문의">프로그램문의</option>
        <option value="결제문제">결제문제</option>
        <option value="제휴문의">제휴문의</option>
        <option value="기타">기타</option>
      </select>

      {/* Subject */}
      <input
        type="text"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        placeholder="제목* (최대 200자)"
        maxLength={200}
        required
      />

      {/* Message */}
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="문의 내용* (최소 10자, 최대 2000자)"
        minLength={10}
        maxLength={2000}
        required
      />

      {/* Terms Agreement */}
      <label>
        <input
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
          required
        />
        개인정보 수집 및 이용에 동의합니다*
      </label>

      {/* Error Message */}
      {error && <div className="error">{error}</div>}

      {/* Success Message */}
      {success && <div className="success">{success}</div>}

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '접수 중...' : '문의하기'}
      </button>
    </form>
  );
}
```

---

### **3. Axios Example**

```javascript
// Using Axios
import axios from 'axios';

const submitEnquiry = async (formData) => {
  try {
    const response = await axios.post(
      'https://class-crew.onrender.com/api/v1/enquiries',
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || '',
        countryCode: '82',
        category: convertCategoryToEnglish(formData.category),  // ⚠️ Convert to English
        subject: formData.subject,
        message: formData.message,
        agreeToTerms: formData.agreeToTerms,
      },
      {
        headers: {
          'Content-Type': 'application/json',  // ⚠️ JSON, not FormData
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data);
    throw error;
  }
};

// Helper function
const convertCategoryToEnglish = (korean) => {
  const map = {
    '일반문의': 'General Question',
    '기술지원': 'Technical Support',
    '프로그램문의': 'Program Inquiry',
    '결제문제': 'Payment Issue',
    '제휴문의': 'Partnership',
    '기타': 'Other',
  };
  return map[korean] || 'General Question';
};
```

---

## 🔄 With File Upload (2-Step Process)

If user uploads a file, follow this workflow:

### **Step 1: Upload File First**

```javascript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'enquiries');

  const response = await fetch(
    'https://class-crew.onrender.com/api/v1/admin/uploads/single',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,  // ⚠️ Requires admin token
      },
      body: formData,  // ⚠️ FormData only for file upload
    }
  );

  const result = await response.json();
  return result.data.url;  // e.g., "/uploads/enquiries/file-123.pdf"
};
```

### **Step 2: Submit Enquiry with File URL**

```javascript
const handleSubmitWithFile = async (formData, file) => {
  let attachmentUrl = '';
  let attachmentOriginalName = '';

  // Upload file first if exists
  if (file) {
    attachmentUrl = await uploadFile(file);
    attachmentOriginalName = file.name;
  }

  // Then submit enquiry with file URL
  const result = await submitEnquiry({
    ...formData,
    attachmentUrl,
    attachmentOriginalName,
  });

  return result;
};
```

---

## 🧪 Test Your Request

### **cURL Example (Copy & Paste to Terminal)**

```bash
curl -X POST https://class-crew.onrender.com/api/v1/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "email": "test@example.com",
    "phone": "01012345678",
    "company": "테스트 회사",
    "category": "General Question",
    "subject": "테스트 문의",
    "message": "이것은 테스트 문의입니다. 최소 10자 이상 작성해야 합니다.",
    "agreeToTerms": true
  }'
```

### **Expected Success Response**

```json
{
  "success": true,
  "message": "Enquiry submitted successfully",
  "data": {
    "_id": "673a1b2c3d4e5f6g7h8i9j0k",
    "ticketNumber": "ENQ-2025-000123",
    "name": "홍길동",
    "email": "test@example.com",
    "phone": "01012345678",
    "company": "테스트 회사",
    "countryCode": "82",
    "category": "General Question",
    "subject": "테스트 문의",
    "message": "이것은 테스트 문의입니다...",
    "status": "pending",
    "priority": "medium",
    "agreeToTerms": true,
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2025-11-12T10:30:00.000Z",
    "updatedAt": "2025-11-12T10:30:00.000Z"
  }
}
```

---

## ❌ Common Mistakes

### **1. Sending FormData instead of JSON**

```javascript
// ❌ WRONG
const formData = new FormData();
formData.append('name', 'John');
formData.append('email', 'john@example.com');
fetch(url, {
  method: 'POST',
  body: formData  // ❌ Backend expects JSON!
});

// ✅ CORRECT
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    // ...
  })
});
```

### **2. Sending Korean category**

```javascript
// ❌ WRONG
category: "일반문의"

// ✅ CORRECT
category: "General Question"
```

### **3. agreeToTerms as string**

```javascript
// ❌ WRONG
agreeToTerms: "true"  // String

// ✅ CORRECT
agreeToTerms: true    // Boolean
```

### **4. Missing required fields**

```javascript
// ❌ WRONG - Missing fields
{
  name: "John",
  email: "john@example.com"
  // Missing: phone, category, subject, message, agreeToTerms
}

// ✅ CORRECT - All required fields
{
  name: "John",
  email: "john@example.com",
  phone: "01012345678",
  category: "General Question",
  subject: "My question",
  message: "This is my detailed message with more than 10 characters.",
  agreeToTerms: true
}
```

---

## 🔍 Debugging Checklist

- [ ] Using `Content-Type: application/json` header
- [ ] Sending data as JSON string (`JSON.stringify()`)
- [ ] Category is English enum, not Korean
- [ ] `agreeToTerms` is boolean `true`, not string
- [ ] All required fields are present
- [ ] Phone number matches format (Korean or Indian)
- [ ] Email is valid format
- [ ] Subject is max 200 characters
- [ ] Message is 10-2000 characters
- [ ] If file upload: upload file first, then use URL

---

## 📞 Need Help?

**Check these files:**
- API Docs: `backend/CUSTOMER_SERVICE_CENTER_API.md`
- Postman: `backend/postman/Customer-Service-Center-API.postman_collection.json`
- Validator: `backend/src/validators/inquiry.validators.js`

**Test with Postman first:**
1. Import collection
2. Run "4. Enquiry Management → Create Enquiry (Public)"
3. Verify response
4. Copy working request to frontend

---

**Problem Solved! ✅**

The key points:
1. ⚠️ Send **JSON**, not FormData
2. ⚠️ Use **English category** enum
3. ⚠️ `agreeToTerms` must be **boolean** `true`
4. ⚠️ Include **all required fields**

