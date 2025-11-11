# 🔐 Authentication - Frontend Integration Guide

Complete guide for implementing user authentication, password reset, and account recovery in your ClassCrew frontend application.

---

## 📋 Overview

ClassCrew uses JWT (JSON Web Token) authentication with comprehensive account recovery features including SMS-based password reset and ID recovery.

**Token Lifetime:** 7 days  
**Storage:** localStorage (or sessionStorage for temporary sessions)

---

## 🔑 API Endpoints

### User Registration

**Endpoint:** `POST /auth/register`

**Request:**

```javascript
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01012345678",
  "memberType": "individual"
}
```

**cURL Test:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "홍길동",
    "username": "testuser123",
    "email": "test@example.com",
    "password": "password123",
    "phone": "01012345678",
    "memberType": "individual"
  }'
```

**Response:**

```javascript
{
  "success": true,
  "data": {
    "user": {
      "_id": "userId123",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "phone": "01012345678",
      "memberType": "individual",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Login

**Endpoint:** `POST /auth/login`

**Request:**

```javascript
{
  "emailOrUsername": "john@example.com",
  "password": "password123"
}
```

**cURL Test:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser123",
    "password": "password123"
  }'
```

**Response:** Same as registration

### Find User ID

**Endpoint:** `POST /auth/find-id`

**Request:**

```javascript
{
  "name": "홍길동",
  "phoneNumber": "01012345678"
}
```

**cURL Test:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/find-id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "phoneNumber": "01012345678"
  }'
```

**Response:**

```javascript
{
  "success": true,
  "userIds": ["testuser123"],
  "message": "고객님의 정보와 일치하는 아이디 목록입니다"
}
```

### Password Reset - Step 1: Initiate

**Endpoint:** `POST /auth/password-reset/initiate`

**Request:**

```javascript
{
  "name": "홍길동",
  "phoneNumber": "01012345678"
}
```

**cURL Test:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/password-reset/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "phoneNumber": "01012345678"
  }'
```

**Response:**

```javascript
{
  "success": true,
  "message": "인증번호가 발송되었습니다",
  "sessionId": "reset-token-uuid",
  "expiresIn": 900
}
```

### Password Reset - Step 2: Verify Code

**Endpoint:** `POST /auth/password-reset/verify-code`

**Request:**

```javascript
{
  "sessionId": "reset-token-uuid",
  "verificationCode": "123456"
}
```

**cURL Test:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/password-reset/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID_HERE",
    "verificationCode": "123456"
  }'
```

**Response:**

```javascript
{
  "success": true,
  "message": "인증이 완료되었습니다",
  "resetToken": "jwt-reset-token",
  "userId": "user123",
  "username": "testuser123"
}
```

### Password Reset - Step 3: Reset Password

**Endpoint:** `POST /auth/password-reset/reset`

**Request:**

```javascript
{
  "resetToken": "jwt-reset-token",
  "newPassword": "newSecurePassword123"
}
```

**cURL Test:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/password-reset/reset \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken": "YOUR_RESET_TOKEN_HERE",
    "newPassword": "newpassword123"
  }'
```

**Response:**

```javascript
{
  "success": true,
  "message": "비밀번호가 성공적으로 변경되었습니다"
}
```

### Admin Login

**Endpoint:** `POST /admin/login`

**Request:**

```javascript
{
  "email": "classcrew@admin.com",
  "password": "admin123"
}
```

**cURL Test:**

```bash
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "classcrew@admin.com",
    "password": "admin123"
  }'
```

---

## 💻 Frontend Implementation

### Authentication Service

```javascript
// src/services/auth.service.js

import apiClient from "./api.client";

