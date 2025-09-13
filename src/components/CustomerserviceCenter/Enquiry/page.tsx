import React from "react";

const page = () => {
  return (
    <>
      <div className="w-full mx-auto mt-10">
        <div className="bg-[rgba(217,217,217,0.39)] py-3 px-8 text-[18px] font-bold text-black">
          <span>
            공개교육 프로그램에 대해 궁금하신 점이 있으신 경우 간략한 정보와
            함께 문의 내용을 남겨 주시면 상세히 회신 드리겠습니다.
          </span>
        </div>

        <div className=" py-5">
          <p className="text-right text-[18px] font-bold  text-[rgba(0,0,0,0.72)] mb-4">
            <span className="text-red-500">*</span> 항목은 필수 입력 항목입니다.
          </p>

          <form className="space-y-6 mt-10">
            <div className="flex items-center">
              <label className="w-[55px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                성함 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className=" w-[973px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-14 "
                placeholder=""
              />
            </div>

            <div className="flex items-center">
              <label className="w-[80px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                연락처 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 flex-1">
                <select className=" w-[207px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-8 ">
                  <option>010</option>
                  <option>011</option>
                  <option>016</option>
                </select>
                <span className="  text-[#D9D9D9] text-[25px] font-extrabold justify-center items-center">
                  -
                </span>
                <input
                  type="text"
                  className=" w-[354px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 "
                />
                <span className="  text-[#D9D9D9] text-[25px] font-extrabold justify-center items-center">
                  -
                </span>
                <input
                  type="text"
                  className=" w-[348px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 "
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-[80px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  className=" w-[266px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-8 "
                />
                <span className=" text-[#D9D9D9] text-[18px] font-extrabold justify-center items-center">
                  @
                </span>

                <input
                  type="text"
                  className=" w-[302px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2  "
                />
                <select className=" w-[357px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-1 ">
                  <option>직접입력</option>
                  <option>gmail.com</option>
                  <option>naver.com</option>
                </select>
              </div>
            </div>

            <div className="flex items-center ">
              <label className="w-[80px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                회사명
              </label>
              <input type="text"  className=" w-[972px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-8 "/>
            </div>
            <div className="w-[973px] h-[1px] border-b border-[#D9D9D9] ml-2 mt-8 mb-8"></div>

            <div className="flex items-center">
              <label className="w-[96px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                문의 구분 <span className="text-red-500">*</span>
              </label>
              <select className=" w-[409px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-4 ">
                <option>선택하세요</option>
                <option>일반문의</option>
                <option>기술지원</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-[96px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                제목 <span className="text-red-500">*</span>
              </label>
              <input className=" w-[972px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-4 "/>
            </div>

            <div className="flex items-start">
              <label className="w-[96px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                문의 내용 <span className="text-[#FF0000]">*</span>
              </label>
              <textarea className=" w-[972px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-4 " />
            </div>

            <div className="flex items-center">
              <label className="w-[96px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                첨부파일
              </label>
              <div className="flex items-center gap-4 flex-1">
                <input type="file" className="hidden" id="fileUpload" />
                <label
                  htmlFor="fileUpload"
                  className="border text-[18px] font-semibold text-black px-4 py-2 rounded cursor-pointer bg-white ml-4"
                >
                  파일선택
                </label>
                <p className="text-sm text-[rgba(0,0,0,0.72)] text-[18px] font-bold tracking-tighter leading-4">
                  최대 <span className="text-[#FF0000]">15MB</span> <br />
                  zip, pdf, hwp, ppt, pptx, doc, docx, xls, xlsx, jpg, jpeg, png
                </p>
              </div>
            </div>
<div className="flex items-start">
  <label className="w-[106px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
    자동방지글 <span className="text-[#FF0000]">*</span>
  </label>

  <div className="flex-1 flex flex-col gap-2">
    <div className="bg-gray-800 w-[97px] h-[49px] ml-2 text-white py-3 px-6 justify-center items-center text-[14px] font-semibold">
      b2d473
    </div>

    <input
      type="text"
   className=" w-[735px] h-[47px] border border-[rgba(84, 76, 76, 0.14)]  rounded px-3 py-2 ml-2 "
     
    />
      <span className="text-[11px] text-[#9A9A9A]"> * 위쪽의 자동등록방지 코드를 입력하세요. [새로고침]</span>
  </div>

</div>

           

            <div className="flex items-center gap-2 ml-32">
              <input type="checkbox" id="privacy"  className="w-6 h-6 accent-black" />
              <label htmlFor="privacy" className="text-[18px] font-semibold">
               <span className="text-black"> 개인정보 수집 및 이용 </span>에 동의합니다.
              </label>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-black w-[158px] h-[52px] text-[22px] text-white px-6 py-2 rounded font-semibold"
              >
                접수하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;
