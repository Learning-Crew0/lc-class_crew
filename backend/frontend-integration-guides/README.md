# 📚 ClassCrew Frontend Integration Guides

Complete API integration documentation for frontend developers.

## 🎯 Overview

This directory contains detailed integration guides for all ClassCrew API endpoints, with code examples, best practices, and real-world implementation patterns.

**Base URL:** `http://localhost:5000/api/v1` (Development)  
**Production:** `https://your-domain.com/api/v1`

---

## 📂 Documentation Structure

### Core Features
- [**Getting Started**](./01-getting-started.md) - Setup, authentication basics, and quick start
- [**Authentication**](./02-authentication.md) - User registration, login, and token management
- [**Users**](./03-users.md) - Profile management and user operations

### Course Management
- [**Courses**](./04-courses.md) - Browse, search, and manage courses
- [**Training Schedules**](./05-training-schedules.md) - Schedule selection and management
- [**Products**](./06-products.md) - Learning store and product catalog

### Purchase Flow
- [**Shopping Cart**](./07-shopping-cart.md) - Cart operations for courses and products
- [**Class Applications**](./08-class-applications.md) - Complete application workflow
- [**Student Enrollments**](./09-student-enrollments.md) - Enrollment tracking and management

### Content & Support
- [**Announcements**](./10-announcements.md) - News and updates
- [**FAQs**](./11-faqs.md) - Frequently asked questions
- [**Course History**](./12-course-history.md) - Personal course history lookup

### Administration
- [**Admin APIs**](./13-admin.md) - Admin dashboard and management
- [**Error Handling**](./14-error-handling.md) - Error handling patterns and best practices

---

## 🚀 Quick Navigation

### For New Developers
1. Start with [Getting Started](./01-getting-started.md)
2. Review [Authentication](./02-authentication.md)
3. Follow [Error Handling](./14-error-handling.md) patterns

### For Feature Implementation
- **User Registration/Login**: [Authentication](./02-authentication.md)
- **Course Browsing**: [Courses](./04-courses.md)
- **Shopping Cart**: [Shopping Cart](./07-shopping-cart.md)
- **Class Application**: [Class Applications](./08-class-applications.md)
- **Admin Panel**: [Admin APIs](./13-admin.md)

---

## 💡 Key Concepts

### Authentication
All authenticated endpoints require a Bearer token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Pagination
Most list endpoints support pagination:
```
?page=1&limit=10
```

### File Uploads
Use `multipart/form-data` with FormData:
```javascript
const formData = new FormData();
formData.append('file', fileObject);
```

---

## 🛠️ Technology Stack

**Backend:** Node.js + Express + MongoDB  
**Authentication:** JWT  
**File Upload:** Multer (10MB limit)  
**Date Format:** ISO 8601

---

## 📊 API Statistics

- **Total Endpoints:** 80+
- **Public Endpoints:** 25+
- **Authenticated Endpoints:** 45+
- **Admin Endpoints:** 15+
- **File Upload Endpoints:** 8+

---

## 📞 Support

For API issues or questions:
- Check the specific guide in this folder
- Review error codes in [Error Handling](./14-error-handling.md)
- Verify your authentication token is valid

---

**Last Updated:** 2025-11-11  
**API Version:** v1.0  
**Total Backend LOC:** ~13,859 lines

