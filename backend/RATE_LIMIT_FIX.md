# 🚦 Rate Limit Fix for Images (429 Error)

## 🐛 Problem

**Error:** `429 Too Many Requests` when loading images

**Root Cause:**
- Backend rate limit: **100 requests per 15 minutes**
- Next.js Image Optimizer makes multiple requests per image
- Quickly hits rate limit during page load

---

## ✅ **Solution 1: Frontend Fix (Immediate)**

Add `unoptimized` prop to Next.js Image components:

### **Before (Causing 429):**
```jsx
<Image 
  src="https://class-crew.onrender.com/uploads/courses/image.png"
  width={640}
  height={400}
  alt="Course"
/>
```

### **After (Fixed):**
```jsx
<Image 
  src="https://class-crew.onrender.com/uploads/courses/image.png"
  width={640}
  height={400}
  alt="Course"
  unoptimized  // ← Bypasses Next.js optimizer
/>
```

### **Why This Works:**
- Next.js Image Optimizer makes extra requests to optimize/resize images
- `unoptimized` loads images directly from backend
- Reduces total request count
- Avoids hitting rate limit

### **Apply Globally:**
```javascript
// next.config.js
module.exports = {
  images: {
    unoptimized: true,  // ← Apply to all images
  },
};
```

---

## ✅ **Solution 2: Backend Fix (Better Long-term)**

**Exclude static files from rate limiting:**

### **Updated:** `backend/src/config/security.js`

```javascript
const rateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks and static files
        return req.path === "/health" || req.path.startsWith("/uploads/");
    },
});
```

### **What Changed:**
```diff
skip: (req) => {
-   // Skip rate limiting for health checks
-   return req.path === "/health";
+   // Skip rate limiting for health checks and static files
+   return req.path === "/health" || req.path.startsWith("/uploads/");
},
```

### **Why This Works:**
- Static files (images, PDFs) don't need rate limiting
- They're not API endpoints that can be abused
- Allows unlimited image requests
- API endpoints still protected

---

## 📊 **Current Rate Limit Settings**

**File:** `backend/src/config/env.js`

```javascript
rateLimit: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 100,           // 100 requests per 15 min
}
```

**Can be overridden via environment variables:**
```bash
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes in ms
RATE_LIMIT_MAX_REQUESTS=100      # max requests per window
```

---

## 🎯 **Recommended Approach**

### **Immediate (Do Now):**
1. ✅ Add `unoptimized` to Image components (frontend)
2. ✅ Or add `unoptimized: true` to `next.config.js`

### **Long-term (Deploy):**
1. ✅ Backend fix applied (excludes `/uploads/` from rate limit)
2. ✅ Push backend changes to production
3. ✅ Remove `unoptimized` from frontend (optional - can keep for performance)

---

## 🚀 **Deployment**

### **Backend:**
```bash
git add backend/src/config/security.js
git commit -m "fix: exclude static files from rate limiting"
git push origin main
```

Render.com auto-deploys ✅

### **Frontend:**
Option A: Keep `unoptimized` (no deployment needed)
Option B: Remove `unoptimized` after backend deploys

---

## 🧪 **Testing**

### **Before Fix:**
1. Load cart page with multiple images
2. Error: `429 Too Many Requests` after ~10 images
3. Images fail to load

### **After Fix (Frontend):**
1. Load cart page with `unoptimized` prop
2. ✅ All images load successfully
3. No 429 errors

### **After Fix (Backend):**
1. Remove `unoptimized` prop
2. Load cart page
3. ✅ Next.js Image Optimizer works
4. ✅ Images load and are optimized
5. No 429 errors

---

## ⚠️ **Alternative: Increase Rate Limit**

If you still hit rate limits on API endpoints:

### **Option 1: Environment Variable**
```bash
# .env (production)
RATE_LIMIT_MAX_REQUESTS=500  # Increase to 500 requests per 15 min
```

### **Option 2: Disable in Development**
```javascript
// backend/src/config/security.js
const rateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip in development
        if (config.env === 'development') return true;
        
        // Skip for health checks and static files
        return req.path === "/health" || req.path.startsWith("/uploads/");
    },
});
```

---

## 📚 **Rate Limiting Best Practices**

### **What SHOULD Be Rate Limited:**
- ✅ Login/Authentication endpoints
- ✅ API endpoints (GET, POST, PUT, DELETE)
- ✅ Search endpoints
- ✅ Data-intensive queries

### **What SHOULD NOT Be Rate Limited:**
- ❌ Static files (images, CSS, JS)
- ❌ Health checks
- ❌ Public assets
- ❌ CDN content

---

## 📊 **Impact Analysis**

### **Before Fix:**
```
100 requests per 15 min
÷ Cart page with 10 images
= Only 10 page loads before rate limit
```

### **After Fix:**
```
Static files: unlimited ✅
API requests: still 100 per 15 min ✅
Cart page: unlimited loads ✅
```

---

## ✅ **Summary**

| Solution | Speed | Impact | Recommended |
|----------|-------|--------|-------------|
| Frontend `unoptimized` | ⚡ Instant | Frontend only | ✅ Do now |
| Backend exclude `/uploads/` | 🚀 2 min deploy | Backend only | ✅ Deploy ASAP |
| Increase rate limit | 🚀 2 min deploy | Backend only | ⚠️ If still needed |

**Best approach:** Do both!
1. Frontend fix for immediate relief
2. Backend fix for proper solution
3. Then remove frontend workaround (optional)

---

## 🐛 **Troubleshooting**

### **Still getting 429 on API endpoints:**
- Check if you're making too many API calls in loops
- Use pagination for large datasets
- Implement frontend caching

### **Rate limit too strict for your use case:**
- Increase `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Or increase `windowMs` to a longer window

### **Need different limits for different endpoints:**
```javascript
// Create separate rate limiters
const apiLimiter = rateLimit({ max: 100, windowMs: 15 * 60 * 1000 });
const authLimiter = rateLimit({ max: 5, windowMs: 15 * 60 * 1000 });

// Apply to specific routes
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', apiLimiter);
```

---

**Backend fix is ready to deploy!** 🚀

Static files (images) are now excluded from rate limiting.



