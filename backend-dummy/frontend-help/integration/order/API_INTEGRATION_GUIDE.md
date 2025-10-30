# 📦 Order Module - API Integration Guide

## Base URL
```
/api/orders
```

---

## 📋 Overview

The Order module handles order creation, tracking, and management. Orders are created from cart items during checkout.

---

## 🔗 Module Relationships

- **Order** → **User** (N:1): Each order belongs to one user
- **Order** → **Product** (N:M): Order contains products (snapshot at purchase time)
- **Order** ← **Cart**: Created from cart items

---

## 🎯 API Endpoints

### 1. Create Order (Checkout)
```http
POST /api/orders/create
```

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "user123",
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "1234567890",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "card",
  "notes": "Please deliver before 6 PM"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "order123",
    "orderNumber": "ORD-20240120-001",
    "user": "user123",
    "items": [
      {
        "product": {
          "_id": "prod123",
          "name": "JavaScript Book",
          "images": ["https://image.jpg"]
        },
        "quantity": 2,
        "price": 799,
        "subtotal": 1598
      }
    ],
    "subtotal": 1598,
    "tax": 287.64,
    "shippingCharge": 50,
    "discount": 0,
    "totalAmount": 1935.64,
    "status": "pending",
    "paymentStatus": "pending",
    "paymentMethod": "card",
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "1234567890",
      "addressLine1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Field Validations:**
- All shipping address fields required except `addressLine2`
- `paymentMethod`: One of `card`, `upi`, `cod`
- Cart must have items

**Use Case:** Checkout page submission

---

### 2. Get User Orders
```http
GET /api/orders
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `userId` (required): User ID
- `status` (optional): Filter by status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```
GET /api/orders?userId=user123&status=delivered&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "order123",
        "orderNumber": "ORD-20240120-001",
        "items": [
          {
            "product": {
              "_id": "prod123",
              "name": "JavaScript Book"
            },
            "quantity": 2,
            "price": 799
          }
        ],
        "totalAmount": 1935.64,
        "status": "delivered",
        "paymentStatus": "paid",
        "createdAt": "2024-01-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalOrders": 25,
      "limit": 10
    }
  }
}
```

**Order Status Values:**
- `pending`: Order placed, awaiting confirmation
- `confirmed`: Order confirmed by admin
- `processing`: Order being prepared
- `shipped`: Order shipped
- `delivered`: Order delivered
- `cancelled`: Order cancelled

---

### 3. Get Single Order by ID
```http
GET /api/orders/:orderId
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**URL Parameters:**
- `orderId`: Order ID

**Query Parameters:**
- `userId` (optional): For verification

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "order123",
    "orderNumber": "ORD-20240120-001",
    "user": {
      "_id": "user123",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "product": {
          "_id": "prod123",
          "name": "JavaScript Book",
          "images": ["https://image.jpg"],
          "category": "Books"
        },
        "quantity": 2,
        "price": 799,
        "subtotal": 1598
      }
    ],
    "subtotal": 1598,
    "tax": 287.64,
    "shippingCharge": 50,
    "discount": 0,
    "totalAmount": 1935.64,
    "status": "shipped",
    "paymentStatus": "paid",
    "paymentMethod": "card",
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "1234567890",
      "addressLine1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "trackingNumber": "TRACK123456",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-20T10:00:00.000Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-01-20T11:00:00.000Z"
      },
      {
        "status": "shipped",
        "timestamp": "2024-01-21T09:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-21T09:00:00.000Z"
  }
}
```

---

### 4. Track Order by Order Number
```http
GET /api/orders/track/:orderNumber
```

**URL Parameters:**
- `orderNumber`: Order number (e.g., ORD-20240120-001)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderNumber": "ORD-20240120-001",
    "status": "shipped",
    "trackingNumber": "TRACK123456",
    "estimatedDelivery": "2024-01-25T18:00:00.000Z",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-20T10:00:00.000Z",
        "description": "Order placed successfully"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-01-20T11:00:00.000Z",
        "description": "Order confirmed"
      },
      {
        "status": "shipped",
        "timestamp": "2024-01-21T09:00:00.000Z",
        "description": "Order shipped"
      }
    ]
  }
}
```

**Use Case:** Order tracking page (public, no auth required)

---

