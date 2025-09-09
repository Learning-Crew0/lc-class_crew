"use client";

import Image from "next/image";
import Footer from "@/components/layout/footer/page";
import Navbar from "@/components/layout/navbar/page";
import { Banner, NavBar, CourseSection } from "@/components/home";
import SearchBanner from "@/components/ui/SearchBanner";
import React from "react";
import Button from "@/components/ui/Button";
import { motion, Variants } from "framer-motion";

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // stagger children when parent becomes visible
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

const course1 = {
  id: "1",
  tagColor: "text-pink-600",
  tagText: "리더십",
  category: "환급",
  title: "핵심을 짚는 말과 글, 비즈니스 문해력",
  description: "LEVEL UP",
  tags: ["모여듣기", "얼리버드 할인", "그룹할인"],
  date: "25.08.01~25.08.02",
  price: "₩600,000",
};

const course2 = {
  id: "2",
  tagColor: "text-blue-600",
  tagText: "DX",
  category: "환급",
  title: "COURSE TITLE",
  description: "",
  tags: ["모여듣기", "얼리버드 할인", "그룹할인"],
  date: "25.08.01~25.08.02",
  price: "₩600,000",
};

const course3 = {
  id: "3",
  tagColor: "text-green-600",
  tagText: "라이프 & 커리어",
  category: "환급",
  title: "COURSE TITLE",
  description: "",
  tags: ["모여듣기", "얼리버드 할인", "그룹할인"],
  date: "25.08.01~25.08.02",
  price: "₩600,000",
};

const course4 = {
  id: "4",
  tagColor: "text-orange-600",
  tagText: "비즈니스 스킬",
  category: "환급",
  title: "핵심을 짚는 말과 글, 비즈니스 문해력",
  description: "LEVEL UP",
  tags: ["모여듣기", "얼리버드 할인", "그룹할인"],
  date: "25.08.01~25.08.02",
  price: "₩600,000",
};

const newestCourses = [course1, course2, course3, course4];
const popularCourses = [course1, course2, course4, course3];
const allCourses = [
  { ...course1, id: "1" },
  { ...course2, id: "2" },
  { ...course4, id: "4" },
  { ...course3, id: "3" },
  { ...course2, id: "5" },
  { ...course1, id: "6" },
  { ...course3, id: "7" },
  { ...course4, id: "8" },
];

export default function StorePage() {
  const [theme, setTheme] = React.useState("");
  const [job, setJob] = React.useState("");

  return (
    <motion.main
      className="flex flex-col items-center w-full"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Navbar — if you want it animated too, wrap it */}
      <motion.div variants={childVariants} className="w-full">
        <Navbar />
      </motion.div>

      {/* Banner (single instance only) */}
      <motion.div variants={childVariants} className="w-full">
        <Banner />
      </motion.div>

      {/* NavBar (component under the banner) */}
      <motion.div variants={childVariants} className="w-full">
        <NavBar />
      </motion.div>

      {/* Course sections */}
      <motion.div variants={childVariants} className="w-full">
        <CourseSection title="NEWEST" courses={newestCourses} />
      </motion.div>

      <motion.div variants={childVariants} className="w-full">
        <CourseSection title="POPULAR" courses={popularCourses} />
      </motion.div>

      <motion.div variants={childVariants} className="w-full">
        <CourseSection title="ALL" courses={allCourses} />
      </motion.div>

      {/* CTA button */}
      <motion.div
        variants={childVariants}
        className="w-full flex justify-center"
      >
        <Button label="View All" variant="primary" className="mt-4 mb-20" />
      </motion.div>

      {/* Search banner */}
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

      {/* Footer (it already animates inside, but wrapping won't hurt) */}
      <motion.div variants={childVariants} className="w-full">
        <Footer />
      </motion.div>
    </motion.main>
  );
}
