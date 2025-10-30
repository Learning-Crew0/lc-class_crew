"use client";
import Footer from "@/components/layout/footer/page";
import Navbar from "@/components/layout/navbar/page";
import { Banner, NavBar, CourseSection } from "@/components/home";
import SearchBanner from "@/components/ui/SearchBanner";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { motion, Variants } from "framer-motion";

import type { Course } from "@/types/course";

const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.16,
            delayChildren: 0.08,
        },
    },
};

const childVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

// Default fallback courses for when API fails
const defaultCourse1 = {
    id: "1",
    tagColor: "text-[#DC77EC]",
    tagText: "리더십",
    category: "환급",
    title: "핵심을 짚는 말과 글,\n비즈니스 문해력",
    description: "LEVEL UP",
    tags: ["모여듣기", "얼리버드 할인", "그룹할인"],
    date: "25.08.01~25.08.02",
    price: "₩600,000",
};

const defaultCourse2 = {
    id: "2",
    tagColor: "text-[#0A16FE]",
    tagText: "DX",
    category: "환급",
    title: "COURSE TITLE",
    description: "",
    tags: ["모여듣기", "얼리버드 할인", "그룹할인"],
    date: "25.08.01~25.08.02",
    price: "₩600,000",
};

const defaultCourse3 = {
    id: "3",
    tagColor: "text-[#10BD58]",
    tagText: "라이프 & 커리어",
    category: "환급",
    title: "COURSE TITLE",
    description: "",
    tags: ["모여듣기", "얼리버드 할인", "그룹할인"],
    date: "25.08.01~25.08.02",
    price: "₩600,000",
};

const defaultCourse4 = {
    id: "4",
    tagColor: "text-[#D38D00]",
    tagText: "비즈니스 스킬",
    category: "환급",
    title: "핵심을 짚는 말과 글,\n비즈니스 문해력",
    description: "LEVEL UP",
    tags: ["모여듣기", "얼리버드 할인", "그룹할인"],
    date: "25.08.01~25.08.02",
    price: "₩600,000",
};

const defaultNewestCourses = [
    defaultCourse1,
    defaultCourse2,
    defaultCourse3,
    defaultCourse4,
];
const defaultPopularCourses = [
    defaultCourse1,
    defaultCourse2,
    defaultCourse4,
    defaultCourse3,
];
const defaultAllCourses = [
    { ...defaultCourse1, id: "1" },
    { ...defaultCourse2, id: "2" },
    { ...defaultCourse4, id: "4" },
    { ...defaultCourse3, id: "3" },
    { ...defaultCourse2, id: "5" },
    { ...defaultCourse1, id: "6" },
    { ...defaultCourse3, id: "7" },
    { ...defaultCourse4, id: "8" },
];

// Helper function to transform API course data to match UI expectations
const transformCourseData = (apiCourse: Record<string, unknown>): Course => {
    // Convert hex color to CSS class format
    const convertTagColor = (hexColor: string): string => {
        if (!hexColor) return "text-[#DC77EC]";
        if (hexColor.startsWith("#")) {
            return `text-[${hexColor}]`;
        }
        return hexColor.startsWith("text-") ? hexColor : `text-[${hexColor}]`;
    };

    // Format price - return the number for price field and formatted string for display
    const getPrice = (price: unknown): number => {
        if (typeof price === "number") return price;
        if (typeof price === "string" && price !== "undefined") {
            const numPrice = parseInt(price.replace(/[^\d]/g, ""));
            return isNaN(numPrice) ? 600000 : numPrice;
        }
        return 600000;
    };

    const getPriceText = (price: unknown, priceText?: string): string => {
        if (priceText && priceText !== "undefined" && priceText.trim())
            return priceText;
        const numPrice = getPrice(price);
        return `₩${numPrice.toLocaleString()}`;
    };

    // Format date
    const formatDate = (date: unknown): string => {
        if (!date || date === "undefined")
            return new Date().toLocaleDateString();
        if (typeof date === "string") {
            const parsedDate = new Date(date);
            return isNaN(parsedDate.getTime())
                ? date
                : parsedDate.toLocaleDateString();
        }
        return new Date().toLocaleDateString();
    };

    // Helper to extract string from image field (handles both string and object)
    const getImageUrl = (imageField: unknown): string | undefined => {
        if (!imageField) return undefined;
        if (typeof imageField === "string") return imageField;
        if (typeof imageField === "object" && "url" in imageField) {
            return (imageField as { url: string }).url;
        }
        if (Array.isArray(imageField) && imageField.length > 0) {
            return getImageUrl(imageField[0]);
        }
        return undefined;
    };

    return {
        id: (apiCourse._id as string) || (apiCourse.id as string) || "",
        title: (apiCourse.title as string) || "Course Title",
        description:
            (apiCourse.shortDescription as string) ||
            (apiCourse.longDescription as string) ||
            (apiCourse.description as string) ||
            "Course Description",
        category:
            typeof apiCourse.category === "object" && apiCourse.category
                ? ((apiCourse.category as Record<string, unknown>)
                    .title as string) ||
                ((apiCourse.category as Record<string, unknown>)
                    .name as string) ||
                "환급"
                : (apiCourse.category as string) || "환급",
        tagColor: convertTagColor((apiCourse.tagColor as string) || "#DC77EC"),
        tagText: (apiCourse.tagText as string) || "리더십",
        tags: (apiCourse.tags as string[]) || [
            "모여듣기",
            "얼리버드 할인",
            "그룹할인",
        ],
        date: formatDate(apiCourse.date),
        price: getPrice(apiCourse.price),
        priceText: getPriceText(apiCourse.price, apiCourse.priceText as string),
        image: getImageUrl(apiCourse.mainImage || apiCourse.image),
        hoverImage: getImageUrl(
            apiCourse.hoverImage || apiCourse.mainImage || apiCourse.image
        ),
        duration: apiCourse.duration as string,
        location: apiCourse.location as string,
        level: apiCourse.level as string,
        isActive: (apiCourse.isActive as boolean) !== false,
    };
};

