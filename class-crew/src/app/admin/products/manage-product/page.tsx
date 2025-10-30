"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
    getAllProducts,
    getAllProductCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "@/utils/api";

interface ProductCategory {
    _id: string;
    title: string;
    description?: string;
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

function ManageProduct() {
    const searchParams = useSearchParams();
    const editProductId = searchParams.get("edit");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [baseCost, setBaseCost] = useState<number>(0);
    const [discountRate, setDiscountRate] = useState<number>(0);
    const [availableQuantity, setAvailableQuantity] = useState<number>(0);
    const [images, setImages] = useState<FileList | null>(null);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [specifications, setSpecifications] = useState<Record<string, string>>({});
    const [isActive, setIsActive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [editingId, setEditingId] = useState<string | null>(editProductId || null);
    const [filters, setFilters] = useState({
        category: "",
        search: "",
        isActive: ""
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
                console.log("Products data:", productsData);
                setProducts(productsData);
            } else {
                toast.error(response.message || "Failed to fetch products.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error while fetching products.");
        }
    }, [filters]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (editProductId) {
            loadProductForEdit(editProductId);
        }
    }, [editProductId]);

    const loadProductForEdit = async (productId: string) => {
        try {
            const response = await getProductById(productId);
            if (response.success) {
                const product = (response as { product?: Product }).product;
                if (product) {
                    setName(product.name);
                    setDescription(product.description || "");
                    setCategory(typeof product.category === 'string' ? product.category : product.category._id);
                    setBaseCost(product.baseCost);
                    setDiscountRate(product.discountRate || 0);
                    setAvailableQuantity(product.availableQuantity);
                    setExistingImages(product.images || []);
                    setImages(null); // Reset file input for editing
                    setSpecifications(product.specifications as Record<string, string> || {});
                    setIsActive(product.isActive);
                    setEditingId(product._id);
                }
            }
        } catch (error) {
            console.error("Error loading product for edit:", error);
            toast.error("Failed to load product for editing");
        }
    };

