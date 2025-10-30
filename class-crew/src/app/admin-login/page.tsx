"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { loginAdmin } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        emailOrUsername: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.emailOrUsername || !formData.password) {
            setError("모든 필드를 입력해주세요.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Determine if input is email or username
            const isEmail = formData.emailOrUsername.includes("@");
            const credentials = {
                [isEmail ? "email" : "username"]: formData.emailOrUsername,
                password: formData.password,
            };

            const response = await loginAdmin(credentials);

            if (!response.success) {
                // Handle specific error messages from backend
                const errorMessage = response.message || "로그인에 실패했습니다.";

                if (errorMessage.includes("Invalid credentials")) {
                    setError("아이디 또는 비밀번호가 올바르지 않습니다.");
                } else if (errorMessage.includes("deactivated")) {
                    setError("관리자 계정이 비활성화되었습니다. 다른 관리자에게 문의하세요.");
                } else if (errorMessage.includes("required")) {
                    setError("이메일/아이디와 비밀번호를 모두 입력해주세요.");
                } else {
                    setError(errorMessage);
                }
                setIsLoading(false);
                return;
            }

            if (response.token && response.admin) {
                const adminData = response.admin as {
                    id: string;
                    email: string;
                    username: string;
                    role: string;
                    isActive: boolean;
                };

                // Double-check if admin is active (backend should handle this, but extra safety)
                if (!adminData.isActive) {
                    setError("관리자 계정이 비활성화되었습니다. 다른 관리자에게 문의하세요.");
                    setIsLoading(false);
                    return;
                }

                // Convert admin data to user format for AuthContext
                const userData = {
                    id: adminData.id,
                    email: adminData.email,
                    username: adminData.username,
                    fullName: adminData.username, // Use username as fullName for admin
                    memberType: "admin",
                };

                login(response.token, userData);

                // Success message
                alert("✅ 관리자 로그인이 완료되었습니다!");
                router.push("/admin");
            } else {
                setError("로그인 응답이 올바르지 않습니다. 서버 관리자에게 문의하세요.");
            }
        } catch (error) {
            console.error("Admin login error:", error);
            setError(error instanceof Error ? error.message : "로그인에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="w-full max-w-[1270px] mx-auto mt-20 flex flex-col items-center mb-6">
            <div className="flex justify-center items-center h-[130px]">
                <h1 className="text-[36px] font-extrabold text-[var(--primary)]">
                    관리자 로그인
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="w-[819px] space-y-6 p-10">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
                    <p className="font-semibold">⚠️ 관리자 전용 로그인</p>
                    <p className="text-sm mt-1">
                        이 페이지는 관리자 전용입니다. 일반 사용자는{" "}
                        <Link href="/login" className="underline font-semibold">
                            일반 로그인 페이지
                        </Link>
                        를 이용해주세요.
                    </p>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <div className="bg-blue-50 border border-blue-400 text-blue-800 px-4 py-3 rounded">
                        <p className="font-semibold">🔧 개발 모드 - 기본 관리자 계정</p>
                        <div className="text-sm mt-2 space-y-1">
                            <p><strong>Username:</strong> classcrew_admin</p>
                            <p><strong>Email:</strong> admin@classcrew.com</p>
                            <p><strong>Password:</strong> Admin@123456</p>
                            <p className="text-xs mt-2 text-blue-600">
                                ⚠️ 첫 로그인 후 반드시 비밀번호를 변경하세요!
                            </p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-[18px] font-bold text-black mb-2">
                        관리자 ID 또는 이메일 주소{" "}
                        <span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                        type="text"
                        name="emailOrUsername"
                        value={formData.emailOrUsername}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        placeholder="관리자 ID 또는 이메일을 입력하세요"
                    />
                </div>

                <div>
                    <label className="block text-[18px] font-bold text-black mb-2">
                        비밀번호 <span className="text-[#FF0000]">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            placeholder="비밀번호를 입력하세요"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOffIcon className="w-5 h-5 stroke-2" />
                            ) : (
                                <EyeIcon className="w-5 h-5 stroke-2" />
                            )}
                        </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                        관리자 비밀번호를 입력하십시오.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-3 rounded-full text-[18px] font-bold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "로그인 중..." : "관리자 로그인"}
                </button>

                <div className="flex justify-center gap-4 text-gray-400 text-[18px] font-bold">
                    <Link href="/login" className="hover:text-black">
                        일반 로그인
                    </Link>
                    <span>|</span>
                    <Link href="/" className="hover:text-black">
                        홈으로
                    </Link>
                </div>
            </form>
        </main>
    );
}