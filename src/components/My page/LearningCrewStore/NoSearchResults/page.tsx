"use client";

import React from "react";

function NoSearchResults({ query = "반려동물" }) {
  return (
    <div className="max-w-[1270px] mx-auto mt-10 p-4 text-center text-gray-600">
      <div className="bg-gray-200 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-4">
        ❗
      </div>
      <p className="font-semibold mb-2">{query}에 대한 검색 결과 총 0개</p>
      <p>{query}에 대한 검색 결과를 찾을 수 없습니다.</p>
      <p>- 검색어가 바르게 입력되었는지 확인해 보세요.</p>
      <p>- 보다 일반적인 단어로 검색해 보세요.</p>
    </div>
  );
}

export default NoSearchResults;
