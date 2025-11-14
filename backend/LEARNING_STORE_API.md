# Learning Store API Documentation

## ✅ Complete API Reference for Frontend Integration

All endpoints are **READY** and match frontend requirements exactly!

---

## 📋 1. Product Listing API

### **GET `/api/v1/products`** (Public - No Auth Required)

Get all active products with pagination and filtering.

### **Query Parameters:**

```typescript
{
  page?: number;           // Default: 1
  limit?: number;          // Default: 12
  category?: string;       // Filter by category ID
  sortBy?: 'createdAt' | 'baseCost' | 'finalPrice' | 'name';
  sortOrder?: 'asc' | 'desc';  // Default: 'desc'
  search?: string;         // Text search in name/description
  minPrice?: number;       // Filter by finalPrice
  maxPrice?: number;       // Filter by finalPrice
  inStock?: 'true' | 'false';  // Filter by stock availability
}
```

### **Example Request:**

```bash
GET https://class-crew.onrender.com/api/v1/products?page=1&limit=12&category=cat123
```

### **Response Structure:**

```json
{
  "status": "success",
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "product123",
      "name": "66일 챌린지",
      "description": "66일 동안 꾸준한 실천을 돕는 굿즈...",
      "detailedDescription": "이를 통해 누구나 지속 가능한 성장과 발전을...",
      "category": {
        "_id": "cat123",
        "title": "진단도구"
      },
      "baseCost": 100000,
      "discountRate": 33,
      "finalPrice": 67000,      // Auto-calculated: baseCost * (1 - discountRate/100)
      "availableQuantity": 10,
      "images": [
        "https://class-crew.onrender.com/uploads/products/product123/main.jpg",
        "https://class-crew.onrender.com/uploads/products/product123/thumb1.jpg",
        "https://class-crew.onrender.com/uploads/products/product123/thumb2.jpg",
        "https://class-crew.onrender.com/uploads/products/product123/thumb3.jpg"
      ],
      "detailImages": [
        "https://class-crew.onrender.com/uploads/products/product123/detail1.jpg",
        "https://class-crew.onrender.com/uploads/products/product123/detail2.jpg"
      ],
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z",
      "id": "product123"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 24,
    "totalPages": 2
  }
}
```

### **Frontend Integration:**

```typescript
// In your Product Listing Page
const response = await fetch(
  `${API_URL}/products?page=${page}&limit=12&category=${categoryId}`
);
const { data, pagination } = await response.json();

// NEW Badge Logic (Frontend calculates this)
const isNew = (createdAt: string) => {
  const productDate = new Date(createdAt);
  const now = new Date();
  return productDate.getMonth() === now.getMonth() && 
         productDate.getFullYear() === now.getFullYear();
};
```

---

## 🛍️ 2. Product Detail API

### **GET `/api/v1/products/:id`** (Public - No Auth Required)

Get single product with all details.

### **Example Request:**

```bash
GET https://class-crew.onrender.com/api/v1/products/product123
```

### **Response Structure:**

```json
{
  "status": "success",
  "message": "Product retrieved successfully",
  "data": {
    "_id": "product123",
    "name": "66일 챌린지",
    "description": "66일 동안 꾸준한 실천을 돕는 굿즈를 제작하여...",
    "detailedDescription": "이를 통해 누구나 지속 가능한 성장과 발전을 이루어 낼 수 있도록 돕습니다. 해당 굿즈를 제작하여 성장과 발전...",
    "category": {
      "_id": "cat123",
      "title": "진단도구"
    },
    "baseCost": 100000,
    "discountRate": 0,
    "finalPrice": 100000,
    "availableQuantity": 10,
    "images": [
      "https://class-crew.onrender.com/uploads/products/product123/main.jpg",
      "https://class-crew.onrender.com/uploads/products/product123/thumb1.jpg",
      "https://class-crew.onrender.com/uploads/products/product123/thumb2.jpg",
      "https://class-crew.onrender.com/uploads/products/product123/thumb3.jpg"
    ],
    "detailImages": [
      "https://class-crew.onrender.com/uploads/products/product123/detail-big-frame.jpg",
      "https://class-crew.onrender.com/uploads/products/product123/detail-second-frame.jpg"
    ],
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "id": "product123"
  }
}
```

### **Frontend Integration:**

