# 🛍️ Product Module - API Integration Guide

## Base URL
```
/api/products
```

---

## 📋 Overview

The Product module manages the product catalog for the e-commerce system.

---

## 🔗 Module Relationships

- **Product** → **ProductCategory** (N:1): Each product belongs to one category
- **Product** → **Cart** (N:M): Products can be in multiple carts
- **Product** → **Order** (N:M): Products can be in multiple orders

---

## 🎯 API Endpoints

### 1. Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category ID
- `isActive` (optional): Filter by active status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in name/description
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Example:**
```
GET /api/products?category=cat123&page=1&limit=12&minPrice=500&maxPrice=5000
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "prod123",
        "name": "JavaScript Complete Guide",
        "description": "Comprehensive JavaScript book",
        "category": {
          "_id": "cat123",
          "title": "Books"
        },
        "baseCost": 999,
        "discountRate": 20,
        "finalPrice": 799,
        "availableQuantity": 50,
        "images": [
          "https://image1.jpg",
          "https://image2.jpg"
        ],
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 48,
      "limit": 12
    }
  }
}
```

---

### 2. Get Single Product
```http
GET /api/products/:id
```

**URL Parameters:**
- `id`: Product ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "prod123",
    "name": "JavaScript Complete Guide",
    "description": "Comprehensive JavaScript book covering ES6+, async programming, and modern frameworks",
    "category": {
      "_id": "cat123",
      "title": "Books",
      "description": "Educational books"
    },
    "baseCost": 999,
    "discountRate": 20,
    "finalPrice": 799,
    "availableQuantity": 50,
    "images": [
      "https://image1.jpg",
      "https://image2.jpg",
      "https://image3.jpg"
    ],
    "specifications": {
      "author": "John Doe",
      "pages": 500,
      "language": "English",
      "publisher": "Tech Press"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

### 3. Get Products by Category
```http
GET /api/products/category/:categoryId
```

**URL Parameters:**
- `categoryId`: Product Category ID

**Query Parameters:**
- `page`, `limit`: Pagination

**Response:** Same as Get All Products

---

### 4. Create Product (Admin)
```http
POST /api/products
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "JavaScript Complete Guide",
  "description": "Comprehensive JavaScript book",
  "category": "cat123",
  "baseCost": 999,
  "discountRate": 20,
  "availableQuantity": 100,
  "images": [
    "https://image1.jpg",
    "https://image2.jpg"
  ],
  "specifications": {
    "author": "John Doe",
    "pages": 500
  },
  "isActive": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    // Created product object
  }
}
```

---

### 5. Update Product (Admin)
```http
PUT /api/products/:id
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Request Body (All fields optional):**
```json
{
  "name": "Updated Name",
  "baseCost": 1299,
  "discountRate": 25,
  "availableQuantity": 75
}
```

---

### 6. Delete Product (Admin)
```http
DELETE /api/products/:id
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 💻 Frontend Implementation

### React - Product List with Filters

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products', { params: filters });
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
        />
        
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value, page: 1})}
        >
          <option value="">All Categories</option>
          {/* Populate from product categories API */}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({...filters, minPrice: e.target.value, page: 1})}
        />
        
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: e.target.value, page: 1})}
        />
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img src={product.images[0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="category">{product.category?.title}</p>
              
              <div className="price">
                {product.discountRate > 0 && (
                  <span className="original">₹{product.baseCost}</span>
                )}
                <span className="final">₹{product.finalPrice}</span>
                {product.discountRate > 0 && (
                  <span className="discount">{product.discountRate}% OFF</span>
                )}
              </div>
              
              <p className="stock">
                {product.availableQuantity > 0 
                  ? `${product.availableQuantity} in stock`
                  : 'Out of stock'
                }
              </p>
              
              <button onClick={() => window.location.href = `/products/${product._id}`}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <div className="pagination">
          <button 
            disabled={filters.page === 1}
            onClick={() => setFilters({...filters, page: filters.page - 1})}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button 
            disabled={filters.page === pagination.totalPages}
            onClick={() => setFilters({...filters, page: filters.page + 1})}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
```

---

### React - Product Detail Page

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddToCartButton from './AddToCartButton';

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-detail">
      <div className="product-images">
        <img 
          src={product.images[selectedImage]} 
          alt={product.name}
          className="main-image"
        />
        <div className="image-thumbnails">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={selectedImage === index ? 'active' : ''}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="category">{product.category?.title}</p>
        
        <div className="price">
          {product.discountRate > 0 && (
            <span className="original">₹{product.baseCost}</span>
          )}
          <span className="final">₹{product.finalPrice}</span>
          {product.discountRate > 0 && (
            <span className="discount">Save {product.discountRate}%</span>
          )}
        </div>

        <p className="description">{product.description}</p>

        {product.specifications && (
          <div className="specifications">
            <h3>Specifications</h3>
            <ul>
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="stock-info">
          {product.availableQuantity > 0 ? (
            <p className="in-stock">✓ In Stock ({product.availableQuantity} available)</p>
          ) : (
            <p className="out-of-stock">✗ Out of Stock</p>
          )}
        </div>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
```

---

## ✅ Integration Checklist

- [ ] Product list with filters
- [ ] Product search
- [ ] Price range filter
- [ ] Category filter
- [ ] Pagination
- [ ] Product detail page
- [ ] Image gallery
- [ ] Stock display
- [ ] Add to cart integration
- [ ] Admin: Create/Update/Delete products

---

## 🐛 Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 404 | Product not found | Check product ID |
| 400 | Invalid category | Ensure category exists |
| 403 | Admin access required | Need admin token |

---

**Related Modules:** ProductCategory, Cart, Order

