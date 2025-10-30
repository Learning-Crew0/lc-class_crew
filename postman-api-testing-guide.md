# Complete Postman API Testing Guide

## Base URL
```
http://localhost:3000/api
```

## 1. Product Category Controller Tests

### 1.1 Get All Product Categories
- **Method**: GET
- **URL**: `{{baseUrl}}/categories`
- **Headers**: None required
- **Body**: None

### 1.2 Get Product Category by ID
- **Method**: GET
- **URL**: `{{baseUrl}}/categories/{{categoryId}}`
- **Headers**: None required
- **Body**: None
- **Path Variables**: 
  - `categoryId`: Valid MongoDB ObjectId

### 1.3 Create Product Category
- **Method**: POST
- **URL**: `{{baseUrl}}/categories`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "title": "Electronics",
    "description": "Electronic gadgets and devices",
    "order": 1,
    "isActive": true
  }
  ```

### 1.4 Update Product Category
- **Method**: PUT
- **URL**: `{{baseUrl}}/categories/{{categoryId}}`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "title": "Updated Electronics",
    "description": "Updated description for electronics",
    "order": 2,
    "isActive": false
  }
  ```

### 1.5 Delete Product Category
- **Method**: DELETE
- **URL**: `{{baseUrl}}/categories/{{categoryId}}`
- **Headers**: None required
- **Body**: None

---

## 2. Product Controller Tests

### 2.1 Get All Products
- **Method**: GET
- **URL**: `{{baseUrl}}/products`
- **Headers**: None required
- **Query Parameters** (optional):
  - `page`: 1
  - `limit`: 10
  - `isActive`: true
  - `category`: {{categoryId}}

### 2.2 Get Product by ID
- **Method**: GET
- **URL**: `{{baseUrl}}/products/{{productId}}`
- **Headers**: None required
- **Body**: None

### 2.3 Create Product (with images)
- **Method**: POST
- **URL**: `{{baseUrl}}/products`
- **Headers**: 
  ```
  Content-Type: multipart/form-data
  ```
- **Body** (form-data):
  ```
  name: iPhone 15 Pro
  category: {{categoryId}}
  baseCost: 99999
  discountRate: 10
  availableQuantity: 50
  description: Latest iPhone with advanced features
  isActive: true
  images: [Select files - multiple image files]
  ```

### 2.4 Create Product (without images)
- **Method**: POST
- **URL**: `{{baseUrl}}/products`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "name": "Samsung Galaxy S24",
    "category": "{{categoryId}}",
    "baseCost": 79999,
    "discountRate": 15,
    "availableQuantity": 30,
    "description": "Latest Samsung flagship phone",
    "isActive": true
  }
  ```

### 2.5 Update Product (with images)
- **Method**: PUT
- **URL**: `{{baseUrl}}/products/{{productId}}`
- **Headers**: 
  ```
  Content-Type: multipart/form-data
  ```
- **Body** (form-data):
  ```
  name: Updated iPhone 15 Pro
  baseCost: 89999
  discountRate: 20
  availableQuantity: 25
  description: Updated description
  isActive: true
  images: [Select new image files]
  ```

### 2.6 Update Product (without images)
- **Method**: PUT
- **URL**: `{{baseUrl}}/products/{{productId}}`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "name": "Updated Samsung Galaxy S24",
    "baseCost": 69999,
    "discountRate": 25,
    "availableQuantity": 20,
    "description": "Updated Samsung phone description",
    "isActive": true
  }
  ```

### 2.7 Delete Product
- **Method**: DELETE
- **URL**: `{{baseUrl}}/products/{{productId}}`
- **Headers**: None required
- **Body**: None

---

## 3. Cart Controller Tests

### 3.1 Get User Cart
- **Method**: GET
- **URL**: `{{baseUrl}}/cart`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "userId": "{{userId}}"
  }
  ```

### 3.2 Add Item to Cart
- **Method**: POST
- **URL**: `{{baseUrl}}/cart/add`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "userId": "{{userId}}",
    "productId": "{{productId}}",
    "quantity": 2
  }
  ```

### 3.3 Update Cart Item Quantity
- **Method**: PUT
- **URL**: `{{baseUrl}}/cart/update/{{productId}}`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "userId": "{{userId}}",
    "quantity": 5
  }
  ```

### 3.4 Remove Item from Cart
- **Method**: DELETE
- **URL**: `{{baseUrl}}/cart/remove/{{productId}}`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "userId": "{{userId}}"
  }
  ```

