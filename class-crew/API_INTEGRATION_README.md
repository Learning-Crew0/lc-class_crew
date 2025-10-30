# API Integration Guide

## Overview
This document describes the integration of register and login APIs with the frontend components.

## Backend Requirements
Make sure your backend server is running on `http://localhost:5000` with the following endpoints:

### Register API
- **Endpoint**: `POST /api/users/register`
- **Body**:
```json
{
  "email": "user@example.com",
  "username": "username123",
  "password": "Password123",
  "fullName": "John Doe",
  "gender": "male",
  "memberType": "student",
  "phone": "1234567890",
  "dob": "2000-01-01",
  "agreements": {
    "termsOfService": true,
    "privacyPolicy": true,
    "marketingConsent": false
  }
}
```

### Login API
- **Endpoint**: `POST /api/users/login`
- **Body**:
```json
{
  "emailOrUsername": "user@example.com",
  "password": "Password123"
}
```

## Frontend Components

### Register Component
- **Location**: `src/components/Jointhemember/page.tsx`
- **Features**:
  - Form validation
  - API integration
  - Loading states
  - Error handling
  - Agreement checkboxes

### Login Component
- **Location**: `src/components/login/page.tsx`
- **Features**:
  - Form validation
  - API integration
  - Loading states
  - Error handling
  - Password visibility toggle

## API Utility
- **Location**: `src/utils/api.ts`
- **Functions**:
  - `registerUser()` - Handles user registration
  - `loginUser()` - Handles user login
  - `apiCall()` - Generic API call function

## Authentication Context
- **Location**: `src/contexts/AuthContext.tsx`
- **Features**:
  - Global authentication state
  - Login/logout functions
  - Local storage management
  - Event dispatching for navbar updates
  - SSR-safe localStorage access
- **Setup**: Added to `src/app/layout.tsx` as AuthProvider wrapper

## Environment Variables
```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api
```

## Usage

### Testing Registration
1. Navigate to `/jointhemembership`
2. Fill out the form with valid data
3. Check all required agreements
4. Click "가입하기"

### Testing Login
1. Navigate to `/login`
2. Enter email/username and password
3. Click "로그인"

## Error Handling
Both components include comprehensive error handling for:
- Network errors
- Validation errors
- Server errors
- Missing required fields

## Integration with Navbar
The login state automatically updates the navbar component through:
- Local storage events
- Custom event dispatching
- Real-time state synchronization

## Next Steps
1. Start your backend server
2. Test the registration flow
3. Test the login flow
4. Verify navbar updates correctly
5. Add additional error handling as needed