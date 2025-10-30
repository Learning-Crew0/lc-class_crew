"use client";

import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CourseForm } from "@/components/CourseEditfom/page";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/utils/api";
import NEXT_PUBLIC_BASE_API from "@/utils/constant";


interface Category {
    _id: string;
    title: string;
    description?: string;
    isActive?: boolean;
}

interface Course {
    _id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    tagColor: string;
    tagText: string;
    category: Category | string;
    tags: string[];
    price: number;
    priceText: string;
    date: string;
    duration: string;
    target: string;
    location: string;
    hours: number;
    field: string;
    refundOptions: string;
    learningGoals: string;
    recommendedAudience: string[];
    processName: string;
    isActive: boolean;
    isFeatured: boolean;
    mainImage: string;
    noticeImage: string;
    createdAt: string;
    updatedAt: string;
}

export default function CourseManager() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [viewCourse, setViewCourse] = useState<Course | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const BASE_API = NEXT_PUBLIC_BASE_API;

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await getAllCategories();
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
    }, []);

    // Fetch all courses
    const fetchCourses = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_API}/courses`);
            const data = await res.json();
            if (res.ok && data.courses) setCourses(data.courses);
            else toast.error(data.message || "Failed to fetch courses");
        } catch (err) {
            console.error(err);
            toast.error("Error fetching courses");
        }
    }, [BASE_API]);

    // Fetch single course by ID
    const handleView = async (id: string) => {
        try {
            const res = await fetch(`${BASE_API}/courses/${id}`);
            const data = await res.json();
            if (res.ok) setViewCourse(data.course);
            else toast.error(data.message || "Cannot fetch course");
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        }
    };

    // Edit course
    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        setEditModalOpen(true);
    };

    // Delete course
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        try {
            const res = await fetch(`${BASE_API}/courses/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Course deleted successfully!");
                fetchCourses();
            } else toast.error(data.message || "Delete failed");
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchCourses();
    }, [fetchCategories, fetchCourses]);

    const router = useRouter();

    const handleManageClassgoal = (courseId: string) => {
        router.push(`/admin/coursepage/manage-class-goal?courseId=${courseId}`);
    };

    return (
        <div className="p-10 bg-white min-h-screen">
            <Toaster position="top-right" />
            <h1 className="text-3xl font-bold mb-6">Course Manager</h1>

            {/* Courses Table */}
            <div className="overflow-x-auto border rounded-xl mb-8">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-4 py-2 text-left">Title</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr
                                key={course._id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-4 py-2">{course.title}</td>
                                <td className="px-4 py-2">
                                    {typeof course.category === "string"
                                        ? course.category
                                        : course.category?.title}
                                </td>
                                <td className="px-4 py-2">
                                    {course.priceText}
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        onClick={() => handleView(course._id)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(course)}
                                        className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleManageClassgoal(course._id)}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-red-600"
                                    >
                                        Manage Classgoal
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    No courses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Course Dialog */}
            {viewCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-100 sticky top-0 z-10">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {viewCourse.title}
                            </h2>
                            <button
                                onClick={() => setViewCourse(null)}
                                className="px-4 py-2 text-sm font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
                            >
                                ✕ Close
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4 text-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <p>
                                    <strong>Course ID:</strong> {viewCourse._id}
                                </p>
                                <p>
                                    <strong>Category:</strong>{" "}
                                    {typeof viewCourse.category === "string"
                                        ? viewCourse.category
                                        : viewCourse.category?.title}
                                </p>
                                <p>
                                    <strong>Short Description:</strong>{" "}
                                    {viewCourse.shortDescription}
                                </p>
                                <p>
                                    <strong>Long Description:</strong>{" "}
                                    {viewCourse.longDescription}
                                </p>
                                <p>
                                    <strong>Tag Color:</strong>{" "}
                                    <span
                                        style={{ color: viewCourse.tagColor }}
                                    >
                                        {viewCourse.tagColor}
                                    </span>
                                </p>
                                <p>
                                    <strong>Tag Text:</strong>{" "}
                                    {viewCourse.tagText}
                                </p>
                                <p>
                                    <strong>Tags:</strong>{" "}
                                    {viewCourse.tags.join(", ")}
                                </p>
                                <p>
                                    <strong>Process Name:</strong>{" "}
                                    {viewCourse.processName}
                                </p>
                                <p>
                                    <strong>Price:</strong>{" "}
                                    {viewCourse.priceText}
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {new Date(
                                        viewCourse.date
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Duration:</strong>{" "}
                                    {viewCourse.duration}
                                </p>
                                <p>
                                    <strong>Target:</strong> {viewCourse.target}
                                </p>
                                <p>
                                    <strong>Location:</strong>{" "}
                                    {viewCourse.location}
                                </p>
                                <p>
                                    <strong>Hours:</strong> {viewCourse.hours}
                                </p>
                                <p>
                                    <strong>Field:</strong> {viewCourse.field}
                                </p>
                                <p>
                                    <strong>Refund Options:</strong>{" "}
                                    {viewCourse.refundOptions}
                                </p>
                                <p>
                                    <strong>Learning Goals:</strong>{" "}
                                    {viewCourse.learningGoals}
                                </p>
                                <p>
                                    <strong>Recommended Audience:</strong>{" "}
                                    {viewCourse.recommendedAudience.join(", ")}
                                </p>
                                <p>
                                    <strong>Active:</strong>{" "}
                                    {viewCourse.isActive ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Featured:</strong>{" "}
                                    {viewCourse.isFeatured ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Created At:</strong>{" "}
                                    {new Date(
                                        viewCourse.createdAt
                                    ).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Updated At:</strong>{" "}
                                    {new Date(
                                        viewCourse.updatedAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                            {viewCourse.mainImage && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
                                        Main Image
                                    </h3>
                                    <img
                                        src={viewCourse.mainImage}
                                        alt={viewCourse.title}
                                        className="rounded-xl w-full object-cover shadow-md max-h-96"
                                    />
                                </div>
                            )}
                            {viewCourse.noticeImage && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
                                        Notice Image
                                    </h3>
                                    <img
                                        src={viewCourse.noticeImage}
                                        alt={`${viewCourse.title} notice`}
                                        className="rounded-xl w-full object-cover shadow-md max-h-96"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Course Dialog */}
            {editModalOpen && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-4xl p-8 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh] relative">
                        <button
                            className="absolute top-4 right-4 text-red-500 text-xl font-bold"
                            onClick={() => setEditModalOpen(false)}
                        >
                            &times;
                        </button>
                        <CourseForm
                            BASE_API={BASE_API}
                            categories={categories}
                            course={selectedCourse}
                            onSuccess={() => {
                                fetchCourses();
                                setEditModalOpen(false);
                                setSelectedCourse(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
