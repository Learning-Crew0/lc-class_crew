# Best Practices Guide

## Async Handler Pattern

We use the `asyncHandler` utility to wrap all async route handlers, eliminating the need for try-catch blocks in controllers.

### Usage Example

```javascript
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");

// ❌ OLD WAY - Manual try-catch
const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

// ✅ NEW WAY - Using asyncHandler
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return successResponse(res, user);
});
```

## API Error Handling

Use the `ApiError` class for consistent error responses across the application.

### Available Static Methods

```javascript
const ApiError = require("../utils/apiError.util");

// 400 - Bad Request
throw ApiError.badRequest("Invalid input data");
throw ApiError.badRequest("Validation failed", ["Email is required", "Password too short"]);

// 401 - Unauthorized
throw ApiError.unauthorized("Invalid credentials");

// 403 - Forbidden
throw ApiError.forbidden("Access denied");

// 404 - Not Found
throw ApiError.notFound("User not found");

// 409 - Conflict
throw ApiError.conflict("Email already exists");

// 500 - Internal Server Error
throw ApiError.internal("Something went wrong");

// Custom status code
throw new ApiError(422, "Unprocessable entity", errors);
```

### Service Layer Example

```javascript
const ApiError = require("../utils/apiError.util");

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Account is deactivated");
  }

  return user;
};
```

### Controller Example

```javascript
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return successResponse(res, user, "User retrieved successfully");
});
```

## Error Response Format

All errors are automatically formatted by the error middleware:

```json
{
  "success": false,
  "message": "User not found",
  "errors": ["Optional array of detailed errors"],
  "stack": "Only in development mode"
}
```

## Code Formatting with Prettier

### Format All Files

```bash
npm run format
```

### Check Formatting

```bash
npm run format:check
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Migration Guide

### Step 1: Update Service Layer

Replace `throw new Error()` with `ApiError`:

```javascript
// Before
if (!user) {
  throw new Error("User not found");
}

// After
if (!user) {
  throw ApiError.notFound("User not found");
}
```

### Step 2: Update Controllers

Remove try-catch blocks and use asyncHandler:

```javascript
// Before
const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.params.id);
    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

// After
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUser(req.params.id);
  return successResponse(res, user);
});
```

### Step 3: Remove Error Response Helpers

No need for `errorResponse` utility anymore. Just throw ApiError:

```javascript
// Before
try {
  // ...
} catch (error) {
  return errorResponse(res, error.message, 401);
}

// After (errors are automatically handled)
const result = await authService.login(email, password);
return successResponse(res, result);
```

## Benefits

1. **Cleaner Code**: No more try-catch blocks in controllers
2. **Consistent Errors**: All errors follow the same format
3. **Better HTTP Status Codes**: Semantic error status codes
4. **Centralized Handling**: All errors go through one middleware
5. **Development-Friendly**: Stack traces in development mode
6. **Type Safety**: Clear error constructors with autocomplete

## Prettier Configuration

Our Prettier configuration (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## ESLint Configuration

Basic rules in `.eslintrc.json`:
- No console warnings (use logger instead)
- No unused variables
- Prefer const over let
- No var keyword

## VS Code Integration

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

