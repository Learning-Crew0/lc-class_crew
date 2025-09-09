import CourseCard from "@/components/home/CourseCard/page";
import type { Course } from "@/types/course";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

interface CourseSectionProps {
  title: string;
  courses: Course[];
}

export default function CourseSection({ title, courses }: CourseSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as const;

  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  } as const;

  const arrowVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeOut" as const },
    },
  } as const;

  return (
    <motion.section
      className="py-8 px-6 max-w-7xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.div
        className="flex items-center justify-between"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="flex items-center justify-start gap-2 text-[36px] font-extrabold text-[var(--primary)] mb-6"
          variants={titleVariants}
        >
          {title}
          <motion.img
            src="/images/up-arrow.png"
            alt=""
            className="w-8 h-8"
            variants={arrowVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          />
        </motion.h2>
        <motion.h2
          className="text-lg font-medium text-gray-500"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          전체 CLASS
        </motion.h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseCard
              course={course}
              highlighted={title === "POPULAR" && index === 2}
            />
          </motion.div>
        ))}
      </motion.div>

      {title !== "ALL" && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeOut" as const },
          }}
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ gap: "1rem" }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
          >
            <motion.img
              src="/images/left-arrow.png"
              alt=""
              className="w-12 h-12 cursor-pointer"
              variants={arrowVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            />
            <motion.img
              src="/images/right-black-arrow.png"
              alt=""
              className="w-12 h-12 cursor-pointer"
              variants={arrowVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
