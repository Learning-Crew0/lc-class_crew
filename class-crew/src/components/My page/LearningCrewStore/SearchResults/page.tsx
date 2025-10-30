"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar/page";
import { getAllProducts } from "@/utils/api";

interface Product {
  _id: string;
  name: string;
  description?: string;
  category: {
    _id: string;
    title: string;
  } | string;
  baseCost: number;
  discountRate?: number;
  finalPrice?: number;
  availableQuantity: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

const defaultImages = [
  "/class-goal/learningStore/productDetails/search-image1.png",
  "/class-goal/learningStore/productDetails/search-iamge2.png",
  "/class-goal/learningStore/productDetails/search-image3.png",
];

function SearchResultsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || searchParams?.get('query') || "리더십";

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        console.log("Searching products for:", query);

        const response = await getAllProducts({
          search: query,
          isActive: true,
          limit: 20
        });

        console.log("Search response:", response);

        if (response.success && response.products) {
          const productsData = response.products as Product[];
          console.log("Search results:", productsData);
          setProducts(productsData);
          setError(null);
        } else {
          console.log("No search results found");
          setProducts([]);
          setError("검색 결과가 없습니다");
        }
      } catch (err) {
        console.error("Error searching products:", err);
        setError(`검색 실패: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Helper functions
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()}원`;
  };

  const getCategoryTitle = (category: Product['category']): string => {
    if (typeof category === 'object' && category.title) {
      return category.title;
    }
    return typeof category === 'string' ? category : '기타';
  };

  const getProductImage = (product: Product, index: number): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return defaultImages[index % defaultImages.length];
  };
  if (loading) {
    return (
      <div className="max-w-[1270px] mx-auto mt-30 p-4">
        <SearchBar placeholder={query} />
        <div className="text-center py-8 mt-10">
          <p className="text-lg text-gray-600">검색 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1270px] mx-auto mt-30 p-4">
      {/* Search Bar */}
      <SearchBar placeholder={query} />

      {/* Error message */}
      {error && (
        <div className="text-center py-4 mt-6">
          <p className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded">
            {error}
          </p>
        </div>
      )}

      {/* Search Result Count */}
      <p className="mb-4 mt-10 text-black flex text-[24px] font-semibold items-center justify-center">
        <span className="text-blue-600">{query}</span>에 대한 검색 결과 총{" "}
        <span className="text-blue-600">{products.length}</span>개
      </p>

      {/* Product List */}
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold text-black mb-4 ml-6">
          상품 ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">검색 결과가 없습니다</p>
            <p className="text-gray-400">다른 키워드로 검색해보세요</p>
          </div>
        ) : (
          products.map((product, index) => (
            <div
              key={product._id}
              className="flex items-start justify-center rounded p-4 border-b pb-6 mb-10"
            >
              {/* Thumbnail */}
              <div className="relative w-[313px] h-[184px]">
                <Image
                  src={getProductImage(product, index)}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImages[index % defaultImages.length];
                  }}
                />
              </div>

              {/* Text Section */}
              <div className="ml-10 flex-1 leading- space-y-5">
                <p className="text-[22px] text-black font-bold">
                  <span className="text-black">{getCategoryTitle(product.category)}</span> &gt; {product.name}
                </p>

                {product.description && (
                  <p className="text-[16px] text-gray-600">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description
                    }
                  </p>
                )}

                <p className="text-[18px] text-black font-semibold">
                  가격: <span className="text-gray-500">
                    {product.discountRate && product.discountRate > 0 ? (
                      <>
                        <span className="line-through mr-2">{formatPrice(product.baseCost)}</span>
                        <span className="text-red-600">{formatPrice(product.finalPrice || product.baseCost)}</span>
                        <span className="text-red-600 ml-1">({product.discountRate}% 할인)</span>
                      </>
                    ) : (
                      formatPrice(product.finalPrice || product.baseCost)
                    )}
                  </span>
                </p>

                <p className="text-[18px] text-black font-semibold">
                  재고: <span className={`${product.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.availableQuantity > 0 ? `${product.availableQuantity}개 남음` : '품절'}
                  </span>
                </p>

                <p className="text-[16px] text-gray-500">
                  등록일: {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Button */}
              <div className="ml-8 flex items-center">
                <Link href={`/learning-store/product/${product._id}`}>
                  <button className="text-black font-bold text-[24px] border-2 border-black px-5 py-2 rounded hover:bg-black hover:text-white transition">
                    상세보기
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SearchResults() {
  return (
    <Suspense fallback={
      <div className="max-w-[1270px] mx-auto mt-30 p-4">
        <div className="text-center py-8 mt-10">
          <p className="text-lg text-gray-600">검색 페이지를 불러오는 중...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}

export default SearchResults;
