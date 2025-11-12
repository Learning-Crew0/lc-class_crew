# 🛍️ Admin Products & Categories API Integration Guide

**Complete Backend API Reference for Frontend Integration**

---

## 📋 Table of Contents

2. [Product Categories Management](#product-categories-management)
3. [Products Management](#products-management)
4. [Image Upload Workflow](#image-upload-workflow)
5. [Error Handling](#error-handling)
6. [Complete Workflow Example](#complete-workflow-example)

---

## 📁 Product Categories Management

### 1. Get All Categories (Admin)

```
GET /api/v1/admin/product-categories
Authorization: Bearer {token}

Query Parameters (optional):
- page=1
- limit=10
- sortBy=order (or title, createdAt)
- sortOrder=asc (or desc)
- search=electronics
- isActive=true (or false)

Response:
{
  "status": "success",
  "message": "Product categories retrieved successfully",
  "data": [
    {
      "_id": "674b3e8f9d3c2a1f8e4d5c6b",
      "title": "Stationery",
      "slug": "stationery",
      "description": "School and office supplies",
      "icon": "https://example.com/icons/stationery.png",
      "order": 1,
      "isActive": true,
      "productCount": 15,
      "createdAt": "2025-11-12T10:30:00.000Z",
      "updatedAt": "2025-11-12T10:30:00.000Z"
    },
    {
      "_id": "674b3e8f9d3c2a1f8e4d5c6c",
      "title": "Electronics",
      "slug": "electronics",
      "description": "Electronic gadgets and accessories",
      "icon": null,
      "order": 2,
      "isActive": true,
      "productCount": 8,
      "createdAt": "2025-11-12T11:00:00.000Z",
      "updatedAt": "2025-11-12T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

---

### 2. Get Single Category

```
GET /api/v1/admin/product-categories/:id
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "message": "Product category retrieved successfully",
  "data": {
    "_id": "674b3e8f9d3c2a1f8e4d5c6b",
    "title": "Stationery",
    "slug": "stationery",
    "description": "School and office supplies",
    "icon": "https://example.com/icons/stationery.png",
    "order": 1,
    "isActive": true,
    "productCount": 15,
    "createdAt": "2025-11-12T10:30:00.000Z",
    "updatedAt": "2025-11-12T10:30:00.000Z"
  }
}
```

---

### 3. Create Category

```
POST /api/v1/admin/product-categories
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "Stationery",                    // Required
  "description": "School and office supplies",  // Optional
  "icon": "https://example.com/icon.png",   // Optional (full URL)
  "order": 1,                               // Optional, default: 0
  "isActive": true                          // Optional, default: true
}

Response:
{
  "status": "success",
  "message": "Product category created successfully",
  "data": {
    "_id": "674b3e8f9d3c2a1f8e4d5c6b",
    "title": "Stationery",
    "slug": "stationery",                   // Auto-generated from title
    "description": "School and office supplies",
    "icon": "https://example.com/icon.png",
    "order": 1,
    "isActive": true,
    "productCount": 0,                      // Starts at 0
    "createdAt": "2025-11-12T10:30:00.000Z",
    "updatedAt": "2025-11-12T10:30:00.000Z"
  }
}

Validation Errors:
- "Product category title is required"
- "Icon must be a valid URI" (if icon is not a valid URL)
```

---

### 4. Update Category

```
PUT /api/v1/admin/product-categories/:id
Authorization: Bearer {token}
Content-Type: application/json

Request Body (all fields optional):
{
  "title": "Updated Stationery",
  "description": "Updated description",
  "icon": "https://example.com/new-icon.png",
  "order": 2,
  "isActive": false
}

Response:
{
  "status": "success",
  "message": "Product category updated successfully",
  "data": {
    "_id": "674b3e8f9d3c2a1f8e4d5c6b",
    "title": "Updated Stationery",
    "slug": "updated-stationery",           // Auto-updated if title changed
    "description": "Updated description",
    "icon": "https://example.com/new-icon.png",
    "order": 2,
    "isActive": false,
    "productCount": 15,
    "createdAt": "2025-11-12T10:30:00.000Z",
    "updatedAt": "2025-11-12T12:00:00.000Z"
  }
}

Validation Error:
- At least one field must be present for update
```

---

### 5. Toggle Category Active Status

```
PATCH /api/v1/admin/product-categories/:id/toggle-active
Authorization: Bearer {token}

No request body needed

Response:
{
  "status": "success",
  "message": "Product category status updated successfully",
  "data": {
    "_id": "674b3e8f9d3c2a1f8e4d5c6b",
    "title": "Stationery",
    "slug": "stationery",
    "isActive": false,                      // Toggled!
    "productCount": 15,
    ...
  }
}
```

---

### 6. Update Product Counts (Bulk)

```
PATCH /api/v1/admin/product-categories/update-counts
Authorization: Bearer {token}

No request body needed

Response:
{
  "status": "success",
  "message": "Product counts updated successfully",
  "data": {
    "message": "Updated product counts for 5 categories."
  }
}

Or if no updates needed:
{
  "status": "success",
  "message": "Product counts updated successfully",
  "data": {
    "message": "No product counts needed updating."
  }
}

⚠️ This recalculates productCount for ALL categories by counting linked products
```

---

### 7. Delete Category

```
DELETE /api/v1/admin/product-categories/:id
Authorization: Bearer {token}

Response (Success):
{
  "status": "success",
  "message": "Product category deleted successfully",
  "data": {
    "message": "Product category deleted successfully"
  }
}

Response (Error - has products):
{
  "success": false,
  "message": "Cannot delete category with 15 associated products.",
  "status": 400
}

⚠️ IMPORTANT: Cannot delete a category if products are linked to it!
   Must reassign or delete products first.
```

---

## 🛍️ Products Management

### 1. Get All Products (Admin)

```
GET /api/v1/admin/products
Authorization: Bearer {token}

Query Parameters (optional):
- page=1
- limit=10
- sortBy=createdAt (or name, finalPrice)
- sortOrder=desc (or asc)
- search=notebook (text search in name/description)
- category=674b3e8f9d3c2a1f8e4d5c6b (filter by category ID)
- isActive=true (or false)
- inStock=true (products with availableQuantity > 0)
- minPrice=1000
- maxPrice=50000

Response:
{
  "status": "success",
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "674b4f9a8e5d3b2c1a9f8e7d",
      "name": "Premium Notebook",
      "description": "High-quality notebook for students",
      "category": {
        "_id": "674b3e8f9d3c2a1f8e4d5c6b",
        "title": "Stationery"
      },
      "baseCost": 20000,
      "discountRate": 25,
      "finalPrice": 15000,                  // Auto-calculated
      "availableQuantity": 500,
      "images": [
        "/uploads/products/notebook-1.png",
        "/uploads/products/notebook-2.png"
      ],
      "isActive": true,
      "isNew": true,                        // Virtual field (created < 7 days ago)
      "inStock": true,                      // Virtual field (availableQuantity > 0)
      "createdAt": "2025-11-12T14:30:00.000Z",
      "updatedAt": "2025-11-12T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### 2. Get Single Product

```
GET /api/v1/admin/products/:id
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "message": "Product retrieved successfully",
  "data": {
    "_id": "674b4f9a8e5d3b2c1a9f8e7d",
    "name": "Premium Notebook",
    "description": "High-quality notebook for students with 200 pages...",
    "category": {
      "_id": "674b3e8f9d3c2a1f8e4d5c6b",
      "title": "Stationery"
    },
    "baseCost": 20000,
    "discountRate": 25,
    "finalPrice": 15000,
    "availableQuantity": 500,
    "images": [
      "/uploads/products/notebook-1.png",
      "/uploads/products/notebook-2.png"
    ],
    "isActive": true,
    "isNew": true,
    "inStock": true,
    "createdAt": "2025-11-12T14:30:00.000Z",
    "updatedAt": "2025-11-12T14:30:00.000Z"
  }
}
```

---

### 3. Create Product

```
POST /api/v1/admin/products
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "Premium Notebook",               // Required, max 200 chars
  "description": "High-quality notebook for students with 200 pages, durable cover",  // Required, max 2000 chars
  "category": {                             // Required
    "_id": "674b3e8f9d3c2a1f8e4d5c6b",     // Required (from category list)
    "title": "Stationery"                   // Required (from category list)
  },
  "baseCost": 20000,                        // Required, min: 0
  "discountRate": 25,                       // Optional, min: 0, max: 100, default: 0
  "availableQuantity": 500,                 // Optional, min: 0, default: 0
  "images": [                               // Required, min 1 image
    "/uploads/temp/notebook-1.png",
    "/uploads/temp/notebook-2.png"
  ],
  "isActive": true                          // Optional, default: true
}

Response:
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "_id": "674b4f9a8e5d3b2c1a9f8e7d",
    "name": "Premium Notebook",
    "description": "High-quality notebook for students with 200 pages, durable cover",
    "category": {
      "_id": "674b3e8f9d3c2a1f8e4d5c6b",
      "title": "Stationery"
    },
    "baseCost": 20000,
    "discountRate": 25,
    "finalPrice": 15000,                    // ✅ AUTO-CALCULATED!
    "availableQuantity": 500,
    "images": [
      "/uploads/temp/notebook-1.png",
      "/uploads/temp/notebook-2.png"
    ],
    "isActive": true,
    "isNew": true,
    "inStock": true,
    "createdAt": "2025-11-12T14:30:00.000Z",
    "updatedAt": "2025-11-12T14:30:00.000Z"
  }
}

Validation Errors:
- "Product name is required"
- "Product name cannot exceed 200 characters"
- "Product description is required"
- "Description cannot exceed 2000 characters"
- "Category is required"
- "Category ID is required"
- "Category title is required"
- "Base cost is required"
- "Base cost cannot be negative"
- "Discount rate cannot be negative"
- "Discount rate cannot exceed 100%"
- "Available quantity cannot be negative"
- "At least one image is required"
- "Images are required"
```

**⚠️ IMPORTANT - finalPrice Calculation:**

```
Formula:
- If discountRate > 0:
    finalPrice = baseCost * (1 - discountRate / 100)
- If discountRate = 0:
    finalPrice = baseCost

Examples:
- baseCost: 20000, discountRate: 25 → finalPrice: 15000
- baseCost: 10000, discountRate: 10 → finalPrice: 9000
- baseCost: 5000, discountRate: 0 → finalPrice: 5000

✅ DON'T send finalPrice in request - it's auto-calculated!
```

---

### 4. Update Product

```
PUT /api/v1/admin/products/:id
Authorization: Bearer {token}
Content-Type: application/json

Request Body (all fields optional, min 1 required):
{
  "name": "Updated Premium Notebook",
  "description": "Updated description",
  "category": {
    "_id": "674b3e8f9d3c2a1f8e4d5c6c",
    "title": "Electronics"
  },
  "baseCost": 25000,
  "discountRate": 30,
  "availableQuantity": 450,
  "images": [
    "/uploads/temp/new-image-1.png"
  ],
  "isActive": false
}

Response:
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "_id": "674b4f9a8e5d3b2c1a9f8e7d",
    "name": "Updated Premium Notebook",
    "description": "Updated description",
    "category": {
      "_id": "674b3e8f9d3c2a1f8e4d5c6c",
      "title": "Electronics"
    },
    "baseCost": 25000,
    "discountRate": 30,
    "finalPrice": 17500,                    // ✅ Re-calculated on update!
    "availableQuantity": 450,
    "images": [
      "/uploads/temp/new-image-1.png"
    ],
    "isActive": false,
    "isNew": true,
    "inStock": true,
    "createdAt": "2025-11-12T14:30:00.000Z",
    "updatedAt": "2025-11-12T15:00:00.000Z"
  }
}

Validation Error:
- At least one field must be present for update
```

---

### 5. Update Product Stock

```
PATCH /api/v1/admin/products/:id/stock
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "availableQuantity": 750                  // Required, min: 0
}

Response:
{
  "status": "success",
  "message": "Stock updated successfully",
  "data": {
    "_id": "674b4f9a8e5d3b2c1a9f8e7d",
    "name": "Premium Notebook",
    "availableQuantity": 750,               // Updated!
    "inStock": true,                        // Re-calculated
    ...
  }
}

Validation Errors:
- "Available quantity must be a number"
- "Available quantity cannot be negative"
- "Available quantity is required"
```

---

### 6. Toggle Product Active Status

```
PATCH /api/v1/admin/products/:id/toggle-active
Authorization: Bearer {token}

No request body needed

Response:
{
  "status": "success",
  "message": "Product status updated successfully",
  "data": {
    "_id": "674b4f9a8e5d3b2c1a9f8e7d",
    "name": "Premium Notebook",
    "isActive": false,                      // Toggled!
    ...
  }
}
```

---

### 7. Delete Product

```
DELETE /api/v1/admin/products/:id
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": {
    "message": "Product deleted successfully"
  }
}

⚠️ NOTE: Product images are NOT automatically deleted from storage.
   Consider implementing cleanup logic if needed.
```

---

## 📤 Image Upload Workflow

### Step 1: Upload Image First

```
POST /api/v1/admin/uploads/single
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: [binary image file]
- folder: "products" (or "temp", "categories")

Response:
{
  "status": "success",
  "message": "File uploaded successfully",
  "data": {
    "filename": "file-1762925432599-96240906.png",
    "originalName": "notebook.png",
    "mimetype": "image/png",
    "size": 245678,
    "url": "/uploads/products/file-1762925432599-96240906.png",  // ✅ Use this!
    "path": "S:\\...\\backend\\uploads\\products\\file-1762925432599-96240906.png"
  }
}
```

### Step 2: Use Image URL in Product/Category

```
Use the "url" field from upload response:

For Product:
{
  "images": [
    "/uploads/products/file-1762925432599-96240906.png"  // From upload response
  ]
}

For Category Icon:
{
  "icon": "https://example.com/icon.png"  // Must be full URL for category
}
```

---

## 🎯 Complete Workflow Example

### Scenario: Create a New Product in New Category

#### Step 1: Login as Admin

```bash
POST /api/v1/auth/admin/login
{
  "identifier": "admin@classcrew.com",
  "password": "Admin@123"
}

→ Save token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Step 2: Create Category

```bash
POST /api/v1/admin/product-categories
Authorization: Bearer {token}
{
  "title": "Stationery",
  "description": "School supplies",
  "order": 1,
  "isActive": true
}

→ Save category ID: "674b3e8f9d3c2a1f8e4d5c6b"
→ Save category title: "Stationery"
```

#### Step 3: Upload Product Images

```bash
# Image 1
POST /api/v1/admin/uploads/single
Authorization: Bearer {token}
Form Data: file=[notebook-front.png], folder="products"

→ Save URL: "/uploads/products/file-1762925432599-96240906.png"

# Image 2
POST /api/v1/admin/uploads/single
Authorization: Bearer {token}
Form Data: file=[notebook-back.png], folder="products"

→ Save URL: "/uploads/products/file-1762925432600-12345678.png"
```

#### Step 4: Create Product

```bash
POST /api/v1/admin/products
Authorization: Bearer {token}
{
  "name": "Premium Notebook A4",
  "description": "200 pages, hardcover, ruled",
  "category": {
    "_id": "674b3e8f9d3c2a1f8e4d5c6b",
    "title": "Stationery"
  },
  "baseCost": 20000,
  "discountRate": 25,
  "availableQuantity": 500,
  "images": [
    "/uploads/products/file-1762925432599-96240906.png",
    "/uploads/products/file-1762925432600-12345678.png"
  ],
  "isActive": true
}

→ Product created with finalPrice: 15000 (auto-calculated)
```

#### Step 5: Update Product Stock (Later)

```bash
PATCH /api/v1/admin/products/{productId}/stock
Authorization: Bearer {token}
{
  "availableQuantity": 450
}
```

#### Step 6: Toggle Product Visibility

```bash
PATCH /api/v1/admin/products/{productId}/toggle-active
Authorization: Bearer {token}

→ isActive toggled to false (hidden from public)
```

---

## ❌ Error Handling

### Common Error Responses

#### 1. Validation Error

```json
{
    "success": false,
    "message": "Validation error",
    "errors": ["Product name is required", "At least one image is required"],
    "status": 400
}
```

#### 2. Authentication Error

```json
{
    "success": false,
    "message": "인증 토큰이 제공되지 않았습니다",
    "status": 401
}
```

#### 3. Unauthorized (Not Admin)

```json
{
    "success": false,
    "message": "관리자 권한이 필요합니다",
    "status": 403
}
```

#### 4. Not Found

```json
{
    "success": false,
    "message": "Product not found",
    "status": 404
}
```

#### 5. Cannot Delete Category with Products

```json
{
    "success": false,
    "message": "Cannot delete category with 15 associated products.",
    "status": 400
}
```

#### 6. Duplicate Category Title

```json
{
    "success": false,
    "message": "Validation error",
    "errors": {
        "title": "A category with this title already exists"
    },
    "status": 400
}
```

---

## 📊 Data Models Summary

### Product Category Object

```typescript
{
  _id: string;                    // MongoDB ObjectId
  title: string;                  // Unique
  slug: string;                   // Auto-generated from title
  description?: string;           // Optional
  icon?: string;                  // Optional, must be full URL
  order: number;                  // For sorting, default: 0
  isActive: boolean;              // Default: true
  productCount: number;           // Auto-updated, default: 0
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Object

```typescript
{
  _id: string;                    // MongoDB ObjectId
  name: string;                   // Max 200 chars
  description: string;            // Max 2000 chars
  category: {
    _id: string;                  // Reference to ProductCategory
    title: string;                // Denormalized for performance
  };
  baseCost: number;               // Original price
  discountRate: number;           // 0-100 percentage
  finalPrice: number;             // AUTO-CALCULATED: baseCost * (1 - discountRate/100)
  availableQuantity: number;      // Stock count
  images: string[];               // Array of URLs, min 1
  isActive: boolean;              // Default: true
  isNew: boolean;                 // Virtual: created within 7 days
  inStock: boolean;               // Virtual: availableQuantity > 0
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔑 Key Points for Frontend

✅ **Always include Authorization header** with Bearer token
✅ **Upload images FIRST**, then use URLs in product/category creation
✅ **DON'T send finalPrice** - it's auto-calculated from baseCost & discountRate
✅ **Category must exist** before creating products
✅ **Category must have both \_id and title** when creating/updating products
✅ **At least 1 image required** for products
✅ **Images accept relative paths** (`/uploads/...`) or full URLs
✅ **Category icon must be full URL** (e.g., `https://...`)
✅ **Cannot delete category** if products are linked to it
✅ **isNew and inStock** are virtual fields (read-only)
✅ **Product count** in category is auto-managed

---

## 🚀 Quick Reference

### Workflow Order:

1. **Login** → Get admin token
2. **Create Categories** → Get category IDs
3. **Upload Images** → Get image URLs
4. **Create Products** → Link to categories, use image URLs
5. **Manage** → Update, toggle active, update stock

### Required Fields:

**Category:**

- title ✅

**Product:**

- name ✅
- description ✅
- category.\_id ✅
- category.title ✅
- baseCost ✅
- images (min 1) ✅

### Optional Fields:

**Category:**

- description, icon, order, isActive

**Product:**

- discountRate, availableQuantity, isActive

---

## 📞 Support

Base URL: `https://class-crew.onrender.com/api/v1`

For testing: Use Postman collection at `backend/postman/Products-Complete-API.postman_collection.json`

---

**Last Updated:** November 12, 2025
**API Version:** v1
