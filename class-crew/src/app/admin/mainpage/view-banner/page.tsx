"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

type Banner = {
    _id: string;
    headline: string;
    subText: string;
    mainText: string;
    buttonText: string;
    linkUrl: string;
    order: number;
    isActive: boolean;
    imageUrl: string;
    displayPeriod: {
        start: string;
        end: string;
    };
};

export default function BannerListPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

    // Fetch banners
    const fetchBanners = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/banner`);
            const data = await res.json();
            if (data.success) setBanners(data.banners);
            else toast.error("Failed to fetch banners.");
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Something went wrong while fetching banners.");
        } finally {
            setLoading(false);
        }
    }, [BASE_URL]);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`${BASE_URL}/banner/${id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) {
                toast.success("Banner deleted successfully!");
                setBanners(banners.filter((b) => b._id !== id));
            } else toast.error("Failed to delete banner.");
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Something went wrong while deleting banner.");
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`${BASE_URL}/banner/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            if (res.ok) {
                toast.success("Banner status updated!");
                setBanners(
                    banners.map((b) =>
                        b._id === id ? { ...b, isActive: !currentStatus } : b
                    )
                );
            } else toast.error("Failed to update status.");
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Something went wrong while updating status.");
        }
    };

    const startEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setPreview(banner.imageUrl);
        setShowModal(true);
    };

    const closeModal = useCallback(() => {
        setShowModal(false);
        setTimeout(() => {
            setEditingBanner(null);
            setImageFile(null);
            setPreview(null);
        }, 300);
    }, []);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingBanner) return;
        const { name, value } = e.target;

        // handle nested displayPeriod
        if (name === "start" || name === "end") {
            setEditingBanner({
                ...editingBanner,
                displayPeriod: { ...editingBanner.displayPeriod, [name]: value },
            });
        } else {
            setEditingBanner({ ...editingBanner, [name]: value });
        }
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingBanner) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBanner) return;

        const formData = new FormData();
        formData.append("headline", editingBanner.headline);
        formData.append("subText", editingBanner.subText);
        formData.append("mainText", editingBanner.mainText);
        formData.append("buttonText", editingBanner.buttonText);
        formData.append("linkUrl", editingBanner.linkUrl);
        formData.append("displayPeriod[start]", editingBanner.displayPeriod.start);
        formData.append("displayPeriod[end]", editingBanner.displayPeriod.end);
        formData.append("order", String(editingBanner.order));
        formData.append("isActive", String(editingBanner.isActive));
        if (imageFile) formData.append("image", imageFile);

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`${BASE_URL}/banner/${editingBanner._id}`, {
                method: "PUT",
                body: formData,
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) {
                toast.success("Banner updated successfully!");
                setShowModal(false);
                setTimeout(() => {
                    setEditingBanner(null);
                    setImageFile(null);
                    setPreview(null);
                    fetchBanners();
                }, 300);
            } else toast.error("Failed to update banner.");
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Something went wrong while updating banner.");
        }
    };

    if (loading) return <p className="text-center mt-20 text-lg">Loading banners...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <Toaster position="top-right" reverseOrder={false} />
            <h1 className="text-4xl font-extrabold tracking-tight mb-10 text-center text-gray-900">
                Banner Management
            </h1>

            {banners.length === 0 ? (
                <p className="text-center text-gray-500">No banners found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {banners.map((banner) => (
                        <div
                            key={banner._id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                        >
                            <div className="relative h-48 w-full">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.headline}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-5 space-y-2">
                                <h2 className="text-xl font-bold text-gray-800">{banner.headline}</h2>
                                <p className="text-gray-600">{banner.subText}</p>
                                <p className="text-gray-500">{banner.mainText}</p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Button:</span> {banner.buttonText} →{" "}
                                    <a
                                        href={banner.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        Visit
                                    </a>
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Display:</span>{" "}
                                    {new Date(banner.displayPeriod.start).toLocaleDateString()} -{" "}
                                    {new Date(banner.displayPeriod.end).toLocaleDateString()}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Order:</span> {banner.order}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Status:</span>{" "}
                                    <span className={banner.isActive ? "text-green-500" : "text-red-600"}>
                                        {banner.isActive ? "Active" : "Inactive"}
                                    </span>
                                </p>
                                <div className="flex justify-between mt-4 space-x-2">
                                    <button
                                        onClick={() => toggleActive(banner._id, banner.isActive)}
                                        className="flex-1 px-4 py-2 rounded-xl bg-yellow-500 text-white font-bold hover:opacity-90 transition"
                                    >
                                        Toggle Active
                                    </button>
                                    <button
                                        onClick={() => startEdit(banner)}
                                        className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:opacity-90 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner._id)}
                                        className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:opacity-90 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingBanner && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-auto p-4 transition-opacity duration-300 ${showModal ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div
                        className={`bg-white rounded-3xl w-full max-w-6xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out ${showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
                            }`}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Edit Banner</h2>
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: "headline", label: "Headline", type: "text" as const },
                                { name: "subText", label: "Sub Text", type: "text" as const },
                                { name: "mainText", label: "Main Text", type: "text" as const },
                                { name: "buttonText", label: "Button Text", type: "text" as const },
                                { name: "linkUrl", label: "Link URL", type: "text" as const },
                                { name: "start", label: "Display Start", type: "text" as const },
                                { name: "end", label: "Display End", type: "text" as const },
                                { name: "order", label: "Order", type: "number" as const },
                                { name: "isActive", label: "Active", type: "checkbox" as const },
                            ].map((field) => (
                                <div key={field.name} className="flex flex-col">
                                    <label className="block font-semibold mb-1 text-gray-700">
                                        {field.label}
                                    </label>
                                    {field.type === "checkbox" ? (
                                        <input
                                            type="checkbox"
                                            name={field.name}
                                            checked={editingBanner.isActive}
                                            onChange={(e) =>
                                                setEditingBanner({
                                                    ...editingBanner,
                                                    isActive: e.target.checked,
                                                })
                                            }
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={
                                                field.name === "start"
                                                    ? editingBanner.displayPeriod.start
                                                    : field.name === "end"
                                                        ? editingBanner.displayPeriod.end
                                                        : String((editingBanner as unknown as Record<string, string | number | boolean>)[
                                                            field.name
                                                        ])
                                            }
                                            onChange={handleEditChange}
                                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        />
                                    )}
                                </div>
                            ))}

                            {/* Banner Image */}
                            <div className="col-span-1 md:col-span-2 flex flex-col">
                                <label className="block font-semibold mb-2 text-gray-700">
                                    Banner Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-2 cursor-pointer"
                                />
                                {preview && (
                                    <div className="mt-3 flex justify-center">
                                        <Image
                                            src={preview}
                                            alt="Banner Preview"
                                            width={600}
                                            height={300}
                                            className="rounded-xl object-cover border-2 border-gray-300 shadow-md max-w-full h-auto"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:opacity-90 transition"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-8 py-3 rounded-xl bg-gray-400 text-white font-bold hover:opacity-90 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}