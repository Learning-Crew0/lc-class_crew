# 🖼️ Thumbnail Module - API Integration Guide

## Base URL
```
/api/thumbnail
```

## 📋 Overview
Manages image thumbnails for various content types.

## 🎯 API Endpoints

### 1. Get Thumbnails by Category
```http
GET /api/thumbnail?category=course
```

**Query Parameters:**
- `category`: Filter by category (course, product, banner, etc.)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "thumb123",
      "title": "Course Thumbnail",
      "image": "https://thumbnail.jpg",
      "category": "course",
      "isActive": true
    }
  ]
}
```

### 2. Create Thumbnail (Admin)
```http
POST /api/thumbnail
Headers: Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Request (FormData):**
```javascript
const formData = new FormData();
formData.append('title', 'Course Thumbnail');
formData.append('image', fileInput.files[0]);
formData.append('category', 'course');
formData.append('isActive', true);
```

### 3. Update Thumbnail (Admin)
```http
PUT /api/thumbnail/:id
```

### 4. Delete Thumbnail (Admin)
```http
DELETE /api/thumbnail/:id
```

## 💻 React Example

```javascript
const ThumbnailGallery = ({ category }) => {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    axios.get(`/api/thumbnail?category=${category}`)
      .then(res => setThumbnails(res.data.data));
  }, [category]);

  return (
    <div className="thumbnail-grid">
      {thumbnails.map(thumb => (
        <img key={thumb._id} src={thumb.image} alt={thumb.title} />
      ))}
    </div>
  );
};
```

