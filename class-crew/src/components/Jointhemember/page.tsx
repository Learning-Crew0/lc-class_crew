"use client";

import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { registerUser } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Jointhem() {
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

  const [agreements, setAgreements] = useState({
    allAgree: false,
    termsOfService: false,
    privacyPolicy: false,
    marketingConsent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgreementChange = (name: string, checked: boolean) => {
    if (name === "allAgree") {
      setAgreements({
        allAgree: checked,
        termsOfService: checked,
        privacyPolicy: checked,
        marketingConsent: checked,
      });
    } else {
      const newAgreements = { ...agreements, [name]: checked };
      newAgreements.allAgree =
        newAgreements.termsOfService &&
        newAgreements.privacyPolicy &&
        newAgreements.marketingConsent;
      setAgreements(newAgreements);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.userId || !formData.password ||
      !formData.confirmPassword || !formData.name || !formData.gender ||
      !formData.memberType || !formData.phone || !formData.dobYear ||
      !formData.dobMonth || !formData.dobDay) {
      return "모든 필수 항목을 입력해주세요.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }

    if (formData.password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!agreements.termsOfService || !agreements.privacyPolicy) {
      return "필수 약관에 동의해주세요.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const dob = `${formData.dobYear}-${formData.dobMonth.padStart(2, '0')}-${formData.dobDay.padStart(2, '0')}`;

      await registerUser({
        email: formData.email,
        username: formData.userId,
        password: formData.password,
        fullName: formData.name,
        gender: formData.gender,
        memberType: formData.memberType,
        phone: formData.phone,
        dob,
        agreements: {
          termsOfService: agreements.termsOfService,
          privacyPolicy: agreements.privacyPolicy,
          marketingConsent: agreements.marketingConsent,
        },
      });

      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[1270px] mx-auto mt-20 flex flex-col items-center mb-6">
        <div className="flex justify-center items-center h-[130px]">
          <h1 className="text-[36px] font-extrabold text-[var(--primary)]">
            로그인
          </h1>
        </div>
      </div>
      <main className="w-[1270px] mt-6 mx-auto flex flex-col items-center mb-10">
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
            {formData.confirmPassword && (
              <p className={`text-[16px] font-medium ${
                formData.password === formData.confirmPassword 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formData.password === formData.confirmPassword ? '일치' : '불일치'}
              </p>
            )}
            {!formData.confirmPassword && (
              <p className="text-[16px] text-[#6D6D6D]">입력하십시오.</p>
            )}

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
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>

                {/* Custom Arrow */}
                <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
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
                  <option value="재직자">재직자</option>
                  <option value="기업교육담당자">기업교육담당자</option>
                  <option value="취업준비생">취업준비생</option>
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

      <main className="w-[1270px] mt-6 mx-auto flex flex-col items-center mb-10">
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

        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-8">
          <p className="text-[20px] font-bold text-black">
            이용약관, 개인정보 수집 및 이용, 메일링 서비스(선택)에 모두 동의
            합니다.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 mt-4 text-[20px] text-black font-medium">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 border border-gray-400"
                checked={agreements.allAgree}
                onChange={(e) => handleAgreementChange("allAgree", e.target.checked)}
              />
              <span>모두 동의</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 border border-gray-400"
                checked={agreements.termsOfService}
                onChange={(e) => handleAgreementChange("termsOfService", e.target.checked)}
              />
              <span>
                이용약관 동의 <span className="text-[#EE0000]">*</span>
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 border border-gray-400"
                checked={agreements.privacyPolicy}
                onChange={(e) => handleAgreementChange("privacyPolicy", e.target.checked)}
              />
              <span>
                개인정보 수집 및 이용 <span className="text-[#EE0000]">*</span>
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 border border-gray-400"
                checked={agreements.marketingConsent}
                onChange={(e) => handleAgreementChange("marketingConsent", e.target.checked)}
              />
              <span>메일링서비스</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[55px] bg-black text-white text-[20px] font-bold py-4 rounded-full mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "가입 중..." : "가입하기"}
          </button>
        </form>
      </main>
    </>
  );
}
