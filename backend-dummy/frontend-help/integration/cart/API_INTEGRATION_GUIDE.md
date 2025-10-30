# 🛒 Cart Module - API Integration Guide

## Base URL
```
/api/cart
```

---

## 📋 Overview

The Cart module manages user shopping carts for products. Each user has one cart that persists across sessions.

---

## 🔗 Module Relationships

- **Cart** → **User** (N:1): Each cart belongs to one user
- **Cart** → **Product** (N:M): Cart contains multiple products through items array
- **Cart** → **Order**: Cart items move to order on checkout

---

## 🎯 API Endpoints

All cart endpoints require authentication.

**Authentication Header Required:**
```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

---

### 1. Get User Cart
```http
GET /api/cart
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "cart123",
    "user": "user123",
    "items": [
      {
        "product": {
          "_id": "prod123",
          "name": "JavaScript Book",
          "baseCost": 999,
          "discountRate": 20,
          "finalPrice": 799,
          "images": ["https://image1.jpg"],
          "availableQuantity": 50,
          "category": {
            "_id": "cat123",
            "title": "Books"
          }
        },
        "quantity": 2,
        "priceAtTime": 799,
        "subtotal": 1598
      },
      {
        "product": {
          "_id": "prod456",
          "name": "React Course",
          "finalPrice": 2999,
          "images": ["https://image2.jpg"],
          "availableQuantity": 100
        },
        "quantity": 1,
        "priceAtTime": 2999,
        "subtotal": 2999
      }
    ],
    "totalAmount": 4597,
    "itemCount": 3,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

**Use Case:** Display cart items on cart page

---

### 2. Get Cart Summary
```http
GET /api/cart/summary
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "itemCount": 3,
    "totalAmount": 4597,
    "hasItems": true
  }
}
```

**Use Case:** Show cart count in header/navbar

---

### 3. Add Item to Cart
```http
POST /api/cart/add
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "user123",
  "productId": "prod123",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": {
    "_id": "cart123",
    "items": [...],
    "totalAmount": 4597,
    "itemCount": 3
  }
}
```

**Validations:**
- `productId`: Must be valid product ID
- `quantity`: Must be >= 1
- Product must be active and in stock
- Cannot exceed available quantity

**Use Case:** "Add to Cart" button on product page

---

### 4. Update Cart Item Quantity
```http
PUT /api/cart/update/:productId
```

**Headers:**
```
Authorization: Bearer eyJhbğc...
```

**URL Parameters:**
- `productId`: Product ID to update

**Request Body:**
```json
{
  "userId": "user123",
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    // Updated cart object
  }
}
```

**Validations:**
- `quantity`: Must be >= 1
- Cannot exceed product stock

**Use Case:** +/- buttons on cart page

---

### 5. Remove Item from Cart
```http
DELETE /api/cart/remove/:productId
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**URL Parameters:**
- `productId`: Product ID to remove

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "data": {
    // Updated cart object
  }
}
```

**Use Case:** Remove button on cart items

---

### 6. Clear Entire Cart
```http
DELETE /api/cart/clear
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "_id": "cart123",
    "items": [],
    "totalAmount": 0,
    "itemCount": 0
  }
}
```

**Use Case:** Clear cart button or after successful order

---

