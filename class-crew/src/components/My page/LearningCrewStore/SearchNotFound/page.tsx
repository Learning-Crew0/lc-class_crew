"use client";

import React from "react";
import Image from "next/image";
import { SearchBar } from "@/components/ui/SearchBar/page";

function SearchNotFound({ query = "반려동물" }) {
  return (
    <div className="max-w-[1270px] mx-auto mt-12 p-4 text-center">
      {/* Search Bar */}
      <SearchBar placeholder={query} />

      {/* Result Count */}
      <p className="mb-10 mt-10 text-black text-[24px] font-semibold">
        <span className="text-blue-600">{query}</span>에 대한 검색 결과 총{" "}
        <span className="text-blue-600">0</span>개
      </p>

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-[80px] h-[80px] flex items-center justify-center border border-gray-300 rounded-full">
          <span className="text-4xl text-gray-500">!</span>
        </div>
      </div>

      {/* Message */}
      <p className="text-[20px] font-semibold mb-4">
        <span className="text-blue-600">{query}</span>에 대한 검색 결과를 찾을
        수 없습니다.
      </p>

      <div className="text-gray-600 text-[18px] leading-relaxed">
        <p>- 검색어가 바르게 입력되었는지 확인해 보세요.</p>
        <p>- 보다 일반적인 단어로 검색해 보세요.</p>
      </div>
    </div>
  );
}

export default SearchNotFound;
