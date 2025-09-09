"use client";

import { Instagram } from "lucide-react";
import { FaFacebookF, FaYoutube, FaLaptop, FaCaretDown } from "react-icons/fa";
import { motion, Variants } from "framer-motion";

export default function Footer() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const socialVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const hoverVariants: Variants = {
    hover: { scale: 1.1, y: -2 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.footer
      className="bg-[#111111] text-white py-10 px-6 md:px-12 w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 font-medium">
        {/* LEFT SIDE */}
        <motion.div className="text-md mt-4" variants={itemVariants}>
          <motion.p
            className="text-secondary ml-2 text-[17px]"
            variants={itemVariants}
            transition={{ delay: 0.1 }}
          >
            주식회사 러닝크루{" "}
            <span className="text-text"> | 사업자 등록번호. 393–88–01627</span>
          </motion.p>

          <motion.p
            className="text-text text-[17px]"
            variants={itemVariants}
            transition={{ delay: 0.2 }}
          >
            주소, 서울 성동구 연무장5가길 7 (성수동2가, <br /> 성수역
            현대테라스타워) W1001호–1003호
          </motion.p>

          <motion.p
            className="text-text mt-4 text-[17px]"
            variants={itemVariants}
            transition={{ delay: 0.3 }}
          >
            이메일.{" "}
            <a
              href="mailto:info@learning-crew.com"
              className="hover:text-gray-300 transition text-text text-[17px] ml-2"
            >
              info@learning-crew.com
            </a>
          </motion.p>

          <motion.p
            className="text-[14px] text-text pt-4 mt-5 ml-3"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            © 2025. Learning Crew all rights reserved. Site by{" "}
            <a
              href="#"
              className="hover:text-gray-200 underline underline-offset-2 transition"
            >
              THREEWAY
            </a>
          </motion.p>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          className="bg-[#ffffff14] rounded-lg p-8 flex flex-col gap-4 shadow-lg w-full h-[210px] md:w-auto"
          variants={itemVariants}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              className="bg-secondary text-black font-semibold underline rounded-lg py-5 px-4 transition border border-background"
              variants={hoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              오시는 길
            </motion.button>

            <motion.button
              className="bg-transparent border border-background text-white font-medium rounded-lg py-5 px-4 transition"
              whileHover={{
                scale: 1.1,
                y: -2,
                backgroundColor: "rgba(128, 128, 128, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              대관신청
            </motion.button>

            <motion.div
              className="flex justify-center gap-4 pt-4 border border-background py-5 px-4 rounded-lg"
              variants={itemVariants}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full transition hover:bg-gray-700"
                variants={socialVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </motion.a>

              <motion.a
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full transition hover:bg-gray-700"
                variants={socialVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="YouTube"
              >
                <FaYoutube size={18} />
              </motion.a>

              <motion.a
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full transition hover:bg-gray-700"
                variants={socialVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </motion.a>

              <motion.a
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full transition hover:bg-gray-700"
                variants={socialVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Website"
              >
                <FaLaptop size={18} />
              </motion.a>
            </motion.div>

            <motion.div
              className="relative"
              variants={itemVariants}
              transition={{ delay: 0.7 }}
            >
              <select className="appearance-none bg-transparent border border-gray-600 rounded-lg py-5 px-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-500 w-full pr-8">
                <option>Family Site</option>
                <option>Learning Crew</option>
                <option>Another Site</option>
              </select>
              <FaCaretDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={16}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
