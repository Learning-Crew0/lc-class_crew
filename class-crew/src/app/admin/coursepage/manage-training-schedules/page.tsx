"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    getAllCourses,
    getCourseTrainingSchedules,
    addTrainingSchedule,
    updateTrainingSchedule,
    deleteTrainingSchedule
} from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface Course {
    _id: string;
    title: string;
    shortDescription?: string;
}

interface TrainingSchedule {
    _id: string;
    scheduleName: string;
    startDate?: string;
    endDate?: string;
    status: string;
    availableSeats?: number;
    enrolledCount: number;
    isActive: boolean;
}

interface CourseWithSchedules extends Course {
    trainingSchedules: TrainingSchedule[];
}

export default function ManageTrainingSchedules() {
    const { token } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<TrainingSchedule | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        scheduleName: "",
        startDate: "",
        endDate: "",
        status: "upcoming",
        availableSeats: "",
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await getAllCourses();
            if (response.success) {
                setCourses(Array.isArray(response.courses) ? response.courses : []);
            } else {
                toast.error("Failed to fetch courses");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error("Error fetching courses");
        } finally {
            setLoading(false);
        }
    };

    const fetchSchedules = async (courseId: string) => {
        try {
            setLoading(true);
            const response = await getCourseTrainingSchedules(courseId);
            if (response.success) {
                const scheduleData = response.data as { trainingSchedules?: TrainingSchedule[] };
                setSchedules(Array.isArray(scheduleData?.trainingSchedules) ? scheduleData.trainingSchedules : []);
            } else {
                toast.error("Failed to fetch training schedules");
            }
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Error fetching schedules");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (courseId: string) => {
        setSelectedCourse(courseId);
        if (courseId) {
            fetchSchedules(courseId);
        } else {
            setSchedules([]);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            scheduleName: "",
            startDate: "",
            endDate: "",
            status: "upcoming",
            availableSeats: "",
        });
        setShowAddForm(false);
        setEditingSchedule(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCourse) {
            toast.error("Please select a course first");
            return;
        }

        if (!formData.scheduleName) {
            toast.error("Schedule name is required");
            return;
        }

        try {
            setLoading(true);

            const scheduleData = {
                scheduleName: formData.scheduleName,
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined,
                status: formData.status,
                availableSeats: formData.availableSeats ? Number(formData.availableSeats) : undefined,
            };

            console.log("Sending schedule data:", scheduleData);
            console.log("Selected course:", selectedCourse);
            console.log("Token exists:", !!token);

            let response;
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            if (editingSchedule) {
                response = await updateTrainingSchedule(token, selectedCourse, editingSchedule._id, scheduleData);
            } else {
                response = await addTrainingSchedule(token, selectedCourse, scheduleData);
            }

            console.log("API Response:", response);

            if (response.success) {
                toast.success(editingSchedule ? "Schedule updated successfully" : "Schedule added successfully");
                resetForm();
                fetchSchedules(selectedCourse);
            } else {
                toast.error(response.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving schedule:", error);
            toast.error("Error saving schedule");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (schedule: TrainingSchedule) => {
        setEditingSchedule(schedule);
        setFormData({
            scheduleName: schedule.scheduleName,
            startDate: schedule.startDate ? schedule.startDate.split('T')[0] : "",
            endDate: schedule.endDate ? schedule.endDate.split('T')[0] : "",
            status: schedule.status,
            availableSeats: schedule.availableSeats?.toString() || "",
        });
        setShowAddForm(true);
    };

    const handleDelete = async (scheduleId: string) => {
        if (!confirm("Are you sure you want to delete this training schedule?")) {
            return;
        }

        try {
            setLoading(true);
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            const response = await deleteTrainingSchedule(token, selectedCourse, scheduleId);

            if (response.success) {
                toast.success("Schedule deleted successfully");
                fetchSchedules(selectedCourse);
            } else {
                toast.error(response.message || "Failed to delete schedule");
            }
        } catch (error) {
            console.error("Error deleting schedule:", error);
            toast.error("Error deleting schedule");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "upcoming": return "bg-blue-100 text-blue-800";
            case "ongoing": return "bg-green-100 text-green-800";
            case "completed": return "bg-gray-100 text-gray-800";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-[var(--primary)] mb-8">
                    Manage Training Schedules
                </h1>

                {/* Course Selection */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Select Course</h2>
                    <select
                        value={selectedCourse}
                        onChange={(e) => handleCourseChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                        <option value="">Select a course...</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCourse && (
                    <>
                        {/* Add Schedule Button */}
                        <div className="mb-6">
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                {showAddForm ? "Cancel" : "Add New Schedule"}
                            </button>
                        </div>

                        {/* Add/Edit Form */}
                        {showAddForm && (
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
                                </h2>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Schedule Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="scheduleName"
                                            value={formData.scheduleName}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                            placeholder="Enter schedule name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Available Seats
                                        </label>
                                        <input
                                            type="number"
                                            name="availableSeats"
                                            value={formData.availableSeats}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                            placeholder="Enter available seats"
                                            min="1"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                                        >
                                            {loading ? "Saving..." : editingSchedule ? "Update Schedule" : "Add Schedule"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="ml-4 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Schedules List */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Training Schedules</h2>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Loading schedules...</p>
                                </div>
                            ) : schedules.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No training schedules found for this course.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-2 text-left">Schedule Name</th>
                                                <th className="px-4 py-2 text-left">Status</th>
                                                <th className="px-4 py-2 text-left">Start Date</th>
                                                <th className="px-4 py-2 text-left">End Date</th>
                                                <th className="px-4 py-2 text-left">Seats</th>
                                                <th className="px-4 py-2 text-left">Enrolled</th>
                                                <th className="px-4 py-2 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules.map((schedule) => (
                                                <tr key={schedule._id} className="border-t">
                                                    <td className="px-4 py-2 font-medium">{schedule.scheduleName}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                                                            {schedule.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString() : "-"}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {schedule.endDate ? new Date(schedule.endDate).toLocaleDateString() : "-"}
                                                    </td>
                                                    <td className="px-4 py-2">{schedule.availableSeats || "-"}</td>
                                                    <td className="px-4 py-2">{schedule.enrolledCount}</td>
                                                    <td className="px-4 py-2">
                                                        <button
                                                            onClick={() => handleEdit(schedule)}
                                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition mr-2"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(schedule._id)}
                                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}