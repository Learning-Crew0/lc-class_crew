# 🚀 Quick Test Reference Card

## Server Setup
```bash
cd backend-dummy
npm run dev
```
Server: `http://localhost:5000`

---

## 🎨 BANNER API

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/banner` | Create banner with image |
| GET | `/api/banner` | Get all active banners |
| PUT | `/api/banner/:id` | Update banner |
| DELETE | `/api/banner/:id` | Delete banner |

### Create Banner (Postman)
```
POST http://localhost:5000/api/banner
Body: form-data

Required Fields:
✅ image (file)
✅ headline (text)
✅ mainText (text)
✅ buttonText (text)
✅ displayPeriod[start] (text) - e.g., "2024-01-01"
✅ displayPeriod[end] (text) - e.g., "2024-12-31"

Optional Fields:
- subText (text)
- linkUrl (text)
- order (text)
```

### Example cURL
```bash
curl -X POST http://localhost:5000/api/banner \
  -F "image=@banner.png" \
  -F "headline=다가오는 가을 대비!" \
  -F "subText=날씨는 쌀쌀해지지만 마음은 따듯하게!" \
  -F "mainText=힐링&자기계발 과정 20% 할인" \
  -F "buttonText=Explore" \
  -F "linkUrl=/courses" \
  -F "displayPeriod[start]=2024-01-01" \
  -F "displayPeriod[end]=2024-12-31" \
  -F "order=1"
```

---

## 🖼️ THUMBNAIL API

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/thumbnail` | Create thumbnail with image |
| GET | `/api/thumbnail?category=POPULAR` | Get thumbnails by category |
| PUT | `/api/thumbnail/:id` | Update thumbnail |
| DELETE | `/api/thumbnail/:id` | Delete thumbnail |

### Create Thumbnail (Postman)
```
POST http://localhost:5000/api/thumbnail
Body: form-data

Required Fields:
✅ image (file)
✅ title (text)
✅ category (text) - NEWEST/POPULAR/ALL

Optional Fields:
- courseId (text)
- tags (text) - add multiple rows for multiple tags
- level (text)
- instructor (text)
- schedule (text)
- price (text)
- buttonText (text)
- order (text)
```

### Example cURL
```bash
curl -X POST http://localhost:5000/api/thumbnail \
  -F "image=@thumbnail.png" \
  -F "title=Leadership Mastery Course" \
  -F "category=POPULAR" \
  -F "tags=리더십" \
  -F "tags=비즈니스 스킬" \
  -F "level=LEVEL UP" \
  -F "instructor=John Doe" \
  -F "schedule=25.08.01~25.08.02" \
  -F "price=600000" \
  -F "buttonText=Apply Now" \
  -F "order=1"
```

### Get by Category
```bash
# All active thumbnails
curl http://localhost:5000/api/thumbnail

# POPULAR only
curl "http://localhost:5000/api/thumbnail?category=POPULAR"

# NEWEST only
curl "http://localhost:5000/api/thumbnail?category=NEWEST"
```

---

## 📂 CATEGORY API

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/category` | Create category |
| GET | `/api/category` | Get all categories |
| GET | `/api/category/:id` | Get single category |
| PUT | `/api/category/:id` | Update category |
| DELETE | `/api/category/:id` | Delete category |

### Create Category (Postman)
```
POST http://localhost:5000/api/category
Body: raw (JSON)

{
  "title": "Leadership",
  "description": "Leadership courses",
  "order": 1,
  "isActive": true
}
```

---

## 🎯 Testing Workflow

### 1. Test Banner
```bash
# 1. Create banner
POST /api/banner (with image)

# 2. Get all banners
GET /api/banner

# 3. Copy banner _id from response

# 4. Update banner
PUT /api/banner/{_id}

# 5. Delete banner
DELETE /api/banner/{_id}
```

### 2. Test Thumbnail
```bash
# 1. Create thumbnail
POST /api/thumbnail (with image)

# 2. Get POPULAR thumbnails
GET /api/thumbnail?category=POPULAR

# 3. Copy thumbnail _id from response

# 4. Update thumbnail
PUT /api/thumbnail/{_id}

# 5. Delete thumbnail
DELETE /api/thumbnail/{_id}
```

---

## 🐛 Common Issues

### "Only .jpeg, .jpg, .png files are allowed!"
→ Use correct image format

### "Server error"
→ Check MongoDB connection and Cloudinary credentials

### Image not uploading
→ Verify Cloudinary credentials in `.env.dev`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Cannot find route
→ Verify server is running and routes are registered in `src/index.js`

---

## 📦 Import Postman Collection

1. Open Postman
2. Click "Import"
3. Select `ClassCrew-API.postman_collection.json`
4. All requests will be ready to use!

---

## ✅ Success Indicators

### Banner Created Successfully
```json
{
  "success": true,
  "message": "Banner created successfully",
  "banner": {
    "_id": "...",
    "imageUrl": "https://res.cloudinary.com/...",
    ...
  }
}
```

### Thumbnail Created Successfully
```json
{
  "success": true,
  "message": "Thumbnail created successfully",
  "thumbnail": {
    "_id": "...",
    "imageUrl": "https://res.cloudinary.com/...",
    ...
  }
}
```

### Image Uploaded to Cloudinary
- Check `imageUrl` in response
- Should start with `https://res.cloudinary.com/`
- Open URL in browser to verify image

---

## 🔗 Quick Links

- Full Guide: `API_TESTING_GUIDE.md`
- Postman Collection: `ClassCrew-API.postman_collection.json`
- Server: `http://localhost:5000`
- API Base: `http://localhost:5000/api`

---

**Happy Testing! 🎉**