class AuthService {
    /**
     * Register a new user
     */
    async register(userData) {
        try {
            const response = await apiClient.post("/auth/register", userData);
            if (response.success) {
                this.setAuthData(response.data);
            }
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Login user
     */
    async login(emailOrUsername, password) {
        try {
            const response = await apiClient.post("/auth/login", {
                emailOrUsername,
                password,
            });
            if (response.success) {
                this.setAuthData(response.data);
            }
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Admin login
     */
    async adminLogin(email, password) {
        try {
            const response = await apiClient.post("/admin/login", {
                email,
                password,
            });
            if (response.success) {
                this.setAuthData(response.data);
            }
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Find user ID by name and phone
     */
    async findUserId(name, phoneNumber) {
        try {
            const response = await apiClient.post("/auth/find-id", {
                name,
                phoneNumber,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Password reset - Step 1: Initiate
     */
    async initiatePasswordReset(name, phoneNumber) {
        try {
            const response = await apiClient.post(
                "/auth/password-reset/initiate",
                { name, phoneNumber }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Password reset - Step 2: Verify code
     */
    async verifyResetCode(sessionId, verificationCode) {
        try {
            const response = await apiClient.post(
                "/auth/password-reset/verify-code",
                { sessionId, verificationCode }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Password reset - Step 3: Reset password
     */
    async resetPassword(resetToken, newPassword) {
        try {
            const response = await apiClient.post(
                "/auth/password-reset/reset",
                { resetToken, newPassword }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Get auth token
     */
    getToken() {
        return localStorage.getItem("token");
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Check if user is admin
     */
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === "admin";
    }

    /**
     * Set authentication data
     */
    setAuthData({ user, token }) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    }

    /**
     * Handle authentication errors
     */
    handleError(error) {
        if (error.status === 401) {
            this.logout();
        }
        return error;
    }
}

export default new AuthService();
```

---

## 🎨 UI Components

### Find ID Component

```javascript
// src/components/auth/FindIdForm.jsx

import React, { useState } from "react";
import authService from "../../services/auth.service";
import ErrorAlert from "../ErrorAlert";

const FindIdForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
    });
    const [foundIds, setFoundIds] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 7)
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
            7,
            11
        )}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setFormData({ ...formData, phoneNumber: formatted });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authService.findUserId(
                formData.name,
                formData.phoneNumber.replace(/-/g, "")
            );

            if (response.success) {
                setFoundIds(response.userIds);
            }
        } catch (err) {
            setError(err.message || "아이디 찾기에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (foundIds) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    아이디 찾기 결과
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 mb-3">
                        고객님의 정보와 일치하는 아이디입니다:
                    </p>
                    {foundIds.map((id, index) => (
                        <div
                            key={index}
                            className="bg-white p-3 rounded border mb-2"
                        >
                            <p className="font-bold text-lg text-blue-600">
                                {id}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <a
                        href="/login"
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-center"
                    >
                        로그인하기
                    </a>
                    <a
                        href="/password-reset"
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 text-center"
                    >
                        비밀번호 찾기
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">아이디 찾기</h2>

            {error && (
                <ErrorAlert message={error} onClose={() => setError("")} />
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="홍길동"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">
                        전화번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="010-1234-5678"
                        maxLength={13}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "조회 중..." : "아이디 찾기"}
                </button>

                <p className="mt-4 text-center text-gray-600">
                    <a href="/login" className="text-blue-500 hover:underline">
                        로그인으로 돌아가기
                    </a>
                </p>
            </form>
        </div>
    );
};

export default FindIdForm;
```

### Password Reset Component

```javascript
// src/components/auth/PasswordResetForm.jsx

import React, { useState } from "react";
import authService from "../../services/auth.service";
import ErrorAlert from "../ErrorAlert";
import SuccessAlert from "../SuccessAlert";

const PasswordResetForm = () => {
    const [step, setStep] = useState(1); // 1: initiate, 2: verify, 3: reset, 4: success
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [sessionData, setSessionData] = useState({
        sessionId: null,
        resetToken: null,
        username: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

    // Timer for verification code expiration
    React.useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [step, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 7)
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
            7,
            11
        )}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setFormData({ ...formData, phoneNumber: formatted });
    };

    const handleInitiate = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authService.initiatePasswordReset(
                formData.name,
                formData.phoneNumber.replace(/-/g, "")
            );

            if (response.success) {
                setSessionData({
                    ...sessionData,
                    sessionId: response.sessionId,
                });
                setTimeLeft(response.expiresIn);
                setStep(2);
            }
        } catch (err) {
            setError(err.message || "인증번호 발송에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authService.verifyResetCode(
                sessionData.sessionId,
                formData.verificationCode
            );

            if (response.success) {
                setSessionData({
                    ...sessionData,
                    resetToken: response.resetToken,
                    username: response.username,
                });
                setStep(3);
            }
        } catch (err) {
            const msg = err.message || "인증번호 확인에 실패했습니다.";
            const attempts = err.attemptsRemaining;
            setError(attempts ? `${msg} (남은 시도: ${attempts}회)` : msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.resetPassword(
                sessionData.resetToken,
                formData.newPassword
            );

            if (response.success) {
                setStep(4);
                // Auto-redirect after 3 seconds
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
            }
        } catch (err) {
            setError(err.message || "비밀번호 재설정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Initiate
    if (step === 1) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    비밀번호 찾기
                </h2>

                {error && (
                    <ErrorAlert message={error} onClose={() => setError("")} />
                )}

                <form onSubmit={handleInitiate}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="홍길동"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">
                            전화번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handlePhoneChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="010-1234-5678"
                            maxLength={13}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "발송 중..." : "인증번호 발송"}
                    </button>

                    <p className="mt-4 text-center text-gray-600">
                        <a
                            href="/login"
                            className="text-blue-500 hover:underline"
                        >
                            로그인으로 돌아가기
                        </a>
                    </p>
                </form>
            </div>
        );
    }

    // Step 2: Verify Code
    if (step === 2) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    인증번호 확인
                </h2>

                {error && (
                    <ErrorAlert message={error} onClose={() => setError("")} />
                )}

                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                        {formData.phoneNumber}로 인증번호를 발송했습니다.
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                        남은 시간: {formatTime(timeLeft)}
                    </p>
                </div>

                <form onSubmit={handleVerifyCode}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">이름</label>
                        <input
                            type="text"
                            value={formData.name}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                            disabled
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            전화번호
                        </label>
                        <input
                            type="text"
                            value={formData.phoneNumber}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                            disabled
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">
                            인증번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="verificationCode"
                            value={formData.verificationCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                            placeholder="123456"
                            maxLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || timeLeft === 0}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "확인 중..." : "다음"}
                    </button>
                </form>
            </div>
        );
    }

    // Step 3: Reset Password
    if (step === 3) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    새 비밀번호 설정
                </h2>

                {error && (
                    <ErrorAlert message={error} onClose={() => setError("")} />
                )}

                <form onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            사용자 ID
                        </label>
                        <input
                            type="text"
                            value={sessionData.username}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                            disabled
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            새 비밀번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="최소 6자 이상"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">
                            비밀번호 확인{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="비밀번호 재입력"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "변경 중..." : "확인"}
                    </button>
                </form>
            </div>
        );
    }

    // Step 4: Success
    if (step === 4) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-16 w-16 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-green-600">
                        비밀번호 변경 완료
                    </h2>
                    <p className="text-gray-600 mb-6">
                        비밀번호가 성공적으로 변경되었습니다.
                        <br />
                        잠시 후 로그인 페이지로 이동합니다.
                    </p>
                    <a
                        href="/login"
                        className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                    >
                        로그인하기
                    </a>
                </div>
            </div>
        );
    }
};

export default PasswordResetForm;
```

### Registration & Login Forms

```javascript
// src/components/auth/RegisterForm.jsx

import React, { useState } from "react";
import authService from "../../services/auth.service";
import ErrorAlert from "../ErrorAlert";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        memberType: "individual",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const memberTypes = [
        { value: "individual", label: "개인 회원" },
        { value: "corporate_trainer", label: "기업 교육 담당자" },
        { value: "employee", label: "재직자" },
        { value: "job_seeker", label: "구직자" },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (
            !formData.fullName ||
            !formData.username ||
            !formData.email ||
            !formData.password
        ) {
            setError("모든 필수 항목을 입력해주세요.");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return false;
        }

        if (formData.password.length < 6) {
            setError("비밀번호는 최소 6자 이상이어야 합니다.");
            return false;
        }

        const phoneRegex = /^01[0-9]{9}$/;
        if (
            formData.phone &&
            !phoneRegex.test(formData.phone.replace(/-/g, ""))
        ) {
            setError("올바른 전화번호 형식이 아닙니다. (예: 01012345678)");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            registerData.phone = registerData.phone.replace(/-/g, "");

            const response = await authService.register(registerData);

            if (response.success) {
                window.location.href = "/courses";
            }
        } catch (err) {
            setError(err.message || "회원가입 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

            {error && (
                <ErrorAlert message={error} onClose={() => setError("")} />
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="홍길동"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        아이디 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="johndoe"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="example@email.com"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">전화번호</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="01012345678"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        회원 유형 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="memberType"
                        value={formData.memberType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        {memberTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        비밀번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="최소 6자 이상"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">
                        비밀번호 확인 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="비밀번호 재입력"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "처리 중..." : "회원가입"}
                </button>

                <div className="mt-4 text-center space-y-2">
                    <p className="text-gray-600">
                        이미 계정이 있으신가요?{" "}
                        <a
                            href="/login"
                            className="text-blue-500 hover:underline"
                        >
                            로그인
                        </a>
                    </p>
                    <p className="text-gray-600">
                        <a
                            href="/find-id"
                            className="text-blue-500 hover:underline"
                        >
                            아이디 찾기
                        </a>
                        {" | "}
                        <a
                            href="/password-reset"
                            className="text-blue-500 hover:underline"
                        >
                            비밀번호 찾기
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
```

---

## 🛡️ Protected Routes

```javascript
// src/components/auth/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../../services/auth.service";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/courses" replace />;
    }

    return children;
};

export default ProtectedRoute;
```

**Usage:**

```javascript
<Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
<Route path="/admin/*" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
```

---

## ✅ Best Practices

1. **Store tokens securely** - Use httpOnly cookies for production
2. **Handle token expiration** - Implement refresh token logic or redirect to login
3. **Validate inputs** - Client-side validation before API calls
4. **Show loading states** - Provide feedback during authentication
5. **Handle errors gracefully** - Show user-friendly error messages
6. **Phone number formatting** - Auto-format as user types (010-XXXX-XXXX)
7. **Verification code timer** - Show countdown and auto-expire
8. **Rate limiting awareness** - Inform users about attempt limits

---

**Next:** [User Management →](./03-users.md)
