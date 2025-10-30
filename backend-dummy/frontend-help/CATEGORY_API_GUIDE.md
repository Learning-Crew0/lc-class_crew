# 📂 Category Module - Frontend Integration Guide

## Overview
The Category module manages course categories for organizing and filtering courses.

---

## 📍 Base Endpoint
```
/api/category
```

---

## 🔗 Relationships

```
Category
└── Has Many: Courses (1:N)
    └── Each course belongs to one category
```

**Connection:** `Course.category` references `Category._id`

---

## 📊 Data Model

```javascript
{
  "_id": "cat123",
  "name": "Web Development",
  "description": "Learn modern web development technologies",
  "image": "https://cloudinary.com/category-image.jpg",
  "isActive": true,
  "courseCount": 25, // Virtual field - populated from courses
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

## 🎯 API Endpoints

### 1. Get All Categories
```javascript
GET /api/category

// Response
{
  "success": true,
  "data": [
    {
      "_id": "cat123",
      "name": "Web Development",
      "description": "Learn modern web development",
      "image": "https://image.jpg",
      "isActive": true,
      "courseCount": 25
    },
    {
      "_id": "cat124",
      "name": "Mobile Development",
      "description": "Build mobile apps",
      "isActive": true,
      "courseCount": 15
    }
  ]
}
```

**Use Case:** Display category list for course filtering

---

### 2. Get Active Categories
```javascript
GET /api/category?isActive=true

// Returns only active categories
```

**Use Case:** Course filter dropdown

---

### 3. Get Single Category
```javascript
GET /api/category/:id

// Response
{
  "success": true,
  "data": {
    "_id": "cat123",
    "name": "Web Development",
    "description": "Learn modern web development",
    "courseCount": 25,
    "courses": [ /* populated courses */ ]
  }
}
```

---

### 4. Get Category with Courses
```javascript
GET /api/category/:id/courses

// Response
{
  "success": true,
  "data": {
    "category": {
      "_id": "cat123",
      "name": "Web Development"
    },
    "courses": [
      {
        "_id": "course123",
        "title": "Complete Web Development",
        "price": 4999,
        "discountedPrice": 3999
      }
    ]
  }
}
```

---

### 5. Create Category (Admin Only)
```javascript
POST /api/category
Headers: { Authorization: "Bearer ${adminToken}" }

// Request
{
  "name": "Web Development",
  "description": "Learn modern web development",
  "image": "https://image.jpg",
  "isActive": true
}

// Response
{
  "success": true,
  "message": "Category created successfully",
  "data": { /* created category */ }
}
```

---

### 6. Update Category (Admin Only)
```javascript
PUT /api/category/:id
Headers: { Authorization: "Bearer ${adminToken}" }

// Request (all fields optional)
{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": false
}
```

---

### 7. Delete Category (Admin Only)
```javascript
DELETE /api/category/:id
Headers: { Authorization: "Bearer ${adminToken}" }

// Response
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Note:** Cannot delete category if it has associated courses

---

### 8. Bulk Upload Categories (Admin Only)
```javascript
POST /api/categories/bulk-upload
Headers: { 
  Authorization: "Bearer ${adminToken}",
  Content-Type: "multipart/form-data"
}

// Request (FormData)
file: category_template.csv

// CSV Format:
name,description,isActive
Web Development,Learn web dev,true
Mobile Development,Learn mobile dev,true

// Response
{
  "success": true,
  "message": "Categories uploaded successfully",
  "data": {
    "created": 15,
    "failed": 2,
    "errors": [
      {
        "row": 3,
        "name": "Duplicate Category",
        "error": "Category already exists"
      }
    ]
  }
}
```

---

### 9. Download Category Template
```javascript
GET /api/categories/template

// Downloads: category_template.csv
```

---

## 💻 Frontend Implementation

### React Example - Category List

```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/category?isActive=true');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="category-grid">
      {categories.map(category => (
        <Link 
          key={category._id} 
          to={`/courses?category=${category._id}`}
          className="category-card"
        >
          <img src={category.image} alt={category.name} />
          <h3>{category.name}</h3>
          <p>{category.description}</p>
          <span className="course-count">
            {category.courseCount} Courses
          </span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
```