### 5. Get User Order Statistics
```http
GET /api/orders/stats/:userId
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**URL Parameters:**
- `userId`: User ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 15,
    "totalSpent": 45000,
    "ordersByStatus": {
      "pending": 2,
      "confirmed": 1,
      "shipped": 3,
      "delivered": 8,
      "cancelled": 1
    },
    "recentOrders": [
      // Last 5 orders
    ]
  }
}
```

---

### 6. Cancel Order
```http
PUT /api/orders/:orderId/cancel
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**URL Parameters:**
- `orderId`: Order ID

**Request Body:**
```json
{
  "userId": "user123",
  "reason": "Changed my mind"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    // Updated order with status: "cancelled"
  }
}
```

**Restrictions:**
- Can only cancel if status is `pending` or `confirmed`
- Cannot cancel if already shipped/delivered

---

### 7. Update Order Status (Admin)
```http
PUT /api/orders/:orderId/status
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**URL Parameters:**
- `orderId`: Order ID

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    // Updated order
  }
}
```

**Status Transitions:**
- `pending` → `confirmed`
- `confirmed` → `processing`
- `processing` → `shipped`
- `shipped` → `delivered`
- Any status → `cancelled`

---

### 8. Get All Orders (Admin)
```http
GET /api/orders/admin/all
```

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      // All orders with user details
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalOrders": 250
    },
    "statistics": {
      "totalRevenue": 500000,
      "totalOrders": 250,
      "averageOrderValue": 2000
    }
  }
}
```

---

## 💻 Frontend Implementation

### React - Checkout Page

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    paymentMethod: 'card',
    notes: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/orders/create',
        {
          userId,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country
          },
          paymentMethod: formData.paymentMethod,
          notes: formData.notes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Order placed successfully!');
        window.location.href = `/orders/${response.data.data._id}`;
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div className="checkout-page">
      <div className="checkout-form">
        <h2>Shipping Information</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            required
          />
          
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            pattern="[0-9]{10}"
            required
          />
          
          <input
            type="text"
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
            required
          />
          
          <input
            type="text"
            placeholder="Address Line 2 (Optional)"
            value={formData.addressLine2}
            onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
          />
          
          <div className="row">
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
            
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              required
            />
          </div>
          
          <input
            type="text"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
            pattern="[0-9]{6}"
            required
          />
          
          <h3>Payment Method</h3>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>
          
          <textarea
            placeholder="Order Notes (Optional)"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.items.map(item => (
          <div key={item.product._id} className="summary-item">
            <span>{item.product.name} x {item.quantity}</span>
            <span>₹{item.subtotal}</span>
          </div>
        ))}
        
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{cart.totalAmount}</span>
        </div>
        <div className="summary-row">
          <span>Tax (18%):</span>
          <span>₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>₹50</span>
        </div>
        <div className="summary-row total">
          <span><strong>Total:</strong></span>
          <span><strong>₹{(cart.totalAmount * 1.18 + 50).toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
```

---

### React - Order Tracking Page

```javascript
import { useState } from 'react';
import axios from 'axios';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const response = await axios.get(`/api/orders/track/${orderNumber}`);
      
      if (response.data.success) {
        setOrderData(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-tracking">
      <h1>Track Your Order</h1>
      
      <form onSubmit={trackOrder}>
        <input
          type="text"
          placeholder="Enter Order Number (e.g., ORD-20240120-001)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Tracking...' : 'Track Order'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {orderData && (
        <div className="tracking-results">
          <h2>Order #{orderData.orderNumber}</h2>
          <p className="status">Status: <strong>{orderData.status}</strong></p>
          {orderData.trackingNumber && (
            <p>Tracking Number: {orderData.trackingNumber}</p>
          )}
          {orderData.estimatedDelivery && (
            <p>Estimated Delivery: {new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>
          )}

          <div className="status-timeline">
            <h3>Order Timeline</h3>
            {orderData.statusHistory.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{item.status}</h4>
                  <p>{item.description}</p>
                  <small>{new Date(item.timestamp).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
```

---

## ✅ Integration Checklist

- [ ] Checkout page with shipping form
- [ ] Order creation from cart
- [ ] My Orders page
- [ ] Order detail page
- [ ] Order tracking page
- [ ] Cancel order functionality
- [ ] Order status updates
- [ ] Admin order management

---

## 🐛 Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Cart is empty | Add items to cart first |
| 400 | Invalid shipping address | Check required fields |
| 400 | Cannot cancel order | Check order status |
| 404 | Order not found | Verify order ID/number |

---

**Related Modules:** Cart, Product, User

