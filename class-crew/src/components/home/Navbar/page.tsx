"use client";

import { useState } from "react";

export default function NavBar() {
  const items = [
    "리더십/직급/계층",
    "비즈니스 스킬",
    "DX",
    "라이프/커리어",
    "스페셜",
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <nav className="w-full bg-[var(--background)] mt-6 mx-auto">
      <ul className="flex justify-center gap-[190px] w-full font-extrabold border-b-3 border-[var(--secondary)] py-4">
        {items.map((item, index) => (
          <li key={item} className="relative group">
            <a
              href="#"
              className={`text-[20px] font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-150 ${activeIndex === index ? "text-[var(--primary)]" : ""
                }`}
              onClick={() => setActiveIndex(index)}
              aria-current={activeIndex === index ? "page" : undefined}
            >
              {item}
            </a>

            <span
              className="absolute left-0 -bottom-4 h-1 bg-[var(--primary)] w-full hidden group-hover:block transform-origin-left transition-transform duration-300 ease-out"
              aria-hidden
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
