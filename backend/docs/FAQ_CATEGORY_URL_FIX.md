# FAQ Category URL Route Fix

## Problem

The route `/faqs/category/:categoryKey` doesn't work when the `categoryKey` contains a forward slash (`/`), such as `signup/login`.

**Error:**
```
Cannot GET /api/v1/faqs/category/signup/login
```

## Root Cause

Express.js interprets the `/` in `signup/login` as a path separator, not as part of the parameter value. The route pattern `/faqs/category/:categoryKey` expects `:categoryKey` to be a single path segment without slashes.

## Solutions

### ✅ Solution 1: Use Query Parameters (RECOMMENDED)

**Instead of:**
```
GET /api/v1/faqs/category/signup/login
```

**Use:**
```
GET /api/v1/faqs?category=signup/login
```

This already works and is the recommended approach!

**Benefits:**
- Works with any category key format
- No URL encoding needed
- Already implemented and tested
- More flexible for filtering

### ✅ Solution 2: Change Category Keys (RECOMMENDED for URL routing)

Update FAQ category keys to not use slashes:

**Old Format:**
- `signup/login`
- `other/category`

**New Format:**
- `signup-login`
- `other-category`

**Migration Steps:**

1. Update Category Keys:
```javascript
// In your FAQ management UI or via API:
PUT /api/v1/faqs/categories/:id
{
  "key": "signup-login",
  "label": "Signup/Login"
}
```

2. Update Existing FAQs:
```javascript
// Update all FAQs to reference new category key
PUT /api/v1/faqs/:id
{
  "category": "signup-login",
  ...
}
```

3. Update Frontend:
```typescript
// Update your frontend category list
const categories = [
  { key: "all", label: "전체" },
  { key: "signup-login", label: "회원가입/로그인" },  // Changed
  { key: "program", label: "프로그램" },
  { key: "payment", label: "결제" },
  { key: "coalition", label: "제휴" },
];
```

Then the route will work:
```
GET /api/v1/faqs/category/signup-login ✅
```

### ⚠️ Solution 3: URL Encoding (NOT RECOMMENDED)

You can URL-encode the slash, but this is less user-friendly:

```
GET /api/v1/faqs/category/signup%2Flogin
```

This works but creates ugly URLs.

## Recommended Implementation

**For New Projects:**
- Use category keys without slashes (e.g., `signup-login`)
- Implement both query parameter and URL path routes for flexibility

**For Existing Projects:**
- Migrate to query parameter approach: `/faqs?category=signup/login`
- This requires no changes to existing category keys

## Updated Route Documentation

### Get FAQs by Category

**Option 1: Query Parameter (Preferred)**
```http
GET /api/v1/faqs?category=signup/login&page=1&limit=20
```

**Option 2: URL Path (Requires dash-separated keys)**
```http
GET /api/v1/faqs/category/signup-login?page=1&limit=20
```

Both return the same response:
```json
{
  "status": "success",
  "data": {
    "faqs": [...],
    "categoryInfo": {
      "key": "signup-login",
      "label": "Signup/Login"
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalFAQs": 5,
      "limit": 20
    }
  }
}
```

## Implementation Status

- ✅ Query parameter route: **Working**
- ✅ URL path route order: **Fixed**
- ⚠️ Category key format: **Needs migration**

## Next Steps

1. **For Local Development:**
   - Use query parameter approach: `/faqs?category=signup/login`
   - OR update category keys to use dashes

2. **For Production (Render):**
   - Deploy the updated `faq.routes.js` with corrected route order
   - Decide on category key format
   - Migrate existing data if needed

## Testing

```bash
# Test query parameter approach (works with any key format)
curl "http://localhost:5000/api/v1/faqs?category=signup/login"

# Test URL path approach (requires dash-separated keys)
curl "http://localhost:5000/api/v1/faqs/category/signup-login"
```

