"use client";

import React from "react";
import SearchBanner from "@/components/ui/SearchBanner";

export default function ClassRecommend() {
  const reviews = [
    {
      name: "인사직무 A부장",
      text: "실무에 바로 적용해 볼 만한 Tip들을 많이 들을 수 있어 의미가 있었습니다.",
      image: "/class-goal/recommend/span1.png",
    },
    {
      name: "영업직무 B매니저",
      text: "듣고 들을 강연한 리더십에 대해 스스로 정의할 수 있는 계기가 되었습니다.",
      image: "/class-goal/recommend/span2.png",
    },
    {
      name: "개발직무 C과장",
      text: "왜 만족도 평가의 만점은 5점인가? 100점도 아깝지 않습니다!!!",
      image: "/class-goal/recommend/span3.png",
    },
    {
      name: "개발직무 C대리",
      text: "듣고 들을 강연한 리더십에 대해 스스로 정의할 수 있는 계기가 되었습니다.",
      image: "/class-goal/recommend/span4.png",
    },
    {
      name: "R&D직무 D사원",
      text: "실무에 바로 적용해 볼 만한 Tip들을 많이 들을 수 있어 의미가 있었습니다.",
      image: "/class-goal/recommend/span5.png",
    },
    {
      name: "인사직무 A사원",
      text: "왜 만족도 평가의 만점은 5점인가? 100점도 아깝지 않습니다!!!",
      image: "/class-goal/recommend/span6.png",
    },
  ];

  return (
    <main className="w-[1245px] mt-10 mb-20">
      <div className="w-full space-y-16">
        <section>
          <h2 className="w-[251px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[30px] flex items-center justify-center">
            RECOMMEND
          </h2>
          <ul className="space-y-5 ml-8 mt-10 text-[25px] text-[#000000] font-medium">
            <li>- 3년차 미만 주니어, 신입사원</li>
            <li>- 팀 성과를 높이고 싶은 관리자</li>
            <li>- 조직의 목표와 실행을 체계화하고 싶은 리더</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[36px] font-extrabold mb-8 text-[#000000]">
            REAL VOICE
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-[#FAFAFA] shadow-md rounded-[16px] border border-[#c8c9cc] p-6 text-[#333] flex flex-col gap-4"
              >
                <div className="w-full h-12 rounded-full flex items-center bg-[#FAFAFA] justify-start text-2xl gap-4">
                  <img src={review.image} alt="" className="w-12 h-12" />
                  <span className="text-[14px] font-medium text-[#9CA3AF]">
                    {review.name}
                  </span>
                </div>

                <p className="text-[18px] font-medium leading-relaxed">
                  “{review.text}”
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <img src="/images/left-arrow.png" alt="" className="w-12 h-12" />
              <img
                src="/images/right-black-arrow.png"
                alt=""
                className="w-12 h-12"
              />{" "}
            </div>
          </div>
        </section>

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