### 7. Clean Cart (Remove Inactive Products)
```http
POST /api/cart/clean
```

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleaned successfully",
  "data": {
    "removed": 2,
    "cart": {
      // Updated cart object
    }
  }
}
```

**Use Case:** Automatically remove out-of-stock or inactive products

---

## 💻 Frontend Implementation

### React - Cart Page

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // Or from context/redux

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
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/cart/update/${productId}`,
        { userId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    if (!confirm('Remove this item from cart?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `/api/cart/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId }
        }
      );

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!confirm('Clear entire cart?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        '/api/cart/clear',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId }
        }
      );

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      alert('Failed to clear cart');
    }
  };

  if (loading) return <div>Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <button onClick={() => window.location.href = '/products'}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({cart.itemCount} items)</h1>
      
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.product._id} className="cart-item">
            <img 
              src={item.product.images[0]} 
              alt={item.product.name}
              className="item-image"
            />
            
            <div className="item-details">
              <h3>{item.product.name}</h3>
              <p className="category">{item.product.category?.title}</p>
              <p className="price">
                ₹{item.priceAtTime}
                {item.product.discountRate > 0 && (
                  <span className="discount"> ({item.product.discountRate}% off)</span>
                )}
              </p>
              <p className="stock">
                {item.product.availableQuantity > 0 
                  ? `${item.product.availableQuantity} in stock`
                  : 'Out of stock'
                }
              </p>
            </div>
            
            <div className="item-actions">
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.availableQuantity}
                >
                  +
                </button>
              </div>
              
              <p className="subtotal">
                Subtotal: ₹{item.subtotal}
              </p>
              
              <button 
                onClick={() => removeItem(item.product._id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        
        <div className="summary-row">
          <span>Subtotal ({cart.itemCount} items):</span>
          <span>₹{cart.totalAmount}</span>
        </div>
        
        <div className="summary-row">
          <span>Shipping:</span>
          <span>₹50</span>
        </div>
        
        <div className="summary-row">
          <span>Tax (18%):</span>
          <span>₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
        </div>
        
        <div className="summary-row total">
          <span><strong>Total:</strong></span>
          <span><strong>₹{(cart.totalAmount * 1.18 + 50).toFixed(2)}</strong></span>
        </div>
        
        <button 
          className="checkout-btn"
          onClick={() => window.location.href = '/checkout'}
        >
          Proceed to Checkout
        </button>
        
        <button 
          className="clear-btn"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartPage;
```

---

### React - Add to Cart Button Component

```javascript
import { useState } from 'react';
import axios from 'axios';

const AddToCartButton = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const userId = localStorage.getItem('userId');

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to add items to cart');
      window.location.href = '/login';
      return;
    }

    if (product.availableQuantity === 0) {
      alert('Product is out of stock');
      return;
    }

    setAdding(true);
    
    try {
      const response = await axios.post(
        '/api/cart/add',
        {
          userId,
          productId: product._id,
          quantity
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert(`${product.name} added to cart!`);
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: response.data.data
        }));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="add-to-cart">
      <div className="quantity-selector">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={product.availableQuantity}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        />
        <button 
          onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
          disabled={quantity >= product.availableQuantity}
        >
          +
        </button>
      </div>
      
      <button 
        onClick={addToCart}
        disabled={adding || product.availableQuantity === 0}
        className="add-to-cart-btn"
      >
        {adding ? 'Adding...' : 
         product.availableQuantity === 0 ? 'Out of Stock' : 
         'Add to Cart'}
      </button>
    </div>
  );
};

export default AddToCartButton;
```

---

### React - Cart Icon with Count

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CartIcon = () => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/cart/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setItemCount(response.data.data.itemCount || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleCartUpdate = (event) => {
    if (event.detail?.itemCount !== undefined) {
      setItemCount(event.detail.itemCount);
    } else {
      fetchCartCount();
    }
  };

  return (
    <Link to="/cart" className="cart-icon">
      <svg>🛒</svg>
      {itemCount > 0 && (
        <span className="cart-badge">{itemCount}</span>
      )}
    </Link>
  );
};

export default CartIcon;
```

---

## 🔄 Cart Flow

```
1. User browses products
   ↓
2. Clicks "Add to Cart"
   ↓
3. POST /api/cart/add
   ↓
4. Cart icon updates (itemCount)
   ↓
5. User goes to cart page
   ↓
6. GET /api/cart (shows all items)
   ↓
7. User updates quantities
   ↓
8. PUT /api/cart/update/:productId
   ↓
9. User proceeds to checkout
   ↓
10. Cart items move to order
```

---

## ✅ Integration Checklist

- [ ] Implement cart page
- [ ] Add to cart functionality
- [ ] Update quantity controls
- [ ] Remove item functionality
- [ ] Clear cart functionality
- [ ] Cart icon with count in header
- [ ] Real-time cart updates
- [ ] Stock validation
- [ ] Handle out-of-stock products
- [ ] Price snapshot functionality

---

## 🐛 Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 401 | Authentication required | Include valid token |
| 404 | Product not found | Check product ID |
| 400 | Insufficient stock | Check available quantity |
| 400 | Invalid quantity | Must be >= 1 |

---

## 💡 Best Practices

1. **Price Snapshot:** Price is captured when item added (priceAtTime)
2. **Stock Validation:** Always check availableQuantity before adding
3. **Real-time Updates:** Use events/state management for cart count
4. **Persistence:** Cart persists across sessions
5. **Clean Cart:** Periodically remove inactive/out-of-stock products

---

**Related Modules:** Product, Order, User, ProductCategory

