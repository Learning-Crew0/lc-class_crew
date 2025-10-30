"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getAllProductCategories } from "@/utils/api";

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

interface ProductCategory {
  _id: string;
  title: string;
  description?: string;
  isActive: boolean;
}

// Default fallback products for when API fails
const defaultProducts = [
  {
    _id: "1",
    name: "66일 챌린지",
    category: { _id: "cat1", title: "진단도구" },
    baseCost: 100000,
    discountRate: 0,
    finalPrice: 100000,
    availableQuantity: 10,
    images: ["/class-goal/learningStore/image1.png"],
    isActive: true,
    createdAt: new Date().toISOString(),
    isNew: true,
  },
  {
    _id: "2",
    name: "66일 챌린지",
    category: { _id: "cat1", title: "진단도구" },
    baseCost: 150000,
    discountRate: 33,
    finalPrice: 100000,
    availableQuantity: 5,
    images: ["/class-goal/learningStore/image2.png"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "상품명",
    category: { _id: "cat2", title: "문구류" },
    baseCost: 50000,
    discountRate: 0,
    finalPrice: 50000,
    availableQuantity: 20,
    images: ["/class-goal/learningStore/image3.png"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "상품명",
    category: { _id: "cat1", title: "진단도구" },
    baseCost: 80000,
    discountRate: 25,
    finalPrice: 60000,
    availableQuantity: 15,
    images: ["/class-goal/learningStore/image4.png"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching products and categories...");

        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          getAllProducts({ isActive: true, limit: 20 }),
          getAllProductCategories()
        ]);

        console.log("Products response:", productsResponse);
        console.log("Categories response:", categoriesResponse);

        // Handle products
        if (productsResponse.success && productsResponse.products) {
          const productsData = productsResponse.products as Product[];
          console.log("Products data:", productsData);

          if (Array.isArray(productsData) && productsData.length > 0) {
            setProducts(productsData);
            setError(null);
          } else {
            console.log("No products found, using defaults");
            setProducts(defaultProducts);
            setError("No products available from API");
          }
        } else {
          console.log("Products API failed, using defaults");
          setProducts(defaultProducts);
          setError("Failed to load products from API");
        }

        // Handle categories
        if (categoriesResponse.success && categoriesResponse.categories) {
          const categoriesData = categoriesResponse.categories as ProductCategory[];
          console.log("Categories data:", categoriesData);
          setCategories(categoriesData);
        }

      } catch (err) {
        console.error("Error fetching store data:", err);
        setError(`Failed to load store data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setProducts(defaultProducts); // Use defaults on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format price
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()}원`;
  };

  // Helper function to get category title
  const getCategoryTitle = (category: Product['category']): string => {
    if (typeof category === 'object' && category.title) {
      return category.title;
    }
    return typeof category === 'string' ? category : '기타';
  };

  // Helper function to get product image
  const getProductImage = (product: Product, fallbackIndex: number): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return `/class-goal/learningStore/image${(fallbackIndex % 4) + 1}.png`;
  };

  // Helper function to check if product is new (created within last 7 days)
  const isNewProduct = (createdAt: string): boolean => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  if (loading) {
    return (
      <main className="max-w-[1270px] mx-auto mt-30 px-4 mb-10">
        {/* Banner */}
        <div className="relative w-full">
          <Image
            src="/class-goal/learningStore/Rectangle 23864.png"
            alt="Banner"
            width={1270}
            height={200}
            className="w-full"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-[32px] font-bold">Learning-Crew STORE</h1>
            <p className="font-medium text-[25px] mt-2">
              나의 학습과 성장을 위한 특별한 아이템을 만나보세요.
            </p>
          </div>
        </div>

        <div className="text-center py-8 mt-10">
          <p className="text-lg text-gray-600">상품을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1270px] mx-auto mt-30 px-4 mb-10">
      {/* Banner */}
      <div className="relative w-full">
        <Image
          src="/class-goal/learningStore/Rectangle 23864.png"
          alt="Banner"
          width={1270}
          height={200}
          className="w-full"
        />

        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-[32px] font-bold">
            Learning-Crew STORE <br />
          </h1>
          <p className="font-medium text-[25px] mt-2">
            나의 학습과 성장을 위한 특별한 아이템을 만나보세요.
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center py-4 mt-6">
          <p className="text-sm text-yellow-600 bg-yellow-100 px-4 py-2 rounded">
            {error} - 기본 상품을 표시합니다
          </p>
        </div>
      )}

      {/* Data source indicator */}
      <div className="text-center py-2 mt-4">
        <span className={`text-sm px-3 py-1 rounded ${!error ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {!error ? `API에서 ${products.length}개 상품 로드됨` : '기본 상품 표시 중'}
        </span>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        {products.map((product, index) => (
          <Link
            href={`/learning-store/product/${product._id}`}
            key={product._id}
            className="border rounded-lg bg-white shadow hover:shadow-lg transition block overflow-hidden"
          >
            {/* Image */}
            <div className="relative">
              <Image
                src={getProductImage(product, index)}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-60 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/class-goal/learningStore/image${(index % 4) + 1}.png`;
                }}
              />
              {isNewProduct(product.createdAt) && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  NEW
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Category badge */}
              <span className="inline-block bg-black text-white text-xs rounded-lg px-2 py-1 mb-2">
                {getCategoryTitle(product.category)}
              </span>

              {/* Title */}
              <h2 className="font-bold text-[20px] text-[#000000] mb-2">
                {product.name}
              </h2>

              {/* Price logic */}
              {product.discountRate && product.discountRate > 0 ? (
                <>
                  {/* Discounted price */}
                  <p className="text-gray-500 line-through text-[16px]">
                    {formatPrice(product.baseCost)}
                  </p>
                  <p className="text-black font-bold text-[18px] flex items-center gap-1">
                    <span className="text-red-500 mr-1">
                      {product.discountRate}%
                    </span>
                    {formatPrice(product.finalPrice || product.baseCost)}
                  </p>
                </>
              ) : (
                /* Regular price */
                <p className="text-black text-[18px]">
                  {formatPrice(product.finalPrice || product.baseCost)}
                </p>
              )}

              {/* Stock info */}
              <p className="text-sm text-gray-500 mt-1">
                {product.availableQuantity > 0
                  ? `재고 ${product.availableQuantity}개`
                  : '품절'
                }
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default ProductGrid;
