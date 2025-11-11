# 🛍️ Products (Learning Store) - Frontend Integration Guide

Complete guide for implementing the learning store product catalog in your ClassCrew frontend application.

---

## 📋 Overview

Products are physical or digital items sold alongside courses (e.g., books, workbooks, diagnostic tools). This section covers browsing, searching, and managing products.

---

## 🔑 API Endpoints

### Get All Products (Public)

**Endpoint:** `GET /products`  
**Auth Required:** No

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `category` (string)
- `inStock` (true | false)
- `search` (keyword)

**Response:**
```javascript
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "prod123",
        "name": "66일 챌린지",
        "description": "66일 동안 꾸준한 실천을 돕는 굿즈",
        "price": 100000,
        "category": "진단도구",
        "stock": {
          "quantity": 50,
          "trackInventory": true
        },
        "images": ["/uploads/products/image1.png"],
        "isPublished": true,
        "isFeatured": false,
        "inStock": true
      }
    ],
    "pagination": {
      "total": 20,
      "page": 1,
      "pages": 2,
      "limit": 10
    }
  }
}
```

### Get Featured Products

**Endpoint:** `GET /products/featured?limit=6`

### Get Product by ID

**Endpoint:** `GET /products/{productId}`

---

## 💻 Frontend Implementation

### Product Service

```javascript
// src/services/product.service.js

import apiClient from './api.client';

class ProductService {
    /**
     * Get all products with filters
     */
    async getProducts(filters = {}) {
        try {
            const params = {
                page: filters.page || 1,
                limit: filters.limit || 10,
                ...filters,
            };
            const response = await apiClient.get('/products', params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get product by ID
     */
    async getProductById(productId) {
        try {
            const response = await apiClient.get(`/products/${productId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get featured products
     */
    async getFeaturedProducts(limit = 6) {
        try {
            const response = await apiClient.get('/products/featured', { limit });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Search products
     */
    async searchProducts(keyword, filters = {}) {
        try {
            const response = await apiClient.get('/products', {
                search: keyword,
                ...filters,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new ProductService();
```

---

## 🎨 UI Components

### Product List Page

```javascript
// src/pages/Products.jsx

import React, { useState, useEffect } from 'react';
import productService from '../services/product.service';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        category: '',
        inStock: true,
    });

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts(filters);
            setProducts(data.products);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">러닝 스토어</h1>

            {/* Category Filter */}
            <div className="mb-6">
                <select
                    value={filters.category}
                    onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value, page: 1 })
                    }
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="">전체 카테고리</option>
                    <option value="진단도구">진단도구</option>
                    <option value="워크북">워크북</option>
                    <option value="굿즈">굿즈</option>
                </select>

                <label className="ml-4 inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) =>
                            setFilters({ ...filters, inStock: e.target.checked, page: 1 })
                        }
                        className="mr-2"
                    />
                    재고 있는 상품만 보기
                </label>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            조건에 맞는 상품이 없습니다.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {pagination && pagination.pages > 1 && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={(page) => setFilters({ ...filters, page })}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ProductsPage;
```

### Product Card Component

```javascript
// src/components/product/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import cartService from '../../services/cart.service';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
    const { isAuthenticated } = useAuth();
    const [adding, setAdding] = React.useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            window.location.href = '/login';
            return;
        }

        if (!product.inStock) {
            alert('품절된 상품입니다.');
            return;
        }

        setAdding(true);
        try {
            await cartService.addProductToCart(product._id, 1);
            alert('장바구니에 추가되었습니다!');
        } catch (error) {
            alert(error.message || '장바구니 추가 실패');
        } finally {
            setAdding(false);
        }
    };

    return (
        <Link
            to={`/products/${product._id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
            <div className="relative h-48 bg-gray-200">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">품절</span>
                    </div>
                )}

                {product.isFeatured && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded text-sm">
                        추천
                    </span>
                )}
            </div>

            <div className="p-4">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {product.category}
                </span>

                <h3 className="text-lg font-bold mt-2 mb-2 line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-blue-600">
                        {product.price.toLocaleString()}원
                    </div>

                    {product.stock?.trackInventory && (
                        <div className="text-sm text-gray-500">
                            재고: {product.stock.quantity}개
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={adding || !product.inStock}
                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {adding ? '추가 중...' : '장바구니 담기'}
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
```

### Product Detail Page

```javascript
// src/pages/ProductDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/product.service';
import cartService from '../services/cart.service';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await productService.getProductById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!product.inStock) {
            alert('품절된 상품입니다.');
            return;
        }

        setAdding(true);
        try {
            await cartService.addProductToCart(product._id, quantity);
            alert('장바구니에 추가되었습니다!');
            navigate('/cart');
        } catch (error) {
            alert(error.message || '장바구니 추가 실패');
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!product) return <div>상품을 찾을 수 없습니다.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div>
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full rounded-lg shadow-lg"
                        />
                    ) : (
                        <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                            No Image
                        </div>
                    )}
                </div>

                {/* Details */}
                <div>
                    <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded">
                        {product.category}
                    </span>

                    <h1 className="text-3xl font-bold mt-4 mb-4">{product.name}</h1>

                    <p className="text-gray-600 mb-6 whitespace-pre-line">
                        {product.description}
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">가격</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {product.price.toLocaleString()}원
                            </span>
                        </div>

                        {product.stock?.trackInventory && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">재고</span>
                                <span
                                    className={
                                        product.inStock ? 'text-green-600' : 'text-red-600'
                                    }
                                >
                                    {product.inStock
                                        ? `${product.stock.quantity}개 남음`
                                        : '품절'}
                                </span>
                            </div>
                        )}
                    </div>

                    {product.inStock && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">수량</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <span className="text-xl font-semibold">{quantity}</span>
                                <button
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                product.stock?.quantity || 999,
                                                quantity + 1
                                            )
                                        )
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={adding || !product.inStock}
                        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
                    >
                        {adding
                            ? '추가 중...'
                            : product.inStock
                            ? '장바구니에 추가'
                            : '품절'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
```

---

## ✅ Best Practices

1. **Show stock status** - Clear indication of availability
2. **Quantity selector** - Easy increment/decrement buttons
3. **Image gallery** - Support multiple product images
4. **Category filtering** - Allow easy navigation
5. **Out of stock handling** - Disable purchase for unavailable items

---

**Next:** [Shopping Cart Integration →](./07-shopping-cart.md)

