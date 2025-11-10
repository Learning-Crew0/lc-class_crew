# 🛒 Shopping Cart & Class Application System

## Overview

This document describes the complete shopping cart → class application flow with support for multiple courses and bulk participant management.

---

## 🎯 User Flow

### 1. Browse Courses
User browses courses on the course details page and selects a training schedule.

### 2. Add to Shopping Cart
User clicks "CLASS 신청하기" button → Course is added to cart with selected schedule.

**API:** `POST /api/v1/cart/courses`

```json
{
  "courseId": "673abc123def...",
  "scheduleId": "673xyz789ghi..."
}
```

### 3. Shopping Cart Page
User can:
- View all courses/products in cart
- See prices, discounts, and final totals
- Remove items
- Select multiple items for checkout

**API:** `GET /api/v1/cart`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cart123",
    "user": "user123",
    "items": [
      {
        "itemType": "course",
        "course": {
          "_id": "course123",
          "title": "핵심을잡는말과글, 비즈니스문해력 Level Up"
        },
        "schedule": {
          "_id": "schedule123",
          "scheduleName": "2025.07.10~2025.07.13",
          "startDate": "2025-07-10",
          "endDate": "2025-07-13"
        },
        "quantity": 1,
        "price": 150000,
        "discountAmount": 15000,
        "finalPrice": 135000
      }
    ],
    "totalItems": 1,
    "subtotal": 135000
  }
}
```

### 4. Proceed to Class Application
When user clicks "신청하기" (Apply), they're taken to the class application form.

The system automatically:
- Loads all courses from cart
- Prefills applicant information if profile exists
- Shows total pricing

---

## 👥 Participant Management

### Option 1: Up to 5 Students (Manual Entry)

User can manually add up to 5 participants using individual forms.

**Form Fields per Participant:**
- Name (required)
- Email (required)
- Phone (required)
- Department (optional)
- Position (optional)

### Option 2: More than 5 Students (Excel Upload)

For 5+ students, user must:

1. **Download Excel Template**

**API:** `GET /api/v1/class-applications/participants-template`

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "participants_template.xlsx",
    "headers": ["Name", "Email", "Phone", "Department", "Position"],
    "sampleData": [
      {
        "Name": "John Doe",
        "Email": "john@example.com",
        "Phone": "01012345678",
        "Department": "IT Department",
        "Position": "Developer"
      }
    ],
    "instructions": [
      "Fill in participant information row by row",
      "Name, Email, and Phone are required fields",
      "Phone should be 11 digits (e.g., 01012345678)",
      "Email should be valid format (e.g., name@domain.com)",
      "Department and Position are optional",
      "You can add as many rows as needed"
    ]
  }
}
```

2. **Fill Excel File**
   - Add all participant information
   - Ensure required fields are filled

3. **Upload Excel File**

**API:** `POST /api/v1/class-applications` (with file upload)

**Form Data:**
- `participantsFile`: Excel file (`.xls`, `.xlsx`, `.csv`)
- All other application fields

---

## 📝 Class Application Creation

### From Cart (Multiple Courses)

**API:** `POST /api/v1/class-applications`

