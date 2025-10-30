"use client";

import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkUploadCategories,
    downloadCategoryTemplate
} from "@/utils/api";

interface Category {
    _id: string;
    title: string;
    description?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export default function CategoryForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [bulkFile, setBulkFile] = useState<File | null>(null);
    const [bulkUploading, setBulkUploading] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await getAllCategories();
            if (response.success) {
                const categoryData = response.categories || response.data;
                setCategories(Array.isArray(categoryData) ? categoryData : []);
            } else {
                toast.error(response.message || "Failed to fetch categories.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error while fetching categories.");
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

        const payload = { title, description, isActive };
        setLoading(true);

        try {
            let response;
            if (editingId) {
                response = await updateCategory(editingId, payload);
            } else {
                response = await createCategory(payload);
            }

            if (response.success) {
                toast.success(
                    editingId ? "Category updated!" : "Category created!"
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
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await deleteCategory(id);
            if (response.success) {
                toast.success("Category deleted!");
                fetchCategories();
            } else {
                toast.error(response.message || "Failed to delete category.");
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error("Server error while deleting category.");
        }
    };

    const handleEdit = (category: Category) => {
        setTitle(category.title);
        setDescription(category.description || "");
        setIsActive(category.isActive);
        setEditingId(category._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBulkUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bulkFile) {
            toast.error("Please select a file to upload.");
            return;
        }

        setBulkUploading(true);
        try {
            const response = await bulkUploadCategories(bulkFile);
            if (response.success) {
                const summary = response.summary;
                if (summary) {
                    toast.success(`Success! Created: ${summary.created}, Skipped: ${summary.skipped}, Failed: ${summary.failed}`);
                } else {
                    toast.success("Categories uploaded successfully!");
                }
                setBulkFile(null);
                fetchCategories();
            } else {
                toast.error(response.message || "Bulk upload failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during bulk upload.");
        } finally {
            setBulkUploading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setIsActive(true);
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-white text-black p-10">
            <Toaster position="top-right" />
            <h1 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">
                Category Management
            </h1>

            {/* Bulk Upload Section */}
            <div className="max-w-2xl mx-auto mb-8 bg-gray-50 border-2 border-[var(--primary)] rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-[var(--primary)]">Bulk Upload Categories</h2>
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={downloadCategoryTemplate}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-opacity-80 transition"
                    >
                        Download CSV Template
                    </button>
                </div>
                <form onSubmit={handleBulkUpload} className="flex gap-4">
                    <input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                        className="flex-1 border-2 border-[var(--primary)] rounded-lg px-3 py-2"
                    />
                    <button
                        type="submit"
                        disabled={bulkUploading || !bulkFile}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
                    >
                        {bulkUploading ? "Uploading..." : "Upload"}
                    </button>
                </form>
                <p className="text-sm text-gray-600 mt-2">
                    Upload CSV or XLSX file with columns: title (required), description (optional), isActive (optional)
                </p>
            </div>

            {/* Category Form */}
            <form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto bg-gray-50 border-2 border-[var(--primary)] rounded-2xl shadow-lg p-8 space-y-6"
            >
                <h2 className="text-xl font-bold text-center text-[var(--primary)]">
                    {editingId ? "Edit Category" : "Create New Category"}
                </h2>

                {/* Title */}
                <div>
                    <label className="block font-semibold mb-2 text-[var(--primary)]">
                        Category Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter category title"
                        className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-semibold mb-2 text-[var(--primary)]">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter category description"
                        rows={3}
                        className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        id="active"
                        className="w-5 h-5 border-2 border-[var(--primary)] rounded accent-[var(--primary)]"
                    />
                    <label htmlFor="active" className="font-semibold text-[var(--primary)]">
                        Active Category
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-[var(--primary)] hover:border-2 hover:border-[var(--primary)] transition"
                    >
                        {loading
                            ? editingId
                                ? "Updating..."
                                : "Creating..."
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

            {/* Category List */}
            <div className="max-w-4xl mx-auto mt-12">
                <h2 className="text-2xl font-bold mb-6 text-[var(--primary)]">All Categories</h2>
                {categories.length === 0 ? (
                    <p className="text-center text-gray-500">No categories found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categories.map((cat: Category) => (
                            <div
                                key={cat._id}
                                className="bg-white border-2 border-[var(--primary)] rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-[var(--primary)] mb-2">
                                            {cat.title}
                                        </h3>
                                        {cat.description && (
                                            <p className="text-gray-600 text-sm mb-3">
                                                {cat.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${cat.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {cat.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        {cat.createdAt && (
                                            <p className="text-xs text-gray-400">
                                                Created: {new Date(cat.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-opacity-80 transition"
                                        aria-label={`Edit category ${cat.title}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                        aria-label={`Delete category ${cat.title}`}
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