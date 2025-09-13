"use client";

import React from "react";
import Image from "next/image";
import { SearchBar } from "@/components/ui/SearchBar/page";

const images = [
  "/class-goal/learningStore/productDetails/search-image1.png",
  "/class-goal/learningStore/productDetails/search-iamge2.png",
  "/class-goal/learningStore/productDetails/search-image3.png",
];

function SearchResults({ query = "리더십", total = 100 }) {
  return (
    <div className="max-w-[1270px] mx-auto mt-30 p-4">
      {/* Search Bar */}
      <SearchBar placeholder={query} />

      {/* Search Result Count */}
      <p className="mb-4 mt-10 text-black flex text-[24px] font-semibold items-center justify-center">
        <span className="text-blue-600">{query}</span>에 대한 검색 결과 총{" "}
        <span className="text-blue-600">{total}</span>개
      </p>

      {/* Class List */}
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold text-black mb-4 ml-6">
          CLASS ({total})
        </h2>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-start justify-center rounded p-4 border-b pb-6 mb-10"
          >
            {/* Thumbnail with 썸네일 overlay */}
            <div className="relative w-[313px] h-[184px]">
              <Image
                src={images[item - 1]}
                alt="썸네일"
                fill
                className="object-cover rounded"
              />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl rounded">
                썸네일
              </span>
            </div>

            {/* Text Section */}
            <div className="ml-10 flex-1 leading- space-y-5">
              <p className="text-[22px] text-black font-bold">
                <span className="text-black">대분류</span> &gt; [중분류] 과정명
              </p>
              <p className="text-[18px] text-black font-semibold">
                교육대상: 일선 관리자 및 직책자
              </p>
              <p className="text-[18px] text-black font-semibold">
                교육시간: <span className="text-gray-500">2일 (8시간)</span>
              </p>
              <p className="text-[18px] text-black font-semibold">
                교육일정:{" "}
                <span className="text-gray-500">2025.07.15-2025.07.16</span>
              </p>
            </div>

            {/* Button */}
            <div className="ml-8 flex items-center">
              <button className="text-black font-bold text-[24px] border-2 border-black px-5 py-2 rounded  transition">
                상세보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
