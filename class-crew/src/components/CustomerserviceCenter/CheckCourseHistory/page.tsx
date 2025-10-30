
// "use client";

// import Link from "next/link";
// import React, { useState } from "react";

// const InquiryForm: React.FC = () => {
//   const [type, setType] = useState<"personal" | "company">("personal");

//   return (
//     <div className="flex flex-col items-center justify-center mt-10 bg-white">
//       <div className="flex items-center space-x-6 mb-4">
//         {/* 개인 조회 */}
//         <label className="flex items-center space-x-2 cursor-pointer">
//           <input
//             type="radio"
//             name="inquiryType"
//             value="personal"
//             checked={type === "personal"}
//             onChange={() => setType("personal")}
//             className="hidden"
//           />
//           <span
//             className={`w-5 h-5 rounded-full border accent-black cursor-pointer ${
//               type === "personal" ? "bg-black" : "bg-white"
//             }`}
//           />
//           <span className="text-[27px] font-bold text-[rgba(0,0,0,0.72)]">
//             개인 조회
//           </span>
//         </label>

//         {/* 기업 조회 */}
//         <label className="flex items-center space-x-2 cursor-pointer">
//           <input
//             type="radio"
//             name="inquiryType"
//             value="company"
//             checked={type === "company"}
//             onChange={() => setType("company")}
//             className="hidden"
//           />
//           <span
//             className={`w-5 h-5 rounded-full border accent-black cursor-pointer ${
//               type === "company" ? "bg-black" : "bg-white"
//             }`}
//           />
//           <span className="text-[27px] font-bold text-[rgba(0,0,0,0.72)]">
//             기업 조회
//           </span>
//         </label>
//       </div>

//       <p className="text-[#FF0000] font-extrabold mb-16 text-center text-[24px]">
//         현재는 개인별 조회만 가능합니다. 기업 조회는 02-6914-9353으로 문의 부탁드립니다.
//       </p>

//       <form className="w-[855px]">
//         {/* 휴대전화번호 */}
//         <div>
//           <label className="block text-[26px] text-[rgba(0,0,0,0.72)] font-bold mb-4">
//             휴대전화번호
//           </label>
//           <div className="flex">
//             <select className="w-[259px] h-[65px] border border-gray-400 rounded px-2">
//               <option>010</option>
//               <option>011</option>
//               <option>016</option>
//               <option>017</option>
//             </select>
//             <span className="text-[#121212] text-[25px] font-semibold flex items-center mx-2">
//               -
//             </span>
//             <input
//               type="text"
//               className="w-[259px] h-[65px] border rounded px-2 py-2 text-center"
//               maxLength={4}
//             />
//             <span className="text-[#121212] text-[25px] font-semibold flex items-center mx-2">
//               -
//             </span>
//             <input
//               type="text"
//               className="w-[259px] h-[65px] border rounded px-2 py-2 text-center"
//               maxLength={4}
//             />
//           </div>
//         </div>

//         <div className="border-b border-gray-300 mt-8 mr-2"></div>

//         {/* 이메일 */}
//         <div>
//           <label className="block text-[26px] text-[rgba(0,0,0,0.72)] mt-6 font-bold">
//             이메일
//           </label>
//           <div className="flex items-center flex-wrap">
//             <input
//               type="text"
//               className="w-[250px] h-[65px] border rounded px-2 py-2 m-2 text-center"
//             />
//             <span className="text-[#121212] text-[18px] font-semibold flex items-center mx-1">
//               @
//             </span>
//             <input
//               type="text"
//               className="w-[250px] h-[65px] border rounded px-2 py-2 text-center m-2"
//             />
//             <select className="w-[259px] h-[65px] border rounded px-2 py-2 text-center m-2">
//               <option>직접입력</option>
//               <option>gmail.com</option>
//               <option>naver.com</option>
//               <option>daum.net</option>
//             </select>
//           </div>
//         </div>

//         <div className="border-b border-gray-300 mt-2"></div>

//         {/* 이름 */}
//         <div>
//           <label className="block text-[26px] text-[rgba(0,0,0,0.72)] font-bold mt-6 mb-4">
//             이름
//           </label>
//           <input
//             type="text"
//             className="w-full h-[65px] border rounded px-2 py-2"
//             placeholder="이름 입력"
//           />
//         </div>

//         {/* 버튼 */}
//         <Link href="/customerservicecenter/checkcoursehistory/coursehistorylist">
//           <button
//             type="submit"
//             className="w-[134px] h-[44px] bg-black text-white py-3 text-[18px] rounded font-semibold flex justify-center items-center mx-auto mt-8"
//           >
//             확인
//           </button>
//         </Link>
//       </form>
//     </div>
//   );
// };

