# 🛒 Shopping Cart - Frontend Integration Guide

Complete guide for implementing shopping cart functionality in your ClassCrew frontend application.

---

## 📋 Overview

The shopping cart supports both courses (with schedules) and products. Users can manage quantities, remove items, and proceed to class application or checkout.

---

## 🔑 API Endpoints

### Get Cart

**Endpoint:** `GET /cart`  
**Auth Required:** Yes

**Response:**
```javascript
{
  "success": true,
  "data": {
    "_id": "cart123",
    "user": "userId",
    "items": [
      {
        "itemType": "course",
        "course": { /* course details */ },
        "courseSchedule": { /* schedule details */ },
        "quantity": 1,
        "priceAtTime": 500000,
        "subtotal": 500000
      },
      {
        "itemType": "product",
        "product": { /* product details */ },
        "quantity": 2,
        "priceAtTime": 100000,
        "subtotal": 200000
      }
    ],
    "subtotal": 700000,
    "totalDiscount": 0,
    "grandTotal": 700000,
    "itemCount": 2
  }
}
```

### Add Course to Cart

**Endpoint:** `POST /cart/add`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "itemType": "course",
  "productId": "{courseId}",
  "courseSchedule": "{scheduleId}"
}
```

### Add Product to Cart

**Request:**
```javascript
{
  "itemType": "product",
  "productId": "{productId}",
  "quantity": 2
}
```

### Update Quantity

**Endpoint:** `PUT /cart/update/{productId}`  
**Auth Required:** Yes

**Request:**
```javascript
{
  "quantity": 3
}
```

### Remove Item

**Endpoint:** `DELETE /cart/remove/{itemId}?itemType=course&scheduleId={scheduleId}`  
**Auth Required:** Yes

### Clear Cart

**Endpoint:** `DELETE /cart/clear`  
**Auth Required:** Yes

---

## 💻 Frontend Implementation

### Cart Service

```javascript
// src/services/cart.service.js

import apiClient from './api.client';