    const validate = () => {
        if (!name.trim()) {
            toast.error("Product name is required.");
            return false;
        }
        if (!category) {
            toast.error("Product category is required.");
            return false;
        }
        if (baseCost <= 0) {
            toast.error("Base cost must be greater than 0.");
            return false;
        }
        if (availableQuantity < 0) {
            toast.error("Available quantity cannot be negative.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('baseCost', baseCost.toString());
            formData.append('discountRate', discountRate.toString());
            formData.append('availableQuantity', availableQuantity.toString());
            formData.append('specifications', JSON.stringify(specifications));
            formData.append('isActive', isActive.toString());


            console.log(formData)

            // Add image files
            if (images) {
                Array.from(images).forEach((file) => {
                    formData.append('images', file);
                });
            }

            let response;
            if (editingId) {
                response = await updateProduct(editingId, formData);
            } else {
                response = await createProduct(formData);
            }

            if (response.success) {
                toast.success(
                    editingId ? "Product updated!" : "Product created!"
                );
                resetForm();
                fetchProducts();
            } else {
                toast.error(response.message || "Operation failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await deleteProduct(id);
            if (response.success) {
                toast.success("Product deleted!");
                fetchProducts();
            } else {
                toast.error(response.message || "Failed to delete product.");
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error("Server error while deleting product.");
        }
    };

    const handleEdit = (product: Product) => {
        setName(product.name);
        setDescription(product.description || "");
        setCategory(product.category._id);
        setBaseCost(product.baseCost);
        setDiscountRate(product.discountRate || 0);
        setAvailableQuantity(product.availableQuantity);
        setExistingImages(product.images || []);
        setImages(null); // Reset file input for editing
        setSpecifications(product.specifications as Record<string, string> || {});
        setIsActive(product.isActive);
        setEditingId(product._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setCategory("");
        setBaseCost(0);
        setDiscountRate(0);
        setAvailableQuantity(0);
        setImages(null);
        setExistingImages([]);
        setSpecifications({});
        setIsActive(true);
        setEditingId(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(e.target.files);
        }
    };

    const addSpecification = () => {
        const key = prompt("Enter specification key:");
        if (key && key.trim()) {
            setSpecifications({ ...specifications, [key.trim()]: "" });
        }
    };

    const updateSpecification = (key: string, value: string) => {
        setSpecifications({ ...specifications, [key]: value });
    };

    const removeSpecification = (key: string) => {
        const newSpecs = { ...specifications };
        delete newSpecs[key];
        setSpecifications(newSpecs);
    };

    const finalPrice = baseCost - (baseCost * (discountRate / 100));

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Toaster position="top-right" />

            <h1 className="text-3xl font-bold text-center text-[var(--primary)] mb-8">
                Manage Products
            </h1>

            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto bg-gray-50 border-2 border-[var(--primary)] rounded-2xl shadow-lg p-8 space-y-6 mb-12"
            >
                <h2 className="text-xl font-bold text-center text-[var(--primary)]">
                    {editingId ? "Edit Product" : "Create New Product"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">
                            Product Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-2 text-[var(--primary)]">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter product description"
                        rows={4}
                        className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">
                            Base Cost (₹)
                        </label>
                        <input
                            type="number"
                            value={baseCost}
                            onChange={(e) => setBaseCost(parseFloat(e.target.value) || 0)}
                            placeholder="Enter base cost"
                            min="0"
                            step="0.01"
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">
                            Discount Rate (%)
                        </label>
                        <input
                            type="number"
                            value={discountRate}
                            onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                            placeholder="Enter discount rate"
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2 text-[var(--primary)]">
                            Final Price (₹)
                        </label>
                        <input
                            type="text"
                            value={`₹${finalPrice.toFixed(2)}`}
                            readOnly
                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-600"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-2 text-[var(--primary)]">
                        Available Quantity
                    </label>
                    <input
                        type="number"
                        value={availableQuantity}
                        onChange={(e) => setAvailableQuantity(parseInt(e.target.value) || 0)}
                        placeholder="Enter available quantity"
                        min="0"
                        className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2 text-[var(--primary)]">
                        Product Images (Upload Files)
                    </label>

                    {/* File Upload Input */}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-blue-700"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                        Select multiple image files (JPG, PNG, etc.)
                    </p>

                    {/* Show selected files */}
                    {images && images.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm font-semibold text-[var(--primary)] mb-2">
                                Selected Files ({images.length}):
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                {Array.from(images).map((file, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Show existing images for editing */}
                    {editingId && existingImages.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-[var(--primary)] mb-2">
                                Current Images:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {existingImages.map((imageUrl, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={imageUrl}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-20 object-cover rounded border"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-image.png';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Upload new images to replace existing ones
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block font-semibold text-[var(--primary)]">
                            Specifications
                        </label>
                        <button
                            type="button"
                            onClick={addSpecification}
                            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-opacity-80 font-semibold"
                        >
                            Add Specification
                        </button>
                    </div>
                    {Object.entries(specifications).map(([key, value]) => (
                        <div key={key} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={key}
                                readOnly
                                className="w-1/3 border-2 border-gray-300 rounded-xl px-4 py-3 bg-gray-100"
                            />
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => updateSpecification(key, e.target.value)}
                                placeholder="Enter specification value"
                                className="flex-1 border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                            <button
                                type="button"
                                onClick={() => removeSpecification(key)}
                                className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
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
                        Active Product
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-[var(--primary)] hover:border-2 hover:border-[var(--primary)] transition"
                    >
                        {isLoading
                            ? "Processing..."
                            : editingId
                                ? "Update Product"
                                : "Create Product"}
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

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--primary)]">
                        Existing Products ({products.length})
                    </h2>

                    <div className="flex gap-4">
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="border-2 border-[var(--primary)] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="border-2 border-[var(--primary)] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found.</p>
                        <p className="text-gray-400">Create your first product above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white border-2 border-[var(--primary)] rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                {/* Product Image */}
                                {product.images && product.images.length > 0 && (
                                    <div className="mb-4">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-32 object-cover rounded-lg"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-image.png';
                                            }}
                                        />
                                        {product.images.length > 1 && (
                                            <p className="text-xs text-gray-500 mt-1 text-center">
                                                +{product.images.length - 1} more images
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[var(--primary)] mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {product.category.title}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {product.description || "No description provided"}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${product.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {product.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 mb-4">
                                    <div className="flex justify-between">
                                        <span>Base Cost:</span>
                                        <span>₹{product.baseCost}</span>
                                    </div>
                                    {product.discountRate && product.discountRate > 0 && (
                                        <div className="flex justify-between">
                                            <span>Discount:</span>
                                            <span>{product.discountRate}%</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-semibold">
                                        <span>Final Price:</span>
                                        <span>₹{product.finalPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Stock:</span>
                                        <span>{product.availableQuantity}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-opacity-80 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
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

// Wrapper component with Suspense boundary
export default function ManageProductPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
            <ManageProduct />
        </Suspense>
    );
}