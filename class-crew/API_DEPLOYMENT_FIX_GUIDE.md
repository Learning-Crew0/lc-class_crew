# API Deployment Fix Guide

## Problem
The application works locally but API calls fail in the deployed environment, showing errors like "C;} banner?isActive=truecourses?limit=20&page=1304304fetchfetchapi.ts:40page.tsx:177".

## Root Cause Analysis
The issue appears to be related to:
1. Environment variable configuration in production
2. CORS/network issues between frontend and backend
3. API URL construction problems
4. Potential server-side rendering vs client-side rendering differences

## Fixes Applied

### 1. Enhanced API Configuration (`src/utils/api.ts`)
- Added robust base URL handling with fallbacks
- Improved error logging and debugging
- Added retry logic for network failures
- Explicit CORS configuration
- Better error handling and reporting

### 2. Debug Utilities (`src/utils/debug.ts`)
- Created comprehensive API debugging tools
- Environment variable validation
- Connection testing utilities
- Detailed logging for troubleshooting

### 3. Improved Component Error Handling
- Updated home page (`src/components/home/page.tsx`) with better API integration
- Enhanced banner component (`src/components/home/banner/page.tsx`) with improved error handling
- Added fallback mechanisms for when API fails

### 4. Test Pages for Debugging
- `/api-test` - Comprehensive API testing page
- `/debug-env` - Environment variable debugging page

## Deployment Checklist

### 1. Environment Variables
Ensure these are set in your production environment:
```
NEXT_PUBLIC_BASE_API=https://classcrew.onrender.com/api
NODE_ENV=production
```

### 2. Backend API Status
Verify your backend is running and accessible:
- Check: https://classcrew.onrender.com/api/banner?isActive=true
- Check: https://classcrew.onrender.com/api/courses?limit=5&page=1

### 3. CORS Configuration
Ensure your backend allows requests from your frontend domain:
```javascript
// In your backend CORS configuration
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
  credentials: false
}));
```

### 4. Network/CDN Issues
- Check if there are any CDN or proxy issues
- Verify SSL certificates are valid
- Test API endpoints directly in browser

## Testing Steps

### Local Testing
1. Run `npm run dev` in class-crew directory
2. Visit `http://localhost:3000/debug-env` to check environment variables
3. Visit `http://localhost:3000/api-test` to test all API endpoints
4. Check browser console for detailed API logs

### Production Testing
1. Deploy the updated code
2. Visit `https://your-domain.com/debug-env` to verify environment variables
3. Visit `https://your-domain.com/api-test` to test API connectivity
4. Check browser console and network tab for errors

## Common Issues and Solutions

### Issue 1: Environment Variables Not Available
**Symptoms:** `NEXT_PUBLIC_BASE_API` shows as `undefined`
**Solution:** 
- Verify environment variables are set in deployment platform
- Restart the deployment after setting variables
- Check if variables need to be prefixed with `NEXT_PUBLIC_`

### Issue 2: CORS Errors
**Symptoms:** "Access to fetch blocked by CORS policy"
**Solution:**
- Update backend CORS configuration
- Ensure frontend domain is whitelisted
- Check if credentials are being sent unnecessarily

### Issue 3: Network/SSL Issues
**Symptoms:** "Failed to fetch" or SSL certificate errors
**Solution:**
- Verify backend SSL certificate is valid
- Check if backend is accessible from production environment
- Test API endpoints directly

### Issue 4: Build-time vs Runtime Issues
**Symptoms:** Works in development but fails in production
**Solution:**
- Ensure API calls are client-side only (use `useEffect`)
- Check for server-side rendering issues
- Verify environment variables are available at runtime

## Monitoring and Debugging

### Browser Console Logs
The enhanced API utility now provides detailed logging:
- API call URLs and methods
- Response status codes
- Full response data
- Error details with retry attempts

### Network Tab
Check the browser's Network tab for:
- Failed requests (red entries)
- Response codes (should be 200 for success)
- Response headers and CORS information
- Request/response timing

## Next Steps

1. **Deploy the fixes** to your production environment
2. **Test the debug pages** to identify specific issues
3. **Check backend logs** for any server-side errors
4. **Monitor API response times** and success rates
5. **Set up proper error tracking** (e.g., Sentry) for production monitoring

## Contact Points

If issues persist after applying these fixes:
1. Check the browser console logs for specific error messages
2. Test the `/api-test` page to identify which specific API calls are failing
3. Verify backend API endpoints are responding correctly
4. Check deployment platform logs for any configuration issues

The enhanced error handling and debugging tools should provide clear information about what's failing and why.