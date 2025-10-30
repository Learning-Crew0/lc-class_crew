// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import Navbar from "@/components/layout/navbar/page";
// import ClassGoal from "./ClassGoal";
// import Curriculum from "./Curriculum";
// import Recommend from "./Recommend";
// import Instructor from "./Instructor";
// import Promotion from "./Promotion";
// import Footer from "@/components/layout/footer/page";
// import Image from "next/image";
// import { FaCaretDown } from "react-icons/fa";
// import { Calendar, Share2, Download } from "lucide-react";
// import { getCourseById } from "@/utils/api";
// import type { Course } from "@/types/course";

// const tabs = [
//     { id: "class-goal", label: "CLASS GOAL", component: ClassGoal },
//     { id: "curriculum", label: "CURRICULUM", component: Curriculum },
//     { id: "recommend", label: "RECOMMENDED", component: Recommend },
//     { id: "instructor", label: "INSTRUCTOR", component: Instructor },
//     { id: "promotion", label: "PROMOTION", component: Promotion },
// ];

// export default function CourseDetailPage() {
//     const params = useParams();
//     const courseId = params.id as string;

//     const [course, setCourse] = useState<Course | null>(null);
//     // Removed unused courseData state
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const [activeTab, setActiveTab] = useState("class-goal");
//     const [selectedDate, setSelectedDate] = useState("");
//     const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
//     const navbarHeight = 60;
//     const spacerHeight = 30;
//     const stickyNavHeight = 30;
//     const totalOffset = navbarHeight + spacerHeight + stickyNavHeight;
//     const paddingAdjustment = 40;

//     // Fetch course data
//     useEffect(() => {
//         const fetchCourse = async () => {
//             try {
//                 setLoading(true);
//                 const response = await getCourseById(courseId);

//                 if (response.success) {
//                     const apiCourseData = response.course || response.data;
//                     if (apiCourseData && typeof apiCourseData === 'object') {
//                         // API response data is available for components to use

//                         const course = apiCourseData as Record<string, unknown>;
//                         // Transform API data to match UI expectations
//                         // Helper function to safely extract string values
//                         const getString = (value: unknown, fallback: string = ""): string => {
//                             if (typeof value === 'string') return value;
//                             if (typeof value === 'object' && value !== null) {
//                                 const obj = value as Record<string, unknown>;
//                                 return (obj.title as string) || (obj.name as string) || fallback;
//                             }
//                             return fallback;
//                         };

//                         const transformedCourse: Course = {
//                             id: getString(course._id || course.id, courseId),
//                             title: getString(course.title, "Course Title"),
//                             description: getString(course.description || course.shortDescription, "Course Description"),
//                             category: getString(course.category, "대분류>중분류"),
//                             tagText: getString(course.tagText, "문해력"),
//                             tagColor: getString(course.tagColor, "text-blue-500"),
//                             tags: Array.isArray(course.tags) ? course.tags : ["환급", "모여듣기", "얼리버드 할인", "그룹할인"],
//                             image: getString(course.mainImage || course.image, "/images/Main1.png"),
//                             target: getString(course.target, "입사 3년차 미만 주니어, 신입사원"),
//                             duration: getString(course.duration, "12시간(1일차 8시간, 2일차 4시간)"),
//                             location: getString(course.location, "러닝크루 성수 CLASS"),
//                             price: typeof course.price === 'number' ? course.price : 600000,
//                             priceText: getString(course.priceText, "60만원(중식 및 교보재 포함)"),
//                             date: getString(course.date, "일정 보기 및 선택"),
//                         };

//                         console.log("Transformed course:", transformedCourse);
//                         console.log("Image value:", transformedCourse.image, "Type:", typeof transformedCourse.image);

