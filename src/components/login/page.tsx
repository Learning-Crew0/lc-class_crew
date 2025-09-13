// "use client"
// import React, { useState } from "react";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import Link from "next/link"

// const LoginForm: React.FC = () => {
//       const [showPassword, setShowPassword] = useState(false);
//   return (
//     <>
//       <main className="w-[1270px] mx-auto mt-20 flex flex-col items-center justify-center mb-10 ">
//         <div className=" bg-white ">
//           <div className="flex justify-center items-center h-[130px] ">
//             <span className=" w-[145px] h-[40px] text-[36px] font-extrabold text-[var(--primary)]">
//             로그인
//             </span>
//           </div>
//         </div>
//          <div className="w-full flex justify-center items-center mt-10 bg-white">
//       <form className="w-[400px] space-y-5">
//         {/* Username / Email */}
//         <div>
//           <label className="block text-[20px] font-bold text-black mb-1">
//             사용자 ID 또는 이메일 주소 <span className="text-[#FF0000]">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder=""
//             className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
//           />
//         </div>

//         {/* Password */}
//         <div>
//        <label className="block text-[20px] font-bold text-black mb-1">
//             비밀번호 <span className="text-[#FF0000]">*</span>
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder=""
//               className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-3 flex items-center text-black"
//             >
//               {showPassword ? (
//                 <EyeOffIcon className="w-5 h-5 stroke-2" />
//               ) : (
//                 <EyeIcon className="w-5 h-5  stroke-2" />
//               )}
//             </button>
//           </div>
//           <p className="text-gray-400 text-sm mt-1">비밀번호를 입력하십시오.</p>
//         </div>

//         {/* Login Button */}
//         <button
//           type="submit"
//           className="w-full bg-black text-white py-3 rounded-full text-[18px] font-bold hover:bg-gray-300 hover:border-black hover:text-black hover:text-bold transition"
//         >
//           로그인
//         </button>

//     <div className="flex justify-between ml-5 mr-5 text-gray-400 text-[18px] text-bold">
//         <Link href={"/jointhemembership"}> 
//           <button type="button" className="hover:text-black">  
//             회원가입
//           </button>
//           </Link>   
//           <Link href={"//"}>   
//           <button type="button" className="hover:text-black">
//             비밀번호 변경하기
//           </button>
//           </Link>   
//         </div>
//       </form>
//     </div>
//       </main>
//     </>
//   );
// }

// export default LoginForm;


"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="w-full max-w-[1270px] mx-auto mt-20 flex flex-col items-center mb-6">
      <div className="flex justify-center items-center h-[130px]">
        <h1 className="text-[36px] font-extrabold text-[var(--primary)]">
          로그인
        </h1>
      </div>

      <form className="w-[819px] space-y-6 p-10">
        <div>
          <label className="block text-[18px] font-bold text-black mb-2">
            사용자 ID 또는 이메일 주소{" "}
            <span className="text-[#FF0000]">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-[18px] font-bold text-black mb-2">
            비밀번호 <span className="text-[#FF0000]">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600"
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5 stroke-2" />
              ) : (
                <EyeIcon className="w-5 h-5 stroke-2" />
              )}
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            비밀번호를 입력하십시오.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-full text-[18px] font-bold hover:bg-gray-800 transition"
        >
          로그인
        </button>

        <div className="flex justify-between text-gray-400 text-[18px] font-bold">
          <Link href="/jointhemembership" className="hover:text-black">
            회원가입
          </Link>
          <Link href="/changepassword" className="hover:text-black">
            비밀번호 변경하기
          </Link>
        </div>
      </form>
    </main>
  );
};

export default LoginForm;
