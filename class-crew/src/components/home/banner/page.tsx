"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import { getActiveBanners } from "@/utils/api";

// ===== INTERFACES =====
interface BannerPeriod {
    start: string;
    end: string;
}

interface BannerItem {
    _id: string;
    imageUrl: string;
    headline: string;
    subText: string;
    mainText: string;
    buttonText: string;
    linkUrl: string;
    order: number;
    isActive: boolean;
    displayPeriod: BannerPeriod;
}

interface SlideItem {
    src: string;
    imageUrl?: string;
    subText?: string;
    headline?: string;
    mainText?: string;
    buttonText?: string;
    linkUrl?: string;
}

// ===== STYLING CONFIGURATION =====
const BANNER_STYLES = {
    // Container styles
    container: "relative w-full h-[80vh] md:h-[560px] overflow-hidden",
    slideContainer: "flex h-full transition-transform duration-700 ease-in-out",
    slide: "min-w-full h-[560px] relative",

    // Content positioning
    contentWrapper: "absolute inset-y-0 right-0 flex items-center justify-center pr-20 md:pr-28 mt-10 md:mt-16",
    textContainer: "text-left mr-32 max-w-2xl",

    // Text styling - EASILY CUSTOMIZABLE
    subText: {
        base: "font-bold mb-4 transition-all duration-300",
        size: "text-xl md:text-[18px]",
        color: "text-[#787878]", // Change this to customize subtext color
        hover: "text-[#787878]" // Optional hover effect
    },

    headline: {
        base: "font-bold leading-tight tracking-wide transition-all duration-300",
        size: "text-3xl md:text-[32px] lg:text-5xl",
        color: "text-white", // Change this to customize headline color
        spacing: "mt-4",
        hover: "hover:text-gray-100" // Optional hover effect
    },

    // mainText: {
    //     base: "font-semibold leading-snug transition-all duration-300",
    //     size: "text-lg md:text-xl lg:text-2xl",
    //     color: "text-gray-200", // Change this to customize main text color
    //     spacing: "mt-2 mb-6",
    //     hover: "hover:text-white" // Optional hover effect
    // },

    // Button styling
    button: {
        base: "inline-flex mt-5 items-center gap-2 font-bold rounded-md shadow-lg transition-all duration-300 transform",
        size: "px-6 md:px-8 py-3 text-lg md:text-xl",
        colors: "bg-white text-black hover:bg-gray-100",
        effects: "hover:scale-105 hover:shadow-xl active:scale-95"
    },

    // Navigation styles
    navButton: "absolute w-[48px] h-[48px] flex items-center justify-center top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 hover:scale-110",
    dots: "absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3",
    dot: "w-3 h-3 rounded-full transition-all duration-300"
};