//                         setCourse(transformedCourse);
//                     }
//                 }
//             } catch (err) {
//                 console.error("Error fetching course:", err);
//                 setError("Failed to load course");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (courseId) {
//             fetchCourse();
//         }
//     }, [courseId]);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 const visibleSections = entries.filter(
//                     (entry) => entry.isIntersecting
//                 );
//                 if (visibleSections.length > 0) {
//                     visibleSections.sort(
//                         (a, b) =>
//                             a.boundingClientRect.top - b.boundingClientRect.top
//                     );
//                     setActiveTab(visibleSections[0].target.id);
//                 }
//             },
//             {
//                 threshold: 0.1,
//                 rootMargin: `-${totalOffset}px 0px -40% 0px`,
//             }
//         );

//         tabs.forEach((tab) => {
//             const section = sectionRefs.current[tab.id];
//             if (section) observer.observe(section);
//         });

//         return () => observer.disconnect();
//     }, [totalOffset]);

//     const handleTabClick = (id: string) => {
//         setActiveTab(id);
//         const section = sectionRefs.current[id];
//         if (section) {
//             const sectionTop =
//                 section.getBoundingClientRect().top + window.scrollY;
//             // Subtract total offset and a small adjustment for padding/margin
//             window.scrollTo({
//                 top: sectionTop - totalOffset - paddingAdjustment,
//                 behavior: "smooth",
//             });
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
//                     <p className="mt-4 text-lg">Loading course...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !course) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-lg text-red-600">{error || "Course not found"}</p>
//                     <button
//                         onClick={() => window.history.back()}
//                         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                         Go Back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen w-full mx-auto bg-white">
//             <Navbar />

//             <div
//                 className="fixed left-0 w-full bg-white z-40"
//                 style={{ top: `${navbarHeight}px`, height: "30px" }}
//             ></div>

//             <div className="flex gap-8 mt-[130px] w-[1270px] px-4 sm:px-6 lg:px-8  mx-auto">
//                 <div className="w-[458px] h-[460px] overflow-hidden rounded-2xl">
//                     <Image
//                         src={course.image && typeof course.image === 'string' && course.image.trim() !== '' ? course.image : "/class-goal/main-image.png"}
//                         alt={course.title || "Course Image"}
//                         width={400}
//                         height={400}
//                         className="object-cover w-full h-full"
//                         onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.src = "/class-goal/main-image.png";
//                         }}
//                     />
//                 </div>

//                 <div className=" w-[760px] bg-white border border-[#D9D9D9] rounded-2xl p-6 relative">
//                     <p className="flex items-center justify-between text-[18px] font-bold text-[rgba(0,0,0,0.55)]">
//                         {/* {typeof course.category === 'object'
//                             ? ((course.category as any).title || (course.category as any).name || "대분류>중분류")
//                             : (course.category || "대분류>중분류")
//                         } */}
//                         {typeof course.category === "object" && course.category !== null
//                             ? ("title" in course.category
//                                 ? (course.category as { title: string }).title
//                                 : "name" in course.category
//                                     ? (course.category as { name: string }).name
//                                     : "대분류>중분류")
//                             : course.category || "대분류>중분류"}

//                         <span className="flex gap-4 text-black">
//                             <Share2 size={20} strokeWidth={2} />
//                             <Download size={20} strokeWidth={2} />
//                             <Calendar size={20} strokeWidth={2} />
//                         </span>
//                     </p>

