# 📋 Frontend Requirements: Admin Login Implementation

**Complete end-to-end requirements for implementing admin authentication**

---

## 🎯 Overview

This document specifies exactly what the frontend needs to implement for a fully functional admin login system with token storage, state management, and automatic redirect.

---

## 📡 What Backend Provides

### **1. Login Endpoint**

```
POST http://localhost:5000/api/v1/admin/login
Content-Type: application/json

Request Body:
{
  "email": "admin@lcclasscrew.com",
  "password": "changeme123"
}

Success Response (200):
{
  "success": true,
  "message": "관리자 로그인 성공",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzJhOGU3ZjJiOGYyNjM5OGZiNzBhZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMTM0NzE3NSwiZXhwIjoxNzMxOTUxOTc1fQ.WKhLj7xK8pz-8CsFJH0oVUQAm02eOJCvCJ2ZwWDXjaE",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "_id": "6732a8e7f2b8f26398fb70ad",
      "id": "6732a8e7f2b8f26398fb70ad",
      "email": "admin@lcclasscrew.com",
      "username": "admin",
      "fullName": "Admin User",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-11-11T20:52:39.877Z"
    }
  }
}

Error Response (401):
{
  "success": false,
  "message": "관리자 정보가 올바르지 않습니다"
}
```

### **2. Protected Endpoints**

All other admin endpoints require:

```
Authorization: Bearer {token}
```

Example:

```
GET http://localhost:5000/api/v1/admin/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ Frontend Requirements

### **Phase 1: Project Setup**

#### **1.1 Dependencies Required**

```json
{
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.20.0",
        "axios": "^1.6.0"
    }
}
```

#### **1.2 Folder Structure**

---

### **Phase 2: Core Implementation**

#### **2.1 API Client Configuration**

**File:** `src/api/client.js`

**Requirements:**

- ✅ Must use axios
- ✅ Base URL configuration
- ✅ Request interceptor to add token
- ✅ Response interceptor to handle 401 errors
- ✅ Auto-logout on unauthorized

**Expected Behavior:**

1. Automatically add `Authorization` header to all requests
2. Extract `data` from response (axios returns `response.data`)
3. Handle 401 errors → clear storage → redirect to login
4. Handle network errors gracefully

**Implementation:**

```javascript
import axios from "axios";

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response.data, // Extract data
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            window.location.href = "/admin/login";
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default apiClient;
```

---

#### **2.2 Auth Service**

**File:** `src/services/auth.service.js`

**Requirements:**

- ✅ `adminLogin(credentials)` method
- ✅ Store token in localStorage
- ✅ Store admin user data in localStorage
- ✅ `logout()` method to clear storage
- ✅ `getToken()` method
- ✅ `getAdmin()` method
- ✅ `isAuthenticated()` check

**Expected Behavior:**

1. Call login API
2. On success → store token + admin data
3. Return response
4. On error → throw error with message

**Implementation:**

```javascript
import apiClient from "../api/client";

