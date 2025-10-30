"use client";

import Navbar from "@/components/layout/navbar/page";
import { useState } from "react";
import { createCoalitionApplication } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

export default function Coalition() {
    const [fileName, setFileName] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        organization: "",
        field: "",
        phonePrefix: "010", // Default to 010
        phoneMiddle: "",
        phoneLast: "",
        emailLocal: "",
        emailDomain: "",
        emailDomainSelect: "direct", // Default to direct input
        file: null as File | null,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (
            e.target instanceof HTMLInputElement &&
            e.target.type === "file" &&
            (e.target as HTMLInputElement).files
        ) {
            const files = (e.target as HTMLInputElement).files;
            setFormData((prev) => ({
                ...prev,
                [name]: files ? files[0] : null,
            }));
        } else {
            // Handle phone number inputs - only allow numbers
            if (name === "phoneMiddle" || name === "phoneLast") {
                const numericValue = value.replace(/[^0-9]/g, "");
                setFormData((prev) => ({ ...prev, [name]: numericValue }));
            }
            // Handle email domain selection
            else if (name === "emailDomainSelect" && value !== "direct") {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    emailDomain: value,
                }));
            } else {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (
            !formData.name.trim() ||
            !formData.organization.trim() ||
            !formData.field.trim() ||
            !formData.phonePrefix ||
            !formData.phoneMiddle.trim() ||
            !formData.phoneLast.trim() ||
            !formData.emailLocal.trim() ||
            !formData.emailDomain.trim() ||
            !formData.file
        ) {
            console.log("Validation failed - missing fields:", {
                name: !formData.name.trim(),
                organization: !formData.organization.trim(),
                field: !formData.field.trim(),
                phonePrefix: !formData.phonePrefix,
                phoneMiddle: !formData.phoneMiddle.trim(),
                phoneLast: !formData.phoneLast.trim(),
                emailLocal: !formData.emailLocal.trim(),
                emailDomain: !formData.emailDomain.trim(),
                file: !formData.file,
            });
            toast.error("모든 필수 항목을 입력해주세요.");
            return;
        }

        // Validate phone number length and format
        if (
            formData.phoneMiddle.length !== 4 ||
            formData.phoneLast.length !== 4 ||
            !/^\d{4}$/.test(formData.phoneMiddle) ||
            !/^\d{4}$/.test(formData.phoneLast)
        ) {
            toast.error("연락처를 올바르게 입력해주세요. (예: 010-1234-5678)");
            return;
        }

        // Combine phone number and validate total length
        const fullPhoneNumber = `${formData.phonePrefix}${formData.phoneMiddle}${formData.phoneLast}`;
        if (
            fullPhoneNumber.length !== 11 ||
            !/^\d{11}$/.test(fullPhoneNumber)
        ) {
            toast.error("연락처는 11자리 숫자여야 합니다.");
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

        // Combine email
        const fullEmail = `${formData.emailLocal}@${formData.emailDomain}`;

        // Create FormData
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("affiliation", formData.organization); // Backend expects "affiliation"
        submitData.append("field", formData.field);
        submitData.append("contact", fullPhoneNumber);
        submitData.append("email", fullEmail);
        submitData.append("file", formData.file);

        console.log("Form validation passed. Preparing to submit:", {
            name: formData.name,
            affiliation: formData.organization,
            field: formData.field,
            contact: fullPhoneNumber,
            email: fullEmail,
            fileName: formData.file?.name,
            fileSize: formData.file?.size,
            fileType: formData.file?.type,
        });

        try {
            console.log("Submitting coalition form:", {
                name: formData.name,
                organization: formData.organization,
                field: formData.field,
                phone: fullPhoneNumber,
                email: fullEmail,
                file: formData.file?.name,
                fileSize: formData.file?.size,
                fileType: formData.file?.type,
            });

            console.log("FormData contents:");
            for (const [key, value] of submitData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await createCoalitionApplication(submitData);

            console.log("Coalition response:", response);

            if (response.success) {
                toast.success("제출이 완료되었습니다!");
                setFormData({
                    name: "",
                    organization: "",
                    field: "",
                    phonePrefix: "",
                    phoneMiddle: "",
                    phoneLast: "",
                    emailLocal: "",
                    emailDomain: "",
                    emailDomainSelect: "",
                    file: null,
                });
                setFileName("");
            } else {
                console.error("API returned error:", response);
                toast.error(response.message || "제출 중 오류가 발생했습니다.");
            }
        } catch (error: unknown) {
            console.error("Coalition submission error:", error);

            const errorObj = error as Error;
            console.error("Error details:", {
                message: errorObj.message,
                stack: errorObj.stack,
                name: errorObj.name,
            });

            let errorMessage = "제출 중 오류가 발생했습니다.";
            if (errorObj.message?.includes("Failed to fetch")) {
                errorMessage =
                    "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
            } else if (errorObj.message?.includes("CORS")) {
                errorMessage =
                    "CORS 오류가 발생했습니다. 관리자에게 문의해주세요.";
            } else if (errorObj.message?.includes("400")) {
                errorMessage =
                    "입력 데이터에 오류가 있습니다. 모든 필드를 확인해주세요.";
            } else if (errorObj.message?.includes("500")) {
                errorMessage =
                    "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            }

            toast.error(errorMessage);
        }
    };

    return (
        <>
            <Navbar />
            <Toaster position="top-right" />
            <div className="min-h-screen bg-white mt-15">
                <div className="flex justify-center items-center h-[130px] ">
                    <span className=" w-[73px] h-[40px] text-[36px] font-extrabold text-[var(--primary)]">
                        제휴
                    </span>
                </div>

                {/* Header Section */}
                <div
                    className="bg-cover bg-center text-white py-16 px-8 text-start w-full h-[282px]"
                    style={{
                        backgroundImage: "url('/images/coalition-bg-img.png')",
                    }}
                ></div>

                {/* Form Section */}
                <form
                    className="max-w-full  space-y-10 mx-auto p-8 ml-13"
                    onSubmit={handleSubmit}
                >
                    {/* Note */}
                    <p className="text-right text-[18px] font-bold mb-6 mr-10 text-[rgba(0,0,0,0.72)]">
                        * 항목은 필수 입력 항목입니다.
                    </p>

                    {/* Name */}
                    <div className=" flex flex-col md:flex-row md:items-center md:gap-4">
                        <label className="w-[55px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">
                            이름
                            <span className="text-[#FF0000] mr-1">*</span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="이름을 입력하세요"
                            className="border ml-10 w-[409px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                        />
                    </div>

                    {/* Organization */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        <label className="w-[55px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">
                            {" "}
                            소속 <span className="text-[#FF0000] mr-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder="소속 기관을 입력하세요"
                            className="border ml-10 w-[409px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                        />
                    </div>

                    {/* Field */}
                    <div className=" flex flex-col md:flex-row md:items-center md:gap-4">
                        <label className="w-[55px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">
                            분야 <span className="text-[#FF0000] mr-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="field"
                            value={formData.field}
                            onChange={handleChange}
                            placeholder="분야를 입력하세요 (예: 교육, IT, 의료 등)"
                            className="border ml-10 w-[409px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                        />
                    </div>

                    {/* Phone */}
                    <div className=" flex flex-col md:flex-row md:items-center md:gap-4  ">
                        <label className="w-[80px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">
                            연락처{" "}
                            <span className="text-[#FF0000] mr-1">*</span>
                        </label>

                        <div className="flex gap-2 flex-1">
                            <select
                                name="phonePrefix"
                                value={formData.phonePrefix}
                                onChange={handleChange}
                                className="border ml-4 w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                            >
                                <option value="010">010</option>
                                <option value="011">011</option>
                            </select>
                            <span className="flex items-center justify-center font-bold text-[#D9D9D9] w-6">
                                -
                            </span>

                            <input
                                type="text"
                                name="phoneMiddle"
                                value={formData.phoneMiddle}
                                onChange={handleChange}
                                maxLength={4}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                placeholder="1234"
                                className="border  w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                            />
                            <span className="flex items-center justify-center font-bold text-[#D9D9D9] w-6">
                                -
                            </span>
                            <input
                                type="text"
                                name="phoneLast"
                                value={formData.phoneLast}
                                onChange={handleChange}
                                maxLength={4}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                placeholder="5678"
                                className="border  w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                            />
                        </div>
                    </div>

                    <div className="border-b-1 w-[1110] h-[1px] ml-28 border-[#D9D9D9]"></div>

                    {/* Email */}
                    <div className=" flex flex-col md:flex-row md:items-center md:gap-4">
                        <label className="w-[80px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">
                            이메일{" "}
                            <span className="text-[#FF0000] mr-1">*</span>
                        </label>

                        <div className="flex gap-2 flex-1">
                            <input
                                type="text"
                                name="emailLocal"
                                value={formData.emailLocal}
                                onChange={handleChange}
                                placeholder="이메일 주소"
                                className="border ml-4 w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                            />
                            <span className=" flex items-center justify-center text-[#D9D9D9] text-[18px] font-bold p-1">
                                @
                            </span>
                            <input
                                type="text"
                                name="emailDomain"
                                value={formData.emailDomain}
                                onChange={handleChange}
                                placeholder="도메인 (예: gmail.com)"
                                className="border  w-[344px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                            />
                            <select
                                name="emailDomainSelect"
                                value={formData.emailDomainSelect}
                                onChange={handleChange}
                                className="border ml-3  w-[362px] h-[44px] bg-[#F3F3F3] border-[rgba(84, 76, 76, 0.14)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[rgba(84, 76, 76, 0.34)] "
                            >
                                <option value="direct">직접입력</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="naver.com">naver.com</option>
                                <option value="daum.net">daum.net</option>
                                <option value="hanmail.net">hanmail.net</option>
                                <option value="yahoo.com">yahoo.com</option>
                            </select>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className=" flex md:flex-row md:items-start md:gap-4">
                        <label className="w-[176px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] flex items-center">
                            프로필 및 참고자료{" "}
                            <span className="text-[#FF0000] mr-1">*</span>
                        </label>

                        <div className="flex-1 flex items-center gap-4">
                            <label className="w-[134px] h-[44px] border border-black rounded px-3 py-2 flex items-center justify-center cursor-pointer bg-white hover:bg-gray-100">
                                <span className="text-black font-semibold text-[18px]">
                                    {fileName || "파일선택"}
                                </span>
                                <input
                                    type="file"
                                    name="file"
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFileName(
                                            e.target.files?.[0]?.name || ""
                                        );
                                    }}
                                    className="hidden"
                                />
                            </label>

                            <p className="text-[18px] text-[rgba(0,0,0,0.72)] font-bold tracking-tight leading-4.5">
                                최대{" "}
                                <span className="text-red-600 font-bold">
                                    15MB
                                </span>{" "}
                                <br />
                                zip, pdf, hwp, ppt, pptx, doc, docx, xls, xlsx,
                                jpg, jpeg, png
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
                    >
                        제출
                    </button>
                </form>
            </div>
        </>
    );
}
