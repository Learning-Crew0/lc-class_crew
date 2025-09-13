import React from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    title: "66일 챌린지",
    category: "진단도구",
    price: "100,000원",
    image: "/class-goal/learningStore/image1.png",
    isNew: true,
  },
  {
    id: 2,
    title: "66일 챌린지",
    category: "진단도구",
    originalPrice: "150,000원",
    price: "100,000원",
    image: "/class-goal/learningStore/image2.png",
  },
  {
    id: 3,
    title: "상품명",
    category: "문구류",
    price: "금액",
    image: "/class-goal/learningStore/image3.png",
  },
  {
    id: 4,
    title: "상품명",
    category: "진단도구",
    price: "최종금액",
    image: "/class-goal/learningStore/image4.png",
  },
];

function ProductGrid() {
  return (
    <main className="max-w-[1270px] mx-auto mt-30 px-4 mb-10">
      <div className="relative w-full">
        <Image
          src="/class-goal/learningStore/Rectangle 23864.png"
          alt="Banner"
          width={1270}
          height={200}
          className="w-full"
        />
        <h1 className="absolute top-6 left-6 text-white text-[32px] font-bold">
          Learning-Crew STORE <br />
        </h1>
        <p className="absolute top-19 left-6 text-white font-medium text-[25px]">
          {" "}
          나의 학습과 성장을 위한 특별한 아이템을 만나보세요.
        </p>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6"></h1>
      <p className="text-center text-gray-700 mb-10"></p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/learning-store/product/${product.id}`}
            key={product.id}
            className="border rounded-lg bg-white shadow hover:shadow-lg transition block"
          >
            <div className="relative">
              <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-60 object-cover"
              />
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  NEW
                </span>
              )}
            </div>

            <div className="mt-4 p-5">
              <span className="inline-block bg-black text-x text-white rounded-lg px-2 py-1 mb-2">
                {product.category}
              </span>

              <h2 className="font-semibold text-[25px] text-[#000000]">
                {product.title}
              </h2>

              {product.originalPrice && (
                <p className="text-[#000000] line-through text-[20px]">
                  {product.originalPrice}
                </p>
              )}

              <p className="text-black font-bold text-lg">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default ProductGrid;
