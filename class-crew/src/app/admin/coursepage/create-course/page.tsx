"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getActiveCategories } from "@/utils/api";
import NEXT_PUBLIC_BASE_API from "@/utils/constant";

interface Category {
    _id: string;
    title: string;
    description?: string;
    isActive?: boolean;
}
export default function CourseForm() {
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [tagColor, setTagColor] = useState("");
    const [tagText, setTagText] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [price, setPrice] = useState("");
    const [priceText, setPriceText] = useState("");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("");
    const [target, setTarget] = useState("");
    const [location, setLocation] = useState("");
    const [hours, setHours] = useState("");
    const [field, setField] = useState("");
    const [refundOptions, setRefundOptions] = useState("");
    const [learningGoals, setLearningGoals] = useState("");
    const [recommendedAudience, setRecommendedAudience] = useState<string[]>(
        []
    );
    const [processName, setProcessName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [noticeImage, setNoticeImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const BASE_API = NEXT_PUBLIC_BASE_API;
    console.log("BASE_API value:", BASE_API);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getActiveCategories();
                if (response.success) {
                    const categoryData = response.categories || response.data;
                    setCategories(Array.isArray(categoryData) ? categoryData : []);
                } else {
                    toast.error(response.message || "Failed to fetch categories");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error fetching categories");
            }
        };
        fetchCategories();
    }, []);

    const handleTagChange = (tag: string) => {
        setTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };



    const validate = () => {
        if (!title || !category) {
            toast.error("Title and Category are required");
            return false;
        }
        if (price && (isNaN(Number(price)) || Number(price) < 0)) {
            toast.error("Price must be a valid number");
            return false;
        }
        if (!mainImage) {
            toast.error("Main image is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("shortDescription", shortDescription);
        formData.append("longDescription", longDescription);
        formData.append("tagColor", tagColor);
        formData.append("tagText", tagText);
        formData.append("category", category);
        formData.append("tags", JSON.stringify(tags));
        formData.append("price", price);
        formData.append("priceText", priceText);
        formData.append("date", date);
        formData.append("duration", duration);
        formData.append("target", target);
        formData.append("location", location);
        if (hours && !isNaN(Number(hours))) {
            formData.append("hours", hours);
        }
        formData.append("field", field);
        formData.append("refundOptions", refundOptions);
        formData.append("learningGoals", learningGoals);
        formData.append(
            "recommendedAudience",
            JSON.stringify(recommendedAudience)
        );
        formData.append("processName", processName);
        formData.append("isActive", String(isActive));
        formData.append("isFeatured", String(isFeatured));
        if (mainImage) formData.append("mainImage", mainImage);
        if (noticeImage) formData.append("noticeImage", noticeImage);

        try {
            setLoading(true);
            console.log("API URL:", `${BASE_API}/courses`);
            const res = await fetch(`${BASE_API}/courses`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Course created successfully!");
                resetForm();
            } else toast.error(data.message || "Something went wrong");
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit course");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setShortDescription("");
        setLongDescription("");
        setTagColor("");
        setTagText("");
        setCategory("");
        setTags([]);
        setPrice("");
        setPriceText("");
        setDate("");
        setDuration("");
        setTarget("");
        setLocation("");
        setHours("");
        setField("");
        setRefundOptions("");
        setLearningGoals("");
        setRecommendedAudience([]);
        setProcessName("");
        setIsActive(true);
        setIsFeatured(false);
        setMainImage(null);
        setNoticeImage(null);
    };

    return (
        <div className="min-h-screen bg-white text-black p-10">
            <Toaster position="top-right" />
            <h1 className="text-3xl font-bold mb-8 text-center">
                Create New Course
            </h1>

            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto bg-gray-50 border-2 border-black rounded-2xl shadow-lg p-8 space-y-6"
            >
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Course Title"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Short Description"
                    rows={2}
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Long Description"
                    rows={4}
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={tagColor}
                        onChange={(e) => setTagColor(e.target.value)}
                        placeholder="Tag Color (e.g., #FF0000)"
                        className="w-1/2 border-2 border-black rounded-xl px-4 py-3"
                    />
                    <input
                        type="text"
                        value={tagText}
                        onChange={(e) => setTagText(e.target.value)}
                        placeholder="Tag Text"
                        className="w-1/2 border-2 border-black rounded-xl px-4 py-3"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.title}
                        </option>
                    ))}
                </select>
                <div>
                    <label className="block font-semibold mb-2">Tags</label>
                    <div className="flex gap-4">
                        {["NEWEST", "POPULAR", "ALL"].map((tag) => (
                            <label
                                key={tag}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={tags.includes(tag)}
                                    onChange={() => handleTagChange(tag)}
                                />
                                <span>{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        className="w-1/2 border-2 border-black rounded-xl px-4 py-3"
                    />
                    <input
                        type="text"
                        value={priceText}
                        onChange={(e) => setPriceText(e.target.value)}
                        placeholder="Price Text (e.g., KRW)"
                        className="w-1/2 border-2 border-black rounded-xl px-4 py-3"
                    />
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Duration"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Target Audience"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="Hours"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <input
                    type="text"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="Field"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <input
                    type="text"
                    value={refundOptions}
                    onChange={(e) => setRefundOptions(e.target.value)}
                    placeholder="Refund Options"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <input
                    type="text"
                    value={learningGoals}
                    onChange={(e) => setLearningGoals(e.target.value)}
                    placeholder="Learning Goals"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <div>
                    <label className="block font-semibold mb-2">
                        Recommended Audience (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={recommendedAudience.join(", ")}
                        onChange={(e) => {
                            const audiences = e.target.value
                                .split(",")
                                .map(item => item.trim())
                                .filter(item => item.length > 0);
                            setRecommendedAudience(audiences);
                        }}
                        placeholder="e.g., Beginners, Frontend Developers, Students"
                        className="w-full border-2 border-black rounded-xl px-4 py-3"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                        Enter multiple audiences separated by commas
                    </p>
                </div>
                <input
                    type="text"
                    value={processName}
                    onChange={(e) => setProcessName(e.target.value)}
                    placeholder="Process Name"
                    className="w-full border-2 border-black rounded-xl px-4 py-3"
                />
                <div>
                    <label className="font-semibold">Main Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setMainImage(e.target.files?.[0] || null)
                        }
                        className="w-full border-2 border-dashed border-black rounded-xl px-4 py-3"
                    />
                    {mainImage && (
                        <p className="text-sm mt-1"> {mainImage.name}</p>
                    )}
                </div>
                <div>
                    <label className="font-semibold">Notice Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setNoticeImage(e.target.files?.[0] || null)
                        }
                        className="w-full border-2 border-dashed border-black rounded-xl px-4 py-3"
                    />
                    {noticeImage && (
                        <p className="text-sm mt-1"> {noticeImage.name}</p>
                    )}
                </div>
                <div className="flex gap-4 items-center">
                    <label>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => setIsActive(!isActive)}
                        />{" "}
                        Active
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={() => setIsFeatured(!isFeatured)}
                        />{" "}
                        Featured
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-black hover:border-2 hover:border-black transition"
                >
                    {loading ? "Submitting..." : "Submit Course"}
                </button>
            </form>
        </div>
    );
}
