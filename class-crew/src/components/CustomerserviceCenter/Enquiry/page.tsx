"use client";

import React, { useState } from "react";
import { createEnquiry } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const EnquiryPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        phonePrefix: "010",
        phoneMiddle: "",
        phoneLast: "",
        emailLocal: "",
        emailDomain: "",
        emailDomainSelect: "direct",
        company: "",
        category: "",
        subject: "",
        message: "",
        agreeToTerms: false,
    });
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "file") {
            const files = (e.target as HTMLInputElement).files;
            if (files && files[0]) {
                setFile(files[0]);
                setFileName(files[0].name);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (
            !formData.name ||
            !formData.phoneMiddle ||
            !formData.phoneLast ||
            !formData.emailLocal ||
            !formData.emailDomain ||
            !formData.category ||
            !formData.subject ||
            !formData.message ||
            !formData.agreeToTerms
        ) {
            toast.error("모든 필수 항목을 입력해주세요.");
            return;
        }

        if (formData.message.length < 10) {
            toast.error("문의 내용은 최소 10자 이상 입력해주세요.");
            return;
        }

        if (formData.message.length > 2000) {
            toast.error("문의 내용은 최대 2000자까지 입력 가능합니다.");
            return;
        }

        if (formData.subject.length > 200) {
            toast.error("제목은 최대 200자까지 입력 가능합니다.");
            return;
        }

        // Validate phone number length
        if (
            formData.phoneMiddle.length !== 4 ||
            formData.phoneLast.length !== 4
        ) {
            toast.error("연락처를 올바르게 입력해주세요. (예: 010-1234-5678)");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
            !emailRegex.test(`${formData.emailLocal}@${formData.emailDomain}`)
        ) {
            toast.error("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        setLoading(true);

        try {
            // Combine phone number (remove dashes)
            const fullPhoneNumber = `${formData.phonePrefix}${formData.phoneMiddle}${formData.phoneLast}`;

            // Combine email
            const fullEmail = `${formData.emailLocal}@${formData.emailDomain}`;

            // Map category to English values
            const categoryMap: { [key: string]: string } = {
                일반문의: "General Question",
                기술지원: "Technical Support",
                프로그램문의: "Program Inquiry",
                결제문제: "Payment Issue",
                제휴문의: "Partnership",
                기타: "Other",
            };

            // Create FormData
            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("phone", fullPhoneNumber);
            submitData.append("email", fullEmail);
            submitData.append(
                "category",
                categoryMap[formData.category] || formData.category
            );
            submitData.append("subject", formData.subject);
            submitData.append("message", formData.message);
            submitData.append("agreeToTerms", "true");
            submitData.append("countryCode", "82"); // Default Korean country code

            if (formData.company) {
                submitData.append("company", formData.company);
            }

            if (file) {
                submitData.append("attachment", file);
            }

            console.log("Submitting enquiry form:", {
                name: formData.name,
                phone: fullPhoneNumber,
                email: fullEmail,
                category: categoryMap[formData.category] || formData.category,
                subject: formData.subject,
                message: formData.message,
                company: formData.company,
                file: file?.name,
            });

            const response = await createEnquiry(submitData);

            console.log("Enquiry response:", response);

            if (response.success) {
                toast.success("문의가 성공적으로 제출되었습니다!");
                // Reset form
                setFormData({
                    name: "",
                    phonePrefix: "010",
                    phoneMiddle: "",
                    phoneLast: "",
                    emailLocal: "",
                    emailDomain: "",
                    emailDomainSelect: "direct",
                    company: "",
                    category: "",
                    subject: "",
                    message: "",
                    agreeToTerms: false,
                });
                setFile(null);
                setFileName("");
            } else {
                toast.error(
                    response.message || "문의 제출 중 오류가 발생했습니다."
                );
            }
        } catch (error) {
            console.error("Enquiry submission error:", error);
            toast.error("문의 제출 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Toaster position="top-right" />
            <div className="w-full mx-auto mt-10">
                <div className="bg-[rgba(217,217,217,0.39)] py-3 px-8 text-[18px] font-bold text-black">
                    <span>
                        공개교육 프로그램에 대해 궁금하신 점이 있으신 경우
                        간략한 정보와 함께 문의 내용을 남겨 주시면 상세히 회신
                        드리겠습니다.
                    </span>
                </div>

                <div className=" py-5">
                    <p className="text-right text-[18px] font-bold  text-[rgba(0,0,0,0.72)] mb-4">
                        <span className="text-[rgba(0,0,0,0.72)]">*</span>{" "}
                        항목은 필수 입력 항목입니다.
                    </p>

                    <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
                        <div className="flex items-center">
                            <label className="w-[55px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                성함 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className=" w-[973px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-14 "
                                placeholder=""
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="w-[80px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                연락처 <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2 flex-1">
                                <select
                                    name="phonePrefix"
                                    value={formData.phonePrefix}
                                    onChange={handleChange}
                                    className=" w-[207px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-8 "
                                >
                                    <option value="010">010</option>
                                    <option value="011">011</option>
                                    <option value="016">016</option>
                                </select>
                                <span className="  text-[#D9D9D9] text-[25px] font-extrabold justify-center items-center">
                                    -
                                </span>
                                <input
                                    type="text"
                                    name="phoneMiddle"
                                    value={formData.phoneMiddle}
                                    onChange={handleChange}
                                    className=" w-[354px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 "
                                />
                                <span className="  text-[#D9D9D9] text-[25px] font-extrabold justify-center items-center">
                                    -
                                </span>
                                <input
                                    type="text"
                                    name="phoneLast"
                                    value={formData.phoneLast}
                                    onChange={handleChange}
                                    className=" w-[348px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 "
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[80px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                이메일 <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2 flex-1">
                                <input
                                    type="text"
                                    name="emailLocal"
                                    value={formData.emailLocal}
                                    onChange={handleChange}
                                    className=" w-[266px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-8 "
                                />
                                <span className=" text-[#D9D9D9] text-[18px] font-extrabold justify-center items-center">
                                    @
                                </span>

                                <input
                                    type="text"
                                    name="emailDomain"
                                    value={formData.emailDomain}
                                    onChange={handleChange}
                                    className=" w-[302px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2  "
                                />
                                <select
                                    name="emailDomainSelect"
                                    value={formData.emailDomainSelect}
                                    onChange={handleChange}
                                    className=" w-[357px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-1 "
                                >
                                    <option value="direct">직접입력</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="naver.com">naver.com</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center ">
                            <label className="w-[80px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                회사명
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className=" w-[972px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-8 "
                            />
                        </div>
                        <div className="w-[973px] h-[1px] border-b border-[#D9D9D9] ml-28 mt-8 mb-8"></div>

                        <div className="flex items-center">
                            <label className="w-[96px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                문의 구분{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className=" w-[409px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-4 "
                            >
                                <option value="">선택하세요</option>
                                <option value="일반문의">일반문의</option>
                                <option value="기술지원">기술지원</option>
                                <option value="프로그램문의">
                                    프로그램문의
                                </option>
                                <option value="결제문제">결제문제</option>
                                <option value="제휴문의">제휴문의</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[96px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className=" w-[972px] h-[44px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-4 "
                            />
                        </div>

                        <div className="flex items-start">
                            <label className="w-[96px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                문의 내용{" "}
                                <span className="text-[#FF0000]">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className=" w-[972px] h-[120px] border border-[rgba(84, 76, 76, 0.14)] bg-[#F3F3F3] rounded px-3 py-2 ml-4 "
                                placeholder="문의 내용을 입력해주세요 (최소 10자, 최대 2000자)"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="w-[96px] h-[24px]  text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                첨부파일
                            </label>
                            <div className="flex items-center gap-4 flex-1">
                                <input
                                    type="file"
                                    name="attachment"
                                    onChange={handleChange}
                                    className="hidden"
                                    id="fileUpload"
                                />
                                <label
                                    htmlFor="fileUpload"
                                    className="border text-[18px] font-semibold text-black px-4 py-2 rounded cursor-pointer bg-white ml-4"
                                >
                                    {fileName || "파일선택"}
                                </label>
                                <p className="text-sm text-[rgba(0,0,0,0.72)] text-[18px] font-bold tracking-tighter leading-4">
                                    최대{" "}
                                    <span className="text-[#FF0000]">15MB</span>{" "}
                                    <br />
                                    zip, pdf, hwp, ppt, pptx, doc, docx, xls,
                                    xlsx, jpg, jpeg, png
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-32">
                            <input
                                type="checkbox"
                                id="privacy"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="w-6 h-6 accent-black"
                            />
                            <label
                                htmlFor="privacy"
                                className="text-[18px] font-semibold"
                            >
                                <span className="text-black">
                                    {" "}
                                    개인정보 수집 및 이용{" "}
                                </span>
                                에 동의합니다.
                            </label>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black w-[158px] h-[52px] text-[22px] text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "제출 중..." : "접수하기"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EnquiryPage;