export default function StorePage() {
    const [theme, setTheme] = useState("");
    const [job, setJob] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Derived course arrays - prioritize API courses over defaults
    const newestCourses =
        courses.length > 0
            ? courses.slice(0, 4)
            : defaultNewestCourses.slice(0, 4);
    const popularCourses =
        courses.length > 0
            ? courses.slice(0, 4).reverse()
            : defaultPopularCourses.slice(0, 4);
    const allCourses =
        courses.length > 0
            ? courses.slice(0, 8)
            : defaultAllCourses.slice(0, 8);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);

                // Import debug utilities
                const { debugApiConfig, testApiConnection } = await import(
                    "@/utils/debug"
                );

                // Debug API configuration
                debugApiConfig();

                // Test API connection first
                const connectionTest = await testApiConnection();
                if (!connectionTest.success) {
                    throw new Error(
                        `API connection test failed: ${connectionTest.error}`
                    );
                }

                // Import API function
                const { getAllCourses } = await import("@/utils/api");

                console.log("Fetching courses using API utility...");
                const response = await getAllCourses({ limit: 20, page: 1 });

                console.log("API Response:", response);

                if (response.success && response.courses) {
                    const coursesData = response.courses;
                    console.log("Courses data:", coursesData);

                    if (Array.isArray(coursesData) && coursesData.length > 0) {
                        // Filter only active courses
                        const activeCourses = coursesData
                            .filter(
                                (course: Record<string, unknown>) =>
                                    course.isActive !== false
                            )
                            .map(transformCourseData);

                        console.log("Transformed courses:", activeCourses);
                        setCourses(activeCourses);
                        setError(null);
                    } else {
                        console.log("No courses found in API response");
                        setError("No courses available");
                    }
                } else {
                    console.log("API response not successful:", response);
                    setError("Failed to load courses from API");
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError(
                    `Failed to load courses: ${err instanceof Error ? err.message : "Unknown error"}`
                );
                // Keep default courses on error
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <motion.main
            className="flex flex-col items-center w-full"
            initial="hidden"
            animate="visible"
            variants={pageVariants}
        >
            <motion.div variants={childVariants} className="w-full">
                <Navbar />
            </motion.div>

            <motion.div variants={childVariants} className="w-full">
                <Banner />
            </motion.div>

            <motion.div variants={childVariants} className="w-full">
                <NavBar />
            </motion.div>

            {loading && (
                <motion.div
                    variants={childVariants}
                    className="w-full text-center py-8"
                >
                    <p className="text-lg text-gray-600">Loading courses...</p>
                </motion.div>
            )}

            {error && (
                <motion.div
                    variants={childVariants}
                    className="w-full text-center py-8"
                >
                    <p className="text-lg text-red-600">{error}</p>

                </motion.div>
            )}



            <motion.div variants={childVariants} className="w-full">
                <CourseSection title="NEWEST" courses={newestCourses} />
            </motion.div>

            <motion.div variants={childVariants} className="w-full">
                <CourseSection title="POPULAR" courses={popularCourses} />
            </motion.div>

            <motion.div variants={childVariants} className="w-full">
                <CourseSection title="ALL" courses={allCourses} />
            </motion.div>

            <motion.div
                variants={childVariants}
                className="w-full flex justify-center"
            >
                <Button
                    label="View All"
                    variant="primary"
                    className="mt-4 mb-20"
                />
            </motion.div>

            <motion.div
                variants={childVariants}
                className="w-full flex justify-center"
            >
                <SearchBanner
                    bgImage="/images/Block_with_illustration.png"
                    title="추천CLASS찾기"
                    description=""
                    buttonText="검색"
                    height="h-[130px]"
                    width="w-[1245px]"
                    onSearch={() => console.log("Searching with:", theme, job)}
                    filters={[
                        {
                            label: "테마",
                            value: theme,
                            onChange: setTheme,
                            options: [
                                { label: "리더십", value: "leadership" },
                                { label: "DX", value: "dx" },
                            ],
                        },
                        {
                            label: "직급/직책",
                            value: job,
                            onChange: setJob,
                            options: [
                                { label: "Manager", value: "manager" },
                                { label: "Staff", value: "staff" },
                            ],
                        },
                    ]}
                />
            </motion.div>

            <motion.div variants={childVariants} className="w-full">
                <Footer />
            </motion.div>
        </motion.main>
    );
}
