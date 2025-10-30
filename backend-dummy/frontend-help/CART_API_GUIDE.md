# 🛒 Cart Module - Frontend Integration Guide

## Overview
The Cart module manages user shopping carts for the e-commerce system.

---

## 📍 Base Endpoint
```
/api/cart
```

---

## 🔗 Relationships

```
User (1:1) Cart
└── Cart contains many Products (N:M through CartItems)
    └── Each cart item references a Product
```

**Connections:**
- `Cart.user` references `User._id`
- `Cart.items[].product` references `Product._id`

---

## 📊 Data Model

```javascript
{
  "_id": "cart123",
  "user": "user123",
  "items": [
    {
      "product": {
        "_id": "prod123",
        "name": "JavaScript Book",
        "price": 999,
        "discountPrice": 799,
        "images": ["https://image.jpg"],
        "stock": 50,
        "category": { "name": "Books" }
      },
      "quantity": 2,
      "priceAtTime": 799, // Price when added to cart
      "subtotal": 1598
    }
  ],
  "totalAmount": 1598,
  "itemCount": 2,
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T15:30:00.000Z"
}
```

---

## 🎯 API Endpoints

### 1. Get User Cart
```javascript
GET /api/cart
Headers: { Authorization: "Bearer ${token}" }

// Response
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
          "price": 999,
          "discountPrice": 799,
          "images": ["https://image.jpg"],
          "stock": 50
        },
        "quantity": 2,
        "priceAtTime": 799,
        "subtotal": 1598
      }
    ],
    "totalAmount": 1598,
    "itemCount": 2
  }
}
```

**Use Case:** Display cart items and total on cart page

---

### 2. Add Product to Cart
```javascript
POST /api/cart/add
Headers: { Authorization: "Bearer ${token}" }

// Request
{
  "productId": "prod123",
  "quantity": 2
}

// Response
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": { /* updated cart */ }
}
```

**Use Case:** Add to cart button on product page

---

### 3. Update Cart Item Quantity
```javascript
PUT /api/cart/update/:productId
Headers: { Authorization: "Bearer ${token}" }

// Request
{
  "quantity": 3
}

// Response
{
  "success": true,
  "message": "Cart updated successfully",
  "data": { /* updated cart */ }
}
```

**Use Case:** +/- buttons on cart items

---

### 4. Remove Product from Cart
```javascript
DELETE /api/cart/remove/:productId
Headers: { Authorization: "Bearer ${token}" }

// Response
{
  "success": true,
  "message": "Product removed from cart",
  "data": { /* updated cart */ }
}
```

**Use Case:** Remove item button on cart page

---

### 5. Clear Cart
```javascript
DELETE /api/cart/clear
Headers: { Authorization: "Bearer ${token}" }

// Response
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "items": [],
    "totalAmount": 0,
    "itemCount": 0
  }
}
```

**Use Case:** Clear cart button or after successful order

---

## 💻 Frontend Implementation

### React Example - Cart Page

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

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
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      alert('Error updating cart: ' + error.response?.data?.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      alert('Error removing item: ' + error.response?.data?.message);
    }
  };

  const clearCart = async () => {
    if (!confirm('Clear all items from cart?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      alert('Error clearing cart');
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty</div>;
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
              <p className="price">
                {item.priceAtTime < item.product.price && (
                  <span className="original-price">
                    ₹{item.product.price}
                  </span>
                )}
                <span className="current-price">₹{item.priceAtTime}</span>
              </p>
              <p className="stock">
                {item.product.stock > 0 
                  ? `${item.product.stock} in stock`
                  : 'Out of stock'
                }
              </p>
            </div>
            
            <div className="item-actions">
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(
                    item.product._id, 
                    item.quantity - 1
                  )}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(
                    item.product._id, 
                    item.quantity + 1
                  )}
                  disabled={item.quantity >= item.product.stock}
                >
                  +
                </button>
              </div>
              
              <p className="subtotal">Subtotal: ₹{item.subtotal}</p>
              
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
        <h2>Cart Summary</h2>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{cart.totalAmount}</span>
        </div>
        <div className="summary-row">
          <span>Tax (18%):</span>
          <span>₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>₹{(cart.totalAmount * 1.18).toFixed(2)}</span>
        </div>
        
        <button className="checkout-btn" onClick={() => window.location.href = '/checkout'}>
          Proceed to Checkout
        </button>
        <button className="clear-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartPage;
```

---

### React Example - Add to Cart Button

```javascript
const AddToCartButton = ({ productId, productName }) => {
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      window.location.href = '/login';
      return;
    }

    setAdding(true);
    try {
      const response = await axios.post(
        '/api/cart/add',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`${productName} added to cart!`);
        // Update cart count in header
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="add-to-cart">
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button 
        onClick={addToCart}
        disabled={adding}
        className="add-to-cart-btn"
      >
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};
```

---

### React Example - Cart Icon with Count

```javascript
const CartIcon = () => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setItemCount(response.data.data.itemCount || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <Link to="/cart" className="cart-icon">
      <ShoppingCartIcon />
      {itemCount > 0 && (
        <span className="cart-badge">{itemCount}</span>
      )}
    </Link>
  );
};
```

---

## 🔄 State Management (Redux Example)

```javascript
// Redux Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/cart/add',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    itemCount: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.itemCount = action.payload.itemCount;
      });
  }
});

export default cartSlice.reducer;
```

---

## 🎨 UI/UX Recommendations

1. **Cart Page:**
   - Show product image, name, price
   - Quantity controls with stock limits
   - Real-time total calculation
   - Remove item confirmation
   - Empty cart state

2. **Add to Cart:**
   - Loading state while adding
   - Success notification
   - Quantity selector
   - Stock availability indicator
   - Login prompt for guests

3. **Cart Icon:**
   - Always visible in header
   - Show item count badge
   - Update in real-time
   - Link to cart page

---

## ⚠️ Important Notes

1. **Stock Validation:**
   - Backend validates stock before adding
   - Cannot add more than available stock
   - Cart shows current stock status

2. **Price Snapshot:**
   - `priceAtTime` captures price when item added
   - Protects against price changes
   - Order uses this price

3. **Authentication:**
   - All cart endpoints require authentication
   - Redirect to login if not authenticated
   - Cart persists across sessions

---

## ✅ Testing Checklist

- [ ] Fetch and display cart items
- [ ] Add product to cart
- [ ] Update item quantity
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Cart icon shows correct count
- [ ] Stock validation works
- [ ] Price calculations correct
- [ ] Auth required for all actions
- [ ] Responsive on mobile

---

**Module Status:** ✅ Production Ready  
**Related Modules:** Product, Order, User

