// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";

// export default function Banner() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const slides = ["/images/Banner 1 1.png","/images/Banner 2 1.png"];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [slides.length]);

//   const goToSlide = (index: number) => {
//     setCurrentSlide(index);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   return (
//     <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
//       <div
//         className="flex h-full transition-transform duration-500 ease-in-out"
//         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//       >
//         {slides.map((src, index) => (
//           <div key={index} className="min-w-full h-full relative">
//             <Image
//               src={src}
//               alt={`Slide ${index + 1}`}
//               fill
//               className="object-cover"
//               priority={index === 0}
//             />

//             {/* <div className="absolute inset-0 bg-black/40 flex justify-center items-center  space-y-5">
//               <div className="flex flex-col text-left text-text  ml-auto pr-80">
//                 <h1 className="  font-bold mb-20">
//                   <span className="text-2xl mb-20">러닝크루</span> <br /> <span> 2025 4분기 </span>
//                   <br /> <span> 신입사원 입문과정 </span>
//                 </h1>

//                 <button className="w-36 h-13  ml-10 text-lg bg-white text-[var(--primary)] px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-300">
//                   Explore
//                 </button>
//               </div>
//             </div> */}
//                 <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-30 mt-16">
//         <div className="text-left">
//           <p className="text-gray-300 text-2xl font-bold ">러닝크루</p>
//           <h2 className="text-white text-5xl font-bold leading-snug mt-6 tracking-wide">
//             2025 4분기 <br />
//             신입사원 입문 과정
//           </h2>
//           <button className="mt-8  px-8 py-3 text-xl bg-white text-black  font-bold rounded-md shadow">
//             Explore
//           </button>
//         </div>
//       </div>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={prevSlide}
//         className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition"
//         aria-label="Previous slide"
//       >
//         <Image
//           src="/images/left-arroww.png"
//           alt="Left"
//           width={36}
//           height={36}
//         />
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition"
//         aria-label="Next slide"
//       >
//         <Image
//           src="/images/arrow-right.png"
//           alt="Right"
//           width={36}
//           height={36}
//         />
//       </button>

//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-3 h-3 rounded-full transition ${
//               currentSlide === index ? "bg-white" : "bg-white/50"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }




"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";

export default function Banner() {
  const slides = [
    {
      src: "/images/Banner 1 1.png",
      content: (
        <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-32 mt-16">
          <div className="text-left">
            <p className="text-[#6d6d6d] text-2xl font-bold">러닝크루</p>
            <h2 className="text-white text-5xl font-bold leading-snug mt-6 tracking-wide">
              2025 4분기 <br />
              신입사원 입문 과정
            </h2>
            <Link href="/class/1">
              <button className="mt-8 px-8 py-3 text-xl bg-white text-black font-bold rounded-md shadow cursor-pointer">
                Explore
              </button>
            </Link>
          </div>
        </div>
      ),
    },
    {
      src: "/images/Banner 2 1.png",
      content: (
        <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-23 mt-6">
          <div className="text-left">
            <p className="text-gray-300 text-2xl font-bold">
              다가오는 가을 대비! <br />{" "}
              <span className="text-[#6d6d6d]">
                날씨는 쌀쌀해지지만 마음은 따듯하게!
              </span>
            </p>
            <h2 className="text-white text-5xl font-bold leading-snug mt-6 tracking-wide">
              힐링&자기계발 과정 <br />
              20% 할인
            </h2>
            <Link href="/class/2">
              <button className="mt-8 px-8 py-3 text-xl bg-white text-black font-bold rounded-md shadow cursor-pointer">
                Explore
              </button>
            </Link>
          </div>
        </div>
      ),
    },
    {
      src: "/images/Banner 3 1.png",
      content: (
        <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-15 mt-6">
          <div className="text-left">
            <p className="text-gray-300 text-5xl font-bold mb-2 leading-16">
              성공하는 하루의 시작 ,<br />{" "}
              <span className="mt-2">리더의 책상 위 달력</span>
            </p>
            <h2 className="text-[#6d6d6d] text-2xl font-semibold leading-snug mt-6 tracking-wide">
              9/15(월)~19(목) 사흘간 <br /> 진행되는 할인혜택을 놓치지 마세요!
            </h2>
            <Link href="/class/3">
              <button className="mt-10 px-5 py-3 text-xl flex bg-white text-black font-bold items-center rounded-md shadow cursor-pointer">
                보러가기 <MdKeyboardArrowRight size={25} />
              </button>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <Image
              src={slide.src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {slide.content}
          </div>
        ))}
      </div>

      {/* Arrows */}
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

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