```tsx
// Product Detail Page
const product = response.data;

// Main product images carousel (top section)
<div className="images-carousel">
  {product.images.map((img, index) => (
    <img key={index} src={img} alt={`${product.name} ${index + 1}`} />
  ))}
</div>

// Detail images (bottom section)
<div className="detail-section">
  <p>{product.detailedDescription}</p>
  {product.detailImages?.map((img, index) => (
    <img key={index} src={img} alt={`Detail ${index + 1}`} />
  ))}
</div>
```

**Image Mapping:**
- `images[0]` → Main product image
- `images[1-3]` → Thumbnail images (if available)
- `detailImages[0]` → Replaces `/big-frame-image.png` (line 184)
- `detailImages[1]` → Replaces `/second-frame-image.png` (line 222)

---

## 🛒 3. Add to Cart API

### **POST `/api/v1/cart/add`** (Requires Authentication)

Add product to shopping cart.

### **Request Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### **Request Body:**

```json
{
  "productId": "product123",
  "quantity": 2,
  "itemType": "product"    // IMPORTANT: Must be "product" (not "course")
}
```

### **Example Request:**

```bash
POST https://class-crew.onrender.com/api/v1/cart/add
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "productId": "product123",
  "quantity": 2,
  "itemType": "product"
}
```

### **Response:**

```json
{
  "status": "success",
  "message": "Product added to cart successfully",
  "data": {
    "_id": "cart123",
    "user": "user123",
    "items": [
      {
        "_id": "cartitem456",
        "itemType": "product",
        "product": {
          "_id": "product123",
          "name": "66일 챌린지",
          "baseCost": 100000,
          "finalPrice": 100000,
          "images": [
            "https://class-crew.onrender.com/uploads/products/product123/main.jpg"
          ],
          "category": {
            "_id": "cat123",
            "title": "진단도구"
          },
          "availableQuantity": 10
        },
        "quantity": 2,
        "priceAtTime": 100000,
        "subtotal": 200000      // priceAtTime * quantity
      }
    ],
    "totalAmount": 200000,
    "itemCount": 1
  }
}
```

### **Frontend Integration:**

```typescript
const addToCart = async (productId: string, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
      itemType: 'product'  // Important!
    }),
  });
  
  if (response.ok) {
    toast.success('상품이 장바구니에 추가되었습니다');
    router.push('/shopping-basket');
  }
};
```

---

## 🛍️ 4. Get Cart / Shopping Basket API

### **GET `/api/v1/cart`** (Requires Authentication)

Get user's shopping cart with all items.

### **Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

### **Example Request:**

