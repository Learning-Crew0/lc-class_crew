import React from "react";
import { motion, Variants } from "framer-motion";
import Button from "./Button";

type Option = {
  label: string;
  value: string;
};

type SearchBannerProps = {
  bgImage: string;
  title: string;
  description: string;
  filters: {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
  }[];
  buttonText: string;
  onSearch: () => void;

  width?: string;
  height?: string;
  className?: string;
};

export default function SearchBanner({
  bgImage,
  title,
  description,
  filters,
  buttonText,
  onSearch,
  width = "w-[1245px]",
  height = "h-[200px]",
  className = "",
}: SearchBannerProps) {
  // Typed variants with explicit Variants type to resolve inference issues
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const filterVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 25px rgba(255, 255, 255, 0.3)",
      y: -2,
    },
    tap: { scale: 0.98 },
  };

  const selectVariants: Variants = {
    hover: { scale: 1.02 },
    focus: { scale: 1.05, borderColor: "rgba(255, 255, 255, 0.8)" },
  };

  const decorativeOrbVariants: Variants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.7, 0.5],
    },
  };

  const decorativeFloatVariants: Variants = {
    animate: {
      x: [0, 10, 0],
      y: [0, -5, 0],
    },
  };

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden p-6 flex items-center justify-between mb-20 ${width} ${height} ${className} px-20`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Title Section */}
      <motion.div
        className="flex flex-col relative z-10"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <motion.h2
          className="text-white font-bold text-lg"
          variants={titleVariants}
          whileHover={{
            scale: 1.05,
            color: "rgba(255, 255, 255, 0.9)",
            transition: { duration: 0.2, ease: "easeOut" },
          }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="text-white mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        className="flex items-center gap-4 relative z-10"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        {filters.map((filter, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-2 text-white"
            variants={filterVariants}
          >
            <motion.span
              className="font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {filter.label}
            </motion.span>

            <motion.select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="bg-transparent/80 backdrop-blur-sm border border-white/70 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/90 hover:border-white/80"
              variants={selectVariants}
              whileHover="hover"
              whileFocus="focus"
              whileTap={{ scale: 0.98 }}
            >
              <option value="">- 선택 -</option>
              {filter.options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="text-black bg-white hover:bg-gray-100"
                >
                  {opt.label}
                </option>
              ))}
            </motion.select>
          </motion.div>
        ))}

        {/* Search Button */}
        <motion.div variants={buttonVariants}>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              label={buttonText}
              onClick={onSearch}
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm text-black font-semibold hover:bg-white/100 border-white/20 shadow-lg"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Optional decorative elements */}
      <motion.div
        className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"
        variants={decorativeOrbVariants}
        animate="animate"
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"
        variants={decorativeFloatVariants}
        animate="animate"
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
