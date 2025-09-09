// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import Navbar from "@/components/layout/navbar/page";
// import ClassGoal from "./ClassGoal";
// import Curriculum from "./Curriculum";
// import Recommend from "./Recommend";
// import Instructor from "./Instructor";
// import Promotion from "./Promotion";
// import Footer from "@/components/layout/footer/page";
// import Image from "next/image";
// import { FaCaretDown } from "react-icons/fa";

// const tabs = [
//   { id: "class-goal", label: "CLASS GOAL", component: ClassGoal },
//   { id: "curriculum", label: "CURRICULUM", component: Curriculum },
//   { id: "recommend", label: "RECOMMENDED", component: Recommend },
//   { id: "instructor", label: "INSTRUCTOR", component: Instructor },
//   { id: "promotion", label: "PROMOTION", component: Promotion },
// ];

// export default function CourseDetailPage() {
//   const params = useParams();
//   const courseId = params.id;
//   const [activeTab, setActiveTab] = useState("class-goal");

//   const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

//   const navbarHeight = 60;

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setActiveTab(entry.target.id);
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );

//     tabs.forEach((tab) => {
//       const section = sectionRefs.current[tab.id];
//       if (section) observer.observe(section);
//     });

//     return () => observer.disconnect();
//   }, []);

//   const handleTabClick = (id: string) => {
//     setActiveTab(id);
//     sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="min-h-screen w-full mx-auto bg-white">
//       <Navbar />

//       <div
//         className="fixed left-0 w-full bg-white z-40"
//         style={{ top: `${navbarHeight}px`, height: "30px" }}
//       ></div>

//       <div className="flex gap-8 mt-[100px] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         <div className="w-[400px] h-[400px] overflow-hidden rounded-2xl">
//           <Image
//             src="/class-goal/main-image.png"
//             alt="Course Image"
//             width={400}
//             height={400}
//             className="object-cover w-full h-full"
//           />
//         </div>

//         <div className="flex-1 bg-white border border-[#D9D9D9] rounded-2xl p-6 relative">
//           <p className="text-[18px] font-bold text-black">대분류 &gt; 중분류</p>

//           <h2 className="text-[32px] text-black font-bold mt-2 leading-snug">
//             핵심을 짚는 말과 글, 비즈니스 문해력 Level Up
//           </h2>

//           <div className="mt-6 space-y-3 text-sm text-gray-800">
//             <div className="flex gap-10">
//               <span className="w-[80px] font-bold text-black">교육대상</span>
//               <span>
//                 입사 3년차 미만 주니어, 신입사원, 누구나, 교육 대상 <br />은
//                 2줄이 될 수 있음을 감안
//               </span>
//             </div>
//             <div className="flex gap-10">
//               <span className="w-[80px] font-bold text-black">교육시간</span>
//               <span>12시간(1일차 8시간, 2일차 4시간)</span>
//             </div>
//             <div className="flex gap-10">
//               <span className="w-[80px] font-bold text-black">교육비</span>
//               <span>60만원(중식 및 교보재 포함)</span>
//             </div>
//             <div className="flex gap-10">
//               <span className="w-[80px] font-bold text-black">교육장</span>
//               <span>러닝크루 성수 CLASS</span>
//             </div>
//             <div className="flex items-center gap-10">
//               <span className="w-[80px] font-bold text-black">교육일정</span>

//               <div className="relative w-[300px]">
//                 <select className="w-full h-[60px] border border-[#DDDDDD] px-3 py-2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
//                   <option value="">일정 보기 및 선택</option>
//                 </select>
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
//                   <FaCaretDown size={20} />
//                 </span>
//               </div>
//             </div>

//             <div className="border-b border-[#D9D9D9] mt-5" />
//           </div>

//           <div className="flex gap-3 mt-6">
//             <button className="px-4 py-1 text-sm rounded-md font-bold bg-[#E7E7E7] text-black">
//               환급
//             </button>
//             <button className="px-5 py-1 bg-black text-white font-bold rounded-lg">
//               모여듣기
//             </button>
//             <button className="px-5 py-1 bg-black text-white font-bold rounded-lg">
//               얼리버드 할인
//             </button>
//             <button className="px-5 py-1 bg-black text-white font-bold rounded-lg">
//               그룹할인
//             </button>
//           </div>