class AuthService {
    async adminLogin(credentials) {
        try {
            // Call backend API
            const response = await apiClient.post("/admin/login", credentials);

            // Response structure: { success: true, data: { token, admin, refreshToken } }
            const { token, admin, refreshToken } = response.data;

            // Store in localStorage
            localStorage.setItem("adminToken", token);
            localStorage.setItem("adminUser", JSON.stringify(admin));
            if (refreshToken) {
                localStorage.setItem("adminRefreshToken", refreshToken);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminRefreshToken");
    }

    getToken() {
        return localStorage.getItem("adminToken");
    }

    getAdmin() {
        const admin = localStorage.getItem("adminUser");
        return admin ? JSON.parse(admin) : null;
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    isAdmin() {
        const admin = this.getAdmin();
        return admin && admin.role === "admin";
    }
}

export default new AuthService();
```

---

#### **2.3 Auth Context**

**File:** `src/contexts/AuthContext.jsx`

**Requirements:**

- ✅ Provide auth state globally
- ✅ `admin` state (current logged-in admin)
- ✅ `loading` state (for initial check)
- ✅ `adminLogin()` function
- ✅ `logout()` function
- ✅ Initialize from localStorage on mount
- ✅ Update state after login

**Expected Behavior:**

1. On mount → check localStorage for existing admin
2. Set loading to false after check
3. Provide login/logout functions
4. Update admin state after successful login

**Implementation:**

```javascript
import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize from localStorage
    useEffect(() => {
        const storedAdmin = authService.getAdmin();
        if (storedAdmin) {
            setAdmin(storedAdmin);
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

    const logout = () => {
        authService.logout();
        setAdmin(null);
    };

    const value = {
        admin,
        loading,
        adminLogin,
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

#### **2.4 Admin Login Page**

**File:** `src/pages/admin/Login.jsx`

**Requirements:**

- ✅ Form with email and password fields
- ✅ Submit handler
- ✅ Call `adminLogin()` from context
- ✅ Show loading state during login
- ✅ Show error message on failure
- ✅ Redirect to `/admin/dashboard` on success
- ✅ Use `navigate()` with `replace: true`

**Expected Behavior:**

1. User enters email & password
2. Click submit → show loading
3. Call adminLogin API
4. On success → redirect to dashboard
5. On error → show error message

**Implementation:**

```javascript
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
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await adminLogin(formData);

            // SUCCESS - Redirect to dashboard
            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "로그인에 실패했습니다");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    관리자 로그인
                </h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            이메일
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
```

---

#### **2.5 Protected Route Component**

**File:** `src/components/admin/ProtectedRoute.jsx`

**Requirements:**

- ✅ Check authentication status
- ✅ Check admin role
- ✅ Show loading state
- ✅ Redirect to login if not authenticated
- ✅ Render children if authenticated

**Expected Behavior:**

1. Check if user is authenticated
2. Check if user is admin
3. If yes → render children
4. If no → redirect to login

**Implementation:**

```javascript
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
```

---

#### **2.6 Admin Dashboard**

**File:** `src/pages/admin/Dashboard.jsx`

**Requirements:**

- ✅ Display admin info
- ✅ Show welcome message
- ✅ Access admin data from context
- ✅ Logout button

**Expected Behavior:**

1. Display logged-in admin's name
2. Show admin email
3. Logout button clears storage and redirects

**Implementation:**

```javascript
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { admin, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">관리자 대시보드</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    로그아웃
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">환영합니다!</h2>
                <p className="text-gray-700">
                    이름: {admin?.fullName || admin?.username}
                </p>
                <p className="text-gray-700">이메일: {admin?.email}</p>
                <p className="text-gray-700">역할: {admin?.role}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
```

---

#### **2.7 App Router Configuration**

**File:** `src/App.jsx`

**Requirements:**

- ✅ Wrap app with AuthProvider
- ✅ Configure routes
- ✅ Public route for login
- ✅ Protected routes for admin pages

**Implementation:**

```javascript
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect root to login */}
                    <Route
                        path="/"
                        element={<Navigate to="/admin/login" replace />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
```

---

### **Phase 3: Testing Requirements**

#### **3.1 Manual Testing Checklist**

**Login Flow:**

- [ ] Enter valid credentials → redirects to dashboard
- [ ] Enter invalid credentials → shows error message
- [ ] Error message clears when typing
- [ ] Loading state shows during login
- [ ] Form is disabled during loading

**Token Storage:**

- [ ] Token is saved in localStorage after login
- [ ] Admin data is saved in localStorage after login
- [ ] Open DevTools → Application → Local Storage → verify keys exist

**Protected Routes:**

- [ ] Cannot access dashboard without login
- [ ] Accessing dashboard URL directly → redirects to login
- [ ] After login → can access dashboard
- [ ] After logout → redirected to login

**State Management:**

- [ ] Admin data is available in context
- [ ] Admin data persists on page refresh
- [ ] Logout clears all data

**API Integration:**

- [ ] Authorization header added automatically to requests
- [ ] 401 errors trigger automatic logout
- [ ] Network errors are handled gracefully

#### **3.2 Browser Console Tests**

**After Login:**

```javascript
// Check localStorage
console.log("Token:", localStorage.getItem("adminToken"));
console.log("Admin:", JSON.parse(localStorage.getItem("adminUser")));

// Should show: Token string and admin object
```

**Test API Call:**

```javascript
// In browser console after login
fetch("http://localhost:5000/api/v1/admin/profile", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
})
    .then((r) => r.json())
    .then((data) => console.log("Profile:", data));

// Should return admin profile
```

---

### **Phase 4: Environment Configuration**

#### **4.1 Environment Variables**

**File:** `.env`

```bash
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENV=development
```

**File:** `.env.production`

```bash
REACT_APP_API_URL=https://api.classcrew.com/api/v1
REACT_APP_ENV=production
```

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER OPENS /admin/login                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AuthProvider checks localStorage                │
│              - No token found                                │
│              - Shows Login Page                              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              USER enters email & password                    │
│              Clicks "로그인"                                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              handleSubmit() called                           │
│              - setLoading(true)                              │
│              - calls adminLogin(credentials)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AuthService.adminLogin()                        │
│              - POST /admin/login                             │
│              - Backend validates credentials                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
            ┌────────────┐   ┌────────────┐
            │  SUCCESS   │   │   ERROR    │
            └──────┬─────┘   └──────┬─────┘
                   │                │
                   ▼                ▼
    ┌────────────────────┐  ┌───────────────┐
    │ Backend returns:   │  │ Show error    │
    │ - token            │  │ message       │
    │ - admin object     │  │ - setError()  │
    │ - refreshToken     │  │ - setLoading  │
    └────────┬───────────┘  │   (false)     │
             │              └───────────────┘
             ▼
┌─────────────────────────────────────────────────────────────┐
│              AuthService stores in localStorage:             │
│              - adminToken                                    │
│              - adminUser (JSON string)                       │
│              - adminRefreshToken                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AuthContext updates state:                      │
│              - setAdmin(admin)                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              navigate('/admin/dashboard', {replace: true})   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              ProtectedRoute checks auth:                     │
│              - isAuthenticated: true ✓                       │
│              - isAdmin: true ✓                               │
│              - Renders Dashboard                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD DISPLAYED                       │
│              - Shows admin.fullName                          │
│              - Shows admin.email                             │
│              - Logout button available                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Debugging Guide

### **Issue 1: Token Not Storing**

**Check:**

```javascript
// After login, run in console:
console.log("Token:", localStorage.getItem("adminToken"));
console.log("Admin:", localStorage.getItem("adminUser"));
```

**Expected:** Both should have values

**If null:** Check if `authService.adminLogin()` is storing correctly

---

### **Issue 2: Not Redirecting**

**Check:**

```javascript
// In login component, add console.log:
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await adminLogin(formData);
        console.log("✅ Login successful, about to redirect");
        navigate("/admin/dashboard", { replace: true });
        console.log("✅ Navigate called");
    } catch (err) {
        console.log("❌ Login failed:", err);
    }
};
```

**Expected:** See both console.logs

---

### **Issue 3: 401 on Protected Routes**

**Check:**

```javascript
// Verify token is being sent:
// In apiClient.js, add console.log:
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    console.log("🔑 Token:", token ? "Exists" : "Missing");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

## ✅ Acceptance Criteria

### **Must Have:**

- ✅ Login form validates email format
- ✅ Shows loading state during API call
- ✅ Displays error messages in Korean
- ✅ Token stored in localStorage after successful login
- ✅ Admin data stored in localStorage
- ✅ Redirects to dashboard after login
- ✅ Protected routes check authentication
- ✅ Logout clears storage and redirects
- ✅ Token added to all API requests automatically
- ✅ 401 errors trigger automatic logout
- ✅ Admin data persists on page refresh

### **Nice to Have:**

- ⭐ Remember me functionality
- ⭐ Session timeout warning
- ⭐ Refresh token implementation
- ⭐ Loading skeleton on dashboard
- ⭐ Animated transitions

---

## 📦 Deliverables

### **Required Files:**

1. ✅ `src/api/client.js` - Axios configuration
2. ✅ `src/services/auth.service.js` - Auth service
3. ✅ `src/contexts/AuthContext.jsx` - Auth context
4. ✅ `src/pages/admin/Login.jsx` - Login page
5. ✅ `src/pages/admin/Dashboard.jsx` - Dashboard
6. ✅ `src/components/admin/ProtectedRoute.jsx` - Route protection
7. ✅ `src/App.jsx` - Router configuration

### **Testing Evidence:**

1. ✅ Screenshot of successful login
2. ✅ Screenshot of localStorage with token
3. ✅ Screenshot of dashboard with admin info
4. ✅ Video of complete login flow
5. ✅ Browser console showing no errors

---

## 🎯 Success Metrics

- ✅ Login success rate: 100% with valid credentials
- ✅ Token storage: 100% reliable
- ✅ Redirect time: < 1 second
- ✅ Page refresh: Admin data persists
- ✅ Protected routes: 100% blocked without auth
- ✅ Error handling: All errors displayed to user

---

## 📞 Backend Contact

**API Endpoint:** `http://localhost:5000/api/v1/admin/login`

**Default Credentials:**

- Email: `admin@lcclasscrew.com`
- Password: `changeme123`

**Support Documents:**

- `ADMIN_ROUTES_COMPLETE.md` - All admin endpoints
- `ADMIN_LOGIN_FIX.md` - Detailed implementation guide
- `frontend-integration-guides/13-admin.md` - Complete admin guide

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-11  
**Status:** ✅ Ready for Implementation
