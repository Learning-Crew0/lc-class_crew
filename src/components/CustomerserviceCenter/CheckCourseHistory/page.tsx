"use client"
import Link from "next/link";
import React, { useState } from "react";

const InquiryForm: React.FC = () => {
  const [type, setType] = useState<"personal" | "company">("personal");

  return (
    <div className=" flex flex-col items-center justify-center mt-10 bg-white ">
      <div className="flex items-center space-x-6 mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
         <input
  type="radio"
  name="inquiryType"
  value="personal"
  checked={type === "personal"}
  onChange={() => setType("personal")}
  className=" hidden"
/>
          <span
            className={`w-5 h-5 rounded-full border accent-black cursor-pointer ${
              type === "personal" ? "bg-black" : "bg-white"
            }`}
          />
          <span className="text-[27px] font-bold text-[rgba(0,0,0,0.72)]">개인 조회</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="inquiryType"
            value="company"
            checked={type === "company"}
            onChange={() => setType("company")}
            className="hidden "
          />
          <span
            className={`w-5 h-5 rounded-full border accent-black cursor-pointer ${
              type === "company" ? "bg-black" : "bg-white"
            }`}
          />
          <span className="text-[27px] font-bold text-[rgba(0,0,0,0.72)]">기업 조회</span>
        </label>
      </div>

      <p className="text-[#FF0000] font-extrabold mb-16 text-center text-[24px]">
        현재는 개인별 조회만 가능합니다. 기업 조회는 {" "} 02-6914-9353으로 문의 부탁드립니다.
      </p>

      <form className=" w-[580px]  space-y-10">
        <div>
          <label className="block text-[18px] text-[#242424] font-semibold mb-2 ">휴대전화번호</label>
          <div className="flex ">
            <select className="w-[300px] h-[50px] border-1 border-gray-400 rounded px-2">
              <option>010</option>
              <option>011</option>
              <option>016</option>
              <option>017</option>
            </select>
             <span className="  text-[#121212] text-[25px] font-semibold justify-center items-center m-1">
                  -
                </span>
            <input
              type="text"
              className="w-[200px] h-[50px]  border rounded px-2 py-2 text-center"
              maxLength={4}
            />
             <span className="  text-[#121212] text-[25px] font-semibold justify-center items-center m-1">
                  -
                </span>
            <input
              type="text"
            className="w-[200px] h-[50px]  border rounded px-2 py-2 text-center"
              maxLength={4}
            />
          </div>
        </div>

        <div className="border-b border-gray-300"></div>

        <div>
            <label className="block text-[18px] text-[#242424] font-semibold mb-2">이메일</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="w-[200px] h-[50px]  border rounded px-2 py-2 text-center"
           
            />
           <span className="  text-[#121212] text-[18px] font-semibold justify-center items-center m-1">
                  @
                </span>
            <input
              type="text"
              className="w-[200px] h-[50px]  border rounded px-2 py-2 text-center"
             
            />
            <select className="w-[300px] h-[50px] border-1 border-gray-400 rounded px-2">
              <option>직접입력</option>
              <option>gmail.com</option>
              <option>naver.com</option>
              <option>daum.net</option>
            </select>
          </div>
        </div>
        
        <div className="border-b border-gray-300"></div>

        <div>
           <label className="block text-[18px] text-[#242424] font-semibold mb-2">  이름</label>
          <input
            type="text"
          className="w-full h-[50px]  border rounded px-2 py-2 "
            placeholder="이름 입력"
          />
        </div>

        <Link href={'/customerservicecenter/checkcoursehistory/coursehistorylist'}>
        <button
          type="submit"
          className="w-[134px] h-[44px]  bg-black text-white py-3 text-[18px] rounded font-semibold justify-center items-center flex mx-auto"
        >
          확인
        </button>
        </Link>
      </form>
    </div>
  );
};

export default InquiryForm;
