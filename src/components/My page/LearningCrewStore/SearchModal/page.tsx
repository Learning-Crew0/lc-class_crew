"use client";

import React from "react";
import { X, Search } from "lucide-react";

function SearchModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-opacity-60 flex items-center justify-center z-50">
      {/* Modal Box */}
      <div className="bg-black text-white rounded-xl p-8 w-[1270px] h-[694px] relative flex flex-col mt-30 mb-30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400"
        >
          <X size={24} />
        </button>

        {/* Description */}
        <p className="mb-6 text-center text-[15px] leading-relaxed">
          관심 있는 교육 주제나 직무, 직급 등을 키워드로 검색해보세요. 다양한
          CLASS가 기다리고 있습니다.
        </p>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-md text-black px-3 py-2 mb-6">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent outline-none px-2 w-[1170px]"
          />
          <Search size={22} className="text-gray-700" />
        </div>

        {/* Recommended Keywords */}
        <div>
          <p className="mb-3 font-semibold mt-10">추천 검색어</p>
          <div className="flex flex-wrap gap-3 mt-10">
            {[
              "가나다",
              "가나다라마",
              "Dhd;kdukljhb",
              "가나다",
              "abcf",
              "Dhd;kdukljhb",
              "가나다라마",
              "abcf",
              "Dhd;kdukljhb",
              "Dhd;kdukljhb",
            ].map((tag, idx) => (
              <span
                key={idx}
                className="border border-white rounded-full px-4 py-1 text-sm cursor-pointer hover:bg-white hover:text-black transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