class CartService {
    /**
     * Get user's cart
     */
    async getCart() {
        try {
            const response = await apiClient.get('/cart');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Add course to cart
     */
    async addCourseToCart(courseId, scheduleId) {
        try {
            const response = await apiClient.post('/cart/add', {
                itemType: 'course',
                productId: courseId,
                courseSchedule: scheduleId,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Add product to cart
     */
    async addProductToCart(productId, quantity = 1) {
        try {
            const response = await apiClient.post('/cart/add', {
                itemType: 'product',
                productId,
                quantity,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update product quantity
     */
    async updateQuantity(productId, quantity) {
        try {
            const response = await apiClient.put(`/cart/update/${productId}`, {
                quantity,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Remove item from cart
     */
    async removeItem(itemId, itemType, scheduleId = null) {
        try {
            let url = `/cart/remove/${itemId}?itemType=${itemType}`;
            if (scheduleId) {
                url += `&scheduleId=${scheduleId}`;
            }
            const response = await apiClient.delete(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Clear cart
     */
    async clearCart() {
        try {
            const response = await apiClient.delete('/cart/clear');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get item count (for badge)
     */
    async getCartItemCount() {
        try {
            const cart = await this.getCart();
            return cart.itemCount || 0;
        } catch (error) {
            return 0;
        }
    }
}

export default new CartService();
```

---

## 🎨 UI Components

### Cart Page

```javascript
// src/pages/Cart.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cart.service';
import CartItem from '../components/cart/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId, itemType, scheduleId) => {
        if (!confirm('이 항목을 삭제하시겠습니까?')) return;

        try {
            await cartService.removeItem(itemId, itemType, scheduleId);
            await fetchCart(); // Refresh cart
        } catch (error) {
            alert(error.message || '삭제 실패');
        }
    };

    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            await cartService.updateQuantity(productId, quantity);
            await fetchCart(); // Refresh cart
        } catch (error) {
            alert(error.message || '수량 변경 실패');
        }
    };

    const handleProceedToApplication = () => {
        const courseIds = cart.items
            .filter((item) => item.itemType === 'course')
            .map((item) => item.course._id);

        if (courseIds.length === 0) {
            alert('신청할 강좌를 선택해주세요.');
            return;
        }

        // Navigate to class application with course IDs
        navigate('/class-applications/create', { state: { courseIds } });
    };

    if (loading) return <LoadingSpinner />;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">장바구니</h1>
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600 mb-4">
                        장바구니가 비어있습니다.
                    </p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        강좌 둘러보기
                    </button>
                </div>
            </div>
        );
    }

    const courses = cart.items.filter((item) => item.itemType === 'course');
    const products = cart.items.filter((item) => item.itemType === 'product');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">장바구니</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    {/* Courses */}
                    {courses.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">강좌 ({courses.length})</h2>
                            <div className="space-y-4">
                                {courses.map((item) => (
                                    <CartItem
                                        key={`${item.course._id}-${item.courseSchedule._id}`}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    {products.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                상품 ({products.length})
                            </h2>
                            <div className="space-y-4">
                                {products.map((item) => (
                                    <CartItem
                                        key={item.product._id}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                        onUpdateQuantity={handleUpdateQuantity}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                        <h3 className="text-xl font-bold mb-4">주문 요약</h3>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">소계</span>
                                <span className="font-semibold">
                                    {cart.subtotal.toLocaleString()}원
                                </span>
                            </div>
                            {cart.totalDiscount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>할인</span>
                                    <span>-{cart.totalDiscount.toLocaleString()}원</span>
                                </div>
                            )}
                            <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                <span>총계</span>
                                <span className="text-blue-600">
                                    {cart.grandTotal.toLocaleString()}원
                                </span>
                            </div>
                        </div>

                        {courses.length > 0 && (
                            <button
                                onClick={handleProceedToApplication}
                                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 font-semibold mb-3"
                            >
                                강좌 신청하기
                            </button>
                        )}

                        {products.length > 0 && (
                            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 font-semibold">
                                상품 구매하기
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
```

### Cart Item Component

```javascript
// src/components/cart/CartItem.jsx

import React from 'react';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    const isCourse = item.itemType === 'course';

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                {isCourse ? (
                    <img
                        src={item.course.mainImage}
                        alt={item.course.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={item.product.images?.[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Details */}
            <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                    {isCourse ? item.course.title : item.product.name}
                </h3>

                {isCourse && item.courseSchedule && (
                    <p className="text-sm text-gray-600 mb-2">
                        📅 {item.courseSchedule.scheduleName}
                        <br />
                        {formatDate(item.courseSchedule.startDate)} ~{' '}
                        {formatDate(item.courseSchedule.endDate)}
                    </p>
                )}

                {!isCourse && (
                    <p className="text-sm text-gray-600 mb-2">
                        {item.product.description?.substring(0, 50)}...
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        {!isCourse && onUpdateQuantity && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        onUpdateQuantity(
                                            item.product._id,
                                            Math.max(1, item.quantity - 1)
                                        )
                                    }
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <span className="font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        onUpdateQuantity(item.product._id, item.quantity + 1)
                                    }
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                            {item.subtotal.toLocaleString()}원
                        </p>
                        <button
                            onClick={() =>
                                onRemove(
                                    isCourse ? item.course._id : item.product._id,
                                    item.itemType,
                                    isCourse ? item.courseSchedule._id : null
                                )
                            }
                            className="text-sm text-red-600 hover:underline"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
```

### Cart Icon (Header)

```javascript
// src/components/layout/CartIcon.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cartService from '../../services/cart.service';
import { useAuth } from '../../context/AuthContext';

const CartIcon = () => {
    const { isAuthenticated } = useAuth();
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCartCount();
        }
    }, [isAuthenticated]);

    const fetchCartCount = async () => {
        try {
            const count = await cartService.getCartItemCount();
            setItemCount(count);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <Link to="/cart" className="relative">
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                </span>
            )}
        </Link>
    );
};

export default CartIcon;
```

---

## ✅ Best Practices

1. **Real-time updates** - Refresh cart after any modification
2. **Item count badge** - Show cart item count in header
3. **Separate course/product** - Different UI for different item types
4. **Quantity controls** - Easy increment/decrement for products
5. **Confirmation prompts** - Confirm before removing items

---

**Next:** [Class Applications Integration →](./08-class-applications.md)

