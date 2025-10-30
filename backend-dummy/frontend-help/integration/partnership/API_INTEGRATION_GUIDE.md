# 🤝 Partnership Module - API Integration Guide

## Base URL
```
/api/partnerships
```

## 📋 Overview
Manages partnership and collaboration opportunities.

## 🎯 API Endpoints

### 1. Get All Partnerships
```http
GET /api/partnerships
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "partner123",
      "organizationName": "Tech Company Inc",
      "contactPerson": "Jane Smith",
      "email": "jane@techcompany.com",
      "phone": "1234567890",
      "partnershipType": "corporate",
      "description": "Looking for training programs",
      "status": "pending",
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

### 2. Get Single Partnership
```http
GET /api/partnerships/:id
```

### 3. Create Partnership Request
```http
POST /api/partnerships
```

**Request Body:**
```json
{
  "organizationName": "Tech Company Inc",
  "contactPerson": "Jane Smith",
  "email": "jane@techcompany.com",
  "phone": "1234567890",
  "partnershipType": "corporate",
  "description": "We are interested in training programs for our employees"
}
```

### 4. Update Partnership (Admin)
```http
PUT /api/partnerships/:id
Headers: Authorization: Bearer ADMIN_TOKEN
```

### 5. Delete Partnership (Admin)
```http
DELETE /api/partnerships/:id
```

## 💻 React Example

```javascript
const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: 'corporate',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/partnerships', formData);
      
      if (response.data.success) {
        alert('Partnership request submitted successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Organization Name"
        value={formData.organizationName}
        onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Contact Person"
        value={formData.contactPerson}
        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
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
      <select
        value={formData.partnershipType}
        onChange={(e) => setFormData({...formData, partnershipType: e.target.value})}
      >
        <option value="corporate">Corporate Training</option>
        <option value="educational">Educational Institution</option>
        <option value="affiliate">Affiliate Partnership</option>
      </select>
      <textarea
        placeholder="Tell us about your partnership interest"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />
      <button type="submit">Submit Request</button>
    </form>
  );
};
```

