"use client";

import React from "react";
import Image from "next/image";

export function SearchBar({ placeholder = "검색어를 입력하세요" }) {
  return (
    <div className="relative flex items-center justify-center">
      <input
        type="text"
        className="bg-[#E1E1E1] p-3 w-[1187px] rounded-lg outline-none"
        placeholder={placeholder}
      />
      <Image
        src="/class-goal/learningStore/productDetails/search-icon.png"
        alt="search-bar"
        width={25}
        height={25}
        className="absolute top-3 right-10 cursor-pointer"
      />
    </div>
  );
}
