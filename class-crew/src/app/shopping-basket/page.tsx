"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "@/utils/api";

interface CartItem {
    product: {
        _id: string;
        name: string;
        baseCost: number;
        discountRate?: number;
        finalPrice?: number;
        images: string[];
        availableQuantity: number;
        category?: {
            _id: string;
            title: string;
        };
    };
    quantity: number;
    priceAtTime: number;
    subtotal: number;
}

interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    totalAmount: number;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
}

// Default fallback data
const defaultCartItems: CartItem[] = [
    {
        product: {
            _id: "1",
            name: "강의명강의명강의명강의명강의명강의명강의명강의명강의명강의명강의명강의명",
            baseCost: 150000,
            discountRate: 10,
            finalPrice: 135000,
            images: ["/shopping-basket.png"],
            availableQuantity: 10,
            category: { _id: "cat1", title: "진단도구" },
        },
        quantity: 1,
        priceAtTime: 135000,
        subtotal: 135000,
    },
    {
        product: {
            _id: "2",
            name: "강의명강의명 강의명 강의명 강의명 강의명 강의명 강의명 강의명 강의명 강의명 강의명",
            baseCost: 10000,
            discountRate: 0,
            finalPrice: 10000,
            images: ["/shopping-basket.png"],
            availableQuantity: 5,
            category: { _id: "cat2", title: "문구류" },
        },
        quantity: 1,
        priceAtTime: 10000,
        subtotal: 10000,
    },
];

