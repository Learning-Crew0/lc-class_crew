import React, { useState } from "react";
import Image from "next/image";

function ProductDetailPage() {
  const [quantity, setQuantity] = useState(2); // Default matches screenshot

  return (
    <main className="max-w-[1270px] mx-auto mt-30 px-4">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-12 mb-16">
        {/* Left - Product Images */}
        <div className="flex flex-col items-start">
          {/* Main Image */}
          <div className="border rounded-lg overflow-hidden mb-4">
            <Image
              src="/class-goal/learningStore/productDetails/main-image.png"
              alt="66일 챌린지"
              width={400}
              height={400}
              className="object-cover w-full"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {[
              "/class-goal/learningStore/productDetails/sub-image.png",
              "/class-goal/learningStore/productDetails/sub-image2.png",
              "/class-goal/learningStore/productDetails/sub-image3.png",
            ].map((thumb, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden w-20 h-20"
              >
                <Image
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex-1 border rounded-lg p-6">
          <div className="border-b pb-2 mb-4 text-[24px] text-gray-700 font-bold">
            진단도구
          </div>

          <div className="space-y-3">
            <p className="text-[24px] font-medium flex justify-between">
              <strong>제품명</strong> &nbsp; 66일 챌린지
            </p>
            <p className="text-[24px] font-medium flex justify-between">
              <strong>가격</strong> &nbsp; 100,000원
            </p>
            <div className="text-[24px] font-medium flex justify-between ">
              <strong>수량</strong> &nbsp;
              <input
                type="text"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded px-2 py-1 w-[400px]"
                placeholder="수량을 입력하세요."
              />
            </div>
          </div>

          <p className="mt-6 font-semibold text-[24px]">
            총 금액(수량):{" "}
            <span className="text-[32px] font-bold">
              {(100000 * quantity).toLocaleString()}원 ({quantity}개)
            </span>
          </p>

          <div className="flex gap-4 mt-8 justify-between">
            <button className="bg-gray-200 text-black px-10 w-full py-3 rounded hover:bg-gray-300 transition">
              찜하기
            </button>
            <button className="bg-black text-white px-10 py-3 w-full rounded hover:bg-gray-800 transition">
              구매하기
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="border-t pt-10 mb-20">
        <h2 className="text-[32px] font-bold mb-20">상세정보</h2>

        <div className="relative">
          <Image
            src="/class-goal/learningStore/productDetails/big-frame-image.png"
            alt="Detailed Info"
            width={1270}
            height={500}
            className="w-full object-cover rounded-lg"
          />

          {/* Overlay Text + Buttons */}
          <div className="absolute bottom-10 left-0 flex gap-30 justify-center px-10">
            <p className="text-white text-[20px] font-medium w-full mb-6">
              66일 동안 꾸준한 실천을 돕는 굿즈를 제작하여, 작은 습관이 모여 더
              큰 변화를 만들어갈 수 있도록 지원합니다. <br /> 이를 통해 누구나
              지속 가능한 성장과 발전을 경험할 수 있는 브랜드를 만드는 것이
              목표입니다.
            </p>
            <p>
              <Image
                src="/class-goal/learningStore/productDetails/arrow-image.png"
                alt="arrow"
                width={50}
                height={50}
              />
            </p>
          </div>

          <div className="flex gap-3 absolute bottom-40 left-8">
            <button className="text-white text-[20px] font-extrabold px-6 py-2 border-2 rounded-full transition">
              Overview
            </button>
            <button className="text-white  text-[20px] font-extrabold px-6 py-2 border-2 rounded-full  transition">
              Approach
            </button>
            <button className=" text-white  text-[20px] font-extrabold px-6 py-2 border-2 rounded-full  transition">
              Target
            </button>
          </div>
        </div>
        <div>
          <Image
            src="/class-goal/learningStore/productDetails/second-frame-image.png"
            alt="66일 챌린지"
            width={1270}
            height={500}
            className="w-full object-cover rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPage;