// export default InquiryForm;



"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const InquiryForm: React.FC = () => {
  const [type, setType] = useState<"personal" | "company">("personal");

  return (
    <div className="flex flex-col items-center justify-center mt-10 bg-white">
      <div className="flex items-center space-x-6 mb-4">
        {/* 개인 조회 */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="inquiryType"
            value="personal"
            checked={type === "personal"}
            onChange={() => setType("personal")}
            className="hidden"
          />
          <span
            className={`w-5 h-5 rounded-full border accent-black cursor-pointer ${
              type === "personal" ? "bg-black" : "bg-white"
            }`}
          />
          <span className="text-[27px] font-bold text-[rgba(0,0,0,0.72)]">
            개인 조회
          </span>
        </label>

        {/* 기업 조회 */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="inquiryType"
            value="company"
            checked={type === "company"}
            onChange={() => setType("company")}
            className="hidden"
          />
          <span
            className={`w-5 h-5 rounded-full border accent-black cursor-pointer ${
              type === "company" ? "bg-black" : "bg-white"
            }`}
          />
          <span className="text-[27px] font-bold text-[rgba(0,0,0,0.72)]">
            기업 조회
          </span>
        </label>
      </div>

      <p className="text-[#FF0000] font-extrabold mb-16 text-center text-[24px]">
        현재는 개인별 조회만 가능합니다. 기업 조회는 02-6914-9353으로 문의 부탁드립니다.
      </p>

      <form className="w-[855px]">
        {/* 휴대전화번호 */}
        <div>
          <label className="block text-[26px] text-[rgba(0,0,0,0.72)] font-bold mb-4">
            휴대전화번호
          </label>
          <div className="flex">
            {/* custom select with icon */}
            <div className="relative w-[259px]">
             <div className="relative w-full">
  <select
    defaultValue=""
    className="w-full h-[65px] border border-gray-400 text-[20px] font-medium 
               rounded text-black px-3 appearance-none pr-10
               placeholder:text-black placeholder:text-[24px] "
  >
    <option value="" disabled hidden>
      010
    </option>
    <option>010</option>
    <option>011</option>
    <option>016</option>
    <option>017</option>
  </select>
  <FaCaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
</div>


              <FaCaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            <span className="text-[#121212] text-[25px] font-semibold flex items-center mx-2">
              -
            </span>
            <input
              type="text"
              className="w-[259px] h-[65px] border rounded px-2 py-2 text-center"
              maxLength={4}
            />
            <span className="text-[#121212] text-[25px] font-semibold flex items-center mx-2">
              -
            </span>
            <input
              type="text"
              className="w-[259px] h-[65px] border rounded px-2 py-2 text-center"
              maxLength={4}
            />
          </div>
        </div>

        <div className="border-b border-gray-300 mt-8 mr-2"></div>

        {/* 이메일 */}
        <div>
          <label className="block text-[26px] text-[rgba(0,0,0,0.72)] mt-6 font-bold">
            이메일
          </label>
          <div className="flex items-center flex-wrap">
            <input
              type="text"
              className="w-[250px] h-[65px] border rounded px-2 py-2 m-2 text-center"
            />
            <span className="text-[#121212] text-[18px] font-semibold flex items-center mx-1">
              @
            </span>
            <input
              type="text"
              className="w-[250px] h-[65px] border rounded px-2 py-2 text-center m-2"
            />

            {/* custom select with icon */}
            <div className="relative w-[259px] m-2">
             <select
    defaultValue=""
    className="w-full h-[65px] border border-gray-400 text-[20px] font-medium 
               rounded text-black px-3 appearance-none pr-10
               placeholder:text-black placeholder:text-[24px] "
  >
    <option value="" disabled hidden>
  직접입력
    </option>
    <option>직접입력</option>
   
  </select>
              <FaCaretDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 mt-4"></div>

        {/* 이름 */}
        <div>
          <label className="block text-[26px] text-[rgba(0,0,0,0.72)] font-bold mt-6 mb-4">
            이름
          </label>
          <input
            type="text"
            className="w-full h-[65px] border rounded px-2 py-2"
            placeholder="이름 입력"
          />
        </div>

        {/* 버튼 */}
        <Link href="/customerservicecenter/checkcoursehistory/coursehistorylist">
          <button
            type="submit"
            className="w-[134px] h-[44px] bg-black text-white py-3 text-[18px] rounded font-semibold flex justify-center items-center mx-auto mt-8"
          >
            확인
          </button>
        </Link>
      </form>
    </div>
  );
};

export default InquiryForm;
