"use client";

import Link from "next/link";

export default function ProductsPage() {
    const productPages = [
        {
            title: "Manage Product Categories",
            description: "Create, edit, and manage product categories for organizing your products",
            href: "/admin/products/manage-product-category",
            icon: "📂",
            color: "bg-blue-500"
        },
        {
            title: "Manage Products",
            description: "Add new products, edit existing ones, and manage product details",
            href: "/admin/products/manage-product",
            icon: "🛍️",
            color: "bg-green-500"
        },
        {
            title: "View Products",
            description: "Browse all products with advanced filtering and search options",
            href: "/admin/products/view-product",
            icon: "👁️",
            color: "bg-purple-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-[var(--primary)] mb-4">
                    Products Management
                </h1>
                <p className="text-center text-gray-600 mb-12 text-lg">
                    Manage your product catalog, categories, and inventory
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productPages.map((page, index) => (
                        <Link
                            key={index}
                            href={page.href}
                            className="group bg-white border-2 border-[var(--primary)] rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <div className="text-center">
                                <div className={`w-16 h-16 ${page.color} rounded-full flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                                    {page.icon}
                                </div>
                                <h2 className="text-xl font-bold text-[var(--primary)] mb-3 group-hover:text-opacity-80">
                                    {page.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {page.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 bg-gray-50 border-2 border-[var(--primary)] rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-[var(--primary)] mb-6 text-center">
                        Quick Stats & Actions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                            <div className="text-3xl font-bold text-[var(--primary)] mb-2">📊</div>
                            <h3 className="font-semibold text-[var(--primary)] mb-2">Analytics</h3>
                            <p className="text-gray-600 text-sm">View product performance and sales data</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                            <div className="text-3xl font-bold text-[var(--primary)] mb-2">📦</div>
                            <h3 className="font-semibold text-[var(--primary)] mb-2">Inventory</h3>
                            <p className="text-gray-600 text-sm">Monitor stock levels and manage inventory</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                            <div className="text-3xl font-bold text-[var(--primary)] mb-2">🔄</div>
                            <h3 className="font-semibold text-[var(--primary)] mb-2">Sync</h3>
                            <p className="text-gray-600 text-sm">Synchronize with external systems</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <div className="bg-white border-2 border-[var(--primary)] rounded-2xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-[var(--primary)] mb-4">
                            Need Help?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Check out our documentation or contact support for assistance with product management.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-opacity-80 transition">
                                View Documentation
                            </button>
                            <button className="px-6 py-3 border-2 border-[var(--primary)] text-[var(--primary)] rounded-xl font-semibold hover:bg-[var(--primary)] hover:text-white transition">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}