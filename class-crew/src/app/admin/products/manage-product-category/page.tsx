"use client";

import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    getAllProductCategories,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory
} from "@/utils/api";

interface ProductCategory {
    _id: string;
    title: string;
    description?: string;
    order?: number;
    isActive: boolean;
    productCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export default function ManageProductCategory() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [order, setOrder] = useState<number>(1);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

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
            toast.error("Server error while fetching product categories.");
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const validate = () => {
        if (!title.trim()) {
            toast.error("Category title is required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = { title, description, order, isActive };
        setLoading(true);

        try {
            let response;
            if (editingId) {
                response = await updateProductCategory(editingId, payload);
            } else {
                response = await createProductCategory(payload);
            }

            if (response.success) {
                toast.success(
                    editingId ? "Product category updated!" : "Product category created!"
                );
                resetForm();
                fetchCategories();
            } else {
                toast.error(response.message || "Operation failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product category?")) return;

        try {
            const response = await deleteProductCategory(id);
            if (response.success) {
                toast.success("Product category deleted!");
                fetchCategories();
            } else {
                toast.error(response.message || "Failed to delete product category.");
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error("Server error while deleting product category.");
        }
    };

    const handleEdit = (category: ProductCategory) => {
        setTitle(category.title);
        setDescription(category.description || "");
        setOrder(category.order || 1);
        setIsActive(category.isActive);
        setEditingId(category._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setOrder(1);
        setIsActive(true);
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Toaster position="top-right" />

            <h1 className="text-3xl font-bold text-center text-[var(--primary)] mb-8">
                Manage Product Categories
            </h1>

            <form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto bg-gray-50 border-2 border-[var(--primary)] rounded-2xl shadow-lg p-8 space-y-6"
            >
                <h2 className="text-xl font-bold text-center text-[var(--primary)]">
                    {editingId ? "Edit Product Category" : "Create New Product Category"}
                </h2>

                <div>
                    <label className="block font-semibold mb-2 text-[var(--primary)]">
                        Category Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter product category title"
                        className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2 text-[var(--primary)]">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter product category description"
                        rows={3}
                        className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2 text-[var(--primary)]">
                        Display Order
                    </label>
                    <input
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                        placeholder="Enter display order"
                        min="1"
                        className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-5 h-5 text-[var(--primary)] border-2 border-[var(--primary)] rounded focus:ring-[var(--primary)]"
                    />
                    <label htmlFor="isActive" className="font-semibold text-[var(--primary)]">
                        Active Category
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-[var(--primary)] hover:border-2 hover:border-[var(--primary)] transition"
                    >
                        {loading
                            ? "Processing..."
                            : editingId
                                ? "Update Category"
                                : "Create Category"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-3 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="max-w-6xl mx-auto mt-12">
                <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">
                    Existing Product Categories ({categories.length})
                </h2>

                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No product categories found.</p>
                        <p className="text-gray-400">Create your first product category above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <div
                                key={cat._id}
                                className="bg-white border-2 border-[var(--primary)] rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[var(--primary)] mb-2">
                                            {cat.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {cat.description || "No description provided"}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {cat.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-500 mb-4">
                                    <p>Order: {cat.order || 1}</p>
                                    <p>Products: {cat.productCount || 0}</p>
                                    {cat.createdAt && (
                                        <p>Created: {new Date(cat.createdAt).toLocaleDateString()}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-opacity-80 transition"
                                        aria-label={`Edit product category ${cat.title}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                        aria-label={`Delete product category ${cat.title}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}