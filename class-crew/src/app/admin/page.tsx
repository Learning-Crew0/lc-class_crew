"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Layers, Bell } from "lucide-react";
import toast from "react-hot-toast";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    courses: 0,
  });

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const [categoryRes, courseRes] = await Promise.all([
          
        fetch(`${BASE_API}category`),
        fetch(`${BASE_API}courses`),
      ]);

      if (!categoryRes.ok || !courseRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const categoriesData = await categoryRes.json();
      const coursesData = await courseRes.json();

      console.log("📦 Categories Response:", categoriesData);
      console.log("📦 Courses Response:", coursesData);

      // ✅ Check what structure API returns and pick the right one
      const categoryCount =
        Array.isArray(categoriesData)
          ? categoriesData.length
          : categoriesData.data?.length ||
            categoriesData.categories?.length ||
            0;

      const courseCount =
        Array.isArray(coursesData)
          ? coursesData.length
          : coursesData.data?.length ||
            coursesData.courses?.length ||
            0;

      setStats((prev) => ({
        ...prev,
        categories: categoryCount,
        courses: courseCount,
      }));

      toast.success("Dashboard data loaded!");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

  const recentActivity = [
    { id: 1, message: "New course added: React Basics", time: "2 hours ago" },
    { id: 2, message: "Promotion activated: Summer Discount", time: "1 day ago" },
    { id: 3, message: "Notice published: Maintenance Downtime", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold border-b-4 border-black pb-3">
          Dashboard
        </h1>
        <p className="mt-3 text-gray-700 text-lg">
          Welcome to your admin dashboard. Here’s an overview of your platform.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-600 text-lg py-20">
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Users (Static for now) */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold mb-2">Total Users</h2>
                <Users className="text-blue-600" size={28} />
              </div>
              <p className="text-3xl font-extrabold text-blue-600">{stats.users}</p>
              <p className="text-gray-500 mt-1">Active users this month</p>
            </div>

            {/* Categories */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold mb-2">Categories</h2>
                <Layers className="text-green-600" size={28} />
              </div>
              <p className="text-3xl font-extrabold text-green-600">{stats.categories}</p>
              <p className="text-gray-500 mt-1">Categories available</p>
            </div>

            {/* Courses */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold mb-2">Courses</h2>
                <BookOpen className="text-indigo-600" size={28} />
              </div>
              <p className="text-3xl font-extrabold text-indigo-600">{stats.courses}</p>
              <p className="text-gray-500 mt-1">Courses available</p>
            </div>

            {/* Notifications */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold mb-2">Notifications</h2>
                <Bell className="text-orange-600" size={28} />
              </div>
              <p className="text-3xl font-extrabold text-orange-600">
                {recentActivity.length}
              </p>
              <p className="text-gray-500 mt-1">Recent updates</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-5 border-b-2 border-gray-300 pb-2">
              Recent Activity
            </h2>
            <ul className="space-y-4">
              {recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="bg-white border-2 border-black rounded-xl p-4 shadow hover:shadow-lg transition-all flex justify-between items-center"
                >
                  <span className="text-gray-800 font-medium">{activity.message}</span>
                  <span className="text-gray-500 text-sm">{activity.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