---

### React Example - Category Filter Dropdown

```javascript
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get('/api/category?isActive=true');
    if (response.data.success) {
      setCategories(response.data.data);
    }
  };

  return (
    <select 
      value={selectedCategory} 
      onChange={(e) => onCategoryChange(e.target.value)}
      className="category-filter"
    >
      <option value="">All Categories</option>
      {categories.map(cat => (
        <option key={cat._id} value={cat._id}>
          {cat.name} ({cat.courseCount})
        </option>
      ))}
    </select>
  );
};
```

---

### React Example - Admin Category Management

```javascript
const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      let response;
      if (editMode) {
        response = await axios.put(
          `/api/category/${editId}`,
          formData,
          config
        );
      } else {
        response = await axios.post('/api/category', formData, config);
      }

      if (response.data.success) {
        alert(editMode ? 'Category updated!' : 'Category created!');
        fetchCategories();
        resetForm();
      }
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const editCategory = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      isActive: category.isActive
    });
    setEditMode(true);
    setEditId(category._id);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '', isActive: true });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="category-manager">
      <h2>Category Management</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <input
          type="url"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
        />
        <label>
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          />
          Active
        </label>
        <button type="submit">
          {editMode ? 'Update' : 'Create'} Category
        </button>
        {editMode && (
          <button type="button" onClick={resetForm}>Cancel</button>
        )}
      </form>

      <div className="category-list">
        {categories.map(category => (
          <div key={category._id} className="category-item">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <span>Courses: {category.courseCount}</span>
            <span>Status: {category.isActive ? 'Active' : 'Inactive'}</span>
            <button onClick={() => editCategory(category)}>Edit</button>
            <button onClick={() => deleteCategory(category._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### React Example - Bulk Upload

```javascript
const CategoryBulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        '/api/categories/bulk-upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResult(response.data.data);
      alert(`Success! Created: ${response.data.data.created}`);
    } catch (error) {
      alert('Upload failed: ' + error.response?.data?.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    window.location.href = '/api/categories/template';
  };

  return (
    <div className="bulk-upload">
      <h3>Bulk Upload Categories</h3>
      
      <button onClick={downloadTemplate}>
        Download CSV Template
      </button>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Categories'}
        </button>
      </form>

      {result && (
        <div className="upload-result">
          <p>Created: {result.created}</p>
          <p>Failed: {result.failed}</p>
          {result.errors?.length > 0 && (
            <div>
              <h4>Errors:</h4>
              {result.errors.map((err, idx) => (
                <p key={idx}>Row {err.row}: {err.error}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

```

---

## 🔄 Integration with Courses

### Fetch Courses by Category

```javascript
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory]);

  const fetchCourses = async () => {
    let url = '/api/courses';
    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }

    const response = await axios.get(url);
    if (response.data.success) {
      setCourses(response.data.data.courses);
    }
  };

  return (
    <div>
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <CourseGrid courses={courses} />
    </div>
  );
};
```

---

## 🎨 UI/UX Recommendations

1. **Category Cards:**
   - Display as grid (3-4 columns on desktop)
   - Show category image, name, description
   - Display course count
   - Hover effects for better UX

2. **Filter Dropdown:**
   - Show "All Categories" option
   - Display course count next to each category
   - Clear indication of selected category

3. **Admin Interface:**
   - Table view for easy management
   - Inline editing capability
   - Bulk actions (activate/deactivate multiple)
   - Search and filter functionality

---

## ✅ Testing Checklist

- [ ] Fetch and display all categories
- [ ] Filter categories by active status
- [ ] Create new category (admin)
- [ ] Update category details (admin)
- [ ] Delete category (admin)
- [ ] Bulk upload categories via CSV
- [ ] Download CSV template
- [ ] Category-course relationship works
- [ ] Cannot delete category with courses
- [ ] Responsive on mobile devices

---

**Module Status:** ✅ Production Ready

