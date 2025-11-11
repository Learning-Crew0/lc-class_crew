# ⚠️ Error Handling - Frontend Integration Guide

Complete guide for handling errors and implementing proper error responses in your ClassCrew frontend application.

---

## 📋 Error Response Format

All API errors follow this consistent format:

```javascript
{
  "success": false,
  "message": "Error message here",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "stack": "Error stack trace (development only)"
}
```

---

## 🔢 HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| `200` | Success | Process response |
| `201` | Created | Show success message |
| `400` | Bad Request | Show validation errors |
| `401` | Unauthorized | Redirect to login |
| `403` | Forbidden | Show access denied message |
| `404` | Not Found | Show not found message |
| `409` | Conflict | Show conflict message (duplicate resource) |
| `500` | Server Error | Show generic error message |

---

## 💻 Implementation

### Global Error Handler

```javascript
// src/utils/errorHandler.js

class ErrorHandler {
    /**
     * Handle API errors
     */
    handleError(error) {
        console.error('API Error:', error);

        // Network error
        if (!error.status) {
            return {
                title: '네트워크 오류',
                message: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
            };
        }

        // HTTP errors
        switch (error.status) {
            case 400:
                return {
                    title: '입력 오류',
                    message: this.formatValidationErrors(error.errors) || error.message,
                };

            case 401:
                this.handleUnauthorized();
                return {
                    title: '인증 오류',
                    message: '로그인이 필요합니다.',
                };

            case 403:
                return {
                    title: '권한 없음',
                    message: '이 작업을 수행할 권한이 없습니다.',
                };

            case 404:
                return {
                    title: '찾을 수 없음',
                    message: '요청하신 리소스를 찾을 수 없습니다.',
                };

            case 409:
                return {
                    title: '중복 오류',
                    message: error.message || '이미 존재하는 데이터입니다.',
                };

            case 500:
                return {
                    title: '서버 오류',
                    message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                };

            default:
                return {
                    title: '오류',
                    message: error.message || '알 수 없는 오류가 발생했습니다.',
                };
        }
    }

    /**
     * Format validation errors
     */
    formatValidationErrors(errors) {
        if (!errors || !Array.isArray(errors)) return null;
        if (errors.length === 1) return errors[0];
        return errors.map((err, i) => `${i + 1}. ${err}`).join('\n');
    }

    /**
     * Handle unauthorized (401)
     */
    handleUnauthorized() {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login after a short delay
        setTimeout(() => {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }, 1000);
    }

    /**
     * Show error toast/notification
     */
    showError(error, toastFn) {
        const { title, message } = this.handleError(error);
        
        if (toastFn) {
            toastFn.error(message, { title });
        } else {
            alert(`${title}\n\n${message}`);
        }
    }
}

export default new ErrorHandler();
```

### API Client with Error Handling

```javascript
// src/services/api.client.js (enhanced)

import API_CONFIG from '../config/api.config';
import errorHandler from '../utils/errorHandler';

class ApiClient {
    // ... existing code ...

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
            // Network error (fetch failed)
            if (!error.status) {
                throw {
                    status: null,
                    message: 'Network error',
                    errors: [],
                };
            }

            throw error;
        }
    }
}

export default new ApiClient();
```

### Error Boundary Component

```javascript
// src/components/ErrorBoundary.jsx

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            오류가 발생했습니다
                        </h2>
                        <p className="text-gray-600 mb-4">
                            죄송합니다. 일시적인 오류가 발생했습니다.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                            페이지 새로고침
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
```

### Toast Notification Component

```javascript
// src/components/Toast.jsx

import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts([...toasts, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    };

    const removeToast = (id) => {
        setToasts(toasts.filter((t) => t.id !== id));
    };

    const toast = {
        success: (message) => addToast(message, 'success'),
        error: (message) => addToast(message, 'error'),
        info: (message) => addToast(message, 'info'),
        warning: (message) => addToast(message, 'warning'),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-6 py-3 rounded-lg shadow-lg text-white ${
                            toast.type === 'success'
                                ? 'bg-green-500'
                                : toast.type === 'error'
                                ? 'bg-red-500'
                                : toast.type === 'warning'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                        }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
```

### Usage Example

```javascript
// In any component

import React, { useState } from 'react';
import courseService from '../services/course.service';
import errorHandler from '../utils/errorHandler';
import { useToast } from '../components/Toast';

const ExampleComponent = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await courseService.getCourses();
            // Success
            toast.success('데이터를 불러왔습니다!');
        } catch (error) {
            // Error handling
            errorHandler.showError(error, toast);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={fetchData} disabled={loading}>
            {loading ? '로딩 중...' : '데이터 불러오기'}
        </button>
    );
};
```

---

## ✅ Best Practices

1. **Consistent error format** - Use the same structure everywhere
2. **User-friendly messages** - Translate technical errors to Korean
3. **Loading states** - Show spinners during async operations
4. **Error boundaries** - Catch React errors gracefully
5. **Toast notifications** - Non-intrusive error display
6. **Retry logic** - Allow users to retry failed operations
7. **Logging** - Log errors for debugging (console.error)
8. **Auto-logout on 401** - Clear auth data and redirect

---

## 📝 Common Error Scenarios

### Network Timeout

```javascript
// Set timeout for fetch requests
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
} catch (error) {
    if (error.name === 'AbortError') {
        toast.error('요청 시간이 초과되었습니다.');
    }
}
```

### Validation Errors

```javascript
// Display multiple validation errors
if (error.status === 400 && error.errors) {
    error.errors.forEach((err) => {
        toast.error(err);
    });
}
```

### File Upload Errors

```javascript
try {
    await uploadFile(file);
} catch (error) {
    if (error.message.includes('size')) {
        toast.error('파일 크기는 10MB를 초과할 수 없습니다.');
    } else if (error.message.includes('type')) {
        toast.error('지원하지 않는 파일 형식입니다.');
    } else {
        errorHandler.showError(error, toast);
    }
}
```

---

**End of Frontend Integration Guides**

For additional support, please refer to:
- [Getting Started](./01-getting-started.md)
- [API Documentation](../FRONTEND_INTEGRATION_GUIDE.md)

