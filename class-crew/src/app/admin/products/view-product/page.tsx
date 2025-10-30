"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
    getAllProducts,
    getAllProductCategories,
    deleteProduct
} from "@/utils/api";

interface ProductCategory {
    _id: string;
    title: string;
    isActive: boolean;
}

interface Product {
    _id: string;
    name: string;
    description?: string;
    category: {
        _id: string;
        title: string;
    };
    baseCost: number;
    discountRate?: number;
    finalPrice: number;
    availableQuantity: number;
    images?: string[];
    specifications?: Record<string, unknown>;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
}

export default function ViewProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        search: "",
        isActive: "",
        minPrice: "",
        maxPrice: "",
        page: 1,
        limit: 12
    });

    const fetchCategories = useCallback(async () => {
        try {
            const response = await getAllProductCategories();
            console.log("Product Categories API response:", response);
            if (response.success) {
                const categoriesData = (response as { categories?: ProductCategory[] }).categories || [];
                console.log("Categories data:", categoriesData);
                setCategories(categoriesData);
            } else {
                toast.error(response.message || "Failed to fetch product categories.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching product categories");
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([, value]) => value !== "")
            );

            if (cleanFilters.isActive) {
                (cleanFilters as Record<string, unknown>).isActive = cleanFilters.isActive === "true";
            }

            const response = await getAllProducts(cleanFilters);
            console.log("Products API response:", response);
            if (response.success) {
                const productsData = (response as { products?: Product[] }).products || [];
                const paginationData = (response as { pagination?: Pagination }).pagination || null;
                console.log("Products data:", productsData);
                console.log("Pagination data:", paginationData);
                setProducts(productsData);
                setPagination(paginationData);
            } else {
                toast.error(response.message || "Failed to fetch products.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error while fetching products.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const response = await deleteProduct(id);
            if (response.success) {
                toast.success("Product deleted successfully!");
                fetchProducts();
            } else {
                toast.error(response.message || "Failed to delete product.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error while deleting product.");
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters({ ...filters, [key]: value, page: 1 });
    };

    const handlePageChange = (newPage: number) => {
        setFilters({ ...filters, page: newPage });
    };

    const resetFilters = () => {
        setFilters({
            category: "",
            search: "",
            isActive: "",
            minPrice: "",
            maxPrice: "",
            page: 1,
            limit: 12
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Toaster position="top-right" />

            <h1 className="text-3xl font-bold text-center text-[var(--primary)] mb-8">
                View Products
            </h1>

            <div className="max-w-6xl mx-auto bg-gray-50 border-2 border-[var(--primary)] rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-[var(--primary)] mb-4">Filter Products</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">Status</label>
                        <select
                            value={filters.isActive}
                            onChange={(e) => handleFilterChange("isActive", e.target.value)}
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">Search</label>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">Min Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Min price"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">Max Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Max price"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">Items per page</label>
                        <select
                            value={filters.limit}
                            onChange={(e) => handleFilterChange("limit", e.target.value)}
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            <option value="6">6 per page</option>
                            <option value="12">12 per page</option>
                            <option value="24">24 per page</option>
                            <option value="48">48 per page</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={resetFilters}
                        className="px-6 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--primary)]">
                        Products {pagination && `(${pagination.totalProducts} total)`}
                    </h2>
                    {loading && (
                        <div className="text-[var(--primary)]">Loading...</div>
                    )}
                </div>

                {products.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found.</p>
                        <p className="text-gray-400">Try adjusting your filters or create new products.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white border-2 border-[var(--primary)] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    {product.images && product.images.length > 0 && (
                                        <div className="h-48 overflow-hidden relative">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                onError={() => {
                                                    // Handle error if needed
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-[var(--primary)] line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {product.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-2">
                                            Category: {product.category.title}
                                        </p>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {product.description || "No description available"}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span>Base Cost:</span>
                                                <span className={product.discountRate && product.discountRate > 0 ? "line-through text-gray-500" : "font-semibold"}>
                                                    ₹{product.baseCost}
                                                </span>
                                            </div>

                                            {product.discountRate && product.discountRate > 0 && (
                                                <>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Discount:</span>
                                                        <span className="text-red-600 font-semibold">
                                                            {product.discountRate}% OFF
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Final Price:</span>
                                                        <span className="font-bold text-green-600">
                                                            ₹{product.finalPrice}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            <div className="flex justify-between text-sm">
                                                <span>Stock:</span>
                                                <span className={`font-semibold ${product.availableQuantity > 0 ? "text-green-600" : "text-red-600"}`}>
                                                    {product.availableQuantity > 0 ? `${product.availableQuantity} available` : "Out of stock"}
                                                </span>
                                            </div>
                                        </div>

                                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="font-semibold text-sm text-[var(--primary)] mb-2">Specifications:</h4>
                                                <div className="text-xs text-gray-600 space-y-1">
                                                    {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => {
                                                        const displayValue = typeof value === 'string' ? value : String(value);
                                                        return (
                                                            <div key={key} className="flex justify-between">
                                                                <span>{key}:</span>
                                                                <span>{displayValue}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {Object.keys(product.specifications).length > 3 && (
                                                        <div className="text-gray-400">
                                                            +{Object.keys(product.specifications).length - 3} more...
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-400 mb-4">
                                            Created: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => window.location.href = `/admin/products/manage-product?edit=${product._id}`}
                                                className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-opacity-80 transition text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-opacity-80 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <span className="text-[var(--primary)] font-semibold">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-opacity-80 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}