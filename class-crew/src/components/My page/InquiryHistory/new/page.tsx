"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewInquiryPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Inquiry Submitted:", { title, content });

    router.push("/mypage/inquiryhistory");
  };

  return (
    <div className="w-[800px] mx-auto mt-10">
      <h1 className="text-xl font-bold mb-6">문의 작성하기</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="문의 제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-[200px]"
            placeholder="문의 내용을 입력하세요"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-black text-white text-sm px-4 py-2 rounded-sm"
          >
            제출하기
          </button>
          <button
            type="button"
            onClick={() => router.push("/mypage/inquiryhistory")}
            className="border border-gray-400 text-sm px-4 py-2 rounded"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