const CartTableContent: React.FC = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    // Get user ID from localStorage
    const userId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const fetchCart = async () => {
        if (!userId) {
            console.log("No userId, using default items");
            setCartItems(defaultCartItems);
            setError("로그인이 필요합니다");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log("Fetching cart...");

            const response = await getCart(userId);
            console.log("Cart response:", response);

            if (response.success && response.data) {
                const cartData = response.data as Cart;
                console.log("Cart data:", cartData);
                setCart(cartData);
                setCartItems(cartData.items || []);
                setError(null);
            } else {
                console.log("No cart found, using default items");
                setCartItems(defaultCartItems);
                setError("장바구니를 불러올 수 없습니다");
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError(
                `장바구니 로드 실패: ${err instanceof Error ? err.message : "Unknown error"}`
            );
            setCartItems(defaultCartItems);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (productId: string) => {
        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((pid) => pid !== productId)
                : [...prev, productId]
        );
    };

    const selectAll = () => {
        if (selectedProducts.length === cartItems.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(cartItems.map((item) => item.product._id));
        }
    };

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const item = cartItems.find((item) => item.product._id === productId);
        if (!item) return;

        if (newQuantity > item.product.availableQuantity) {
            alert(
                `재고가 부족합니다. 최대 ${item.product.availableQuantity}개까지 주문 가능합니다.`
            );
            return;
        }

        setUpdating(productId);

        try {
            if (!userId) {
                setError("로그인이 필요합니다.");
                return;
            }

            const response = await updateCartItem(productId, {
                userId,
                quantity: newQuantity,
            });

            if (response.success && response.data) {
                const updatedCart = response.data as Cart;
                setCart(updatedCart);
                setCartItems(updatedCart.items || []);
            } else {
                alert(response.message || "수량 업데이트에 실패했습니다.");
            }
        } catch (err) {
            console.error("Error updating quantity:", err);
            alert("수량 업데이트 중 오류가 발생했습니다.");
        } finally {
            setUpdating(null);
        }
    };

    const removeItem = async (productId: string) => {
        if (!confirm("이 상품을 장바구니에서 제거하시겠습니까?")) return;

        setUpdating(productId);

        try {
            if (!userId) {
                setError("로그인이 필요합니다.");
                return;
            }

            const response = await removeFromCart(productId, { userId });

            if (response.success && response.data) {
                const updatedCart = response.data as Cart;
                setCart(updatedCart);
                setCartItems(updatedCart.items || []);
                // Remove from selected products if it was selected
                setSelectedProducts((prev) =>
                    prev.filter((id) => id !== productId)
                );
            } else {
                alert(response.message || "상품 제거에 실패했습니다.");
            }
        } catch (err) {
            console.error("Error removing item:", err);
            alert("상품 제거 중 오류가 발생했습니다.");
        } finally {
            setUpdating(null);
        }
    };

    const removeSelectedItems = async () => {
        if (selectedProducts.length === 0) {
            alert("제거할 상품을 선택해주세요.");
            return;
        }

        if (
            !confirm(
                `선택한 ${selectedProducts.length}개 상품을 제거하시겠습니까?`
            )
        )
            return;

        for (const productId of selectedProducts) {
            try {
                await removeFromCart(productId, { userId: userId! });
            } catch (err) {
                console.error(`Error removing item ${productId}:`, err);
            }
        }

        // Refresh cart after removing all selected items
        fetchCart();
        setSelectedProducts([]);
    };

    const clearEntireCart = async () => {
        if (!confirm("장바구니를 모두 비우시겠습니까?")) return;

        try {
            if (!userId) {
                setError("로그인이 필요합니다.");
                return;
            }

            const response = await clearCart({ userId });

            if (response.success) {
                setCart(null);
                setCartItems([]);
                setSelectedProducts([]);
                alert("장바구니가 비워졌습니다.");
            } else {
                alert(response.message || "장바구니 비우기에 실패했습니다.");
            }
        } catch (err) {
            console.error("Error clearing cart:", err);
            alert("장바구니 비우기 중 오류가 발생했습니다.");
        }
    };

    const totalAmount = selectedProducts.reduce((sum, productId) => {
        const item = cartItems.find((item) => item.product._id === productId);
        return item ? sum + item.subtotal : sum;
    }, 0);

    const formatPrice = (price: number): string => {
        return `${price.toLocaleString()}원`;
    };

    const getProductImage = (item: CartItem): string => {
        if (item.product.images && item.product.images.length > 0) {
            return item.product.images[0];
        }
        return "/shopping-basket.png";
    };

    if (loading) {
        return (
            <main className="w-[1270px] mt-32 flex flex-col items-center mb-30 mx-auto">
                <div className="relative w-full">
                    <Image
                        src="/My page/Rectangle 23864.png"
                        alt="Banner"
                        width={1270}
                        height={200}
                        className="w-full"
                    />
                    <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[32px] font-bold">
                        장바구니
                    </h1>
                </div>
                <div className="text-center py-8">
                    <p className="text-lg text-gray-600">
                        장바구니를 불러오는 중...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="w-[1270px] mt-32 flex flex-col items-center mb-30 mx-auto ">
            <div className="relative w-full">
                <Image
                    src="/My page/Rectangle 23864.png"
                    alt="Banner"
                    width={1270}
                    height={200}
                    className="w-full"
                />
                <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[32px] font-bold">
                    장바구니
                </h1>
            </div>

            {/* Error message */}
            {error && (
                <div className="w-full text-center py-4 mt-6">
                    <p className="text-sm text-yellow-600 bg-yellow-100 px-4 py-2 rounded">
                        {error} - 기본 장바구니를 표시합니다
                    </p>
                </div>
            )}

            {/* Data source indicator */}
            <div className="w-full text-center py-2 mt-4">
                <span
                    className={`text-sm px-3 py-1 rounded ${!error ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                    {!error
                        ? `API에서 ${cartItems.length}개 상품 로드됨`
                        : "기본 장바구니 표시 중"}
                </span>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500 mb-4">
                        장바구니가 비어있습니다
                    </p>
                    <Link
                        href="/learning-store"
                        className="text-blue-600 hover:underline"
                    >
                        쇼핑 계속하기
                    </Link>
                </div>
            ) : (
                <div className="p-4 w-full ">
                    <div className="flex items-center justify-between mb-8">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-[20px] font-bold text-black">
                            <input
                                type="checkbox"
                                checked={
                                    selectedProducts.length ===
                                    cartItems.length && cartItems.length > 0
                                }
                                onChange={selectAll}
                                className="hidden"
                            />
                            전체선택 ({cartItems.length}개)
                        </label>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1 text-[20px] font-medium text-black">
                                <input
                                    type="checkbox"
                                    className="w-[18px] h-[18px] accent-black"
                                />{" "}
                                과정만 보기
                            </label>
                            <label className="flex items-center gap-1 text-[20px] font-medium text-black">
                                <input
                                    type="checkbox"
                                    className="w-[18px] h-[18px] accent-black"
                                />{" "}
                                상품만 보기
                            </label>
                            <button
                                onClick={removeSelectedItems}
                                disabled={selectedProducts.length === 0}
                                className="border border-[rgba(0,0,0,0.50)] px-2 py-1 text-[20px] font-medium text-black flex hover:bg-gray-100 disabled:opacity-50"
                            >
                                <X className="mt-1 w-[20px] h-[20px]" />{" "}
                                선택삭제
                            </button>
                            <button
                                onClick={clearEntireCart}
                                className="border border-red-500 px-2 py-1 text-[20px] font-medium text-red-600 hover:bg-red-50"
                            >
                                전체삭제
                            </button>
                        </div>
                    </div>

                    <table className="w-full h-[59px]">
                        <thead className="bg-[#EDEDED] pb-20">
                            <tr>
                                <th
                                    className="p-2 text-[20px] font-bold text-black cursor-pointer"
                                    onClick={selectAll}
                                >
                                    <span
                                        className={`w-[25px] h-[25px] rounded-full ml-2 border flex items-center justify-center
        ${selectedProducts.length === cartItems.length && cartItems.length > 0
                                                ? "bg-black text-white"
                                                : selectedProducts.length > 0
                                                    ? " text-black"
                                                    : "bg-white"
                                            }`}
                                    >
                                        {selectedProducts.length ===
                                            cartItems.length &&
                                            cartItems.length > 0
                                            ? "✔"
                                            : selectedProducts.length > 0
                                                ? "–"
                                                : ""}
                                    </span>
                                </th>
                                <th className="p-2 text-[20px] font-bold text-black">
                                    상품명
                                </th>
                                <th className="p-2 text-[20px] font-bold text-black">
                                    수량
                                </th>
                                <th className="p-2 text-[20px] font-bold text-black">
                                    정가
                                </th>
                                <th className="p-2 text-[20px] font-bold text-black">
                                    할인금액
                                </th>
                                <th className="p-2 text-[20px] font-bold text-black">
                                    총 결제금액
                                </th>
                                <th className="p-2 text-[20px] font-bold text-black">
                                    관리
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => {
                                const isSelected = selectedProducts.includes(
                                    item.product._id
                                );
                                const isUpdating =
                                    updating === item.product._id;
                                const discount = item.product.discountRate
                                    ? ((item.product.baseCost *
                                        item.product.discountRate) /
                                        100) *
                                    item.quantity
                                    : 0;

                                return (
                                    <tr
                                        key={item.product._id}
                                        className="border-b-2 border-[#D9D9D9] w-full"
                                    >
                                        <td className="p-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    toggleSelect(
                                                        item.product._id
                                                    )
                                                }
                                                className="rounded-full w-[25px] h-[25px] accent-black"
                                                disabled={isUpdating}
                                            />
                                        </td>
                                        <td className="flex items-start gap-3 m-10">
                                            <Image
                                                src={getProductImage(item)}
                                                width={259}
                                                height={184}
                                                alt="상품 이미지"
                                                className="w-[259px] h-[184px] object-cover"
                                                onError={(e) => {
                                                    const target =
                                                        e.target as HTMLImageElement;
                                                    target.src =
                                                        "/shopping-basket.png";
                                                }}
                                            />
                                            <div className="">
                                                <p className="w-[203px] text-[20px] font-medium ml-10 text-black">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-[16px] font-medium mt-2 ml-10 text-gray-600">
                                                    카테고리:{" "}
                                                    {item.product.category
                                                        ?.title || "기타"}
                                                </p>
                                                <p className="text-[16px] font-medium mt-1 ml-10 text-gray-600">
                                                    재고:{" "}
                                                    {
                                                        item.product
                                                            .availableQuantity
                                                    }
                                                    개
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1 ||
                                                        isUpdating
                                                    }
                                                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <span className="text-[18px] font-medium min-w-[40px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        item.product
                                                            .availableQuantity ||
                                                        isUpdating
                                                    }
                                                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2 text-center text-[20px] font-medium text-black">
                                            {formatPrice(
                                                item.product.baseCost *
                                                item.quantity
                                            )}
                                        </td>
                                        <td className="p-2 text-center text-[20px] font-medium text-red-600">
                                            {formatPrice(discount)}
                                        </td>
                                        <td className="p-2 text-center text-[20px] font-medium text-black">
                                            {formatPrice(item.subtotal)}
                                        </td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() =>
                                                    removeItem(item.product._id)
                                                }
                                                disabled={isUpdating}
                                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                            >
                                                {isUpdating
                                                    ? "처리중..."
                                                    : "삭제"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="flex justify-end items-center mt-4 gap-4">
                        <span className="text-[32px] font-medium text-black">
                            총{" "}
                            <span className="font-bold">
                                {selectedProducts.length}
                            </span>{" "}
                            개 주문금액{" "}
                            <span className=" font-bold">
                                {totalAmount.toLocaleString()}{" "}
                            </span>
                            원
                        </span>
                        <Link href={"/classapplication-shoppingbasket"}>
                            <button className="bg-black text-white px-4 py-2 w-[199px] h-[69px] text-[24px] font-extrabold rounded">
                                주문하기
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
};

const CartTable: React.FC = () => {
    return (
        <ProtectedRoute requireAuth={true}>
            <CartTableContent />
        </ProtectedRoute>
    );
};

export default CartTable;