**Request (Form Data):**
```
Content-Type: multipart/form-data

fromCart: true
applicantName: "홍길동"
email: "hong@example.com"
phone: "01012345678"
organization: "ABC Company"
department: "IT Department"
position: "Manager"
memberType: "corporate_trainer"
numberOfParticipants: 3 (or omit if using Excel)
participants[0][name]: "참가자1"
participants[0][email]: "p1@example.com"
participants[0][phone]: "01011112222"
participants[1][name]: "참가자2"
participants[1][email]: "p2@example.com"
participants[1][phone]: "01033334444"
participants[2][name]: "참가자3"
participants[2][email]: "p3@example.com"
participants[2][phone]: "01055556666"
participantsFile: [Excel file] (if 5+ participants)
expectedPaymentMethod: "card_payment"
paymentType: "corporate"
billingInfo[companyRegistrationNumber]: "1234567890"
billingInfo[representativeName]: "대표자명"
billingInfo[representativePhone]: "01087654321"
billingInfo[representativeEmail]: "rep@company.com"
applicationPurpose: "직원 역량 강화"
specialRequests: "점심 채식 옵션 필요"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "app123",
    "applicationNumber": "APP-20250110-00001",
    "userId": "user123",
    "applicantProfile": "profile123",
    "applicantName": "홍길동",
    "email": "hong@example.com",
    "phone": "01012345678",
    "organization": "ABC Company",
    "memberType": "corporate_trainer",
    "courses": [
      {
        "course": "course123",
        "schedule": "schedule123",
        "courseName": "핵심을잡는말과글",
        "scheduleDate": "2025-07-10~2025-07-13",
        "price": 150000,
        "discountAmount": 15000,
        "finalPrice": 135000
      },
      {
        "course": "course456",
        "schedule": "schedule456",
        "courseName": "리더십 과정",
        "scheduleDate": "2025-08-01~2025-08-05",
        "price": 200000,
        "discountAmount": 20000,
        "finalPrice": 180000
      }
    ],
    "numberOfParticipants": 3,
    "participants": [
      {
        "name": "참가자1",
        "email": "p1@example.com",
        "phone": "01011112222"
      },
      {
        "name": "참가자2",
        "email": "p2@example.com",
        "phone": "01033334444"
      },
      {
        "name": "참가자3",
        "email": "p3@example.com",
        "phone": "01055556666"
      }
    ],
    "hasBulkParticipants": false,
    "totalPrice": 350000,
    "totalDiscount": 35000,
    "finalTotalPrice": 315000,
    "status": "pending",
    "createdAt": "2025-01-10T10:30:00.000Z"
  },
  "message": "Class application submitted successfully"
}
```

---

## 🔄 Applicant Profile Auto-Storage

When a user submits a class application, their information is automatically saved to an **Applicant Profile**.

### Benefits:
1. **Auto-fill on Next Application**: Information is pre-filled when applying for another course
2. **Consistent Data**: Maintains user's latest contact and organization info
3. **Statistics**: Tracks total applications per user

### Get Applicant Profile

**API:** `GET /api/v1/applicant-profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "profile123",
    "user": "user123",
    "applicantName": "홍길동",
    "email": "hong@example.com",
    "phone": "01012345678",
    "organization": "ABC Company",
    "department": "IT Department",
    "position": "Manager",
    "memberType": "corporate_trainer",
    "preferredPaymentMethod": "card_payment",
    "paymentType": "corporate",
    "billingInfo": {
      "companyRegistrationNumber": "1234567890",
      "representativeName": "대표자명"
    },
    "totalApplications": 5,
    "lastUsed": "2025-01-10T10:30:00.000Z"
  }
}
```

### Update Applicant Profile

**API:** `PUT /api/v1/applicant-profile`

**Request:**
```json
{
  "phone": "01099998888",
  "department": "New Department"
}
```

---

## 🛒 Shopping Cart APIs

### Add Course to Cart

**Endpoint:** `POST /api/v1/cart/courses`

**Auth:** Required

**Request:**
```json
{
  "courseId": "673abc123...",
  "scheduleId": "673xyz789..."
}
```

### Add Product to Cart

**Endpoint:** `POST /api/v1/cart/products`

**Auth:** Required

**Request:**
```json
{
  "productId": "673prod123...",
  "quantity": 2
}
```

### Get Cart

**Endpoint:** `GET /api/v1/cart`

**Auth:** Required

### Get Only Courses from Cart

