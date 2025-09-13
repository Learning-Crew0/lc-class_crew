"use client";

import Navbar from "@/components/layout/navbar/page";
import { main } from "framer-motion/client";
import React from "react";

export default function ClassMap() {
  return (
    <>
    <Navbar/>
    <main className="w-[1270px] mx-auto  flex flex-col items-center mb-10 mt-14">
    <div className="w-full  py-12 flex flex-col items-center">
      {/* Title */}
      <h2 className="text-[36px] font-extrabold mb-10 text-black">CLASS MAP</h2>

      {/* Table Layout */}
      <div className="grid grid-cols-5 gap-12  w-full text-left ">
        {/* 리더십/직급/계층 */}
        <div>
          <h3 className="font-bold  mb-4 border-b-[2px] text-[18px] text-black border-[#D9D9D9] pb-4">
            리더십/직급/계층
          </h3>
          <ul className="space-y-4 mt-8  text-[18px] font-medium  text-black">
            <li>리더십/팔로워십</li>
            <li>코칭</li>
          </ul>
        </div>

        {/* 비즈니스 스킬 */}
        <div>
           <h3 className="font-bold  mb-4 border-b-[2px] text-[18px] text-black border-[#D9D9D9] pb-4">
            비즈니스 스킬
          </h3>
      <ul className="space-y-4 mt-8  text-[18px] font-medium  text-black">
            <li>커뮤니케이션/협업</li>
            <li>전략/기획</li>
            <li>업무 생산성</li>
            <li>문서작성/프레젠테이션</li>
            <li>전문 직무</li>
          </ul>
        </div>

        {/* DX/AX */}
        <div>
             <h3 className="font-bold  mb-4 border-b-[2px] text-[18px] text-black border-[#D9D9D9] pb-4">
            DX/AX
          </h3>
          <ul className="space-y-4 mt-8  text-[18px] font-medium  text-black">
            <li>데이터 리터러시</li>
            <li>AI 리터러시</li>
          </ul>
        </div>

        {/* 라이프/커리어 */}
        <div>
         <h3 className="font-bold  mb-4 border-b-[2px] text-[18px] text-black border-[#D9D9D9] pb-4">
            라이프/커리어
          </h3>
          <ul className="space-y-4 mt-8  text-[18px] font-medium  text-black">
            <li>자기관리</li>
            <li>재테크</li>
          </ul>
        </div>

        {/* 스페셜 */}
        <div>
    <h3 className="font-bold  mb-4 border-b-[2px] text-[18px] text-black border-[#D9D9D9] pb-4">
            스페셜
          </h3>
 <ul className="space-y-4 mt-8  text-[18px] font-medium  text-black">            <li>TRIP ON(필드트립)</li>
            <li>INSIGHT ON</li>
          </ul>
        </div>
      </div>
    </div>
    </main>
    </>
  );
}
