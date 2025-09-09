"use client";

import React from "react";
import SearchBanner from "@/components/ui/SearchBanner";

export default function ClassInstructor() {
  return (
    <main className="w-[1270px] mt-10 mb-20">
      <div className="w-full space-y-16">
        <h2 className="w-[400px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[26px] flex items-center justify-center">
          INSTRUCTOR/FACILITATOR
        </h2>

        <h3 className="text-[36px] font-extrabold text-black">정상 범</h3>

        <section className="space-y-4">
          <h4 className="text-[28px] font-semibold">학력 및 경력</h4>
          <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
            <li>- 고려대학교 대학원 교육학 석사(우수논문상)</li>
            <li>- 고려대학교 대학원 교육학 박사 수료</li>
            <li>- 현) 이슈앤솔루션 대표 강사, 러닝크루 파트너 강사</li>
          </ul>
        </section>

        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>

        <section className="space-y-4">
          <h4 className="text-[28px] font-semibold">전문분야</h4>
          <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
            <li>
              - 직무스킬: PT스킬, 사내강사양성, 문제해결, 기획 및 보고, 업무수명
            </li>
            <li>- 기타: 전략기획(전략적사고, 전략분석기법)</li>
          </ul>
        </section>

        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>

        <section className="space-y-4">
          <h4 className="text-[28px] font-semibold">자격 및 저서</h4>
          <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
            <li>- BIRKMAN Method 강사 자격</li>
            <li>- CAPSTONE Biz Simulation 강사 자격</li>
            <li>- 한국코치협회(KCA) 정회원</li>
          </ul>
        </section>

        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>

        <section className="space-y-4">
          <h4 className="text-[28px] font-semibold">출강이력</h4>
          <div className="flex items-start justify-center">
            <span>-</span>
            <p className="text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
              삼성반도체, 삼성SDS, 삼성병원, 현대자동차인재개발원, 현대자동차,
              현대모비스, 현대제철, 현대중공업, 현대삼호중공업, LIG넥스원,
              한국항공우주산업, CJ제일제당, 불로그룹코리아, 기아자동차,
              농심그룹, 대우건설, LG전자, LG화학, GS글로벌 외 다수
            </p>
          </div>
        </section>

        {/* Bottom Banner */}
        <SearchBanner
          className="mt-20"
          bgImage="/images/Block_with_illustration.png"
          title="나를 위한 투자, 지금 이 CLASS로 시작하세요"
          description="성장을 위한 꾸준한 노력, 이미 당신은 능력자!"
          buttonText="CLASS 신청하기"
          width="w-[1245px]"
          height="h-[147px]"
          onSearch={() => console.log("Apply clicked")}
          filters={[]}
        />
      </div>
    </main>
  );
}