// ===== COMPONENT =====
export default function Banner() {
    // Default slides with new styling structure
    const defaultSlides: SlideItem[] = [
        {
            src: "/images/Banner 1 1.png",
            subText: "러닝크루",
            headline: "2025 4분기",
            mainText: "신입사원 입문 과정",
            buttonText: "Explore",
            linkUrl: "/class/1"
        },
        {
            src: "/images/Banner 2 1.png",
            subText: "다가오는 가을 대비!",
            headline: "힐링&자기계발 과정",
            mainText: "20% 할인",
            buttonText: "Explore",
            linkUrl: "/class/2"
        },
        {
            src: "/images/Banner 3 1.png",
            subText: "성공하는 하루의 시작",
            headline: "리더의 책상 위 달력",
            mainText: "9/15(월)~19(목) 사흘간 진행되는 할인혜택을 놓치지 마세요!",
            buttonText: "보러가기",
            linkUrl: "/class/3"
        }
    ];

    // State management
    const [slides, setSlides] = useState<SlideItem[]>(defaultSlides);
    const [currentSlide, setCurrentSlide] = useState(0);

    // ===== API INTEGRATION =====
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                console.log("Fetching banners from API...");
                const response = await getActiveBanners();
                console.log("Banner API Response:", response);

                if (response.success) {
                    const bannersData = response.banners || response.data || [];

                    if (Array.isArray(bannersData) && bannersData.length > 0) {
                        const apiSlides: SlideItem[] = bannersData
                            .filter((banner: BannerItem) => banner.isActive)
                            .sort((a: BannerItem, b: BannerItem) => a.order - b.order)
                            .map((banner: BannerItem) => ({
                                src: banner.imageUrl?.trim() || "/images/Banner 1 1.png",
                                imageUrl: banner.imageUrl,
                                subText: banner.subText || "러닝크루",
                                headline: banner.headline || "Course Title",
                                mainText: banner.mainText || "Course Description",
                                buttonText: banner.buttonText || "Explore",
                                linkUrl: banner.linkUrl?.trim() || "/class/1"
                            }));

                        if (apiSlides.length > 0) {
                            console.log("Using API banners:", apiSlides.length);
                            setSlides(apiSlides);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching banners:", err);
                // Keep default slides on error
            }
        };

        fetchBanners();
    }, []);

    // ===== AUTO-SLIDE FUNCTIONALITY =====
    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [slides.length]);

    // ===== NAVIGATION FUNCTIONS =====
    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const nextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % slides.length);

    const goToSlide = (index: number) => setCurrentSlide(index);

    // ===== RENDER BANNER CONTENT =====
    const renderBannerContent = (slide: SlideItem) => (
        <div className={BANNER_STYLES.contentWrapper}>
            <div className={BANNER_STYLES.textContainer}>
                {/* Subtext - Easily customizable */}
                {slide.subText && (
                    <p className={`
                        ${BANNER_STYLES.subText.base}
                        ${BANNER_STYLES.subText.size}
                        ${BANNER_STYLES.subText.color}
                        ${BANNER_STYLES.subText.hover}
                    `}>
                        {slide.subText}
                    </p>
                )}

                {/* Headline - Easily customizable */}
                {slide.headline && (
                    <h2 className={`
                        ${BANNER_STYLES.headline.base}
                        ${BANNER_STYLES.headline.size}
                        ${BANNER_STYLES.headline.color}
                        ${BANNER_STYLES.headline.spacing}
                        ${BANNER_STYLES.headline.hover}
                    `}>
                        {slide.headline}
                    </h2>
                )}

                {/* Button */}
                <Link href={slide.linkUrl || "/class/1"}>
                    <button className={`
                        ${BANNER_STYLES.button.base}
                        ${BANNER_STYLES.button.size}
                        ${BANNER_STYLES.button.colors}
                        ${BANNER_STYLES.button.effects}
                    `}>
                        {slide.buttonText || "Explore"}
                        {slide.buttonText === "보러가기" && <MdKeyboardArrowRight size={25} />}
                    </button>
                </Link>
            </div>
        </div>
    );

    // ===== MAIN RENDER =====
    return (
        <div className={BANNER_STYLES.container}>
            {/* Slides container */}
            <div
                className={BANNER_STYLES.slideContainer}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className={BANNER_STYLES.slide}>
                        <Image
                            src={slide.imageUrl || slide.src}
                            alt={`Banner ${index + 1}: ${slide.headline || 'Slide'}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {renderBannerContent(slide)}
                    </div>
                ))}
            </div>

            {/* Navigation - Previous Button */}
            <button
                onClick={prevSlide}
                className="absolute w-[40px] h-[40px] flex items-center justify-center left-6 top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Previous slide"
            >
                <Image
                    src="/images/left-arroww.png"
                    alt="Previous"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                />
            </button>

            {/* Navigation - Next Button */}
            <button
                onClick={nextSlide}
                className={`${BANNER_STYLES.navButton} right-6`}
                aria-label="Next slide"
            >
                <Image
                    src="/images/arrow-right.png"
                    alt="Next"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                />
            </button>

            {/* Dots Navigation */}
            <div className={BANNER_STYLES.dots}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`
                            ${BANNER_STYLES.dot}
                            ${currentSlide === index ? "bg-white" : "bg-white/40"}
                        `}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
