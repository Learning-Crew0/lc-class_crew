# 📂 Product Category Module - API Integration Guide

## Base URL
```
/api/product-categories
```

## 📋 Overview
Manages product categories for organizing products.

## 🔗 Relationships
- **ProductCategory** → **Product** (1:N): One category has many products

## 🎯 API Endpoints

### 1. Get All Product Categories
```http
GET /api/product-categories
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "cat123",
      "title": "Books",
      "description": "Educational books and guides",
      "order": 1,
      "isActive": true,
      "productCount": 25
    }
  ]
}
```

### 2. Get Single Category
```http
GET /api/product-categories/:id
```

### 3. Create Category (Admin)
```http
POST /api/product-categories
Headers: Authorization: Bearer ADMIN_TOKEN
```

**Request Body:**
```json
{
  "title": "Books",
  "description": "Educational books",
  "order": 1,
  "isActive": true
}
```

### 4. Update Category (Admin)
```http
PUT /api/product-categories/:id
```

### 5. Delete Category (Admin)
```http
DELETE /api/product-categories/:id
```

## 💻 React Example

```javascript
const CategoryFilter = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/product-categories')
      .then(res => setCategories(res.data.data));
  }, []);

  return (
    <select onChange={(e) => filterByCategory(e.target.value)}>
      <option value="">All Categories</option>
      {categories.map(cat => (
        <option key={cat._id} value={cat._id}>{cat.title}</option>
      ))}
    </select>
  );
};
```

**Related Modules:** Product

