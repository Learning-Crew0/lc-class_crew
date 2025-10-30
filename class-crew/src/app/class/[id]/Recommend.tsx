"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SearchBanner from "@/components/ui/SearchBanner";
import { motion } from "framer-motion";
import Image from "next/image";
import { getCourseReviews, getCourseById } from "@/utils/api";

interface Review {
    _id: string;
    reviewerName: string;
    text: string;
    avatar?: string;
    createdAt: string;
}

interface CourseData {
    recommendedAudience?: string[];
    target?: string;
}

export default function ClassRecommend() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const courseId = params.id as string;

    const defaultReviews = [
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

    const defaultAudience = [
        "3년차 미만 주니어, 신입사원",
        "팀 성과를 높이고 싶은 관리자",
        "조직의 목표와 실행을 체계화하고 싶은 리더",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [courseResponse, reviewsResponse] = await Promise.all([
                    getCourseById(courseId),
                    getCourseReviews(courseId),
                ]);

                console.log("Course response:", courseResponse);
                console.log("Reviews response:", reviewsResponse);

                // Get course data for recommended audience
                if (courseResponse.success && courseResponse.course) {
                    setCourseData(courseResponse.course);
                }

                // Get reviews - API returns { success: true, reviews: [...] }
                if (
                    reviewsResponse.success &&
                    (reviewsResponse as unknown as { reviews: Review[] })
                        .reviews
                ) {
                    const reviewsData = (
                        reviewsResponse as unknown as { reviews: Review[] }
                    ).reviews;
                    console.log("Reviews data found:", reviewsData);
                    setReviews(reviewsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchData();
        }
    }, [courseId]);

    const getRecommendedAudience = () => {
        if (
            courseData?.recommendedAudience &&
            courseData.recommendedAudience.length > 0
        ) {
            return courseData.recommendedAudience;
        }
        if (courseData?.target) {
            const audiences = courseData.target
                .split(/\n|;|,/)
                .filter((aud) => aud.trim());
            if (audiences.length > 0) return audiences;
        }
        return defaultAudience;
    };

    const getValidAvatarUrl = (avatar?: string): string => {
        if (!avatar) return "/class-goal/recommend/span1.png";

        const isValidImageUrl =
            /\.(jpg|jpeg|png|gif|webp)$/i.test(avatar) ||
            avatar.includes("cloudinary.com") ||
            avatar.includes("res.cloudinary.com");

        const isNotAdminUrl =
            !avatar.includes("/admin/") &&
            !avatar.includes("localhost:3000/admin");

        if (isValidImageUrl && isNotAdminUrl) {
            return avatar;
        }

        return "/class-goal/recommend/span1.png"; // Default fallback
    };

    const getReviewsToDisplay = () => {
        if (reviews.length > 0) {
            return reviews.map((review, index) => ({
                name: review.reviewerName || "Anonymous User",
                text: review.text,
                image:
                    getValidAvatarUrl(review.avatar) ||
                    `/class-goal/recommend/span${(index % 6) + 1}.png`, // Cycle through default avatars
            }));
        }
        return defaultReviews;
    };

    const arrowVariants = {
        hover: {
            scale: 1.1,
            transition: { duration: 0.2, ease: "easeOut" as const },
        },
    } as const;

    return (
        <main className="w-[1245px]">
            <div className="w-full space-y-8">
                <section>
                    <h2 className="w-[280px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[30px] flex items-center justify-center">
                        RECOMMEND
                    </h2>
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-lg text-gray-600">
                                Loading recommendations...
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-5 ml-8 mt-10 text-[25px] text-[#000000] font-medium">
                            {getRecommendedAudience().map((audience, index) => (
                                <li key={index} className="flex">
                                    <span className="mr-3">-</span>
                                    <span>{audience.trim()}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section>
                    <h2 className="text-[36px] font-extrabold mb-8 text-[#000000]">
                        REAL VOICE
                    </h2>

                    <div className="grid grid-cols-3 gap-6">
                        {getReviewsToDisplay().map((review, idx) => (
                            <div
                                key={idx}
                                className="bg-[#FAFAFA] shadow-md rounded-[16px] border border-[#c8c9cc] p-6 text-[#333] flex flex-col gap-4"
                            >
                                <div className="w-full h-12 rounded-full flex items-center bg-[#FAFAFA] justify-start text-2xl gap-4">
                                    <Image
                                        src={review.image}
                                        alt={review.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                        onError={(e) => {
                                            // Fallback to default avatar on error
                                            const target =
                                                e.target as HTMLImageElement;
                                            target.src =
                                                "/class-goal/recommend/span1.png";
                                        }}
                                    />
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

                    <motion.div
                        className="flex justify-center mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        whileHover={{
                            scale: 1.05,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut" as const,
                            },
                        }}
                    >
                        <motion.div
                            className="flex items-center"
                            transition={{
                                duration: 0.2,
                                ease: "easeOut" as const,
                            }}
                        >
                            <motion.div
                                variants={arrowVariants}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                            >
                                <Image
                                    src="/images/left-arrow.png"
                                    alt="Left Arrow"
                                    width={48}
                                    height={48}
                                    className="cursor-pointer"
                                />
                            </motion.div>
                            <motion.div
                                variants={arrowVariants}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                            >
                                <Image
                                    src="/images/right-black-arrow.png"
                                    alt="Right Arrow"
                                    width={48}
                                    height={48}
                                    className="cursor-pointer"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

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
                    onSearch={() => console.log("Searching with recommend")}
                    filters={[]}
                />
            </div>
        </main>
    );
}
