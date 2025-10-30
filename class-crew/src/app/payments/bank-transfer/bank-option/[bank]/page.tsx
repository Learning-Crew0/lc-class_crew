"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ConsentModal from "./components/ConsentModel";
import ConsentInfo1 from "./components/ConsentInfo1";
import ConsentInfo2 from "./components/ConsentInfo2";

type BankPageProps = {
    params: Promise<{
        bank: string;
    }>;
};

export default function BankPage({ params }: BankPageProps) {
    const resolvedParams = use(params);
    const bankName = decodeURIComponent(resolvedParams.bank);

    const router = useRouter();

    const [accountNumber, setAccountNumber] = useState("");
    const [consent1, setConsent1] = useState(false);
    const [consent2, setConsent2] = useState(false);
    const [openModal, setOpenModal] = useState<"info1" | "info2" | null>(null);

    const isFormValid = accountNumber && (consent1 || consent2);

    const handleRegister = () => {
        if (isFormValid) {
            router.push(
                `/payments/bank-transfer/bank-option/${encodeURIComponent(
                    bankName
                )}/processing`
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="bg-white w-[1245px] h-[657px] rounded-2xl shadow-2xl p-10">
                {/* Account Number Input Section */}
                <div className="flex items-center justify-between bg-gray-100 mx-10 my-10 px-10 py-10 rounded-md mb-6">
                    <div>
                        <p className="font-semibold text-black text-[21px]">
                            계좌번호(숫자만입력)
                        </p>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) =>
                                setAccountNumber(
                                    e.target.value.replace(/[^0-9]/g, "")
                                )
                            }
                            placeholder="계좌번호 입력"
                            className="mt-3 w-full border rounded-md p-2 text-[20px]"
                        />
                        <p className="text-[#6D6D6D] font-semibold text-[21px] mt-2">
                            가상,적금,펀드 계좌 불가
                        </p>
                    </div>
                    <button className="bg-black text-white px-6 py-2 rounded-md">
                        {bankName}
                    </button>
                </div>

                {/* Agreement Section */}
                <div className="space-y-15 mb-10 mx-20 mt-10">
                    {/* Consent 1 */}
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <input
                                type="radio"
                                checked={consent1}
                                onChange={(e) => {
                                    setConsent1(e.target.checked);
                                    if (e.target.checked) setConsent2(false);
                                }}
                                className="w-5 h-5 border-gray-400"
                            />
                            <span className="text-black text-[24px]">
                                개인정보 수집 및 이용
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpenModal("info1")}
                        >
                            <Image
                                src="/simple-payment/arrow.png"
                                alt="Arrow"
                                width={24}
                                height={24}
                            />
                        </button>
                    </label>

                    {/* Consent 2 */}
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <input
                                type="radio"
                                checked={consent2}
                                onChange={(e) => {
                                    setConsent2(e.target.checked);
                                    if (e.target.checked) setConsent1(false);
                                }}
                                className="w-5 h-5 border-gray-400"
                            />
                            <span className="text-black text-[24px]">
                                개인정보 제3자 제공
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpenModal("info2")}
                        >
                            <Image
                                src="/simple-payment/arrow.png"
                                alt="Arrow"
                                width={24}
                                height={24}
                            />
                        </button>
                    </label>

                    {/* Register Button */}
                    <button
                        onClick={handleRegister}
                        disabled={!isFormValid}
                        className={`w-full py-4 rounded-md font-bold text-[24px] ${
                            isFormValid
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        계좌등록하기
                    </button>
                </div>
            </div>

            {/* Modal Popups */}
            {openModal === "info1" && (
                <ConsentModal
                    title="개인정보 수집·이용 동의 안내"
                    onClose={() => setOpenModal(null)}
                >
                    <ConsentInfo1 />
                </ConsentModal>
            )}
            {openModal === "info2" && (
                <ConsentModal
                    title="개인정보 제3자 제공 동의 안내"
                    onClose={() => setOpenModal(null)}
                >
                    <ConsentInfo2 />
                </ConsentModal>
            )}
        </div>
    );
}
