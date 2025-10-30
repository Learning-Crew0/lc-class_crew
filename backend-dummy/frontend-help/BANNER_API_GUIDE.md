# 🎨 Banner Module - Frontend Integration Guide

## Overview
The Banner module manages homepage and promotional banners throughout the application.

---

## 📍 Base Endpoint
```
/api/banner
```

---

## 🔗 Relationships

```
Banner (Standalone)
└── Used for: Homepage sliders, promotional displays
```

---

## 📊 Data Model

```javascript
{
  "_id": "banner123",
  "title": "New Course Launch",
  "description": "Check out our latest web development course",
  "image": "https://cloudinary.com/banner-image.jpg",
  "link": "/courses/web-dev-2024",
  "isActive": true,
  "displayOrder": 1,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎯 API Endpoints

### 1. Get All Banners
```javascript
GET /api/banner

// Response
{
  "success": true,
  "data": [
    {
      "_id": "banner123",
      "title": "New Course Launch",
      "description": "Check out our latest courses",
      "image": "https://banner-image.jpg",
      "link": "/courses/new-course",
      "isActive": true,
      "displayOrder": 1
    }
  ]
}
```

**Use Case:** Display homepage banner slider

---

### 2. Get Active Banners
```javascript
GET /api/banner?isActive=true

// Returns only active banners sorted by displayOrder
```

**Use Case:** Homepage banner carousel

---

### 3. Get Single Banner
```javascript
GET /api/banner/:id

// Response
{
  "success": true,
  "data": {
    "_id": "banner123",
    // ... full banner details
  }
}
```

---

### 4. Create Banner (Admin Only)
```javascript
POST /api/banner
Headers: { 
  Authorization: "Bearer ${adminToken}",
  Content-Type: "multipart/form-data"
}

// Request (FormData)
{
  title: "New Course Launch",
  description: "Check out our latest courses",
  image: [File], // Image file
  link: "/courses/new-course",
  isActive: true,
  displayOrder: 1,
  startDate: "2024-01-01",
  endDate: "2024-01-31"
}

// Response
{
  "success": true,
  "message": "Banner created successfully",
  "data": { /* created banner */ }
}
```

---

### 5. Update Banner (Admin Only)
```javascript
PUT /api/banner/:id
Headers: { 
  Authorization: "Bearer ${adminToken}",
  Content-Type: "multipart/form-data"
}

// Request (FormData) - All fields optional
{
  title: "Updated Title",
  image: [File], // New image (optional)
  isActive: false
}
```

---

### 6. Delete Banner (Admin Only)
```javascript
DELETE /api/banner/:id
Headers: { Authorization: "Bearer ${adminToken}" }

// Response
{
  "success": true,
  "message": "Banner deleted successfully"
}
```

---

## 💻 Frontend Implementation

### React Example - Banner Carousel

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/banner?isActive=true');
      if (response.data.success) {
        // Sort by displayOrder
        const sorted = response.data.data.sort((a, b) => 
          a.displayOrder - b.displayOrder
        );
        setBanners(sorted);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading banners...</div>;

  return (
    <div className="banner-carousel">
      {banners.map(banner => (
        <div key={banner._id} className="banner-slide">
          <a href={banner.link}>
            <img src={banner.image} alt={banner.title} />
            <div className="banner-content">
              <h2>{banner.title}</h2>
              <p>{banner.description}</p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default BannerCarousel;
```

---

### React Example - Admin Banner Management

```javascript
const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    displayOrder: 1,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('/api/banner', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Banner created successfully!');
        fetchBanners(); // Refresh list
        resetForm();
      }
    } catch (error) {
      alert('Error creating banner: ' + error.response?.data?.message);
    }
  };

  const deleteBanner = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBanners(); // Refresh list
    } catch (error) {
      alert('Error deleting banner');
    }
  };

  return (
    <div className="banner-manager">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
        <input
          type="text"
          placeholder="Link (e.g., /courses/web-dev)"
          value={formData.link}
          onChange={(e) => setFormData({...formData, link: e.target.value})}
        />
        <button type="submit">Create Banner</button>
      </form>

      <div className="banner-list">
        {banners.map(banner => (
          <div key={banner._id} className="banner-item">
            <img src={banner.image} alt={banner.title} />
            <h3>{banner.title}</h3>
            <button onClick={() => deleteBanner(banner._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎨 UI/UX Recommendations

1. **Homepage Carousel:**
   - Auto-rotate every 5 seconds
   - Show navigation dots
   - Pause on hover
   - Mobile-friendly swipe gestures

2. **Admin Interface:**
   - Drag-and-drop for reordering (displayOrder)
   - Image preview before upload
   - Toggle active/inactive status
   - Date range picker for scheduling

3. **Image Requirements:**
   - Recommended size: 1920x600px (desktop)
   - Mobile size: 1200x400px
   - Format: JPG, PNG, WebP
   - Max file size: 2MB

---

## 🔄 State Management Example

```javascript
// Redux Slice
const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    setBanners: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

// Actions
export const fetchBanners = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get('/api/banner?isActive=true');
    dispatch(setBanners(response.data.data));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};
```

---

## ✅ Testing Checklist

- [ ] Fetch and display all active banners
- [ ] Banners sorted by displayOrder
- [ ] Images load correctly
- [ ] Links navigate properly
- [ ] Admin can create new banner with image upload
- [ ] Admin can update banner details
- [ ] Admin can toggle active status
- [ ] Admin can delete banner
- [ ] Responsive on mobile devices
- [ ] Auto-rotation works in carousel

---

**Module Status:** ✅ Production Ready

