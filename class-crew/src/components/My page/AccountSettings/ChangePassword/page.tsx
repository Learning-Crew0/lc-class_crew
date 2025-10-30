import React from "react";

const ChangePassword = () => {
  return (
    <>
      <main className="w-[1270px] mt-6 flex flex-col items-center mb-10">
        <div className="w-full gray-300 pt-8">
          <div className="flex items-center mb-6 pb-10 border-b border-[#DDDDDD]">
            <label className="w-[256px] h-[55px] bg-black text-white text-[20px] font-bold flex items-center justify-center rounded">
              현재 비밀번호
            </label>
            <input
              type="password"
              className="ml-19 w-[575px] h-[55px] border  border-[#DDDDDD] rounded px-3"
              placeholder=""
            />
          </div>

          <div className="flex items-center mb-6 mt-16 ">
            <label className="w-[256px] h-[55px] bg-black text-white text-[20px] font-bold flex items-center justify-center rounded">
              신규 비밀번호 입력
            </label>
            <input
              type="password"
              className="ml-19.5 w-[838px] h-[55px] border border-gray-300 text-[hsla(0,0%,30%,1)] font-bold text-[16px] rounded px-3"
              placeholder="공백, 마침표(.), 하이픈(-),어포스트로피(‘)밑줄(_),@ 부호를 포함하여 여러 특수 문자가 허용됩니다. "
            />
          </div>

          <div className="flex items-center mb-12">
            <label className="w-[256px] h-[55px] bg-black text-white text-[20px]  font-bold flex items-center justify-center rounded">
              신규 비밀번호 입력
            </label>
            <input
              type="password"
              className="ml-19.5 w-[838px] h-[55px] border text-[hsla(0,0%,30%,1)] font-bold border-gray-300 text-[16px] rounded px-3"
              placeholder=" 공백, 마침표(.), 하이픈(-), 어포스트로피('), 밑줄(_), @ 부호를 포함하여 여러 특수 문자가 허용됩니다."
            />
          </div>

          <div className="flex justify-center gap-4">
            <button className="w-[256px] h-[70px] bg-[#EEEEEE] text-[24px] text-black font-bold rounded">
              취소
            </button>
            <button className="w-[256px] h-[70px] bg-black text-[24px] text-white font-bold rounded">
              수정완료
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ChangePassword;