//           <div className="absolute top-4 right-4 flex gap-3">
//             <button>
//               <Image
//                 src="/class-goal/share.png"
//                 alt="Share"
//                 width={18}
//                 height={18}
//               />
//             </button>
//             <button>
//               <Image
//                 src="/class-goal/download.png"
//                 alt="Download"
//                 width={18}
//                 height={18}
//               />
//             </button>
//             <button>
//               <Image
//                 src="/class-goal/share-outline.png"
//                 alt="Calendar"
//                 width={18}
//                 height={18}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className="bg-white border-b sticky z-50 mt-[30px]"
//         style={{ top: `${navbarHeight + 30}px` }}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <nav className="flex justify-between gap-8 border-gray-300 w-full mt-8">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => handleTabClick(tab.id)}
//                 className={`py-4 px-1 border-b-2 text-[20px] font-bold ${
//                   activeTab === tab.id
//                     ? "border-gray-900 text-gray-800"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8 space-y-20 bg-white">
//         {tabs.map((tab) => {
//           const Component = tab.component;
//           return (
//             <section
//               key={tab.id}
//               id={tab.id}
//               ref={(el) => {
//                 sectionRefs.current[tab.id] = el;
//               }}
//               className="min-h-screen"
//             >
//               <Component />
//             </section>
//           );
//         })}
//       </div>

//       <Footer />
//     </div>
//   );
// }



"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/navbar/page";
import ClassGoal from "./ClassGoal";
import Curriculum from "./Curriculum";
import Recommend from "./Recommend";
import Instructor from "./Instructor";
import Promotion from "./Promotion";
import Footer from "@/components/layout/footer/page";
import Image from "next/image";
import { FaCaretDown } from "react-icons/fa";
import { courses } from "@/data/courses"; // ✅ import dataset

const tabs = [
  { id: "class-goal", label: "CLASS GOAL", component: ClassGoal },
  { id: "curriculum", label: "CURRICULUM", component: Curriculum },
  { id: "recommend", label: "RECOMMENDED", component: Recommend },
  { id: "instructor", label: "INSTRUCTOR", component: Instructor },
  { id: "promotion", label: "PROMOTION", component: Promotion },
];

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  // ✅ find course by ID
  const course = courses.find((c) => c.id === courseId);

  const [activeTab, setActiveTab] = useState("class-goal");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navbarHeight = 60;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    tabs.forEach((tab) => {
      const section = sectionRefs.current[tab.id];
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mx-auto bg-white">
      <Navbar />

      <div
        className="fixed left-0 w-full bg-white z-40"
        style={{ top: `${navbarHeight}px`, height: "30px" }}
      ></div>

      <div className="flex gap-8 mt-[130px] w-[1270px] px-4 sm:px-6 lg:px-8  mx-auto">
        <div className="w-[458px] h-[460px] overflow-hidden rounded-2xl">
          <Image
            src={course.image}   
            alt={course.title}
            width={400}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>

        <div className=" w-[760px] bg-white border border-[#D9D9D9] rounded-2xl p-6 relative">
          <p className="text-[18px] font-bold text-[rgba(0,0,0,0.55)]">{course.category}</p>

          <h2 className="text-[32px] text-black font-bold mt-2 leading-snug">
            {course.title}
          </h2>

          <div className="mt-6 space-y-3 text-[18px] text-rgba(62, 62, 62, 0.72)">
            <div className="flex gap-10">
              <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">교육대상</span>
              <span>{course.description}</span>
            </div>
            <div className="flex gap-10">
              <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">교육시간</span>
              <span>{course.duration}</span>
            </div>
            <div className="flex gap-10">
              <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">교육비</span>
              <span>{course.priceText}</span>
            </div>
            <div className="flex gap-10">
              <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">교육장</span>
              <span>{course.location}</span>
            </div>
            <div className="flex items-center gap-10">
              <span className="w-[80px] font-bold text-[rgba(0,0,0,0.72)]">교육일정</span>
              <div className="relative w-[300px]">
                <select className="w-full h-[60px] border-2 border-[#DDDDDD] px-3 py-2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">{course.date instanceof Date ? course.date.toLocaleDateString() : course.date}</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <FaCaretDown size={20} />
                </span>
              </div>
            </div>
            <div className="border-b border-[#D9D9D9] mt-5" />
          </div>

          <div className="flex gap-3 mt-6">
            {course.tags.map((tag, idx) => (
              <button
                key={idx}
                className="px-5 py-1 bg-black text-white font-bold rounded-lg"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* tabs navigation */}
      <div
        className="bg-white border-b sticky z-50 mt-[30px]"
        style={{ top: `${navbarHeight + 30}px` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between gap-8 border-gray-300 w-full mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-4 px-1 border-b-2 text-[20px] font-bold ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* dynamic sections */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-20 bg-white">
        {tabs.map((tab) => {
          const Component = tab.component;
          return (
            <section
              key={tab.id}
              id={tab.id}
              ref={(el) => {
                sectionRefs.current[tab.id] = el;
              }}
              className="min-h-screen"
            >
              <Component />
            </section>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}
