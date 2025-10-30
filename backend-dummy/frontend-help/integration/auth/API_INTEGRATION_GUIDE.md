# 🔐 Auth Module - API Integration Guide

## Base URL
```
/api/auth
```

## 📋 Overview
Basic authentication endpoints (simpler alternative to /api/users).

## 🎯 API Endpoints

### 1. Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "user123",
  "password": "Password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "username": "user123",
      "fullName": "John Doe"
    },
    "token": "eyJhbGc..."
  }
}
```

### 2. Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGc..."
  }
}
```

## 💻 React Example

```javascript
const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/auth/login', credentials);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

**Note:** For more advanced features (profile management, password reset, admin operations), use the `/api/users` module instead.

**Related Modules:** User

