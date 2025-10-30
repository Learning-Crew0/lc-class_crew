# 📚 Category Module - API Integration Guide

## Base URL
```
/api/category
```

## 📋 Overview
Manages course categories for organizing courses.

## 🔗 Relationships
- **Category** → **Course** (1:N): One category has many courses

## 🎯 API Endpoints

### 1. Get All Categories
```http
GET /api/category
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "cat123",
      "name": "Web Development",
      "description": "Learn web technologies",
      "image": "https://image.jpg",
      "isActive": true,
      "courseCount": 25
    }
  ]
}
```

### 2. Get Single Category
```http
GET /api/category/:id
```

### 3. Create Category (Admin)
```http
POST /api/category
Headers: Authorization: Bearer ADMIN_TOKEN
```

**Request Body:**
```json
{
  "name": "Web Development",
  "description": "Learn web technologies",
  "image": "https://image.jpg",
  "isActive": true
}
```

### 4. Update Category (Admin)
```http
PUT /api/category/:id
```

### 5. Delete Category (Admin)
```http
DELETE /api/category/:id
```

## 💻 React Example

```javascript
const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/category')
      .then(res => setCategories(res.data.data));
  }, []);

  return (
    <div className="category-grid">
      {categories.map(cat => (
        <Link key={cat._id} to={`/courses?category=${cat._id}`}>
          <img src={cat.image} alt={cat.name} />
          <h3>{cat.name}</h3>
          <p>{cat.courseCount} courses</p>
        </Link>
      ))}
    </div>
  );
};
```

**Related Modules:** Course