//                     <h2 className="text-[32px] text-black font-bold mt-2 leading-tight tracking-tighter">
//                         {course.title}
//                     </h2>
//                     <div className="border-b border-gray-300  mt-2 w-[601px] ml-1 border-2"></div>
//                     <div className="mt-6 space-y-3 text-[18px] text-rgba(62, 62, 62, 0.72)">
//                         <div className="flex gap-10">
//                             <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
//                                 교육대상
//                             </span>
//                             <span className="whitespace-pre-line">
//                                 {course.description}
//                             </span>
//                         </div>
//                         <div className="flex gap-10">
//                             <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
//                                 교육시간
//                             </span>
//                             <span>{course.duration}</span>
//                         </div>
//                         <div className="flex gap-10">
//                             <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
//                                 교육비
//                             </span>
//                             <span>{course.priceText}</span>
//                         </div>
//                         <div className="flex gap-10">
//                             <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
//                                 교육장
//                             </span>
//                             <span>{course.location}</span>
//                         </div>
//                         <div className="flex items-center gap-10">
//                             <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
//                                 교육일정
//                             </span>
//                             <div className="relative w-[300px]">
//                                 <select
//                                     value={selectedDate}
//                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                     className="w-full h-[60px] text-[#434343] border-2 border-[#DDDDDD] px-3 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
//                                 >
//                                     <option value="" disabled>
//                                         일정 보기 및 선택
//                                     </option>
//                                     <option value="2025-01-15">2025년 1월 15일 (수)</option>
//                                     <option value="2025-01-22">2025년 1월 22일 (수)</option>
//                                     <option value="2025-01-29">2025년 1월 29일 (수)</option>
//                                     <option value="2025-02-05">2025년 2월 5일 (수)</option>
//                                 </select>
//                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
//                                     <FaCaretDown size={20} />
//                                 </span>
//                             </div>
//                         </div>
//                         <div className="border-b border-[#D9D9D9] mt-5" />
//                     </div>

//                     <div className="flex gap-3 mt-6">
//                         {course.tags.map((tag, idx) => (
//                             <button
//                                 key={idx}
//                                 className={`px-5 py-1 font-bold rounded-lg ${idx === 0
//                                     ? "bg-[#E7E7E7] text-black"
//                                     : "bg-black text-white"
//                                     }`}
//                             >
//                                 {tag}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* tabs navigation */}
//             <div
//                 className="bg-white border-b sticky z-50 mt-[30px]"
//                 style={{ top: `${navbarHeight + 30}px` }}
//             >
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <nav className="flex justify-between gap-8 border-gray-300 w-full mt-8">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => handleTabClick(tab.id)}
//                                 className={`py-4 px-1 border-b-2 text-[20px] font-bold ${activeTab === tab.id
//                                     ? "border-gray-900 text-gray-800"
//                                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                                     }`}
//                             >
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </nav>
//                 </div>
//             </div>

//             {/* dynamic sections */}
//             <div className="max-w-7xl mx-auto px-4 py-8 space-y-20 bg-white">
//                 {tabs.map((tab) => {
//                     const Component = tab.component;
//                     return (
//                         <section
//                             key={tab.id}
//                             id={tab.id}
//                             ref={(el) => {
//                                 sectionRefs.current[tab.id] = el;
//                             }}
//                             className="min-h-screen"
//                         >
//                             <Component />
//                         </section>
//                     );
//                 })}
//             </div>

//             <Footer />
//         </div>
//     );
// }

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/navbar/page";
import ClassGoal from "./ClassGoal";
import Curriculum from "./Curriculum";
import Recommend from "./Recommend";
import Instructor from "./Instructor";
import Promotion from "./Promotion";
import Footer from "@/components/layout/footer/page";
import Image from "next/image";
import { FaCaretDown } from "react-icons/fa";
import { Calendar, Share2, Download } from "lucide-react";
import { getCourseById, getCourseTrainingSchedules } from "@/utils/api";
import type { Course, TrainingSchedule } from "@/types/course";

// Extend Course type to handle both string and object category
type SafeCourse = Omit<Course, "category"> & {
    category: string | { title?: string; name?: string };
};

