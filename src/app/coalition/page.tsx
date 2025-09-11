"use client";

import Navbar from "@/components/layout/navbar/page";
import { useState } from "react";

export default function Coalition() {
    const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    field: "",
    phonePrefix: "",
    phoneMiddle: "",
    phoneLast: "",
    emailLocal: "",
    emailDomain: "",
    emailDomainSelect: "",
    file: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "file" &&
      (e.target as HTMLInputElement).files
    ) {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev) => ({ ...prev, [name]: files ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // handle form submission
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white mt-15">
        <div className="flex justify-center items-center h-[130px] ">
          <span className=" w-[73px] h-[40px] text-[36px] font-extrabold text-[var(--primary)]">
            제휴
          </span>
        </div>

        {/* Header Section */}
        <div
          className="bg-cover bg-center text-white py-16 px-8 text-start w-full h-[282px]"
          style={{ backgroundImage: "url('/images/coalition-bg-img.png')" }}
        ></div>

        {/* Form Section */}
        <form className="max-w-full  space-y-10 mx-auto p-8 ml-13" onSubmit={handleSubmit} >
          {/* Note */}
          <p className="text-right text-[18px] font-bold mb-6 mr-10 text-[rgba(0,0,0,0.72)]">
            * 항목은 필수 입력 항목입니다.
          </p>

          {/* Name */}
          <div className=" flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-[55px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">
              이름
              <span className="text-[#FF0000] mr-1">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border ml-10 w-[409px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
            />
          </div>

          {/* Organization */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
           <label className="w-[55px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center"> 소속  <span className="text-[#FF0000] mr-1">*</span></label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
             className="border ml-10 w-[409px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
            />
          </div>

          {/* Field */}
          <div className=" flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="w-[55px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">분야  <span className="text-[#FF0000] mr-1">*</span></label>
            <input
              type="text"
              name="field"
              value={formData.field}
              onChange={handleChange}
            className="border ml-10 w-[409px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
            />
          </div>

          {/* Phone */}
          <div className=" flex flex-col md:flex-row md:items-center md:gap-4  ">
              <label className="w-[80px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">연락처   <span className="text-[#FF0000] mr-1">*</span></label>
        
            <div className="flex gap-2 flex-1">
              <select
                name="phonePrefix"
                value={formData.phonePrefix}
                onChange={handleChange}
                 className="border ml-4 w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
              >
                <option value="010">010</option>
                <option value="011">011</option>
              </select>
           <span className="flex items-center justify-center font-bold text-[#D9D9D9] w-6">-</span>

              <input
                type="text"
                name="phoneMiddle"
                value={formData.phoneMiddle}
                onChange={handleChange}
               className="border  w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
              />
                 <span className="flex items-center justify-center font-bold text-[#D9D9D9] w-6">-</span>
              <input
                type="text"
                name="phoneLast"
                value={formData.phoneLast}
                onChange={handleChange}
                 className="border  w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "     
              />
            </div>
         
          </div>
          
          <div className="border-b-1 w-[1110] h-[1px] ml-28 border-[#D9D9D9]"></div>

          {/* Email */}
          <div className=" flex flex-col md:flex-row md:items-center md:gap-4">
             <label className="w-[80px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">이메일  <span className="text-[#FF0000] mr-1">*</span></label>
        
          
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                name="emailLocal"
                value={formData.emailLocal}
                onChange={handleChange}
                  className="border ml-4 w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
              />
              <span className=" flex items-center justify-center text-[#D9D9D9] text-[18px] font-bold p-1" >@</span>
              <input
                type="text"
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleChange}
                   className="border  w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
              />
              <select
                name="emailDomainSelect"
                value={formData.emailDomainSelect}
                onChange={handleChange}
                  className="border ml-3  w-[362px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
              >
                <option value="direct">직접입력</option>
                <option value="gmail.com">gmail.com</option>
                <option value="naver.com">naver.com</option>
              </select>
            </div>
          </div>

     {/* File Upload */}
<div className=" flex md:flex-row md:items-start md:gap-4">
  <label className="w-[176px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">
    프로필 및 참고자료 <span className="text-[#FF0000] mr-1">*</span>
  </label>

  <div className="flex-1 flex items-center gap-4">
    <label className="w-[134px] h-[44px] border border-black rounded px-3 py-2 flex items-center justify-center cursor-pointer bg-white hover:bg-gray-100">
      <span className="text-black font-semibold text-[18px]">{fileName || "파일선택"}</span>
      <input
        type="file"
        name="file"
        onChange={(e) => {
          handleChange(e);
          setFileName(e.target.files?.[0]?.name || "");
        }}
        className="hidden"
      />
    </label>

    <p className="text-[18px] text-[rgba(0,0,0,0.72)] font-bold tracking-tight leading-4.5">
      최대 <span className="text-red-600 font-bold">15MB</span> <br /> 
      zip, pdf, hwp, ppt, pptx, doc, docx, xls, xlsx, jpg, jpeg, png
    </p>
  </div>
</div>



          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            제출
          </button>
        </form>
      </div>
    </>
  );
}
