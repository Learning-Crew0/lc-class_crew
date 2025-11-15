# 📝 Inquiry Categories Update - Documentation

**Date:** November 15, 2025  
**Status:** ✅ **TESTED & WORKING**

---

## ✅ What Changed

Updated the Inquiry model category enum to match the new frontend requirements.

### Old Categories (REMOVED):
- ❌ General Question
- ❌ Technical Support
- ❌ Payment Issue
- ❌ Partnership

### New Categories (ACTIVE):
1. ✅ **Program Inquiry** (프로그램)
2. ✅ **Registration/Payment** (교육신청/결제)
3. ✅ **Certificate** (수료증)
4. ✅ **Group Registration** (단체수강)
5. ✅ **Partnership/Instructor** (제휴/강사 신청)
6. ✅ **Venue Rental** (대관)
7. ✅ **Other** (기타)

---

## 🔧 Backend Changes Made

### 1. Updated Inquiry Model
**File:** `backend/src/models/inquiry.model.js`

```javascript
category: {
    type: String,
    required: function () {
        return this.type === "general";
    },
    enum: [
        "Program Inquiry",
        "Registration/Payment",
        "Certificate",
        "Group Registration",
        "Partnership/Instructor",
        "Venue Rental",
        "Other",
    ],
}
```

### 2. Updated Validators
**File:** `backend/src/validators/inquiry.validators.js`

```javascript
category: Joi.string()
    .valid(
        "Program Inquiry",
        "Registration/Payment",
        "Certificate",
        "Group Registration",
        "Partnership/Instructor",
        "Venue Rental",
        "Other"
    )
    .required()
    .messages({
        "any.only": "Category must be one of: Program Inquiry, Registration/Payment, Certificate, Group Registration, Partnership/Instructor, Venue Rental, Other",
        "any.required": "Category is required",
    })
```

---

## 🧪 Test Results

All 7 categories tested and working! ✅

```
✅ Program Inquiry - PASS
✅ Registration/Payment - PASS
✅ Certificate - PASS
✅ Group Registration - PASS
✅ Partnership/Instructor - PASS
✅ Venue Rental - PASS
✅ Other - PASS
```

---

## 🎨 Frontend Integration

### Category Mapping (Korean → English)

Your frontend code already has the correct mapping! Just keep using it:

```javascript
const categoryMap = {
    "프로그램": "Program Inquiry",
    "교육신청/결제": "Registration/Payment",
    "수료증": "Certificate",
    "단체수강": "Group Registration",
    "제휴/강사 신청": "Partnership/Instructor",
    "대관": "Venue Rental",
    "기타": "Other",
};
```

### Dropdown Options (Frontend)

```jsx
<select name="category" value={formData.category} onChange={handleChange}>
    <option value="">선택하세요</option>
    <option value="프로그램">프로그램</option>
    <option value="교육신청/결제">교육신청/결제</option>
    <option value="수료증">수료증</option>
    <option value="단체수강">단체수강</option>
    <option value="제휴/강사 신청">제휴/강사 신청</option>
    <option value="대관">대관</option>
    <option value="기타">기타</option>
</select>
```

### API Request Example

```javascript
const submitData = {
    name: "홍길동",
    email: "user@example.com",
    phone: "01012345678",
    category: categoryMap[formData.category], // Maps Korean to English
    subject: "문의 제목",
    message: "문의 내용입니다. (최소 10자)",
    agreeToTerms: true,
    company: "테스트 회사", // Optional
    countryCode: "82",
};

const response = await fetch('https://class-crew.onrender.com/api/v1/public/inquiries', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(submitData),
});
```

---

## 📊 API Endpoint

**Endpoint:** `POST /api/v1/public/inquiries`

**Required Fields:**
- `name` (string, 2-100 chars)
- `email` (valid email format)
- `phone` (valid phone format: 01012345678)
- `category` (one of the 7 English values)
- `subject` (string, max 200 chars)
- `message` (string, 10-2000 chars)
- `agreeToTerms` (boolean, must be true)

**Optional Fields:**
- `company` (string, max 200 chars)
- `countryCode` (string, default: "82")

---

## ✅ Validation Rules

### Category
- Must be one of: `Program Inquiry`, `Registration/Payment`, `Certificate`, `Group Registration`, `Partnership/Instructor`, `Venue Rental`, `Other`
- Case-sensitive
- Required field

### Other Validations (Same as Before)
- **Name:** 2-100 characters
- **Email:** Valid email format
- **Phone:** Valid format (01012345678)
- **Subject:** Max 200 characters
- **Message:** 10-2000 characters
- **Company:** Max 200 characters (optional)
- **agreeToTerms:** Must be `true` (boolean)

---

## 🧪 Testing Your Frontend

### Test with cURL:

```bash
curl -X POST https://class-crew.onrender.com/api/v1/public/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트 사용자",
    "email": "test@example.com",
    "phone": "01012345678",
    "category": "Program Inquiry",
    "subject": "프로그램 문의",
    "message": "테스트 문의 내용입니다. 최소 10자 이상 작성.",
    "agreeToTerms": true
  }'
```

### Expected Success Response:

```json
{
  "status": "success",
  "message": "문의가 성공적으로 접수되었습니다",
  "data": {
    "inquiry": {
      "_id": "...",
      "ticketNumber": "INQ-20251115-001",
      "name": "테스트 사용자",
      "email": "test@example.com",
      "phone": "01012345678",
      "category": "Program Inquiry",
      "subject": "프로그램 문의",
      "message": "테스트 문의 내용입니다. 최소 10자 이상 작성.",
      "status": "pending",
      "createdAt": "2025-11-15T..."
    }
  }
}
```

### Expected Error Response (Invalid Category):

```json
{
  "status": "error",
  "message": "Category must be one of: Program Inquiry, Registration/Payment, Certificate, Group Registration, Partnership/Instructor, Venue Rental, Other"
}
```

---

## 📝 Frontend Checklist

- [x] Update category dropdown options (you already have this!)
- [x] Use `categoryMap` to convert Korean to English
- [x] Send English category value to API
- [x] Handle validation errors
- [x] Show success message on submission
- [x] Reset form after successful submission

---

## 🚀 Ready for Production!

The backend is updated, tested, and ready. Your frontend code already has the correct mapping, so it should work seamlessly!

**Backend Status:** ✅ Running  
**All Categories:** ✅ Tested & Working  
**API Endpoint:** ✅ Ready

---

## 📞 Admin Panel Notes

If you have an admin panel for managing inquiries, update the category filter dropdown to show the new 7 categories:

```javascript
const INQUIRY_CATEGORIES = [
    { value: "Program Inquiry", label: "프로그램" },
    { value: "Registration/Payment", label: "교육신청/결제" },
    { value: "Certificate", label: "수료증" },
    { value: "Group Registration", label: "단체수강" },
    { value: "Partnership/Instructor", label: "제휴/강사 신청" },
    { value: "Venue Rental", label: "대관" },
    { value: "Other", label: "기타" },
];
```

---

**Last Updated:** November 15, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready

