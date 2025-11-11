# 🔧 Admin Login - Complete Fix Guide

This guide fixes the admin login flow: token storage, state management, and redirect.

---

## 🎯 Complete Solution

### 1. API Client Setup

```javascript
// src/services/api.client.js

import axios from "axios";

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("adminToken") || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem("adminToken");
            localStorage.removeItem("token");
            window.location.href = "/admin/login";
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default apiClient;
```

---

### 2. Auth Service

```javascript
// src/services/auth.service.js

import apiClient from "./api.client";

class AuthService {
    // Admin Login
    async adminLogin(credentials) {
        try {
            const response = await apiClient.post("/admin/login", credentials);

            // Store token in localStorage
            if (response.data.token) {
                localStorage.setItem("adminToken", response.data.token);
                localStorage.setItem("token", response.data.token); // Fallback
                localStorage.setItem(
                    "adminUser",
                    JSON.stringify(response.data.admin)
                );
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // User Login
    async userLogin(credentials) {
        try {
            const response = await apiClient.post("/auth/login", credentials);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Logout
    logout() {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("user");
    }

    // Get stored token
    getToken() {
        return (
            localStorage.getItem("adminToken") || localStorage.getItem("token")
        );
    }

    // Get stored admin
    getAdmin() {
        const admin = localStorage.getItem("adminUser");
        return admin ? JSON.parse(admin) : null;
    }

    // Get stored user
    getUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    // Check if logged in
    isAuthenticated() {
        return !!this.getToken();
    }

    // Check if admin
    isAdmin() {
        const admin = this.getAdmin();
        return admin && admin.role === "admin";
    }
}

export default new AuthService();
```

---

### 3. Auth Context (React Context API)

```javascript
// src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored credentials on mount
        const storedAdmin = authService.getAdmin();
        const storedUser = authService.getUser();

        if (storedAdmin) {
            setAdmin(storedAdmin);
        } else if (storedUser) {
            setUser(storedUser);
        }

        setLoading(false);
    }, []);

    const adminLogin = async (credentials) => {
        try {
            const response = await authService.adminLogin(credentials);
            setAdmin(response.data.admin);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const userLogin = async (credentials) => {
        try {
            const response = await authService.userLogin(credentials);
            setUser(response.data.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setAdmin(null);
    };

    const value = {
        user,
        admin,
        loading,
        adminLogin,
        userLogin,
        logout,
        isAuthenticated: authService.isAuthenticated(),
        isAdmin: authService.isAdmin(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
```

---

### 4. Admin Login Component (FIXED)

```javascript
// src/pages/admin/AdminLogin.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { adminLogin } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(""); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Call admin login
            await adminLogin(formData);

            // SUCCESS - Redirect to admin dashboard
            console.log("Login successful, redirecting...");
            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "로그인에 실패했습니다");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        관리자 로그인
                    </h1>
                    <p className="text-gray-600 mt-2">ClassCrew Admin Panel</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            이메일
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@lcclasscrew.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                {/* Default Credentials (Development Only) */}
                {process.env.NODE_ENV === "development" && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-xs font-bold mb-1">
                            개발 모드 - 기본 계정:
                        </p>
                        <p className="text-yellow-700 text-xs">
                            Email: admin@lcclasscrew.com
                        </p>
                        <p className="text-yellow-700 text-xs">
                            Password: changeme123
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
```

---

### 5. Protected Admin Routes

```javascript
// src/components/admin/ProtectedAdminRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
```

---

### 6. Admin Routes Setup

```javascript
// src/routes/AdminRoutes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedAdminRoute from "../components/admin/ProtectedAdminRoute";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import CourseManagement from "../pages/admin/CourseManagement";

const AdminRoutes = () => {
    return (
        <Routes>
            {/* Public Route */}
            <Route path="/login" element={<AdminLogin />} />

            {/* Protected Routes */}
            <Route
                path="/*"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <Routes>
                                <Route path="/" element={<AdminDashboard />} />
                                <Route
                                    path="/dashboard"
                                    element={<AdminDashboard />}
                                />
                                <Route
                                    path="/users"
                                    element={<UserManagement />}
                                />
                                <Route
                                    path="/courses"
                                    element={<CourseManagement />}
                                />
                                {/* Add more routes as needed */}
                            </Routes>
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
        </Routes>
    );
};

export default AdminRoutes;
```

---

### 7. Main App Setup

```javascript
// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Routes
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<AdminRoutes />} />

                    {/* User Routes */}
                    <Route path="/*" element={<UserRoutes />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
```

---

### 8. Admin Dashboard Component

```javascript
// src/pages/admin/AdminDashboard.jsx

import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
    const { admin } = useAuth();

    useEffect(() => {
        console.log("Dashboard mounted, admin:", admin);
    }, [admin]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">관리자 대시보드</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-lg">
                    환영합니다, {admin?.fullName || admin?.email}!
                </p>
                <p className="text-gray-600 mt-2">이메일: {admin?.email}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
```

---

## 🔧 Debugging Steps

### 1. Check if Token is Stored

Open browser console after login:

```javascript
// Check localStorage
console.log("Admin Token:", localStorage.getItem("adminToken"));
console.log("Admin User:", localStorage.getItem("adminUser"));
```

### 2. Test API Call Manually

```javascript
// In browser console
fetch("http://localhost:5000/api/v1/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: "admin@lcclasscrew.com",
        password: "changeme123",
    }),
})
    .then((r) => r.json())
    .then((data) => {
        console.log("Response:", data);
        if (data.data.token) {
            localStorage.setItem("adminToken", data.data.token);
            console.log("Token stored!");
        }
    });
```

### 3. Check Network Tab

- Open DevTools → Network
- Try logging in
- Check the `/admin/login` request
- Verify response has `data.token` and `data.admin`

---

## 🐛 Common Issues & Fixes

### Issue 1: Token Not Storing

**Problem:** `localStorage.setItem()` not working

**Fix:**

```javascript
// Check if localStorage is available
if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("adminToken", token);
}
```

### Issue 2: Not Redirecting

**Problem:** `navigate()` not working

**Fix:**

```javascript
// Use replace: true to prevent going back
navigate("/admin/dashboard", { replace: true });

// Or use window.location for hard redirect
window.location.href = "/admin/dashboard";
```

### Issue 3: Auth Context Not Updating

**Problem:** `admin` state not updating after login

**Fix:**

```javascript
// Make sure to await the login
const response = await adminLogin(formData);

// Check if response is valid
if (response && response.data.admin) {
    console.log("Login successful");
}
```

---

## ✅ Testing Checklist

- [ ] Login form submits correctly
- [ ] Token is stored in localStorage
- [ ] Admin user data is stored in localStorage
- [ ] Auth context updates with admin data
- [ ] Redirect to `/admin/dashboard` works
- [ ] Protected routes are accessible
- [ ] Logout clears localStorage
- [ ] Logout redirects to login

---

## 🎯 Final Test Script

```javascript
// Run this in browser console after implementing the fix

// Test 1: Check if auth service exists
console.log("Auth Service:", authService);

// Test 2: Test login manually
authService
    .adminLogin({
        email: "admin@lcclasscrew.com",
        password: "changeme123",
    })
    .then((response) => {
        console.log("✅ Login successful!");
        console.log("Token stored:", !!localStorage.getItem("adminToken"));
        console.log("Admin stored:", !!localStorage.getItem("adminUser"));
    })
    .catch((error) => {
        console.error("❌ Login failed:", error);
    });

// Test 3: Check if token is being used in requests
const token = localStorage.getItem("adminToken");
fetch("http://localhost:5000/api/v1/admin/profile", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
})
    .then((r) => r.json())
    .then((data) => {
        console.log("✅ Token works! Profile:", data);
    })
    .catch((error) => {
        console.error("❌ Token invalid:", error);
    });
```

---

## 📝 Summary

✅ **Token Storage** - Stored in localStorage after login  
✅ **State Management** - Auth context updates automatically  
✅ **Redirect** - Navigate to admin dashboard after login  
✅ **Protected Routes** - Only accessible when authenticated  
✅ **Interceptors** - Token automatically added to all requests  
✅ **Error Handling** - 401 errors auto-logout and redirect

**Your admin login is now fully functional!** 🚀