const tabs = [
    { id: "class-goal", label: "CLASS GOAL", component: ClassGoal },
    { id: "curriculum", label: "CURRICULUM", component: Curriculum },
    { id: "recommend", label: "RECOMMENDED", component: Recommend },
    { id: "instructor", label: "INSTRUCTOR", component: Instructor },
    { id: "promotion", label: "PROMOTION", component: Promotion },
];

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id as string;

    const [course, setCourse] = useState<SafeCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("class-goal");
    const [selectedDate, setSelectedDate] = useState("");
    const [trainingSchedules, setTrainingSchedules] = useState<
        TrainingSchedule[]
    >([]);
    const [selectedSchedule, setSelectedSchedule] = useState<string>("");

    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const navbarHeight = 60;
    const spacerHeight = 30;
    const stickyNavHeight = 30;
    const totalOffset = navbarHeight + spacerHeight + stickyNavHeight;
    const paddingAdjustment = 40;

    // Fetch course data and training schedules
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);

                // Fetch course data
                const courseResponse = await getCourseById(courseId);

                // Fetch training schedules
                const schedulesResponse =
                    await getCourseTrainingSchedules(courseId);

                if (courseResponse.success) {
                    const apiCourseData =
                        courseResponse.course || courseResponse.data;
                    if (apiCourseData && typeof apiCourseData === "object") {
                        const courseData = apiCourseData as Record<
                            string,
                            unknown
                        >;

                        const getString = (
                            value: unknown,
                            fallback = ""
                        ): string => {
                            if (typeof value === "string") return value;
                            if (typeof value === "object" && value !== null) {
                                const obj = value as Record<string, unknown>;
                                return (
                                    (obj.title as string) ||
                                    (obj.name as string) ||
                                    fallback
                                );
                            }
                            return fallback;
                        };

                        const transformedCourse: SafeCourse = {
                            id: getString(
                                courseData._id || courseData.id,
                                courseId
                            ),
                            title: getString(courseData.title, "Course Title"),
                            description: getString(
                                courseData.description ||
                                courseData.shortDescription,
                                "Course Description"
                            ),
                            category: courseData.category ?? "대분류>중분류",
                            tagText: getString(courseData.tagText, "문해력"),
                            tagColor: getString(
                                courseData.tagColor,
                                "text-blue-500"
                            ),
                            tags: Array.isArray(courseData.tags)
                                ? (courseData.tags as string[])
                                : [
                                    "환급",
                                    "모여듣기",
                                    "얼리버드 할인",
                                    "그룹할인",
                                ],
                            image: getString(
                                courseData.mainImage || courseData.image,
                                "/images/Main1.png"
                            ),
                            target: getString(
                                courseData.target,
                                "입사 3년차 미만 주니어, 신입사원"
                            ),
                            duration: getString(
                                courseData.duration,
                                "12시간(1일차 8시간, 2일차 4시간)"
                            ),
                            location: getString(
                                courseData.location,
                                "러닝크루 성수 CLASS"
                            ),
                            price:
                                typeof courseData.price === "number"
                                    ? courseData.price
                                    : 600000,
                            priceText: getString(
                                courseData.priceText,
                                "60만원(중식 및 교보재 포함)"
                            ),
                            date: getString(
                                courseData.date,
                                "일정 보기 및 선택"
                            ),
                        };

                        setCourse(transformedCourse);
                    }
                }

                // Set training schedules
                if (schedulesResponse.success && schedulesResponse.data) {
                    const schedulesData = schedulesResponse.data as {
                        trainingSchedules?: TrainingSchedule[];
                    };
                    if (schedulesData.trainingSchedules) {
                        setTrainingSchedules(schedulesData.trainingSchedules);
                    }
                }
            } catch (err) {
                console.error("Error fetching course data:", err);
                setError("Failed to load course");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) setActiveTab(visible.target.id);
            },
            { threshold: 0.1, rootMargin: `-${totalOffset}px 0px -40% 0px` }
        );

        tabs.forEach((tab) => {
            const section = sectionRefs.current[tab.id];
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [totalOffset]);

    const handleTabClick = (id: string) => {
        setActiveTab(id);
        const section = sectionRefs.current[id];
        if (section) {
            const sectionTop =
                section.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: sectionTop - totalOffset - paddingAdjustment,
                behavior: "smooth",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-lg">Loading course...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-red-600">
                        {error || "Course not found"}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full mx-auto bg-white">
            <Navbar />

            <div
                className="fixed left-0 w-full bg-white z-40"
                style={{ top: `${navbarHeight}px`, height: "30px" }}
            ></div>

            <div className="flex gap-8 mt-[130px] w-[1270px] px-4 sm:px-6 lg:px-8 mx-auto">
                <div className="w-[458px] h-[460px] overflow-hidden rounded-2xl">
                    <Image
                        src={
                            typeof course.image === "string" &&
                                course.image.trim() !== ""
                                ? course.image
                                : "/class-goal/main-image.png"
                        }
                        alt={course.title || "Course Image"}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/class-goal/main-image.png";
                        }}
                    />
                </div>

                <div className="w-[760px] bg-white border border-[#D9D9D9] rounded-2xl p-6 relative">
                    <p className="flex items-center justify-between text-[18px] font-bold text-[rgba(0,0,0,0.55)]">
                        {typeof course.category === "string"
                            ? course.category
                            : course.category?.title ||
                            course.category?.name ||
                            "대분류>중분류"}

                        <span className="flex gap-4 text-black">
                            <Share2 size={20} strokeWidth={2} />
                            <Download size={20} strokeWidth={2} />
                            <Calendar size={20} strokeWidth={2} />
                        </span>
                    </p>

                    <h2 className="text-[32px] text-black font-bold mt-2 leading-tight tracking-tighter">
                        {course.title}
                    </h2>

                    <div className="border-b border-gray-300 mt-2 w-[601px] ml-1 border-2"></div>

                    <div className="mt-6 space-y-3 text-[18px] text-[rgba(62,62,62,0.72)]">
                        <div className="flex gap-10">
                            <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
                                교육대상
                            </span>
                            <span className="whitespace-pre-line">
                                {course.description}
                            </span>
                        </div>
                        <div className="flex gap-10">
                            <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
                                교육시간
                            </span>
                            <span>{course.duration}</span>
                        </div>
                        <div className="flex gap-10">
                            <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
                                교육비
                            </span>
                            <span>{course.priceText}</span>
                        </div>
                        <div className="flex gap-10">
                            <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
                                교육장
                            </span>
                            <span>{course.location}</span>
                        </div>
                        <div className="flex items-center gap-10">
                            <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">
                                교육일정
                            </span>
                            <div className="relative w-[300px]">
                                <select
                                    value={selectedSchedule}
                                    onChange={(e) =>
                                        setSelectedSchedule(e.target.value)
                                    }
                                    className="w-full h-[60px] text-[#434343] border-2 border-[#DDDDDD] px-3 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="" disabled>
                                        일정 보기 및 선택
                                    </option>
                                    {trainingSchedules.map((schedule) => (
                                        <option
                                            key={schedule._id}
                                            value={schedule._id}
                                        >
                                            {schedule.scheduleName} -{" "}
                                            {new Date(
                                                schedule.startDate
                                            ).toLocaleDateString("ko-KR")}
                                            (
                                            {schedule.availableSeats -
                                                schedule.enrolledCount}{" "}
                                            seats left)
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                                    <FaCaretDown size={20} />
                                </span>
                            </div>
                        </div>
                        <div className="border-b border-[#D9D9D9] mt-5" />
                    </div>

                    <div className="flex gap-3 mt-6">
                        {course.tags.map((tag, idx) => (
                            <button
                                key={idx}
                                className={`px-5 py-1 font-bold rounded-lg ${idx === 0
                                    ? "bg-[#E7E7E7] text-black"
                                    : "bg-black text-white"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs navigation */}
            <div
                className="bg-white border-b sticky z-50 mt-[80px]"
                style={{ top: `${navbarHeight + 30}px` }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex justify-between gap-8 border-gray-300 w-full mt-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`py-4 px-1 border-b-2 text-[20px] font-bold ${activeTab === tab.id
                                    ? "border-gray-900 text-gray-800"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Dynamic sections */}
            <div className="max-w-7xl mx-auto px-4 bg-white">
                {tabs.map((tab) => {
                    const Component = tab.component;
                    return (
                        <section
                            key={tab.id}
                            id={tab.id}
                            ref={(el) => {
                                sectionRefs.current[tab.id] = el;
                            }}
                            className="py-8"
                        >
                            <Component />
                        </section>
                    );
                })}
            </div>

            <Footer />
        </div>
    );
}
