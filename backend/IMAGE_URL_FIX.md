# Image URL Fix - Full URL Implementation

## Problem

The frontend was getting 404 errors when trying to fetch images from the backend because the backend was returning relative URLs (`/uploads/temp/file-123.png`) instead of full URLs (`https://class-crew.onrender.com/uploads/temp/file-123.png`).

When the frontend and backend are on different domains, relative URLs don't work for cross-origin requests.

## Solution

Updated the backend to return full URLs for all uploaded files by adding server URL configuration.

## Changes Made

### 1. Environment Configuration (`src/config/env.js`)

- Added `serverUrl` configuration that reads from `SERVER_URL` environment variable
- Falls back to `http://localhost:5000` in development

### 2. Upload Service (`src/services/upload.service.js`)

- Modified `processUpload()` to return full URLs instead of relative paths
- Example: `https://class-crew.onrender.com/uploads/temp/file-123.png`

### 3. File Storage Config (`src/config/fileStorage.js`)

- Updated `getFileUrl()` to return full URLs
- Updated `deleteFileByUrl()` to handle both full URLs and relative URLs (backward compatibility)

### 4. Enrollment Controller (`src/controllers/enrollment.controller.js`)

- Updated certificate download logic to handle full URLs
- Maintains backward compatibility with relative URLs

## Required Environment Variable

### Production (Render)

Add this environment variable to your Render service:

```
SERVER_URL=https://class-crew.onrender.com
```

### Development

Add to your `.env` file:

```
SERVER_URL=http://localhost:5000
```

If not set, it defaults to `http://localhost:PORT` where PORT is from environment or 5000.

## Frontend Integration

### Before (Not Working)

```javascript
// Backend returned relative URL
{
  "url": "/uploads/temp/file-123.png"
}

// Frontend tried to access it and failed (404)
<img src="/uploads/temp/file-123.png" />  // ❌ Looks on frontend domain
```

### After (Working)

```javascript
// Backend now returns full URL
{
  "url": "https://class-crew.onrender.com/uploads/temp/file-123.png"
}

// Frontend can directly use it
<img src="https://class-crew.onrender.com/uploads/temp/file-123.png" />  // ✅ Works!
```

### Next.js Image Optimization

The full URLs work perfectly with Next.js Image component:

```javascript
import Image from "next/image";

// The URL returned from backend
const imageUrl = "https://class-crew.onrender.com/uploads/temp/file-123.png";

// Next.js will automatically optimize and proxy it
<Image src={imageUrl} width={1920} height={1080} alt="Uploaded image" />;
```

## Testing

### 1. Test Upload Endpoint

```bash
curl -X POST http://localhost:5000/api/v1/admin/uploads/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-image.png"

# Should return:
{
  "status": "success",
  "data": {
    "url": "http://localhost:5000/uploads/temp/file-1234567890.png",  // Full URL
    "filename": "file-1234567890.png",
    ...
  }
}
```

### 2. Verify Image Access

```bash
# The returned URL should be directly accessible
curl -I http://localhost:5000/uploads/temp/file-1234567890.png

# Should return: HTTP/1.1 200 OK
```

## Deployment Checklist

- [ ] Set `SERVER_URL` environment variable in Render
    - Go to Render Dashboard → Your Service → Environment
    - Add: `SERVER_URL=https://class-crew.onrender.com`
- [ ] Redeploy the backend service

- [ ] Test image upload after deployment:

    ```bash
    # Upload a test file
    curl -X POST https://class-crew.onrender.com/api/v1/admin/uploads/single \
      -H "Authorization: Bearer YOUR_TOKEN" \
      -F "file=@test.png"

    # Verify the returned URL is accessible
    curl -I [returned_url]
    ```

- [ ] Verify frontend can display images

## Backward Compatibility

All changes maintain backward compatibility:

- `deleteFileByUrl()` handles both full URLs and relative URLs
- Certificate download logic handles both formats
- Old relative URLs in database will still work (though we recommend updating them)

## Notes for Render Deployment

### Important: Persistent Storage

On Render, the `/var/data/files` directory needs to be set up as a persistent disk:

1. Go to your Render service dashboard
2. Add a Disk:
    - Name: `uploads`
    - Mount Path: `/var/data/files`
    - Size: Choose appropriate size (e.g., 10GB)

Without persistent storage, uploaded files will be lost on every deployment!

### CORS Headers

The backend already has proper CORS headers configured for the `/uploads` route (see `src/app.js`):

- `Access-Control-Allow-Origin: *`
- `Cross-Origin-Resource-Policy: cross-origin`

This allows the frontend to fetch images from the backend domain.

## Troubleshooting

### Issue: Still getting 404 errors

**Check:**

1. Is `SERVER_URL` environment variable set correctly?
2. Are files actually being saved to disk?
3. Is the persistent disk mounted in production?
4. Check backend logs for any upload errors

### Issue: CORS errors

**Check:**

1. Verify CORS headers in response: `curl -I [image_url]`
2. Check that middleware in `src/app.js` is correctly configured
3. Ensure frontend is using the full URL returned by backend

### Issue: Images lost after deployment

**Solution:**

- Set up persistent disk on Render (see notes above)
- Consider using S3 for production (already has placeholder in code)

## Future Enhancements

Consider implementing cloud storage (S3, Cloudflare R2, etc.) for production:

- More reliable than local disk storage
- Better performance with CDN
- No data loss on redeployment
- Placeholder code already exists in `upload.service.js`