**Endpoint:** `GET /api/v1/cart/courses`

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "itemType": "course",
      "course": { ... },
      "schedule": { ... },
      "price": 150000,
      "finalPrice": 135000
    }
  ]
}
```

### Update Product Quantity

**Endpoint:** `PATCH /api/v1/cart/items`

**Auth:** Required

**Request:**
```json
{
  "itemType": "product",
  "itemId": "product123",
  "quantity": 3
}
```

**Note:** Cannot update quantity for courses (always 1).

### Remove Item from Cart

**Endpoint:** `DELETE /api/v1/cart/items`

**Auth:** Required

**Request:**
```json
{
  "itemType": "course",
  "itemId": "course123",
  "scheduleId": "schedule123"
}
```

### Clear Cart

**Endpoint:** `DELETE /api/v1/cart/clear`

**Auth:** Required

### Clear Only Course Items

**Endpoint:** `DELETE /api/v1/cart/clear-courses`

**Auth:** Required

---

## 📊 Database Models

### Cart Model

```javascript
{
  user: ObjectId (ref: User, unique),
  items: [
    {
      itemType: "course" | "product",
      course: ObjectId (ref: Course),
      schedule: ObjectId (ref: TrainingSchedule),
      product: ObjectId (ref: Product),
      quantity: Number,
      price: Number,
      discountAmount: Number,
      finalPrice: Number,
      addedAt: Date
    }
  ],
  lastUpdated: Date
}
```

### ApplicantProfile Model

```javascript
{
  user: ObjectId (ref: User, unique),
  applicantName: String (required),
  email: String (required),
  phone: String (required),
  organization: String,
  department: String,
  position: String,
  memberType: "individual" | "corporate_trainer" | "employee" | "job_seeker",
  preferredPaymentMethod: String,
  paymentType: "personal" | "corporate",
  billingInfo: {
    companyRegistrationNumber: String,
    representativeName: String,
    representativePhone: String,
    representativeEmail: String,
    billingAddress: String
  },
  totalApplications: Number,
  lastUsed: Date
}
```

### ClassApplication Model (Updated)

```javascript
{
  userId: ObjectId (ref: User),
  applicantProfile: ObjectId (ref: ApplicantProfile),
  applicantName: String (required),
  email: String (required),
  phone: String (required),
  organization: String,
  department: String,
  position: String,
  memberType: String (required),
  
  // Multiple courses support
  courses: [
    {
      course: ObjectId (ref: Course, required),
      schedule: ObjectId (ref: TrainingSchedule, required),
      courseName: String,
      scheduleDate: String,
      price: Number (required),
      discountAmount: Number,
      finalPrice: Number (required)
    }
  ],
  
  // Backward compatibility
  courseId: ObjectId (ref: Course),
  scheduleId: ObjectId (ref: TrainingSchedule),
  courseName: String,
  scheduleDate: String,
  
  // Participants (up to 5)
  numberOfParticipants: Number (min: 1, max: 5),
  participants: [
    {
      name: String (required),
      email: String (required),
      phone: String (required),
      department: String,
      position: String
    }
  ],
  
  // Bulk participants (5+)
  bulkParticipantsFile: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
  hasBulkParticipants: Boolean,
  
  // Pricing
  totalPrice: Number,
  totalDiscount: Number,
  finalTotalPrice: Number,
  
  // Payment
  expectedPaymentMethod: String,
  paymentType: "personal" | "corporate",
  billingInfo: {
    companyRegistrationNumber: String,
    representativeName: String,
    representativePhone: String,
    representativeEmail: String,
    billingAddress: String
  },
  
  // Status & Review
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled",
  applicationNumber: String (unique),
  reviewedBy: ObjectId (ref: Admin),
  reviewedAt: Date,
  reviewNotes: String,
  rejectionReason: String,
  
  // Linked data
  enrollmentId: ObjectId (ref: Enrollment),
  orderId: String,
  expiresAt: Date
}
```

---

## 🎨 Frontend Integration

### 1. Course Details Page

```javascript
// Add to Cart Button
const handleAddToCart = async () => {
  try {
    const response = await fetch('/api/v1/cart/courses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        courseId: course._id,
        scheduleId: selectedSchedule._id
      })
    });
    
    if (response.ok) {
      // Redirect to cart or show success message
      navigate('/cart');
    }
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};
```

### 2. Shopping Cart Page

```javascript
// Fetch Cart
const fetchCart = async () => {
  const response = await fetch('/api/v1/cart', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  setCart(data.data);
};

// Proceed to Checkout
const handleCheckout = () => {
  navigate('/class-applications/new?fromCart=true');
};
```

### 3. Class Application Form

```javascript
// Fetch Applicant Profile
const fetchProfile = async () => {
  try {
    const response = await fetch('/api/v1/applicant-profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (data.success) {
      // Prefill form with profile data
      setFormData({
        applicantName: data.data.applicantName,
        email: data.data.email,
        phone: data.data.phone,
        organization: data.data.organization,
        // ... etc
      });
    }
  } catch (error) {
    // Profile doesn't exist, user is first-time applicant
    console.log('No existing profile');
  }
};

// Handle Participant Management
const [participants, setParticipants] = useState([]);
const [excelFile, setExcelFile] = useState(null);

const handleAddParticipant = () => {
  if (participants.length < 5) {
    setParticipants([...participants, { name: '', email: '', phone: '' }]);
  } else {
    alert('최대 5명까지 추가 가능합니다. 더 많은 참가자는 Excel 파일로 업로드해주세요.');
  }
};

const handleDownloadTemplate = async () => {
  const response = await fetch('/api/v1/class-applications/participants-template');
  const data = await response.json();
  // Generate and download Excel file based on template data
};

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setExcelFile(file);
    setParticipants([]); // Clear manual entries
  }
};

