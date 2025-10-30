"use client";

import React from "react";
import Image from "next/image";

function NoSearchResults({ query = "반려동물" }) {
  return (
    <div className="max-w-[1270px] mx-auto p-4 text-center space-y-8 text-gray-600 mt-30">
      <p className="font-semibold text-[24px] mb-2">
        {query}에 대한 검색 결과 총 0개
      </p>
      <div className=" rounded-full mx-auto flex items-center justify-center mb-4">
        <Image
          src="/class-goal/learningStore/not-found.png"
          alt="search-icon"
          width={108}
          height={107}
        />
      </div>
      <p className="font-semibold text-[24px] mb-2">
        {query}에 대한 검색 결과를 찾을 수 없습니다.
      </p>
      <div className="text-gray-600 text-[18px] leading-relaxed">
        <p>- 검색어가 바르게 입력되었는지 확인해 보세요.</p>
        <p>- 보다 일반적인 단어로 검색해 보세요.</p>
      </div>
    </div>
  );
}

export default NoSearchResults;
