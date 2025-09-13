"use client";

import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

type FAQ = {
  id: number;
  question: string;
  answer: React.ReactNode;
  category: string;
};

const faqs: FAQ[] = [
  {
    id: 1,
    question: "공개교육을 신청하려면 회원가입을 해야 하나요?",
    answer: (
      <div className="leading-relaxed space-y-1">
        <div className="mb-2">[회원가입 및 로그인]</div> 
        <div>기존 : 회원가입 절차없이 비회원 수강신청이 가능했습니다.</div>
        <div>변경 : 개인회원가입 후 교육 수강신청이 가능합니다.</div>
        <div>
          ※ 비회원시 교육이력은 홈페이지 하단 ‘비회원 수강이력 조회’에서 확인하실 수 있습니다.
        </div>
      </div>
    ),
    category: "signup/login",
  },
  {
    id: 2,
    question: "회원사인데도 개인계정 가입을 해야 하나요?",
    answer: (
      <div className="leading-relaxed">
        네, 개인 계정으로 별도로 가입해야 합니다.
      </div>
    ),
    category: "signup/login",
  },
  {
    id: 3,
    question: "프로그램 관련 문의는 어디로 해야 하나요?",
    answer: (
      <div className="leading-relaxed">
        프로그램 관련 문의는 고객센터로 문의하시면 됩니다.
      </div>
    ),
    category: "program",
  },
  {
    id: 4,
    question: "결제는 어떤 방법으로 가능한가요?",
    answer: (
      <div className="leading-relaxed">
        신용카드, 계좌이체, 무통장입금이 가능합니다.
      </div>
    ),
    category: "payment",
  },
  {
    id: 5,
    question: "제휴 문의는 어떻게 할 수 있나요?",
    answer: (
      <div className="leading-relaxed">
        제휴 문의는 별도의 제휴 담당자 이메일로 연락 부탁드립니다.
      </div>
    ),
    category: "coalition",
  },
];


const categories = [
  { key: "all", label: "전체" },
  { key: "signup/login", label: "회원가입/로그인" },
  { key: "program", label: "프로그램" },
  { key: "payment", label: "결제" },
  { key: "coalition", label: "제휴" },
];

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="w-[1270px] mx-auto p-6">
      {/* Filters */}
      <div className="flex w-full mb-6 gap-3 mt-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCategory(cat.key);
              setOpenId(null);
            }}
            className={`flex-1 py-3  text-[18px] font-bold transition text-center
              ${
                activeCategory === cat.key
                  ? "bg-black text-white"
                  : "bg-[rgba(0,0,0,0.15)] text-[#525252] hover:bg-gray-200"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="border-b-2 border-[#D9D9D9] mt-10"></div>

      {/* FAQ List */}
      <div className="w-full space-y-4 mt-15">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="border-b border-gray-200 pb-4 ">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex justify-between items-center text-left text-[24px] font-extrabold text-[rgba(0,0,0,0.72)]"
            >
              <span>Q. {faq.question}</span>
                 <FaAngleDown
                className={`transition-transform duration-300 mr-10 ${
                  openId === faq.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Accordion Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openId === faq.id
                  ? "max-h-96 opacity-100 mt-3"
                  : "max-h-0 opacity-0"
              }`}
            >
             <div className="flex items-start gap-2 p-4 bg-gray-50 text-[24px] font-medium ml-16 text-[rgba(0,0,0,0.72)] rounded">
  <span className="text-black">A.</span>
  <div className="whitespace-pre-line">{faq.answer}</div>
</div>

            </div>
          </div>
        ))}
        {filteredFaqs.length === 0 && (
          <p className="text-[rgba(0,0,0,0.72)] text-[24px] font-semibold">
            해당 카테고리에 FAQ가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default FAQPage;
