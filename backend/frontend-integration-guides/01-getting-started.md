# 🚀 Getting Started - ClassCrew API Integration

Complete guide to get started with ClassCrew API integration in your frontend application.

---

## 📋 Prerequisites

- Node.js 14+ (for frontend development)
- Basic knowledge of REST APIs
- Understanding of async/await in JavaScript
- Familiarity with fetch API or axios

---

## 🔧 Setup

### 1. API Configuration

Create an API configuration file:

```javascript
// src/config/api.config.js

const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
};

export default API_CONFIG;
```

### 2. Create API Client

```javascript
// src/services/api.client.js

import API_CONFIG from '../config/api.config';

class ApiClient {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getHeaders(isFormData = false) {
        const headers = {};
        
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(options.isFormData),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Request failed',
                    errors: data.errors || [],
                };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET',
        });
    }

    post(endpoint, data, isFormData = false) {
        return this.request(endpoint, {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            isFormData,
        });
    }

    put(endpoint, data, isFormData = false) {
        return this.request(endpoint, {
            method: 'PUT',
            body: isFormData ? data : JSON.stringify(data),
            isFormData,
        });
    }

    patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }
}

export default new ApiClient();
```

### 3. Create Authentication Context

```javascript
// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api.client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user and token from localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (emailOrUsername, password) => {
        try {
            const response = await apiClient.post('/auth/login', {
                emailOrUsername,
                password,
            });

            const { user, token } = response.data;

            // Store in state
            setUser(user);
            setToken(token);

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await apiClient.post('/auth/register', userData);

            const { user, token } = response.data;

            setUser(user);
            setToken(token);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
```

---

## 🎯 Quick Start Example

### Complete Setup in App.js

```javascript
// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
```

### Protected Route Component

```javascript
// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
```

---

## 🧪 Testing Your Setup

### Test API Connection

```javascript
// src/utils/testConnection.js

import apiClient from '../services/api.client';

export const testAPIConnection = async () => {
    try {
        // Try to fetch public courses
        const response = await apiClient.get('/courses', { page: 1, limit: 1 });
        console.log('✅ API Connection successful!');
        console.log('Response:', response);
        return true;
    } catch (error) {
        console.error('❌ API Connection failed:', error);
        return false;
    }
};

// Usage in a component
useEffect(() => {
    testAPIConnection();
}, []);
```

---

## 🎨 UI Component Examples

### Loading Spinner

```javascript
// src/components/LoadingSpinner.jsx

import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );
};

export default LoadingSpinner;
```

### Error Alert

```javascript
// src/components/ErrorAlert.jsx

import React from 'react';

const ErrorAlert = ({ message, onClose }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                    <span className="text-2xl">&times;</span>
                </button>
            )}
        </div>
    );
};

export default ErrorAlert;
```

---

## 📊 Environment Variables

Create a `.env` file in your frontend root:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api/v1

# App Configuration
REACT_APP_NAME=ClassCrew
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
```

---

## ✅ Quick Start Checklist

- [ ] Install dependencies (`npm install` or `yarn install`)
- [ ] Create API configuration file
- [ ] Set up API client with fetch/axios
- [ ] Create authentication context
- [ ] Set up protected routes
- [ ] Configure environment variables
- [ ] Test API connection
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test authentication flow

---

## 🔗 Next Steps

1. **Authentication**: Read [Authentication Guide](./02-authentication.md)
2. **Courses**: Implement course browsing [Courses Guide](./04-courses.md)
3. **Shopping Cart**: Add cart functionality [Cart Guide](./07-shopping-cart.md)
4. **Error Handling**: Review [Error Handling Guide](./14-error-handling.md)

---

## 📝 Common Issues

### CORS Errors
If you encounter CORS errors, ensure the backend has proper CORS configuration:
```javascript
// Backend should have:
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Token Expiration
JWT tokens expire after 7 days. Implement token refresh or redirect to login when expired.

### API Base URL
Make sure to update the API base URL for production deployment.

---

**Next:** [Authentication Integration →](./02-authentication.md)

