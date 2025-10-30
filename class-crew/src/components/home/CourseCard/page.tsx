import type { Course } from "@/types/course";
import Link from "next/link";

export default function CourseCard({ course }: { course: Course }) {
    const getBackgroundColor = (tagColor: string) => {
        switch (tagColor) {
            case "text-[#DC77EC]":
                return "bg-[#DC77EC]";
            case "text-[#0A16FE]":
                return "bg-[#0A16FE]";
            case "text-[#10BD58]":
                return "bg-[#10BD58]";
            case "text-[#D38D00]":
                return "bg-[#D38D00]";
            case "text-pink-600":
                return "bg-[#DC77EC]";
            case "text-blue-600":
                return "bg-[#0A16FE]";
            case "text-green-600":
                return "bg-[#10BD58]";
            case "text-orange-600":
                return "bg-[#D38D00]";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <Link href={`/class/${course.id}`}>
            <div
                className={`group relative bg-white border border-[var(--primary)] rounded-lg p-4 
                   shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105
                   flex flex-col w-[288px] h-[288px] cursor-pointer overflow-hidden`}
                role="article"
                aria-labelledby={`course-title-${course.id}`}
            >
                <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-90 transition-opacity duration-500 rounded-lg">
                    {(course.hoverImage &&
                        typeof course.hoverImage === "string") ||
                        (course.image && typeof course.image === "string") ? (
                        <img
                            src={course.hoverImage || course.image || ""}
                            alt={`${course.title} background`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                // Show the gradient background instead
                                const parent = target.parentElement;
                                if (parent) {
                                    parent.innerHTML =
                                        '<div class="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg"></div>';
                                }
                            }}
                        />
                    ) : (
                        /* Placeholder background when no image is provided */
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg"></div>
                    )}
                </div>

                {/* Normal State Content */}
                <div className="relative z-10 flex-1 flex flex-col group-hover:opacity-0 transition-opacity duration-300">
                    {/* Header Section */}
                    <div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div
                                    className={`w-2 h-2 rounded-full mr-1 ${getBackgroundColor(
                                        course.tagColor
                                    )}`}
                                ></div>
                                <span
                                    className={`text-[16px] font-semibold ${course.tagColor}`}
                                >
                                    {course.tagText}
                                </span>
                            </div>
                            <span className="text-[13px] py-1 font-medium bg-[var(--secondary)] px-2 text-[var(--text)] rounded">
                                {(() => {
                                    if (
                                        typeof course.category === "object" &&
                                        course.category
                                    ) {
                                        return (
                                            course.category.title ||
                                            course.category.name ||
                                            "환급"
                                        );
                                    }
                                    return course.category || "환급";
                                })()}
                            </span>
                        </div>

                        <h1
                            id={`course-title-${course.id}`}
                            className="text-[18px] font-bold text-[var(--primary)] mt-2 line-clamp-2"
                        >
                            {course.title}
                        </h1>

                        <p
                            className="text-[14px] text-[var(--text)] mt-2 overflow-hidden line-clamp-2"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical" as const,
                            }}
                        >
                            {course.description}
                        </p>
                    </div>

                    {/* Tags Section */}
                    <div className="mt-auto flex flex-wrap gap-1 pt-3">
                        {course.tags.map((tag, idx) => (
                            <button
                                key={idx}
                                className="bg-[var(--primary)] text-[var(--secondary)] text-xs px-2 py-1 rounded"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Normal State Footer */}
                <div className="relative z-10 mt-4 border-t border-[var(--secondary)] pt-2 flex justify-between items-center text-sm font-bold text-[var(--primary)] group-hover:opacity-0 transition-opacity duration-300">
                    <span className="text-[var(--primary)] text-[12px] font-normal">
                        {course.date instanceof Date
                            ? course.date.toLocaleDateString()
                            : course.date}
                    </span>
                    <span className="text-[var(--primary)] text-[20px] font-semibold">
                        {course.priceText ||
                            (typeof course.price === "number"
                                ? `₩${course.price.toLocaleString()}`
                                : course.price)}
                    </span>
                </div>

                {/* Hover State Content - Simplified */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {/* Title */}
                    <h2 className="text-white text-[20px] font-bold mb-2">
                        {course.title}
                    </h2>

                    {/* Divider Line */}
                    <div className="w-full h-[1px] bg-white/30 mb-3"></div>

                    {/* Date and Price */}
                    <div className="flex justify-between items-center text-white">
                        <span className="text-[12px] font-normal">
                            {course.date instanceof Date
                                ? course.date.toLocaleDateString()
                                : course.date}
                        </span>
                        <span className="text-[18px] font-semibold">
                            {course.priceText ||
                                (typeof course.price === "number"
                                    ? `₩${course.price.toLocaleString()}`
                                    : course.price)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