// Submit Application
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('fromCart', 'true');
  formData.append('applicantName', applicantName);
  formData.append('email', email);
  formData.append('phone', phone);
  // ... other fields
  
  if (excelFile) {
    formData.append('participantsFile', excelFile);
  } else {
    participants.forEach((p, index) => {
      formData.append(`participants[${index}][name]`, p.name);
      formData.append(`participants[${index}][email]`, p.email);
      formData.append(`participants[${index}][phone]`, p.phone);
    });
  }
  
  const response = await fetch('/api/v1/class-applications', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (response.ok) {
    navigate('/class-applications/success');
  }
};
```

---

## ✅ Testing

### Test Flow

1. **Login as user**
2. **Add courses to cart:**
   - Browse course → Select schedule → Add to cart
   - Repeat for multiple courses
3. **View cart:**
   - Verify all courses are listed
   - Check pricing calculations
4. **Proceed to class application:**
   - Verify courses are pre-loaded
   - Check if profile info is pre-filled (if exists)
5. **Add participants (test both methods):**
   - Manual: Add 3 participants
   - Excel: Download template, fill, upload
6. **Submit application:**
   - Verify application created successfully
   - Check that cart courses are cleared
   - Verify applicant profile is created/updated
7. **Apply for another course:**
   - Verify profile info is auto-filled

---

## 🔐 Security Notes

1. **Authentication Required:**
   - All cart operations require authentication
   - Class application can be submitted without auth (for public users)

2. **File Upload Validation:**
   - Only `.xls`, `.xlsx`, `.csv` files allowed
   - Maximum file size: 5MB
   - Files stored in `/var/data/files/applications` (production)

3. **Data Validation:**
   - Phone: 11 digits
   - Email: Valid format
   - Participants: Required fields validated

---

## 🚀 Deployment Notes

**File Storage:**
- Development: `backend/uploads/applications/`
- Production: `/var/data/files/applications/`

**Environment Variables:**
```
NODE_ENV=production
```

**Mounted Disk (Render):**
Ensure `/var/data/files` is mounted and has write permissions.

---

## 📖 Summary

This system provides a complete e-commerce-style flow for course enrollment:

1. ✅ Browse courses
2. ✅ Add multiple courses to cart
3. ✅ Proceed to unified checkout/application
4. ✅ Manage participants (up to 5 manual, or bulk Excel)
5. ✅ Auto-save applicant profile for future applications
6. ✅ Clear cart after successful application

All features are production-ready and fully integrated! 🎉



