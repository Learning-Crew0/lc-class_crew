# Quick Start Guide - Updated with Best Practices

## ✅ What's New

### 1. Async Handler Pattern
All controllers now use `asyncHandler` to automatically catch errors:

```javascript
const asyncHandler = require("../utils/asyncHandler.util");

// No more try-catch blocks needed!
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return successResponse(res, user, "User retrieved successfully");
});
```

### 2. API Error Class
Use semantic error methods in services:

```javascript
const ApiError = require("../utils/apiError.util");

// In your services
if (!user) {
  throw ApiError.notFound("User not found");
}

if (!user.isActive) {
  throw ApiError.forbidden("Account is deactivated");
}

if (existingUser) {
  throw ApiError.conflict("Email already registered");
}
```

### 3. Prettier & ESLint Setup
Automatic code formatting and linting:

```bash
# Format all code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your settings
# - MongoDB connection string
# - JWT secrets
# - Port, etc.
```

### 3. Seed Database

```bash
# Create admin user
npm run seed

# Or seed with sample data
npm run seed:all
```

### 4. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📝 Development Workflow

### When Writing New Controllers

```javascript
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");

// Always wrap async functions with asyncHandler
const myController = asyncHandler(async (req, res) => {
  // Your logic here
  const result = await myService.doSomething();
  return successResponse(res, result, "Success message");
});
```

### When Writing Services

```javascript
const ApiError = require("../utils/apiError.util");

const myService = async (id) => {
  const item = await Model.findById(id);
  
  // Use semantic error methods
  if (!item) {
    throw ApiError.notFound("Item not found");
  }
  
  return item;
};
```

### Before Committing

```bash
# Format your code
npm run format

# Check for linting issues
npm run lint:fix

# Run tests
npm test
```

## 🎯 API Error Methods

| Method | Status Code | Use Case |
|--------|-------------|----------|
| `ApiError.badRequest()` | 400 | Invalid input, validation errors |
| `ApiError.unauthorized()` | 401 | Authentication required, invalid credentials |
| `ApiError.forbidden()` | 403 | User doesn't have permission |
| `ApiError.notFound()` | 404 | Resource doesn't exist |
| `ApiError.conflict()` | 409 | Duplicate resource (email, username) |
| `ApiError.internal()` | 500 | Unexpected server errors |

## 📦 Available Scripts

```bash
npm start           # Production mode
npm run dev         # Development mode with nodemon
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run seed        # Create admin user
npm run seed:all    # Create sample data
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
npm run lint        # Lint code with ESLint
npm run lint:fix    # Fix linting issues automatically
```

## 🔧 VS Code Setup (Recommended)

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Install VS Code extensions:
- ESLint
- Prettier - Code formatter

## 📚 API Documentation

- Base URL: `http://localhost:5000/api/v1`
- Health Check: `GET /health`
- Postman Collection: `src/docs/api.postman_collection.json`

### Key Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/admin/login` - Admin login

**Public Routes:**
- `GET /api/v1/public/courses` - List published courses
- `GET /api/v1/public/products` - List published products
- `GET /api/v1/public/faqs` - List FAQs

**User Routes (Authenticated):**
- `GET /api/v1/user/profile` - Get user profile
- `GET /api/v1/user/enrollments` - User's enrollments
- `GET /api/v1/user/cart` - User's shopping cart

**Admin Routes (Admin Only):**
- `GET /api/v1/admin/users` - Manage users
- `POST /api/v1/admin/courses` - Create courses
- `PUT /api/v1/admin/products/:id` - Update products

## 🐛 Error Response Format

All API errors follow this structure:

```json
{
  "success": false,
  "message": "User not found",
  "errors": ["Optional array of validation errors"],
  "stack": "Stack trace (development only)"
}
```

## 🎨 Code Style

- **Double quotes** for strings
- **2 spaces** for indentation
- **Semicolons** required
- **Trailing commas** in ES5
- **80 character** line width

Prettier handles all formatting automatically!

## 🔐 Default Credentials (After Seeding)

**Admin:**
- Email: `admin@lcclasscrew.com`
- Password: `changeme123`

**Test Users:**
- Email: `john.doe@example.com`
- Password: `password123`

⚠️ **Change these in production!**

## 📖 Further Reading

- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Detailed best practices guide
- [README.md](./README.md) - Complete project documentation

## 🆘 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using the port

### Prettier/ESLint Not Working
```bash
# Reinstall dev dependencies
npm install --save-dev prettier eslint eslint-config-prettier eslint-plugin-node
```

### Module Not Found Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

