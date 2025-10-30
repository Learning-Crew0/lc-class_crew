"use client";
import SearchBanner from "@/components/ui/SearchBanner";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCourseById } from "@/utils/api";

interface CourseData {
    _id: string;
    title: string;
    learningGoals?: string | string[];
    whatYouWillLearn?: string[];
    target?: string;
    recommendedAudience?: string[];
}

export default function ClassGoal() {
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const courseId = params.id as string;

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const response = await getCourseById(courseId);

                if (response.success && response.course) {
                    setCourseData(response.course as unknown as CourseData);
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    const defaultGoals = [
        "구체적이고 공정한 성과 평가 기준을 수립하고 이를 통해 조직 내 신뢰를 형성한다.",
        "팀원들의 동기를 유발하고, 성장을 촉진하는 성과관리 전략을 학습한다.",
    ];

    const getLearningGoals = () => {
        if (
            courseData?.whatYouWillLearn &&
            courseData.whatYouWillLearn.length > 0
        ) {
            return courseData.whatYouWillLearn;
        }
        if (courseData?.learningGoals) {
            if (typeof courseData.learningGoals === "string") {
                const goals = courseData.learningGoals
                    .split(/\n|;|,/)
                    .filter((goal) => goal.trim());
                if (goals.length > 0) return goals;
            } else if (Array.isArray(courseData.learningGoals)) {
                return courseData.learningGoals;
            }
        }
        return defaultGoals;
    };

    if (loading) {
        return (
            <main className="w-[1270px] items-center">
                <div className="w-full space-y-6">
                    <div className="rounded-lg bg-white">
                        <h2 className="w-[251px] h-[54px] mb-8 font-extrabold rounded-full text-black border-[2px] text-[30px] flex items-center justify-center">
                            CLASS GOAL
                        </h2>
                        <div className="text-center py-8">
                            <p className="text-lg text-gray-600">
                                Loading course goals...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="w-[1270px] items-center">
            <div className="w-full space-y-6">
                <div className="rounded-lg bg-white">
                    <h2 className="w-[251px] h-[54px] mb-8 font-extrabold rounded-full text-black border-[2px] text-[30px] flex items-center justify-center">
                        CLASS GOAL
                    </h2>
                    <ul className="space-y-2 text-black font-medium leading-relaxed text-[25px] ml-10">
                        {getLearningGoals().map((goal, index) => (
                            <li key={index} className="flex">
                                <span className="mr-3">-</span>
                                <span>{goal.trim()}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bottom Banner */}
                <SearchBanner
                    titleDiv="pl-3 flex w-full"
                    className="mt-12 px-20"
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