### 3.5 Clear Entire Cart
- **Method**: DELETE
- **URL**: `{{baseUrl}}/cart/clear`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "userId": "{{userId}}"
  }
  ```

### 3.6 Clean Cart (Remove Inactive Products)
- **Method**: POST
- **URL**: `{{baseUrl}}/cart/clean`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "userId": "{{userId}}"
  }
  ```

### 3.7 Get Cart Summary
- **Method**: GET
- **URL**: `{{baseUrl}}/cart/summary?userId={{userId}}`
- **Headers**: None required
- **Body**: None

---

## 4. Order Controller Tests

### 4.1 Create Order from Cart
- **Method**: POST
- **URL**: `{{baseUrl}}/orders/create`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "userId": "{{userId}}",
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "+91-9876543210",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India"
    },
    "paymentMethod": "cod",
    "notes": "Please deliver between 10 AM - 6 PM"
  }
  ```

### 4.2 Get User Orders
- **Method**: GET
- **URL**: `{{baseUrl}}/orders?userId={{userId}}`
- **Headers**: None required
- **Query Parameters** (optional):
  - `status`: pending/confirmed/shipped/delivered/cancelled

### 4.3 Get Order by ID
- **Method**: GET
- **URL**: `{{baseUrl}}/orders/{{orderId}}?userId={{userId}}`
- **Headers**: None required
- **Body**: None

### 4.4 Cancel Order
- **Method**: PUT
- **URL**: `{{baseUrl}}/orders/{{orderId}}/cancel`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "userId": "{{userId}}",
    "reason": "Changed my mind"
  }
  ```

### 4.5 Update Order Status (Admin)
- **Method**: PUT
- **URL**: `{{baseUrl}}/orders/{{orderId}}/status`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON):
  ```json
  {
    "status": "shipped",
    "trackingNumber": "TRK123456789"
  }
  ```

### 4.6 Get User Order Statistics
- **Method**: GET
- **URL**: `{{baseUrl}}/orders/stats/{{userId}}`
- **Headers**: None required
- **Body**: None

### 4.7 Get All Orders (Admin)
- **Method**: GET
- **URL**: `{{baseUrl}}/orders/admin/all`
- **Headers**: None required
- **Query Parameters** (optional):
  - `status`: pending/confirmed/shipped/delivered/cancelled
  - `page`: 1
  - `limit`: 20

### 4.8 Track Order by Order Number
- **Method**: GET
- **URL**: `{{baseUrl}}/orders/track/{{orderNumber}}`
- **Headers**: None required
- **Body**: None

---

## Postman Environment Variables

Create these variables in your Postman environment:

```
baseUrl: http://localhost:3000/api
userId: 507f1f77bcf86cd799439011
categoryId: 507f1f77bcf86cd799439012
productId: 507f1f77bcf86cd799439013
orderId: 507f1f77bcf86cd799439014
orderNumber: ORD-1234567890
```

## Testing Sequence

### 1. Product Category Flow:
1. Create category → Save categoryId
2. Get all categories
3. Get category by ID
4. Update category
5. Delete category (optional)

### 2. Product Flow:
1. Create product with categoryId → Save productId
2. Get all products
3. Get product by ID
4. Update product
5. Delete product (optional)

### 3. Cart Flow:
1. Add items to cart
2. Get cart
3. Update item quantity
4. Get cart summary
5. Remove item
6. Clear cart

### 4. Order Flow:
1. Add items to cart
2. Create order from cart
3. Get user orders
4. Get order by ID
5. Update order status
6. Cancel order
7. Track order

## Sample Test Data

### Valid MongoDB ObjectIds for Testing:
```
507f1f77bcf86cd799439011
507f1f77bcf86cd799439012
507f1f77bcf86cd799439013
507f1f77bcf86cd799439014
507f1f77bcf86cd799439015
```

### Payment Methods:
- cod (Cash on Delivery)
- card
- upi
- netbanking
- wallet

### Order Status Values:
- pending
- confirmed
- processing
- shipped
- delivered
- cancelled

## Error Testing

Test these scenarios for robust error handling:

1. **Invalid ObjectIds**: Use invalid IDs like "invalid-id"
2. **Missing Required Fields**: Remove required fields from requests
3. **Non-existent Resources**: Use valid ObjectIds that don't exist
4. **Invalid Quantities**: Use negative numbers or zero
5. **Inactive Products**: Try to add inactive products to cart
6. **Empty Cart**: Try to create order with empty cart
7. **Insufficient Stock**: Add more items than available quantity

This comprehensive guide covers all your API endpoints with proper request formats and test scenarios!