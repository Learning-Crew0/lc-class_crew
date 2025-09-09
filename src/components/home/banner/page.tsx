"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["/images/Frame 113.png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((src, index) => (
          <div key={index} className="min-w-full h-full relative">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />

            <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
              <div className="flex flex-col text-left text-white max-w-xl ml-auto pr-16">
                <h2 className="md:text-5xl font-normal">LOREM IPSUM DOLOR</h2>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  LOREM IPSUM DOLOR <br /> SIT AMET
                </h1>
                <p className="text-lg md:text-2xl mb-6"></p>

                <button className="w-fit bg-white text-[var(--primary)] px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
                  Explore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition"
        aria-label="Previous slide"
      >
        <Image
          src="/images/left-arroww.png"
          alt="Left"
          width={36}
          height={36}
        />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition"
        aria-label="Next slide"
      >
        <Image
          src="/images/arrow-right.png"
          alt="Right"
          width={36}
          height={36}
        />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
