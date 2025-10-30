"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { phenomena } from "@/app/font";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, isLoggedIn: authIsLoggedIn, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Update local state based on auth context
  useEffect(() => {
    setIsLoggedIn(authIsLoggedIn);
    if (user) {
      setUserName(user.fullName || user.username || "사용자");
    } else {
      setUserName("");
    }
  }, [authIsLoggedIn, user]);



  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-[67px] bg-primary text-white shadow-lg fixed top-0 left-0 z-50"
    >
      <div className="max-w-full ml-14 mr-10 pt-1 mx-auto flex items-center justify-between px-6 md:px-10 h-full">
        <motion.div>
          <Link href="/" className="flex items-center group">
            <motion.span
              className={`text-2xl md:text-3xl font-normal tracking-widest ${phenomena.className}  `}
            >
              CLASS
            </motion.span>
            <motion.div className="rounded-md mb-1 flex items-center justify-center shadow-md ">
              <Image
                src="/Vector.png"
                alt="Logo"
                width={42}
                height={20}
                className="object-contain"
              />
            </motion.div>
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex justify-center  text-secondary items-center ml-16 gap-20 text-[18px] font-plus-jakarta-sans font-semibold"
        >
          {[
            { href: "/classapplication", label: "CLASS" },
            { href: "/calender", label: "캘린더" },
            { href: "/learning-store", label: "STORE" },
            { href: "/coalition", label: "제휴" },
            { href: "customerservicecenter/announcement", label: "고객센터" },
          ].map((item, index) => (
            <motion.li
              key={item.label}
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.href}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                {item.label}
              </Link>
            </motion.li>
          ))}

          {/* Admin Link - Only show for admin users */}
          {isAdmin && (
            <motion.li
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/admin"
                className="hover:text-gray-300 transition-colors duration-200 text-yellow-300 font-bold"
              >
                관리자
              </Link>
            </motion.li>
          )}

          <motion.li
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isLoggedIn ? (
              <Link href={"/mypage"}>
                <motion.div
                  className="relative flex items-center gap-2 text-[16px]"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className={`w-8 h-8 absolute ml-2 ${phenomena.className} rounded-full bg-white text-black text-[22px] flex items-center justify-center font-bold`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    LC
                  </motion.div>
                  <motion.span
                    className="ml-6 pl-6 py-1 bg-gray-900 px-2 rounded-tl-sm rounded-bl-sm font-semibold text-[18px]"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    {userName}님
                  </motion.span>
                </motion.div>
              </Link>
            ) : (
              <Link href="/login">
                <motion.span
                  className="text-[18px] font-semibold hover:text-gray-300 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  로그인
                </motion.span>
              </Link>
            )}
          </motion.li>
          {/* 
          <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
            <motion.button className="items-center w-8 h-8 transition">
              <img src="/msg.png" alt="" />
            </motion.button>
          </motion.li> */}
        </motion.ul>

        <motion.button
          className="md:hidden flex items-center justify-center p-2"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden bg-primary border-t border-white/20"
      >
        <motion.ul
          className="flex flex-col items-center gap-6 py-6 text-[16px] font-medium"
          initial={{ y: -20, opacity: 0 }}
          animate={isOpen ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
        >
          {[
            { href: "/class", label: "CLASS" },
            { href: "#", label: "캘린더" },
            { href: "#", label: "STORE" },
            { href: "#", label: "제휴" },
            { href: "#", label: "고객센터" },
          ].map((item, index) => (
            <motion.li
              key={item.label}
              whileHover={{ scale: 1.05, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.href}
                className="hover:text-gray-300 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </motion.li>
          ))}

          {/* Admin Link for Mobile - Only show for admin users */}
          {isAdmin && (
            <motion.li
              whileHover={{ scale: 1.05, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/admin"
                className="hover:text-gray-300 transition-colors duration-200 text-yellow-300 font-bold"
                onClick={() => setIsOpen(false)}
              >
                관리자
              </Link>
            </motion.li>
          )}

          {isLoggedIn ? (
            <motion.li whileHover={{ scale: 1.02 }}>
              <Link href={"/mypage"} onClick={() => setIsOpen(false)}>
                <motion.div
                  className="relative flex items-center gap-2 text-[16px]"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className={`w-8 h-8 absolute ml-2 ${phenomena.className} rounded-full bg-white text-black text-[22px] flex items-center justify-center font-bold`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    LC
                  </motion.div>
                  <motion.span className="ml-6 pl-6 py-1 bg-gray-900 px-2 rounded-tl-md rounded-bl-md font-semibold text-[18px]">
                    {userName}님
                  </motion.span>
                </motion.div>
              </Link>
            </motion.li>
          ) : (
            <motion.li whileHover={{ scale: 1.05 }}>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <motion.span
                  className="text-[16px] font-medium hover:text-gray-300 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  로그인
                </motion.span>
              </Link>
            </motion.li>
          )}

          <motion.li whileHover={{ scale: 1.5 }}>
            <motion.button
              className="w-8 h-8 transition"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
            >
              <img src="/msg.png" alt="messages" />
            </motion.button>
          </motion.li>
        </motion.ul>
      </motion.div>
    </motion.nav>
  );
}
