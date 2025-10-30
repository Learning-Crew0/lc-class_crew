"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SearchBanner from "@/components/ui/SearchBanner";
import { getCourseInstructor } from "@/utils/api";

interface InstructorData {
    _id: string;
    name: string;
    bio?: string;
    professionalField?: string;
    certificates?: string[];
    attendanceHistory?: string[];
}

export default function ClassInstructor() {
    // Removed unused theme and job state variables
    const [instructor, setInstructor] = useState<InstructorData | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const courseId = params.id as string;

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                setLoading(true);
                console.log("Fetching instructor for course:", courseId);

                const response = await getCourseInstructor(courseId);
                console.log("Instructor response:", response);

                if (
                    response.success &&
                    (response as unknown as { instructor: InstructorData })
                        .instructor
                ) {
                    const instructorData = (
                        response as unknown as { instructor: InstructorData }
                    ).instructor;
                    console.log("Instructor data found:", instructorData);
                    setInstructor(instructorData);
                } else {
                    console.log("No instructor data found in response");
                }
            } catch (error) {
                console.error("Error fetching instructor:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchInstructor();
        }
    }, [courseId]);

    // Default instructor data
    const defaultInstructor = {
        name: "정상 범",
        education: [
            "고려대학교 대학원 교육학 석사(우수논문상)",
            "고려대학교 대학원 교육학 박사 수료",
            "현) 이슈앤솔루션 대표 강사, 러닝크루 파트너 강사",
        ],
        expertise: [
            "직무스킬: PT스킬, 사내강사양성, 문제해결, 기획 및 보고, 업무수명",
            "기타: 전략기획(전략적사고, 전략분석기법)",
        ],
        certificates: [
            "BIRKMAN Method 강사 자격",
            "CAPSTONE Biz Simulation 강사 자격",
            "한국코치협회(KCA) 정회원",
        ],
        experience: [
            "삼성반도체, 삼성SDS, 삼성병원, 현대자동차인재개발원, 현대자동차, 현대모비스, 현대제철, 현대중공업, 현대삼호중공업, LIG넥스원, 한국항공우주산업, CJ제일제당, 불로그룹코리아, 기아자동차, 농심그룹, 대우건설, LG전자, LG화학, GS글로벌 외 다수",
        ],
    };

    if (loading) {
        return (
            <main className="w-[1270px]">
                <div className="w-full space-y-8">
                    <h2 className="w-[450px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[26px] flex items-center justify-center">
                        INSTRUCTOR/FACILITATOR
                    </h2>
                    <div className="text-center py-8">
                        <p className="text-lg text-gray-600">
                            Loading instructor information...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="w-[1270px]">
            <div className="w-full space-y-8">
                <h2 className="w-[450px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[26px] flex items-center justify-center">
                    INSTRUCTOR/FACILITATOR
                </h2>

                <h3 className="text-[36px] font-extrabold text-black">
                    {instructor?.name || defaultInstructor.name}
                </h3>

                {/* Bio Section */}
                {instructor?.bio && (
                    <>
                        <section className="space-y-4">
                            <h4 className="text-[28px] font-semibold text-black">
                                소개
                            </h4>
                            <div className="text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
                                <p>{instructor.bio}</p>
                            </div>
                        </section>
                        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>
                    </>
                )}

                {/* Professional Field */}
                {instructor?.professionalField && (
                    <>
                        <section className="space-y-4">
                            <h4 className="text-[28px] font-semibold text-black">
                                전문분야
                            </h4>
                            <div className="text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
                                <div className="flex">
                                    <span className="mr-3">-</span>
                                    <span>{instructor.professionalField}</span>
                                </div>
                            </div>
                        </section>
                        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>
                    </>
                )}

                {/* Certificates */}
                {instructor?.certificates &&
                    instructor.certificates.length > 0 ? (
                    <>
                        <section className="space-y-4">
                            <h4 className="text-[28px] font-semibold text-black">
                                자격 및 저서
                            </h4>
                            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
                                {instructor.certificates.map((cert, index) => (
                                    <li key={index} className="flex">
                                        <span className="mr-3">-</span>
                                        <span>{cert}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>
                    </>
                ) : (
                    <>
                        <section className="space-y-4">
                            <h4 className="text-[28px] font-semibold text-black">
                                자격 및 저서
                            </h4>
                            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
                                {defaultInstructor.certificates.map(
                                    (cert, index) => (
                                        <li key={index} className="flex">
                                            <span className="mr-3">-</span>
                                            <span>{cert}</span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </section>
                        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>
                    </>
                )}

                {/* Attendance History */}
                {instructor?.attendanceHistory &&
                    instructor.attendanceHistory.length > 0 ? (
                    <section className="space-y-4">
                        <h4 className="text-[28px] font-semibold text-black">
                            출강이력
                        </h4>
                        <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
                            {instructor.attendanceHistory.map(
                                (history, index) => (
                                    <li key={index} className="flex">
                                        <span className="mr-3">-</span>
                                        <span>{history}</span>
                                    </li>
                                )
                            )}
                        </ul>
                    </section>
                ) : (
                    <section className="space-y-4">
                        <h4 className="text-[28px] font-semibold text-black">
                            출강이력
                        </h4>
                        <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
                            {defaultInstructor.experience.map((exp, index) => (
                                <li key={index} className="flex">
                                    <span className="mr-3">-</span>
                                    <span>{exp}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Default sections if no API data */}
                {!instructor && (
                    <>
                        <section className="">
                            <h4 className="text-[28px] font-semibold text-black">
                                학력 및 경력
                            </h4>
                            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-10 mt-4">
                                {defaultInstructor.education.map(
                                    (edu, index) => (
                                        <li key={index} className="flex">
                                            <span className="mr-3">-</span>
                                            <span>{edu}</span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </section>

                        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>

                        <section className="space-y-4">
                            <h4 className="text-[28px] font-semibold text-black">
                                전문분야
                            </h4>
                            <ul className="space-y-5 text-[25px] text-[#6D6D6D] font-normal ml-6 mt-4">
                                {defaultInstructor.expertise.map(
                                    (exp, index) => (
                                        <li key={index} className="flex">
                                            <span className="mr-3">-</span>
                                            <span>{exp}</span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </section>

                        <div className="w-full h-[2px] bg-[#F0F0F0]"></div>
                    </>
                )}

                {/* Bottom Banner */}
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
