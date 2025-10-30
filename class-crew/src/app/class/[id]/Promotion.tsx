"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import SearchBanner from "@/components/ui/SearchBanner";
import { getCoursePromotions, getCourseById } from "@/utils/api";

interface Promotion {
  _id: string;
  images: string[];
  description?: string;
  title?: string;
}

interface Notice {
  _id: string;
  noticeImage?: string;
  noticeDesc?: string;
  title?: string;
}

export default function PromotionNotice() {
  // Removed unused theme and job state variables
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const courseId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(
          "Fetching promotions and notice for course:",
          courseId
        );

        // Fetch promotions and course data (which includes notice) in parallel
        const [promotionsResponse, courseResponse] = await Promise.all([
          getCoursePromotions(courseId),
          getCourseById(courseId),
        ]);

        console.log("Promotions response:", promotionsResponse);
        console.log("Course response:", courseResponse);

        // Handle promotions - API returns { success: true, promotion: {...} }
        if (
          promotionsResponse.success &&
          (promotionsResponse as unknown as { promotion: Promotion })
            .promotion
        ) {
          const promotionData = (
            promotionsResponse as unknown as {
              promotion: Promotion;
            }
          ).promotion;
          console.log("Promotion data found:", promotionData);
          setPromotions([promotionData]); // Convert single promotion to array
        }

        // Handle notice from course response
        if (
          courseResponse.success &&
          (courseResponse as unknown as { notice: Notice }).notice
        ) {
          const noticeData = (
            courseResponse as unknown as { notice: Notice }
          ).notice;
          console.log("Notice data found:", noticeData);
          setNotice(noticeData);
        }
      } catch (error) {
        console.error("Error fetching promotions and notice:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  // Default promotion images
  const defaultPromotionImages = [
    "/class-goal/promotion/promo1.png",
    "/class-goal/promotion/promo2.png",
    "/class-goal/promotion/promo3.png",
    "/class-goal/promotion/promo4.png",
    "/class-goal/promotion/promo5.png",
  ];

  // Get all promotion images from API
  const getAllPromotionImages = () => {
    const allImages: string[] = [];
    promotions.forEach((promo) => {
      if (promo.images && promo.images.length > 0) {
        allImages.push(...promo.images);
      }
    });
    return allImages.length > 0 ? allImages : defaultPromotionImages;
  };

  if (loading) {
    return (
      <main className="w-[1245px] space-y-8">
        <section className="space-y-8">
          <h2 className="w-[250px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[26px] flex items-center justify-center">
            PROMOTION
          </h2>
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">
              Loading promotions...
            </p>
          </div>
        </section>
      </main>
    );
  }

  const allImages = getAllPromotionImages();
  const smallImages = allImages.slice(0, 4);
  const wideImage = allImages.length > 4 ? allImages[4] : allImages[0];

  return (
    <main className="w-[1245px] space-y-8">
      <section className="space-y-8">
        <h2 className="w-[250px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[26px] flex items-center justify-center">
          PROMOTION
        </h2>

        {/* 4 small images row */}
        {smallImages.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-10">
            {smallImages.map((image, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`Promotion ${idx + 1}`}
                  width={295}
                  height={218}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target =
                      e.target as HTMLImageElement;
                    target.src = `/class-goal/promotion/promo${(idx % 4) + 1}.png`;
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {wideImage && (
          <div className="rounded-lg overflow-hidden">
            <Image
              src={wideImage}
              alt="Promotion Wide"
              width={1245}
              height={218}
              className="w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/class-goal/promotion/promo5.png";
              }}
            />
          </div>
        )}
      </section>

      {/* Notice */}
      <section className="space-y-8 mt-24">
        <h2 className="w-[160px] h-[54px] font-extrabold rounded-full text-black border-[2px] text-[26px] flex items-center justify-center">
          NOTICE
        </h2>

        {notice?.noticeImage ? (
          <div className="rounded-lg overflow-hidden">
            <Image
              src={notice.noticeImage}
              alt="Notice"
              width={1245}
              height={642}
              className="w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "/class-goal/promotion/big-image.png";
              }}
            />
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/class-goal/promotion/big-image.png"
              alt="Notice"
              width={1245}
              height={642}
              className="w-full object-cover"
            />
          </div>
        )}

        {notice?.noticeDesc && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">공지사항</h3>
            <p className="text-gray-700">{notice.noticeDesc}</p>
          </div>
        )}
      </section>

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
        onSearch={() => console.log("Searching with promotion")}
        filters={[]}
      />
    </main>
  );
}
