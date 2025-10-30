# 🎓 Applicant Module - API Integration Guide

## Base URL
```
/api/applicants
```

## 📋 Overview
Manages course applications submitted by users.

## 🔗 Relationships
- **Applicant** → **User** (N:1): Many applications from one user
- **Applicant** → **Course** (N:1): Many applications for one course

## 🎯 API Endpoints

### 1. Get All Applicants (Admin)
```http
GET /api/applicants
```

**Query Parameters:**
- `course`: Filter by course ID
- `status`: Filter by status (pending, approved, rejected)
- `page`, `limit`: Pagination

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "app123",
      "course": {
        "_id": "course123",
        "title": "Web Development"
      },
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "education": "Bachelor's in CS",
      "experience": "2 years",
      "motivation": "Want to learn web dev",
      "status": "pending",
      "appliedAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

### 2. Get Single Applicant
```http
GET /api/applicants/:id
```

### 3. Create Application
```http
POST /api/applicants
Headers: Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "course": "course123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "education": "Bachelor's in Computer Science",
  "experience": "2 years in web development",
  "motivation": "I want to enhance my skills"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    // Created application
  }
}
```

### 4. Update Application (Admin)
```http
PUT /api/applicants/:id
```

**Request Body:**
```json
{
  "status": "approved"
}
```

### 5. Delete Application (Admin)
```http
DELETE /api/applicants/:id
```

### 6. Export Applicants (Admin)
```http
GET /api/applicants/export
```

**Response:** CSV file download

## 💻 React Example

```javascript
const ApplyForm = ({ courseId }) => {
  const [formData, setFormData] = useState({
    course: courseId,
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    motivation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/applicants',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Application submitted successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Education"
        value={formData.education}
        onChange={(e) => setFormData({...formData, education: e.target.value})}
      />
      <textarea
        placeholder="Experience"
        value={formData.experience}
        onChange={(e) => setFormData({...formData, experience: e.target.value})}
      />
      <textarea
        placeholder="Why do you want to join this course?"
        value={formData.motivation}
        onChange={(e) => setFormData({...formData, motivation: e.target.value})}
        required
      />
      <button type="submit">Submit Application</button>
    </form>
  );
};
```

**Related Modules:** Course, User

