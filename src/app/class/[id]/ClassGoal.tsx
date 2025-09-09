"use client";
import SearchBanner from "@/components/ui/SearchBanner";
import React from "react";

export default function ClassGoal() {
  const [theme, setTheme] = React.useState("");
  const [job, setJob] = React.useState("");
  return (
    <main className="w-[1270px] mt-10 mb-20 items-center">
      <div className="w-full  space-y-10">
        <div className=" rounded-lg bg-white ">
          <h2 className="w-[251px] h-[54px] mb-14 font-extrabold rounded-full text-black border-[2px] text-[30px] flex items-center justify-center">
            CLASS GOAL
          </h2>
          <ul className="space-y-2 text-black font-bold leading-relaxed text-[25px]">
            <li>
              - 구체적이고 공정한 성과 평가 기준을 수립하고 이를 통해 조직 내
              신뢰를 형성한다.
            </li>
            <li>
              - 팀원들의 동기를 유발하고, 성장을 촉진하는 성과관리 전략을
              학습한다.
            </li>
          </ul>
        </div>

        {/* Bottom Banner */}
        <SearchBanner
          className="mt-32"
          bgImage="/images/Block_with_illustration.png"
          title="나를 위한 투자, 지금 이 CLASS로 시작하세요"
          description="성장을 위한 꾸준한 노력, 이미 당신은 능력자!"
          buttonText="CLASS 신청하기"
          width="w-[1245px]"
          height="h-[147px]"
          onSearch={() => console.log("Searching with:", theme, job)}
          filters={[]}
        />
      </div>
    </main>
  );
}
