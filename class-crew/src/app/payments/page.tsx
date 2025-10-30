"use client";
import { useState, FormEvent, useEffect, Suspense } from "react";
import { Plus, Minus } from "lucide-react";
import { BiSolidDownload } from "react-icons/bi";
import { FaCaretDown } from "react-icons/fa";
import { X } from "lucide-react";
import Navbar from "@/components/layout/navbar/page";
import { useSearchParams } from "next/navigation";
import { getCourseById, getCourseTrainingSchedules } from "@/utils/api";
import type { Course, TrainingSchedule } from "@/types/course";
import Image from "next/image";

function PaymentContent() {
    const [_file, setFile] = useState<File | null>(null);
    const [taxInvoice, setTaxInvoice] = useState<string>("발행");
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("간편결제");

    // Course data state
    const [course, setCourse] = useState<Course | null>(null);
    const [trainingSchedules, setTrainingSchedules] = useState<
        TrainingSchedule[]
    >([]);
    const [selectedSchedule, setSelectedSchedule] =
        useState<TrainingSchedule | null>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");
    const scheduleId = searchParams.get("scheduleId");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
    };

    // Fetch course data
    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId) return;

            try {
                setLoading(true);

                // Fetch course data
                const courseResponse = await getCourseById(courseId);

                // Fetch training schedules
                const schedulesResponse =
                    await getCourseTrainingSchedules(courseId);

                if (courseResponse.success && courseResponse.course) {
                    setCourse(courseResponse.course as unknown as Course);
                }

                if (schedulesResponse.success && schedulesResponse.data) {
                    const schedulesData = schedulesResponse.data as {
                        trainingSchedules?: TrainingSchedule[];
                    };
                    if (schedulesData.trainingSchedules) {
                        setTrainingSchedules(schedulesData.trainingSchedules);

                        // Find the selected schedule
                        if (scheduleId) {
                            const schedule =
                                schedulesData.trainingSchedules.find(
                                    (s) => s._id === scheduleId
                                );
                            if (schedule) {
                                setSelectedSchedule(schedule);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId, scheduleId]);

    return (
        <>
            <Navbar />
            <main className="w-[1270px] mx-auto mt-24 flex flex-col items-center mb-10">
                <div className="w-full">
                    <div className="mb-6 mt-10">
                        <h2 className="text-[36px] font-extrabold mb-6 text-black">
                            과정정보
                        </h2>
                        <div className="flex items-center gap-4">
                            <button className="text-[22px] font-extrabold text-white bg-black  w-full py-3 rounded-md">
                                PIN커뮤니케이션
                            </button>
                            <button className="text-[22px] font-extrabold text-black bg-[#EEEEEE] w-full py-3 rounded-md">
                                한번에 통하는 비즈니스 커뮤니케이션
                            </button>
                            <button className="text-[22px] font-extrabold text-black bg-[#EEEEEE] w-full py-3 rounded-md">
                                과정명 기입 과정명 기입 과정명 기입
                            </button>
                        </div>
                    </div>

                    <div className="border border-b-0.5 text-[#D9D9D9]"></div>

                    <div className="mt-15 flex gap-6">
                        {/* Left Thumbnail */}
                        <div className="w-[406px] h-[320px] rounded-lg overflow-hidden">
                            <Image
                                src={
                                    course?.mainImage ||
                                    course?.image ||
                                    "/simple-payment/class-application-banner.png"
                                }
                                alt={course?.title || "Course Image"}
                                width={406}
                                height={320}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src =
                                        "/simple-payment/class-application-banner.png";
                                }}
                            />
                        </div>

                        {/* Right Info */}
                        <div className="flex ml-12 flex-col my-auto gap-10 flex-1">
                            {/* 과정명 */}
                            <div className="flex items-center">
                                <label className="w-[80px] text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                    과정명
                                </label>
                                <input
                                    type="text"
                                    value={course?.title || "과정명 자동기입"}
                                    disabled
                                    className="flex-1 h-[50px] w-[547px] px-3  rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px]  font-semibold"
                                />
                            </div>

                            {/* 기간 */}
                            <div className="flex items-center">
                                <label className="w-[80px] text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                    기간
                                </label>
                                <div className="relative w-[333px]">
                                    <select
                                        className="ml-3 w-full h-[44px] border px-3 pr-10 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold appearance-none"
                                        value={selectedSchedule?._id || ""}
                                        onChange={(e) => {
                                            const schedule =
                                                trainingSchedules.find(
                                                    (s) =>
                                                        s._id === e.target.value
                                                );
                                            setSelectedSchedule(
                                                schedule || null
                                            );
                                        }}
                                    >
                                        <option value="">
                                            일정 보기 및 선택
                                        </option>
                                        {trainingSchedules.map((schedule) => (
                                            <option
                                                key={schedule._id}
                                                value={schedule._id}
                                            >
                                                {schedule.scheduleName} -{" "}
                                                {new Date(
                                                    schedule.startDate
                                                ).toLocaleDateString("ko-KR")}
                                            </option>
                                        ))}
                                    </select>
                                    <FaCaretDown
                                        className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[rgba(0,0,0,0.5)]"
                                        size={20}
                                    />
                                </div>
                            </div>

                            {/* 금액 */}
                            <div className="flex items-center">
                                <label className="w-[80px] text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                    금액
                                </label>
                                <div className="flex items-center w-[546px] h-[50px] gap-3 bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold px-8 py-2 rounded-sm">
                                    <span className="text-[#FF0000] text-[20px] font-bold">
                                        10%
                                    </span>
                                    <span className="text-[22px] font-bold text-black">
                                        {course?.priceText ||
                                            `${course?.price?.toLocaleString() || "135,000"}원`}
                                    </span>
                                    <span className="line-through text-[18px] text-[rgba(0,0,0,0.4)]">
                                        150,000원
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-[36px] mt-15 font-extrabold mb-6 text-black">
                        수강생정보
                    </h2>

                    <form className="space-y-12" onSubmit={handleSubmit}>
                        <div className="flex items-center gap-4">
                            <label className="w-[55px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] after:content-['*'] after:text-[#FF0000]">
                                이름
                            </label>
                            <input
                                type="text"
                                placeholder="이재윤"
                                className="ml-24 w-[342px] h-[44px] px-3 border border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-[94px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] after:content-['*'] after:text-[#FF0000]">
                                휴대전화
                            </label>

                            <div className="flex gap-3 flex-1 items-center">
                                {/* First Select */}
                                <div className="relative w-[326px] ml-14">
                                    <select className="w-full h-[44px] border px-3 pr-10 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold appearance-none">
                                        <option>010</option>
                                        <option>011</option>
                                        <option>016</option>
                                    </select>
                                    <FaCaretDown
                                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[rgba(0,0,0,0.5)]"
                                        size={18}
                                    />
                                </div>

                                <span className="text-[20px] font-bold text-[rgba(0,0,0,0.3)]">
                                    -
                                </span>

                                <input
                                    type="text"
                                    className="w-[341px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                    defaultValue="6362"
                                />

                                <span className="text-[20px] font-bold text-[rgba(0,0,0,0.3)]">
                                    -
                                </span>

                                <input
                                    type="text"
                                    className="w-[345px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                    defaultValue="0714"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-[94px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] after:content-['*'] after:text-[#FF0000]">
                                이메일
                            </label>
                            <div className="flex flex-1 gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="cystella"
                                    className="ml-14 w-[345px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                />
                                <span className="m-1 flex items-center text-[18px] font-semibold text-[rgba(0,0,0,0.3)]">
                                    @
                                </span>
                                <input
                                    type="text"
                                    placeholder="example.com"
                                    className="w-[345px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                />
                                <div className="relative w-[333px]">
                                    <select className="ml-3 w-full h-[44px] border px-3 pr-10 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold appearance-none">
                                        <option>직접입력</option>
                                        <option>naver.com</option>
                                        <option>gmail.com</option>
                                    </select>
                                    <FaCaretDown
                                        className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[rgba(0,0,0,0.5)]"
                                        size={20}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-[94px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                소속
                            </label>
                            <input
                                type="text"
                                placeholder="회사명 입력"
                                className="ml-14 w-[1081px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                            />
                        </div>
                        <div className="border border-b-0.5 text-black"></div>

                        <div className="flex items-center gap-4">
                            <label className="w-[94px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                직급
                            </label>
                            <input
                                type="text"
                                placeholder="직급 입력"
                                className="ml-14 w-[1081px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                            />
                        </div>

                        <div className="flex items-start gap-4">
                            <label className="w-[150px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] leading-6">
                                단체신청 양식 <br /> 첨부파일
                            </label>

                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        className="w-[538px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                        onChange={handleFileChange}
                                    />

                                    <button
                                        type="button"
                                        className="w-[152px] h-[44px] border rounded-sm text-[18px] font-semibold text-black"
                                        onClick={() => setFile(null)}
                                    >
                                        파일삭제
                                    </button>

                                    <label className="w-[143px] h-[44px] border rounded-sm text-[18px] font-semibold text-black flex items-center justify-center cursor-pointer">
                                        파일첨부
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        className="w-[208px] h-[44px] border rounded-sm text-[18px] font-semibold text-black flex items-center justify-center cursor-pointer gap-1"
                                    >
                                        단체신청 양식
                                        <BiSolidDownload
                                            size={20}
                                            className="text-black ml-1"
                                        />
                                    </button>
                                </div>

                                <p className="text-[18px] text-[rgba(0,0,0,0.3)]">
                                    *최대 10MB / xls, xlsx
                                </p>
                            </div>
                        </div>

                        <div className="mt-32 ml-24 text-[18px] text-[rgba(0,0,0,0.35)] font-semibold">
                            <ul className="list-disc list-inside space-y-4">
                                <li>
                                    본인 포함 10명까지 개별 등록 가능합니다.
                                    10명 이상은 단체신청 양식을 이용해주세요.
                                </li>
                                <li>
                                    수강생 정보는 계산서, 수료증 발급, 교육이력
                                    조회 등에 이용되니 정확히 입력해주세요.
                                </li>
                                <li>
                                    대리, 단체 신청 시 온라인 신용카드 결제는
                                    불가능하오니 참고 부탁드립니다.
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-center gap-4 pt-6">
                            <button
                                type="button"
                                className="w-[135px] h-[45px] bg-black text-white text-[14px] font-semibold px-2 py-3 rounded-sm flex items-center justify-center gap-1"
                            >
                                수강생 추가
                                <Plus size={16} />
                            </button>

                            <button
                                type="button"
                                className="w-[135px] h-[45px] text-black text-[14px] font-semibold border border-black px-2 py-3 rounded-sm flex items-center justify-center gap-1"
                            >
                                수강생 삭제
                                <Minus size={16} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-full mt-20">
                    {/* Title 2 */}
                    <h2 className="text-[36px] font-extrabold mb-6 text-black">
                        결제정보입력
                    </h2>

                    <div className="w-full mx-auto">
                        <div className="flex items-center py-6">
                            <span className="text-[18px] text-[rgba(0,0,0,0.72)] font-bold">
                                총 결제금액
                            </span>
                            <span className="font-bold text-black ml-14">
                                <span className="text-[32px]">1,440,000</span>{" "}
                                <span className="text-[20px]">원</span>
                            </span>
                        </div>
                        <div className="border border-b-0.5 text-black"></div>

                        {/* 결제방식 선택 */}
                        <div className="flex items-center py-8">
                            <span className="text-[18px] text-[rgba(0,0,0,0.72)] font-bold">
                                결제방식 선택
                            </span>
                            <div className="flex items-center gap-8 ml-32">
                                <label className="flex items-center gap-2 cursor-pointer text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="간편결제"
                                        checked={paymentMethod === "간편결제"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="accent-black w-4 h-4 text-[18px] font-bold"
                                    />
                                    간편결제
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="카드결제"
                                        checked={paymentMethod === "카드결제"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="accent-black w-4 h-4 text-[18px] font-bold"
                                    />
                                    카드결제
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="카드결제"
                                        checked={paymentMethod === "카드결제"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="accent-black w-4 h-4 text-[18px] font-bold"
                                    />
                                    카드결제
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="무통장입금"
                                        checked={paymentMethod === "무통장입금"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="accent-black w-4 h-4 text-[18px] font-bold"
                                    />
                                    카드결제
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="카드현장결제"
                                        checked={
                                            paymentMethod === "카드현장결제"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="accent-black w-4 h-4 text-[18px] font-bold"
                                    />
                                    카드결제
                                </label>
                            </div>
                        </div>
                        <div className=" mx-auto bg-white shadow rounded-lg"></div>
                        <div className="border border-b-0.5 text-black"></div>

                        {/* 세금계산서 발행 여부 */}
                        <div className="flex items-center py-6">
                            <span className="text-[18px] text-[rgba(0,0,0,0.72)] font-bold">
                                세금계산서 발행 여부
                            </span>
                            <div className="flex items-center gap-8 ml-20">
                                <label className="flex items-center gap-2 cursor-pointer text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                    <input
                                        type="radio"
                                        name="tax"
                                        value="발행"
                                        checked={taxInvoice === "발행"}
                                        onChange={(e) =>
                                            setTaxInvoice(e.target.value)
                                        }
                                        className="accent-black w-4 h-4"
                                    />
                                    발행
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-[18px] font-bold text-[rgba(0,0,0,0.72)]">
                                    <input
                                        type="radio"
                                        name="tax"
                                        value="발행하지 않음"
                                        checked={taxInvoice === "발행하지 않음"}
                                        onChange={(e) =>
                                            setTaxInvoice(e.target.value)
                                        }
                                        className="accent-black w-4 h-4"
                                    />
                                    발행하지 않음
                                </label>
                            </div>
                        </div>
                        <div className="border border-b-0.5 text-black"></div>
                    </div>
                </div>

                <div className="w-full mt-20">
                    {/* Title 3 */}
                    <h2 className="text-[36px] font-extrabold mb-6 text-black">
                        계산서 담당자 정보
                    </h2>
                    <form className="space-y-12" onSubmit={handleSubmit}>
                        <div className="flex items-center gap-4">
                            <label className="w-[136px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] after:content-['*'] after:text-[#FF0000]">
                                담당자 성명
                            </label>
                            <input
                                type="text"
                                placeholder="이재윤"
                                className="ml-9 w-[342px] h-[44px] px-3 border border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-[164px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] after:content-['*'] after:text-[#FF0000]">
                                담당자 휴대전화번호
                            </label>
                            <div className="flex gap-2 flex-1 items-center">
                                <div className="relative w-[333px]">
                                    <select className="ml-14 w-[342px] h-[44px] border px-3 pr-10 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold appearance-none">
                                        <option>-선택-</option>
                                        <option>011</option>
                                        <option>016</option>
                                    </select>
                                    <FaCaretDown
                                        className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[rgba(0,0,0,0.5)]"
                                        size={20}
                                    />
                                </div>

                                <span className=" text-[24px] font-semibold text-[rgba(0,0,0,0.3)]">
                                    -
                                </span>

                                <input
                                    type="text"
                                    className="ml-14 w-[345px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                    defaultValue="입력"
                                />

                                <span className="text-[24px] font-semibold text-[rgba(0,0,0,0.3)]">
                                    -
                                </span>

                                <input
                                    type="text"
                                    className="w-[345px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                    defaultValue="입력"
                                />
                            </div>
                        </div>

                        {/* 담당자 이메일 */}
                        <div className="flex items-center gap-4">
                            <label className="w-[122px] h-[24px] text-[18px] font-bold text-[rgba(0,0,0,0.72)] after:content-['*'] after:text-[#FF0000]">
                                담당자 이메일
                            </label>
                            <div className="flex flex-1 gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="cystella"
                                    className="ml-14 w-[345px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                />
                                <span className="m-1 flex items-center text-[18px] font-semibold text-[rgba(0,0,0,0.3)]">
                                    @
                                </span>
                                <input
                                    type="text"
                                    placeholder="example.com"
                                    className="w-[345px] h-[44px] border px-3 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold placeholder-[#0000004D]"
                                />
                                <div className="relative w-[333px]">
                                    <select className="ml-3 w-full h-[44px] border px-3 pr-10 border-[rgba(84,76,76,0.14)] rounded-sm bg-[#F3F3F3] text-[rgba(0,0,0,0.3)] text-[18px] font-semibold appearance-none">
                                        <option>직접입력</option>
                                        <option>naver.com</option>
                                        <option>gmail.com</option>
                                    </select>
                                    <FaCaretDown
                                        className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[rgba(0,0,0,0.5)]"
                                        size={20}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-32 text-[18px] text-[#FF0000] font-semibold">
                            <ul className="list-disc list-inside space-y-3">
                                <li>
                                    세금계산서는 교육 종료일에 일괄 발행됩니다.
                                </li>
                                <li>
                                    선 발행을 원하시는 분은 02-6914-9353으로
                                    연락 부탁드립니다.
                                </li>
                                <li>
                                    세법상 카드 결제와 계산서 발행은 중복할 수
                                    없습니다.
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center space-x-2 text-[18px]">
                            <input
                                type="checkbox"
                                id="example"
                                name="example"
                                className="w-[22px] h-[22px] accent-black"
                            />
                            <label
                                htmlFor="example"
                                className="text-[rgba(0,0,0,0.51)] font-semibold ml-2"
                            >
                                결제정보 및 취소/환불규정을 확인하였으며, 구매에
                                동의합니다.{" "}
                            </label>
                            {/* <button className="text-black font-semibold"    onClick={() => setOpen(true)}>[전문보기]</button> */}
                            <div className="flex flex-col items-start">
                                {/* Trigger button */}
                                <button
                                    onClick={() => setOpen(true)}
                                    className="text-black font-semibold"
                                >
                                    [전문보기]
                                </button>

                                {/* Overlay + Card */}
                                {open && (
                                    <div className="fixed inset-0  bg-black/40 flex items-center justify-center z-50">
                                        <div className="bg-white w-[1245px] h-[540px] rounded-2xl shadow-lg px-20 py-6 mb-20 relative max-h-[90vh] overflow-y-auto">
                                            {/* Close Button */}
                                            <button
                                                onClick={() => setOpen(false)}
                                                className="absolute top-10 right-10 text-black bg-[#D9D9D9] rounded-full hover:text-black p-1"
                                            >
                                                <X size={18} />
                                            </button>

                                            {/* Title */}
                                            <h2 className="text-[32px] font-extrabold text-black mb-8">
                                                취소 및 환불규정
                                            </h2>

                                            {/* Section 1 */}
                                            <div className="mb-6">
                                                <h3 className="text-[20px] font-extrabold mb-2 text-black">
                                                    1. 개강확정
                                                </h3>
                                                <ul className="list-disc list-inside text-[14px] font-semibold text-[rgba(0,0,0,0.45)] space-y-1 ml-6">
                                                    <li>
                                                        교육 시작일 일주일
                                                        전(주말 및 공휴일 제외)
                                                        개강 여부가 확정됩니다.
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 2 */}
                                            <div className="mb-6">
                                                <h3 className="text-[20px] font-extrabold mb-2 text-black">
                                                    2. 교육취소
                                                </h3>
                                                <ul className="list-disc list-inside text-[14px] font-semibold text-[rgba(0,0,0,0.45)] space-y-1 ml-6">
                                                    <li>
                                                        교육 취소는 교육 시작일
                                                        기준으로 하루 전
                                                        18:00까지 가능합니다.
                                                        (월요일 시작일 경우
                                                        금요일 오후 6시까지
                                                        가능)
                                                    </li>
                                                    <li>
                                                        개강확정 이전(교육시작
                                                        8일 전)에는 러닝센터
                                                        마이페이지에서
                                                        교육취소가 가능합니다.
                                                    </li>
                                                    <li className="text-[#FF0000] font-semibold">
                                                        개강확정 이후(교육시작
                                                        7일 전)부터
                                                        유선(02-6914-9353)으로만
                                                        교육취소가 가능합니다.
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Section 3 */}
                                            <div className="mb-8">
                                                <h3 className="text-[20px] font-extrabold mb-2 text-black">
                                                    3. 취소 및 환불규정
                                                </h3>
                                                <ul className="list-disc list-inside text-[14px] font-semibold text-[rgba(0,0,0,0.45)] space-y-1 ml-6">
                                                    <li>
                                                        교육 시작 하루 전
                                                        18:00까지 교육을 취소한
                                                        경우 100% 환불됩니다.
                                                    </li>
                                                    <li className="text-[#FF0000] font-semibold">
                                                        교육 당일 무단으로
                                                        미참여하신 경우 교육비가
                                                        환불되지 않습니다. 만약
                                                        교육비를 사전 입금하지
                                                        않은 경우 교육비 전액이
                                                        청구됩니다.
                                                    </li>
                                                    <li>
                                                        쿠폰으로 교육을 신청했을
                                                        경우 교육당일 일정 변경
                                                        및 취소 시 쿠폰은 사용한
                                                        것으로 간주됩니다. 단,
                                                        교육생 변경은
                                                        가능합니다.
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Confirm Button */}
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                    className="px-8 py-3 w-[94px] h-[45px] bg-black text-white text-[14px] font-semibold rounded-md"
                                                >
                                                    확인
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 pt-6">
                            <button
                                type="submit"
                                className="w-[375px] h-[52px] bg-black text-white text-[14px] font-semibold px-2 py-3 rounded-sm flex items-center justify-center gap-1"
                            >
                                신청
                            </button>

                            <button
                                type="button"
                                className="w-[375px] h-[52px] text-black text-[14px] font-semibold border border-black px-2 py-3 rounded-sm flex items-center justify-center gap-1"
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default function ClassApplication() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-lg text-gray-600">
                            Loading payment page...
                        </p>
                    </div>
                </div>
            }
        >
            <PaymentContent />
        </Suspense>
    );
}
