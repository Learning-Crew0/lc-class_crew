"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SearchBanner from "@/components/ui/SearchBanner";
import { getCourseCurriculum } from "@/utils/api";

interface CurriculumModule {
    _id: string;
    name: string;
    content: string;
}

interface CurriculumData {
    _id: string;
    courseId: string;
    keywords: string[];
    modules: CurriculumModule[];
}

export default function ClassCurriculum() {
    const [curriculum, setCurriculum] = useState<CurriculumData | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const courseId = params.id as string;

    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                setLoading(true);
                console.log("Fetching curriculum for course:", courseId);

                const response = await getCourseCurriculum(courseId);
                console.log("Curriculum response:", response);

                if (
                    response.success &&
                    (response as unknown as { curriculum: CurriculumData })
                        .curriculum
                ) {
                    const curriculumData = (
                        response as unknown as { curriculum: CurriculumData }
                    ).curriculum;
                    console.log("Curriculum data found:", curriculumData);
                    setCurriculum(curriculumData);
                } else {
                    console.log("No curriculum data found in response");
                }
            } catch (error) {
                console.error("Error fetching curriculum:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCurriculum();
        }
    }, [courseId]);

    if (loading) {
        return (
            <main className="w-[1270px]">
                <div className="w-full space-y-8">
                    <h2 className="w-[280px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[30px] flex items-center justify-center">
                        CURRICULUM
                    </h2>
                    <div className="text-center py-8">
                        <p className="text-lg text-gray-600">
                            Loading curriculum...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="w-[1270px]">
            <div className="w-full space-y-8">
                <h2 className="w-[280px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[30px] flex items-center justify-center">
                    CURRICULUM
                </h2>

                {curriculum?.keywords && curriculum.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-[#8C77EC] text-[27px] font-semibold">
                        {curriculum.keywords.map((keyword, index) => (
                            <span key={index}>#{keyword.trim()}</span>
                        ))}
                    </div>
                )}

                {/* Modules Section */}
                {curriculum?.modules && curriculum.modules.length > 0 ? (
                    <div className="space-y-12 text-[20px] text-black leading-relaxed">
                        {curriculum.modules.map((module, index) => (
                            <React.Fragment key={module._id}>
                                <section>
                                    <h3 className="font-extrabold text-[28px] mb-4">
                                        Module {index + 1}. {module.name}
                                    </h3>
                                    <div className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-12">

                                        {module.content
                                            .split("\n")
                                            .filter((line) => line.trim())
                                            .map((line, lineIndex) => (
                                                <div
                                                    key={lineIndex}
                                                    className="flex"
                                                >
                                                    <span className="mr-3">
                                                        -
                                                    </span>
                                                    <span>{line.trim()}</span>
                                                </div>
                                            ))}
                                    </div>
                                </section>
                                {index < curriculum.modules.length - 1 && (
                                    <div className="w-full h-[2px] bg-[#F0F0F0]"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (

                    <div className="space-y-12 text-[20px] text-black leading-relaxed">
                        <div className="flex flex-wrap gap-2 text-[#8C77EC] text-[27px] font-semibold mb-8">
                            <span>#성과는기획이다</span>
                            <span>#리더의미션</span>
                            <span>#성과관리마인드셋</span>
                            <span>#목표설정및배분</span>
                            <span>#성과피드백</span>
                        </div>

                        <section>
                            <h3 className="font-extrabold text-[28px] mb-4">
                                Module 1. 성과관리 이해하기
                            </h3>
                            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-12">
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>전략과 연계된 성과관리 Overview</span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>사람관리, 성과관리, 조직관리</span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>
                                        성과 리더의 핵심 미션: 역량진단,
                                        업무배분, 성과관리, 후배육성
                                    </span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>
                                        현재의 목표설정 방법 및 관리의 힘든
                                        점은?
                                    </span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>성과관리의 New Normal</span>
                                </li>
                            </ul>
                        </section>

                        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>

                        <section>
                            <h3 className="font-extrabold text-[28px] mb-4">
                                Module 2. 성과목표 설정/배분하기
                            </h3>
                            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-12">
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>
                                        어떻게 평가하시겠습니까?: 올바른
                                        성과목표 설정을 위한 의견 공유
                                    </span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>정확하게 어려운 이유 토론하기</span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>
                                        성과목표 지표를 설정하는 방법 및
                                        사례학습
                                    </span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>
                                        성과 배분 및 도전적인 목표 합의 방법
                                        도출
                                    </span>
                                </li>
                            </ul>
                        </section>

                        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>

                        <section>
                            <h3 className="font-extrabold text-[28px] mb-4">
                                Module 3. 성과 평가하기
                            </h3>
                            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-12">
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>나의 성과평과 공정성 진단하기</span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>업적평가와 역량평가</span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>
                                        성과평가의 운영 방법 및 체크포인트
                                    </span>
                                </li>
                                <li className="flex">
                                    <span className="mr-3">-</span>
                                    <span>최종 평가 면담 프로세스 실습</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                )}

                <SearchBanner
                    titleDiv="pl-3 flex w-full"
                    className="mt-32 px-20"
                    bgImage="/images/Block_with_illustration.png"
                    title="나를 위한 투자, 지금 이 CLASS로 시작하세요"
                    description="성장을 위한 꾸준한 노력, 이미 당신은 능력자!"
                    buttonText="CLASS 신청하기"
                    width="w-[1245px]"
                    height="h-[147px]"
                    buttonWidth="w-[180px]"
                    buttonHeight="h-[53px]"
                    buttonLink={`/payments?courseId=${courseId}`}
                    onSearch={() => console.log("Searching...")}
                    filters={[]}
                />
            </div>
        </main>
    );
}
