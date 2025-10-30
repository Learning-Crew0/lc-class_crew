# 🎨 Banner Module - API Integration Guide

## Base URL
```
/api/banner
```

## 📋 Overview
Manages homepage and promotional banners.

## 🎯 API Endpoints

### 1. Get All Active Banners (Public)
```http
GET /api/banner
```

**Description:** Returns only active banners sorted by order  
**Authentication:** Not required

**Response (200):**
```json
{
  "success": true,
  "banners": [
    {
      "_id": "banner123",
      "imageUrl": "https://cloudinary.com/banner.jpg",
      "headline": "New Course Launch",
      "subText": "Limited Time Offer",
      "mainText": "Check out our latest courses",
      "buttonText": "Explore Now",
      "linkUrl": "/courses/new",
      "displayPeriod": {
        "start": "2024-01-01T00:00:00.000Z",
        "end": "2024-12-31T23:59:59.999Z"
      },
      "order": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get All Banners for Admin (Admin)
```http
GET /api/banner/admin/all?page=1&limit=10&search=course&isActive=true&sortBy=createdAt&sortOrder=desc
```

**Description:** Returns ALL banners (active + inactive) with pagination, search, and filtering  
**Authentication:** Required (Admin only)

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search in headline, mainText, or buttonText
- `isActive` (optional) - Filter by status: "true" or "false"
- `sortBy` (optional, default: "createdAt") - Sort field: "createdAt", "order", "headline"
- `sortOrder` (optional, default: "desc") - Sort order: "asc" or "desc"

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "banner123",
      "imageUrl": "https://cloudinary.com/banner.jpg",
      "headline": "New Course Launch",
      "subText": "Limited Time Offer",
      "mainText": "Check out our latest courses",
      "buttonText": "Explore Now",
      "linkUrl": "/courses/new",
      "displayPeriod": {
        "start": "2024-01-01T00:00:00.000Z",
        "end": "2024-12-31T23:59:59.999Z"
      },
      "order": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalBanners": 48,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "stats": {
    "total": 48,
    "active": 35,
    "inactive": 13
  }
}
```

---

### 3. Create Banner (Admin)
```http
POST /api/banner
Headers: Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Request (FormData):**
```javascript
const formData = new FormData();
formData.append('title', 'New Course Launch');
formData.append('description', 'Check out our courses');
formData.append('image', fileInput.files[0]);
formData.append('link', '/courses/new');
formData.append('order', 1);
formData.append('isActive', true);
```

### 3. Update Banner (Admin)
```http
PUT /api/banner/:id
```

### 4. Delete Banner (Admin)
```http
DELETE /api/banner/:id
```

## 💻 React Examples

### Example 1: Public Banner Carousel (Frontend)

```javascript
const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/banner')
      .then(res => {
        setBanners(res.data.banners);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching banners:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading banners...</div>;

  return (
    <div className="carousel">
      {banners.map(banner => (
        <div key={banner._id} className="slide">
          <img src={banner.imageUrl} alt={banner.headline} />
          <div className="content">
            <h3>{banner.subText}</h3>
            <h2>{banner.headline}</h2>
            <p>{banner.mainText}</p>
            <a href={banner.linkUrl} className="btn">
              {banner.buttonText}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
```

**Use Case:** Homepage banner carousel for public users

---

### Example 2: Admin Banner Management Dashboard

```javascript
const AdminBannerDashboard = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const token = localStorage.getItem('adminToken');

  const fetchBanners = async () => {
    try {
      setLoading(true);
      
      // Build query string
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const response = await axios.get(
        `/api/banner/admin/all?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBanners(response.data.data);
      setPagination(response.data.pagination);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [filters]);

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const deleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      await axios.delete(`/api/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBanners(); // Refresh list
      alert('Banner deleted successfully');
    } catch (error) {
      alert('Error deleting banner: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="admin-banner-dashboard">
      <h1>Banner Management</h1>
      
      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Banners</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Active</h3>
          <p>{stats.active}</p>
        </div>
        <div className="stat-card">
          <h3>Inactive</h3>
          <p>{stats.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search banners..."
          value={filters.search}
          onChange={handleSearch}
        />
        
        <select 
          value={filters.isActive}
          onChange={(e) => handleFilterChange('isActive', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select 
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="createdAt">Sort by Date</option>
          <option value="order">Sort by Order</option>
          <option value="headline">Sort by Headline</option>
        </select>

        <select 
          value={filters.sortOrder}
          onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Banner Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="banner-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Headline</th>
                <th>Main Text</th>
                <th>Order</th>
                <th>Status</th>
                <th>Display Period</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner._id}>
                  <td>
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.headline}
                      style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{banner.headline}</td>
                  <td>{banner.mainText.substring(0, 50)}...</td>
                  <td>{banner.order}</td>
                  <td>
                    <span className={banner.isActive ? 'badge-active' : 'badge-inactive'}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {new Date(banner.displayPeriod.start).toLocaleDateString()} - 
                    {new Date(banner.displayPeriod.end).toLocaleDateString()}
                  </td>
                  <td>
                    <button onClick={() => window.location.href = `/admin/banners/edit/${banner._id}`}>
                      Edit
                    </button>
                    <button onClick={() => deleteBanner(banner._id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button 
              disabled={!pagination.hasPrevPage}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </button>
            
            <span>
              Page {pagination.currentPage} of {pagination.totalPages} 
              ({pagination.totalBanners} total banners)
            </span>
            
            <button 
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
```

**Use Case:** Admin dashboard for managing all banners with search, filter, and pagination

