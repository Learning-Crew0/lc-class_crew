import React from "react";
import { motion } from "framer-motion";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200";

  const variants = {
    primary: "bg-[var(--primary)] text-white hover:bg-opacity-90",
    secondary:
      "bg-[var(--secondary)] text-[var(--primary)] hover:bg-opacity-90",
    outline:
      "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
    rest: { scale: 1 },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      whileFocus={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label}
    </motion.button>
  );
}
