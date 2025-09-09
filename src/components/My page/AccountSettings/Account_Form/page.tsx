"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function RequiredInfo() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "",
    memberType: "",
    phone: "",
    dobYear: "",
    dobMonth: "",
    dobDay: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <main className="w-[1270px] mt-6 flex flex-col items-center mb-10">
        <div className="w-full border border-[#E6E6E6] rounded-sm">
          <div className="bg-[#EEEEEE] px-4 py-3 flex items-center gap-2">
            <FaChevronUp className="text-primary" />

            <span className="text-[16px] font-extrabold text-primary">
              필수정보 <span className="text-[#EE0000]">*</span>
            </span>
          </div>

          <div className="p-6 flex flex-col gap-6 text-[14px]">
            <div className=" flex flex-row">
              <label className="block text-[20px] text-primary font-bold mb-2">
                이메일 주소 <span className="text-[#EE0000]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-[565px] h-[60px] border border-[#DDDDDD] ml-9 px-3 py-2 rounded-sm"
                placeholder="ooo@hanmail.net"
              />
            </div>
            <p className="text-[16px] text-[#6D6D6D] ">
              이메일 주소는 계정 인증, 새 비밀번호 수신 하거나 특정 뉴스 또는
              알림을 이메일로 수신하는 경우에 사용됩니다. 반드시 수신 가능한
              이메일을 적어 주세요.
            </p>

            <div className=" flex flex-row">
              <label className="block text-[20px] text-primary font-bold mb-2">
                사용자 ID <span className="text-[#EE0000]">*</span>
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-[565px] h-[60px] border border-[#DDDDDD] ml-14 px-3 py-2 rounded-sm"
                placeholder="hanmail"
              />
            </div>
            <p className="text-[16px] text-[#6D6D6D] ">
              공백, 마침표(.), 하이픈(-), 어포스트로피(&apos;), 밑줄(_), @
              부호를 포함하여 여러 특수 문자가 허용됩니다.
            </p>

            <div className=" flex flex-row">
              <label className="block text-[20px] text-primary font-bold mb-2">
                비밀번호 <span className="text-[#EE0000]">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-[565px] h-[60px] border border-[#DDDDDD] ml-15 px-3 py-2 rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => router.push("/mypage/account/change-password")}
                  className="bg-black w-[256px] h-[60px] text-white px-4 py-2 rounded-md text-sm"
                >
                  비밀번호 변경하기
                </button>
              </div>
            </div>
            <p className="text-[16px] text-[#6D6D6D] ">비밀번호의 강도:</p>

            <div className=" flex flex-row">
              <label className="block text-[20px] text-primary font-bold mb-2">
                비밀번호 확인 <span className="text-[#EE0000]">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-[565px] h-[60px] border border-[#DDDDDD] ml-4 px-3 py-2 rounded-sm"
              />
            </div>
            <p className="text-[16px] text-[#6D6D6D] ">
              새로운 계정에 이용할 새로운 비밀번호를 두 입력 필드에 동일하게
              입력하십시오.
            </p>

            <div className=" flex flex-row">
              <label className="block text-[20px] text-primary font-bold mb-2">
                성명 <span className="text-[#EE0000]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-[565px] h-[60px] border border-[#DDDDDD] ml-25 px-3 py-2 rounded-sm"
              />
            </div>

            <div className=" flex flex-row">
              <label className="block text-[20px] text-primary font-bold mb-2">
                성별 <span className="text-[#EE0000]">*</span>
              </label>

              <div className="relative w-[565px]">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-[565px] h-[60px] border border-[#DDDDDD] ml-25 px-3 py-2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">- 없음 -</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>

                {/* Custom Arrow */}
                <span className="absolute right-1+ top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <FaChevronDown size={20} />
                </span>
              </div>
            </div>

            <div className=" flex flex-row">
              <label className="block text-[20px] text-primary font-bold mb-2">
                회원구분 <span className="text-[#EE0000]">*</span>
              </label>

              <div className="relative w-[565px]">
                <select
                  name="memberType"
                  value={formData.memberType}
                  onChange={handleChange}
                  className="w-[565px] h-[60px] border border-[#DDDDDD] ml-15 px-3 py-2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">- 값 선택하기 -</option>
                  <option value="student">학생</option>
                  <option value="teacher">교사</option>
                  <option value="general">일반</option>
                </select>

                <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <FaChevronDown size={20} />
                </span>
              </div>
            </div>

            <p className="text-[16px] text-[#6D6D6D] mt-3">
              * 재직자 및 기업교육 담당자는 과정신청 시 다수의 교육생 정보
              입력이 가능합니다
            </p>
          </div>
        </div>
      </main>

      {/* 2nd*/}

      <main className="w-[1270px] mt-6 flex flex-col items-center mb-10">
        <div className="w-full border border-[#E6E6E6] rounded-sm">
          <div className="bg-[#EEEEEE] px-4 py-3 flex items-center gap-2">
            <FaChevronUp className="text-primary" />

            <span className="text-[16px] font-extrabold text-primary">
              부가정보 <span className="text-[#EE0000]">*</span>
            </span>
          </div>

          <div className="p-6 flex flex-col gap-6 text-[14px]">
            <div className=" flex flex-row">
              <label className="block text-[20px] text-primary font-bold mb-2">
                휴대전화
              </label>
              <input
                type="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-[565px] h-[60px] border border-[#DDDDDD] ml-18 px-3 py-2 rounded-sm"
              />
            </div>
            <p className="text-[16px] text-[#6D6D6D] ">
              이메일 주소는 계정 인증, 새 비밀번호 수신 하거나 특정 뉴스 또는
              알림을 이메일로 수신하려는 경우에 사용됩니다. 반드시 수신 가능한
              이메일을 적어 주세요.
            </p>

            <div className="flex items-center gap-6">
              <label className="block text-[20px] text-primary font-bold whitespace-nowrap">
                생년월일
              </label>

              <div className="flex flex-row gap-4 ml-11">
                <div className="relative w-[160px]">
                  <select
                    name="dobYear"
                    value={formData.dobYear}
                    onChange={handleChange}
                    className="w-full h-[60px] border border-[#DDDDDD] px-3 py-2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" className="font-bold">
                      년도
                    </option>
                    {Array.from({ length: 26 }, (_, i) => {
                      const year = 2000 + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <FaChevronDown size={20} />
                  </span>
                </div>

                <div className="relative w-[160px]">
                  <select
                    name="dobMonth"
                    value={formData.dobMonth}
                    onChange={handleChange}
                    className="w-full h-[60px] text-bold border border-[#DDDDDD] px-3 py-2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" className="font-bold">
                      월
                    </option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <FaChevronDown size={20} />
                  </span>
                </div>

                <div className="relative w-[160px]">
                  <select
                    name="dobDay"
                    value={formData.dobDay}
                    onChange={handleChange}
                    className="w-full h-[60px] border border-[#DDDDDD] px-3 py-2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled className="font-bold">
                      일
                    </option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <FaChevronDown size={20} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 mt-8">
          <p className="text-[20px] font-bold text-black">
            이용약관, 개인정보 수집 및 이용, 메일링 서비스(선택)에 모두 동의
            합니다.
          </p>

          <div className="flex flex-col gap-4 mt-4 text-[20px] text-black font-medium">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 border border-gray-400"
              />
              <span>모두 동의</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 border border-gray-400"
              />
              <span>
                이용약관 동의 <span className="text-[#EE0000]">*</span>
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 border border-gray-400"
              />
              <span>
                개인정보 수집 및 이용 <span className="text-[#EE0000]">*</span>
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 border border-gray-400"
              />
              <span>메일링서비스</span>
            </label>
          </div>

          <button className="w-full h-[55px] bg-black text-white text-[20px] font-bold py-4 rounded-full mt-6">
            가입하기
          </button>

          <div className="flex justify-center gap-6 mt-6">
            <button className="w-[256px] h-[50px] bg-gray-100 text-black text-[24px] font-bold rounded">
              취소
            </button>
            <button className="w-[256px] h-[50px] bg-black text-white text-[24px] font-bold rounded">
              수정완료
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
