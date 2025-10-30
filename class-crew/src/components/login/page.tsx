"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm: React.FC = () => {
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
            const response = await loginUser(formData);
            console.log("Login response:", response);

            // Handle different response structures from backend
            let token: string;
            let userFromResponse: Record<string, unknown>;

            if (response.success && response.token && response.user) {
                // Admin login structure
                token = response.token;
                userFromResponse = response.user as Record<string, unknown>;
            } else if (response.success && response.data && (response.data as Record<string, unknown>).token && (response.data as Record<string, unknown>).user) {
                // Regular user login structure
                token = (response.data as Record<string, unknown>).token as string;
                userFromResponse = (response.data as Record<string, unknown>).user as Record<string, unknown>;
            } else {
                console.error("Login response missing required fields:", response);
                setError("로그인 응답이 올바르지 않습니다.");
                return;
            }

            const userData = {
                id: (userFromResponse._id || userFromResponse.id) as string,
                email: userFromResponse.email as string,
                username: userFromResponse.username as string,
                fullName: userFromResponse.fullName as string,
                memberType: userFromResponse.memberType as string,
            };

            console.log("User data:", userData);

            login(token, userData);

            // Show success message first
            alert("로그인이 완료되었습니다.");

            // Then redirect to admin page if user is admin, otherwise to home
            setTimeout(() => {
                if (userData.memberType === "admin") {
                    console.log("Redirecting to admin page");
                    router.push("/admin");
                } else {
                    console.log("Redirecting to home page");
                    router.push("/");
                }
            }, 100);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "로그인에 실패했습니다."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="w-full max-w-[1270px] mx-auto mt-20 flex flex-col items-center mb-6">
            <div className="flex justify-center items-center h-[130px]">
                <h1 className="text-[36px] font-extrabold text-[var(--primary)]">
                    로그인
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="w-[819px] space-y-6 p-10">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-[18px] font-bold text-black mb-2">
                        사용자 ID 또는 이메일 주소{" "}
                        <span className="text-[#FF0000]">*</span>
                    </label>
                    <input
                        type="text"
                        name="emailOrUsername"
                        value={formData.emailOrUsername}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
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
                        비밀번호를 입력하십시오.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-3 rounded-full text-[18px] font-bold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "로그인 중..." : "로그인"}
                </button>

                <div className="flex ml-35 gap-74 text-gray-400 text-[18px] font-bold">
                    <Link
                        href="/jointhemembership"
                        className="hover:text-black"
                    >
                        회원가입
                    </Link>
                    <Link href="/changepassword" className="hover:text-black">
                        비밀번호 변경하기
                    </Link>
                </div>
            </form>
        </main>
    );
};

export default LoginForm;
