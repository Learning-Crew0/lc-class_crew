import type { Course } from "@/types/course";
import Link from "next/link";

export default function CourseCard({
  course,
  highlighted = false,
}: {
  course: Course;
  highlighted?: boolean;
}) {
  return (
    <Link href={`/class/${course.id}`}>
      <div
        className={`bg-white border border-[var(--primary)] rounded-lg p-4 
                   shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105
                   flex flex-col w-[288px] h-[288px] cursor-pointer`}
        role="article"
        aria-labelledby={`course-title-${course.id}`}
      >
        <div className="flex-1 flex flex-col">
          <div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${course.tagColor.replace(
                    "text-",
                    "bg-"
                  )}`}
                ></div>
                <span
                  className={`text-[16px] font-semibold ${course.tagColor}`}
                >
                  {course.tagText}
                </span>
              </div>
              <span className="text-[13px] py-1 font-medium bg-[var(--secondary)] px-2 text-[var(--text)]">
                {course.category}
              </span>
            </div>

            <h3
              id={`course-title-${course.id}`}
              className="text-[25px] font-bold text-[var(--primary)] mt-2"
            >
              {course.title}
            </h3>

            <p className="text-[22px] text-[var(--text)] mt-2 line-clamp-2">
              {course.description}
            </p>
          </div>

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

        <div className="mt-4 border-t border-[var(--secondary)] pt-2 flex justify-between items-center text-sm font-bold text-[var(--primary)]">
          <span className="text-[var(--primary)] text-[12px] font-normal">
            {course.date}
          </span>
          <span className="text-[var(--primary)] text-[20px] font-semibold">
            {course.price}
          </span>
        </div>
      </div>
    </Link>
  );
}