```bash
GET https://class-crew.onrender.com/api/v1/cart
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Response:**

```json
{
  "status": "success",
  "message": "장바구니를 성공적으로 조회했습니다",
  "data": {
    "_id": "cart123",
    "user": "user123",
    "items": [
      {
        "_id": "item1",
        "itemType": "course",      // ← Frontend filters by this
        "course": {
          "_id": "course123",
          "title": "Course Name",
          ...
        },
        "quantity": 1,
        "priceAtTime": 150000,
        "subtotal": 150000
      },
      {
        "_id": "item2",
        "itemType": "product",     // ← Frontend filters by this
        "product": {
          "_id": "product123",
          "name": "66일 챌린지",
          "baseCost": 100000,
          "finalPrice": 100000,
          "images": [...],
          ...
        },
        "quantity": 2,
        "priceAtTime": 100000,
        "subtotal": 200000
      }
    ],
    "totalAmount": 350000,
    "itemCount": 2,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### **Frontend Filter Logic:**

```typescript
// Shopping Basket Page (Already implemented in shopping-basket/page.tsx)
const [filterType, setFilterType] = useState<"all" | "course" | "product">("all");

const filteredItems = cartItems.filter(item => {
  if (filterType === "all") return true;
  return item.itemType === filterType;
});

// Filter buttons
<button onClick={() => setFilterType("all")}>전체</button>
<button onClick={() => setFilterType("course")}>수강신청</button>
<button onClick={() => setFilterType("product")}>상품구매</button>
```

**✅ No backend changes needed** - Already supports filtering!

---

## 🗑️ 5. Update Cart Item Quantity

### **PUT `/api/v1/cart/update/:productId`** (Requires Authentication)

Update quantity of item in cart.

### **Request Body:**

```json
{
  "quantity": 3
}
```

### **Example:**

```bash
PUT https://class-crew.onrender.com/api/v1/cart/update/product123
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

---

## 🗑️ 6. Remove from Cart

### **DELETE `/api/v1/cart/remove/:productId`** (Requires Authentication)

Remove item from cart.

### **Example:**

```bash
DELETE https://class-crew.onrender.com/api/v1/cart/remove/product123
Authorization: Bearer <token>
```

---

## 📦 7. Product Categories API

### **GET `/api/v1/product-categories`** (Public)

Get all product categories.

### **Response:**

```json
{
  "status": "success",
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "cat123",
      "title": "진단도구",
      "description": "Self-assessment tools",
      "order": 1,
      "isActive": true,
      "createdAt": "2025-01-10T00:00:00.000Z"
    },
    {
      "_id": "cat456",
      "title": "문구류",
      "description": "Stationery items",
      "order": 2,
      "isActive": true,
      "createdAt": "2025-01-10T00:00:00.000Z"
    }
  ]
}
```

---

## 🔐 Authentication Requirements

### **Public Access (No Login Required):**
- ✅ `GET /products` - Browse products
- ✅ `GET /products/:id` - View product details
- ✅ `GET /product-categories` - View categories

### **Requires Login:**
- 🔒 `POST /cart/add` - Add to cart
- 🔒 `GET /cart` - View cart
- 🔒 `PUT /cart/update/:productId` - Update cart item
- 🔒 `DELETE /cart/remove/:productId` - Remove from cart

---

## 📸 Image URL Format

### **Backend Returns:**
```json
{
  "images": [
    "/uploads/products/product123/image1.jpg",
    "/uploads/products/product123/image2.jpg"
  ]
}
```

### **Frontend Needs:**
Full URLs with domain:
```json
{
  "images": [
    "https://class-crew.onrender.com/uploads/products/product123/image1.jpg",
    "https://class-crew.onrender.com/uploads/products/product123/image2.jpg"
  ]
}
```

### **✅ Solution Already Implemented:**

The backend is configured to return full URLs automatically when `SERVER_URL` environment variable is set:

```env
SERVER_URL=https://class-crew.onrender.com
```

---

## 🎯 Key Points for Frontend Developer

### 1. **NEW Badge Logic**
Frontend calculates if product is "NEW":
```typescript
const isNew = (createdAt: string) => {
  const date = new Date(createdAt);
  const now = new Date();
  return date.getMonth() === now.getMonth() && 
         date.getFullYear() === now.getFullYear();
};
```

### 2. **Price Display**
- Show `baseCost` as original price (crossed out if discount exists)
- Show `finalPrice` as current price
- Display `discountRate` as discount percentage badge

### 3. **Stock Check**
```typescript
const inStock = product.availableQuantity > 0;
```

### 4. **Image Arrays**
- `images[]` → Product photos carousel (main + thumbnails)
- `detailImages[]` → Detail section images (max 2)

### 5. **Cart Integration**
Always use `itemType: "product"` when adding products to cart.

---

## 🚀 Testing the APIs

### **1. Get Products List:**
```bash
curl https://class-crew.onrender.com/api/v1/products
```

### **2. Get Single Product:**
```bash
curl https://class-crew.onrender.com/api/v1/products/[product_id]
```

### **3. Get Categories:**
```bash
curl https://class-crew.onrender.com/api/v1/product-categories
```

### **4. Add to Cart (requires login):**
```bash
curl -X POST https://class-crew.onrender.com/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product123",
    "quantity": 1,
    "itemType": "product"
  }'
```

---

## ✅ Summary

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Product Listing | `GET /products` | ✅ Ready | Supports pagination, filters, sorting |
| Product Detail | `GET /products/:id` | ✅ Ready | Includes `detailImages` field |
| Add to Cart | `POST /cart/add` | ✅ Ready | Use `itemType: "product"` |
| View Cart | `GET /cart` | ✅ Ready | Supports frontend filtering |
| Update Cart | `PUT /cart/update/:id` | ✅ Ready | Working |
| Remove from Cart | `DELETE /cart/remove/:id` | ✅ Ready | Working |
| Categories | `GET /product-categories` | ✅ Ready | Working |

**All APIs are production-ready!** 🎉

Frontend can start integration immediately after Render deployment completes.

