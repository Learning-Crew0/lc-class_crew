"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { colors } from "@/app/colors";

export default function NavBar() {
  const items = [
    "리더십/커리어/개인",
    "비즈니스 스킬",
    "DX",
    "라이프/커리어",
    "스포츠",
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const index = hoverIndex !== null ? hoverIndex : activeIndex;
    if (index === null || !navRefs.current[index] || !underlineRef.current) {
      if (underlineRef.current) {
        underlineRef.current.style.width = "0px";
      }
      return;
    }

    const navItem = navRefs.current[index];
    const { offsetLeft, offsetWidth } = navItem;
    underlineRef.current.style.left = `${offsetLeft}px`;
    underlineRef.current.style.width = `${offsetWidth}px`;
  }, [activeIndex, hoverIndex]);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  } as const;

  return (
    <motion.nav
      className="max-w-8xl w-full bg-[var(--background)] border-b border-[var(--secondary)] py-4 mt-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.ul
        className="flex justify-center gap-40 max-w-8xl mx-auto font-extrabold relative"
        variants={containerVariants}
      >
        {items.map((item, index) => (
          <motion.li
            key={item}
            variants={itemVariants}
            whileHover={{
              y: -5,
              scale: 1.05,
              color: "var(--primary)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
          >
            <motion.a
              ref={(el) => {
                navRefs.current[index] = el;
              }}
              href="#"
              className={`text-[20px] font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-200 ${
                activeIndex === index ? "text-[var(--primary)]" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              aria-current={activeIndex === index ? "page" : undefined}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.a>
          </motion.li>
        ))}
        <motion.div
          ref={underlineRef}
          className="absolute -bottom-[1px] h-1 bg-[var(--primary)] transition-all duration-300 ease-in-out"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: activeIndex !== null ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
        />
      </motion.ul>
    </motion.nav>
  );
}
