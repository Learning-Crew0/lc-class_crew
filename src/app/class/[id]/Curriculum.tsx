"use client";

import React from "react";
import SearchBanner from "@/components/ui/SearchBanner";

export default function ClassCurriculum() {
  return (
    <main className="w-[1270px] mt-10 mb-20">
      <div className="w-full space-y-16">
        <h2 className="w-[251px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[30px] flex items-center justify-center">
          CURRICULUM
        </h2>

        <div className="flex flex-wrap gap-4 text-[#8C77EC] text-[27px] font-semibold">
          <span>#성과는기획이다</span>
          <span>#리더의미션</span>
          <span>#성과관리마인드셋</span>
          <span>#목표설정및배분</span>
          <span>#성과피드백</span>
        </div>

        <div className="space-y-12 text-[20px] text-black leading-relaxed">
          <section>
            <h3 className="font-extrabold text-[28px] mb-4">
              Module 1. 성과관리 이해하기
            </h3>
            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-12">
              <li>- 전략과 연계된 성과관리 Overview</li>
              <li>- 사람관리, 성과관리, 조직관리</li>
              <li>
                - 성과 리더의 핵심 미션: 역량진단, 업무배분, 성과관리, 후배육성
              </li>
              <li>- 현재의 목표설정 방법 및 관리의 힘든 점은?</li>
              <li>- 성과관리의 New Normal</li>
            </ul>
          </section>

          <div className="w-full h-[2px] bg-[#F0F0F0]"></div>

          <section>
            <h3 className="font-extrabold text-[28px] mb-4">
              Module 2. 성과목표 설정/배분하기
            </h3>
            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-12">
              <li>
                - 어떻게 평가하시겠습니까?: 올바른 성과목표 설정을 위한 의견
                공유
              </li>
              <li>- 정확하게 어려운 이유 토론하기</li>
              <li>- 성과목표 지표를 설정하는 방법 및 사례학습</li>
              <li>- 성과 배분 및 도전적인 목표 합의 방법 도출</li>
            </ul>
          </section>

          <div className="w-full h-[2px] bg-[#F0F0F0]"></div>

          <section>
            <h3 className="font-extrabold text-[28px] mb-4">
              Module 3. 성과 평가하기
            </h3>
            <ul className="space-y-5 text-[25px] text-[#6D6D6D]  font-normal ml-12">
              <li>- 나의 성과평과 공정성 진단하기</li>
              <li>- 업적평가와 역량평가</li>
              <li>- 성과평가의 운영 방법 및 체크포인트</li>
              <li>- 최종 평가 면담 프로세스 실습</li>
            </ul>
          </section>
        </div>

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
