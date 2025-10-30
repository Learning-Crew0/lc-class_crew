"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProductById, addToCart } from "@/utils/api";

interface Product {
    _id: string;
    name: string;
    description?: string;
    category:
        | {
              _id: string;
              title: string;
              description?: string;
          }
        | string;
    baseCost: number;
    discountRate?: number;
    finalAmount?: number;
    finalPrice?: number;
    availableQuantity: number;
    images?: string[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

function ProductDetailPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getProductById(productId);

                if (response.success && response.product) {
                    const productData = response.product;

                    // Validate product data has required fields
                    if (!productData._id || !productData.name) {
                        console.error(
                            "Invalid product data: missing _id or name"
                        );
                        setProduct(null);
                        return;
                    }

                    // Ensure finalPrice/finalAmount consistency
                    const processedProduct = {
                        ...productData,
                        finalAmount:
                            productData.finalAmount || productData.baseCost,
                        finalPrice:
                            productData.finalAmount ||
                            productData.finalPrice ||
                            productData.baseCost,
                    };

                    setProduct(processedProduct as unknown as Product);
                } else {
                    console.error(
                        "Failed to fetch product:",
                        response.message || "Unknown error"
                    );
                    setProduct(null);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        if (!product) return;

        // Get userId from localStorage
        const userId =
            typeof window !== "undefined"
                ? localStorage.getItem("userId")
                : null;

        if (!userId) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            router.push("/login");
            return;
        }

        if (product.availableQuantity === 0) {
            alert("상품이 품절되었습니다.");
            return;
        }

        if (quantity > product.availableQuantity) {
            alert(
                `재고가 부족합니다. 최대 ${product.availableQuantity}개까지 주문 가능합니다.`
            );
            return;
        }

        setAddingToCart(true);

        try {
            const response = await addToCart({
                userId,
                productId: product._id,
                quantity,
            });

            if (response.success) {
                alert(`${product.name}이(가) 장바구니에 추가되었습니다!`);
                const goToCart = confirm("장바구니로 이동하시겠습니까?");
                if (goToCart) router.push("/shopping-basket");
            } else {
                alert(response.message || "장바구니 추가에 실패했습니다.");
            }
        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("장바구니 추가 중 오류가 발생했습니다.");
        } finally {
            setAddingToCart(false);
        }
    };

    const getMainImage = (): string => {
        if (product?.images?.length) return product.images[0];
        return "/class-goal/learningStore/productDetails/main-image.png";
    };

    const getThumbnails = (): string[] => {
        if (product?.images && product.images.length > 1) {
            return product.images.slice(1, 4);
        }
        return [
            "/class-goal/learningStore/productDetails/sub-image.png",
            "/class-goal/learningStore/productDetails/sub-image2.png",
            "/class-goal/learningStore/productDetails/sub-image3.png",
        ];
    };

    const calculateTotal = (): number => {
        if (!product) return 0;
        const price =
            product.finalAmount || product.finalPrice || product.baseCost;
        return price * quantity;
    };

    if (loading) {
        return (
            <main className="max-w-[1270px] mx-auto mt-30 px-4">
                <div className="text-center py-8">
                    <p className="text-lg text-gray-600">
                        상품 정보를 불러오는 중...
                    </p>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="max-w-[1270px] mx-auto mt-30 px-4">
                <div className="text-center py-8">
                    <p className="text-lg text-gray-600 mb-4">
                        상품을 찾을 수 없습니다.
                    </p>
                    <Link
                        href="/learning-store"
                        className="text-blue-600 hover:underline"
                    >
                        스토어로 돌아가기
                    </Link>
                </div>
            </main>
        );
    }

    const displayName = product.name || "상품명 없음";
    const displayCategory =
        typeof product.category === "object" && product.category !== null
            ? product.category.title || "카테고리 없음"
            : typeof product.category === "string"
              ? product.category
              : "카테고리 없음";
    const displayPrice =
        product.finalAmount || product.finalPrice || product.baseCost || 0;

    return (
        <main className="max-w-[1270px] mx-auto mt-30 px-4">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-12 mb-16">
                {/* Left - Product Images */}
                <div className="flex flex-col items-start">
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <Image
                            src={getMainImage()}
                            alt={displayName}
                            width={400}
                            height={400}
                            className="object-cover w-full"
                        />
                    </div>

                    <div className="flex gap-3">
                        {getThumbnails().map((thumb, index) => (
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
                        {displayCategory}
                    </div>

                    <div className="space-y-3">
                        <p className="text-[24px] font-medium flex justify-between">
                            <strong>제품명</strong> &nbsp; {displayName}
                        </p>
                        <p className="text-[24px] font-medium flex justify-between">
                            <strong>가격</strong> &nbsp;{" "}
                            {displayPrice.toLocaleString()}원
                        </p>
                        <div className="text-[24px] font-medium flex justify-between ">
                            <strong>수량</strong> &nbsp;
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        Math.max(
                                            1,
                                            parseInt(e.target.value) || 1
                                        )
                                    )
                                }
                                className="border rounded px-2 py-1 w-[200px]"
                            />
                        </div>
                    </div>

                    <p className="mt-6 font-semibold flex justify-between text-[24px]">
                        총 금액(수량):{" "}
                        <span className="text-[32px] mt-2 font-bold">
                            {calculateTotal().toLocaleString()}원 ({quantity}개)
                        </span>
                    </p>

                    <div className="flex gap-4 mt-8 justify-between">
                        <button
                            className="bg-gray-200 text-black px-10 w-full py-3 rounded hover:bg-gray-300 transition"
                            onClick={() =>
                                alert("찜하기 기능은 추후 구현 예정입니다.")
                            }
                        >
                            찜하기
                        </button>

                        <button
                            className="bg-black text-white px-10 py-3 w-full rounded hover:bg-gray-800 transition disabled:bg-gray-400"
                            disabled={
                                addingToCart || product.availableQuantity === 0
                            }
                            onClick={handleAddToCart}
                        >
                            {addingToCart ? "추가 중..." : "구매하기"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Static Section (as in your Figma) */}
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

                    <div className="absolute bottom-10 left-0 flex gap-30 justify-center px-10">
                        <p className="text-white text-[20px] font-medium w-full mb-6">
                            {product?.description ||
                                "66일 동안 꾸준한 실천을 돕는 굿즈를 제작하여, 작은 습관이 모여 더 큰 변화를 만들어갈 수 있도록 지원합니다."}
                            <br />
                            이를 통해 누구나 지속 가능한 성장과 발전을 경험할 수
                            있는 브랜드를 만드는 것이 목표입니다.
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
                        <button className="text-white text-[20px] font-extrabold px-6 py-2 border-2 rounded-full transition">
                            Approach
                        </button>
                        <button className="text-white text-[20px] font-extrabold px-6 py-2 border-2 rounded-full transition">
                            Target
                        </button>
                    </div>
                </div>

                <div className="mt-20">
                    <Image
                        src="/class-goal/learningStore/productDetails/second-frame-image.png"
                        alt={displayName}
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
