"use client";
import Image from "next/image";

interface BannerProps {
  type: "learning" | "payment" | "inquiry" | "account";
}

export default function Banner({ type }: BannerProps) {
  const bannerData = {
    learning: {
      img: "/My page/banner.png",
      text: "안녕하세요, 홍길동 님 마이페이지 입니다.",
    },
    payment: {
      img: "/My page/Rectangle23864.png",
      text: "마이페이지",
    },
    inquiry: {
      img: "/My page/Rectangle23864.png",
      text: "마이페이지",
    },
    account: {
      img: "/My page/Rectangle23864.png",
      text: "마이페이지",
    },
  };

  const { img, text } = bannerData[type];

  return (
    <div className="relative w-full">
      <Image
        src={img}
        alt="Banner"
        width={1270}
        height={200}
        className="w-full"
      />
      <h1 className="absolute left-4 top-4 text-white text-xl font-semibold">
        {text}
      </h1>
    </div>
  );
}
