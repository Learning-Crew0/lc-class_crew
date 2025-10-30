import React from "react";
import { motion, Variants } from "framer-motion";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { FaCaretDown } from "react-icons/fa";

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
  onSearch?: () => void;
  buttonLink?: string;
  width?: string;
  height?: string;
  className?: string;
  buttonWidth?: string;
  buttonHeight?: string;
  titleDiv?: string;
};

export default function SearchBanner({
  bgImage,
  title,
  description,
  filters,
  buttonText,
  onSearch,
  buttonLink,
  width = "w-[1245px]",
  height = "h-[200px]",
  className = "",
  buttonWidth = "w-[105px]",
  buttonHeight = "h-[40px]",
  titleDiv = "text-[32px] font-bold",
}: SearchBannerProps) {
  const router = useRouter();

  const handleClick = () => {
    if (buttonLink) {
      router.push(buttonLink);
    } else if (onSearch) {
      onSearch();
    }
  };
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
      className={`relative rounded-2xl overflow-hidden p-6 flex items-center justify-between mb-20 ${width} ${height} ${className}`}
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
        className={`flex flex-col relative z-10 ${titleDiv}`}
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <motion.h2
          className="text-white font-semibold text-[20px] w-full"
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
          className="text-white mt-2 text-[16px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        className="flex w-[779px] items-center justify-end gap-10 relative z-10"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        {filters.map((filter, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-3 text-white"
            variants={filterVariants}
          >
            <motion.span
              className="font-medium text-[22px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {filter.label}
            </motion.span>

            <div className="relative">
              <motion.select
                value={filter.value}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  filter.onChange(e.target.value)
                }
                className="bg-transparent/80 w-[206px] h-[49px] backdrop-blur-sm border border-white/70 rounded-md px-3 py-2 pr-10 text-sm text-[#898989] focus:outline-none focus:border-white/90 hover:border-white/80 appearance-none cursor-pointer"
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

              {/* Custom Caret Down Icon */}
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <FaCaretDown className="text-white/70 text-lg" />
              </motion.div>
            </div>
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
              onClick={handleClick}
              variant="secondary"
              className={`bg-white/90 ${buttonWidth} ${buttonHeight} backdrop-blur-sm text-black font-semibold hover:bg-white/100 border-white/20 shadow-lg`}
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
