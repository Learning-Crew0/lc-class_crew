# Deployment Steps - Image URL Fix ✅

## 🎯 What Was Fixed

**Backend Changes:**
1. ✅ Enhanced CORS headers for cross-origin image access
2. ✅ Full URL generation for all uploaded files
3. ✅ Proper Content-Type headers for images
4. ✅ OPTIONS preflight request handling
5. ✅ Middleware reordering to prevent blocking

**Result:** Images now work with any frontend framework, including Next.js, without special configuration!

## 🚀 Quick Fix for Production

Follow these steps to deploy the fix:

### Step 1: Set Environment Variable on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service (`class-crew`)
3. Go to **Environment** tab
4. Add a new environment variable:
   ```
   Key: SERVER_URL
   Value: https://class-crew.onrender.com
   ```
5. Click **Save Changes**

### Step 2: Redeploy

Render will automatically redeploy when you save the environment variable.

If not, manually trigger a deploy:
- Click **Manual Deploy** → **Deploy latest commit**

### Step 3: Verify the Fix

After deployment completes (usually 2-3 minutes):

**Test 1: Check Health Endpoint**
```bash
curl https://class-crew.onrender.com/health
```
Expected: `200 OK` with server info

**Test 2: Test Banner Images**
```bash
# Get banners
curl https://class-crew.onrender.com/api/v1/public/banners

# Copy an image URL from the response and test it
curl -I https://class-crew.onrender.com/uploads/temp/file-XXXXXXX.png
```

Expected Response Headers:
```
HTTP/2 200 OK
access-control-allow-origin: *
cross-origin-resource-policy: cross-origin
content-type: image/png
cache-control: public, max-age=31536000
```

**Test 3: Run Automated Test**
```bash
cd backend
node scripts/test-image-access.js
```

This will:
- Fetch all banners from database
- Test each image URL
- Report which images are accessible (200) or missing (404)

**Test 4: Test Upload API (Optional)**
```bash
curl -X POST https://class-crew.onrender.com/api/v1/admin/uploads/single \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@test-image.png"
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "url": "https://class-crew.onrender.com/uploads/temp/file-1234567890.png",
    "filename": "file-1234567890.png",
    ...
  }
}
```

**Test 5: Verify from Frontend**
- Open your frontend app
- Check browser DevTools → Console (should see no 404 errors)
- Check Network tab → Images should return 200 OK
- Verify banners display correctly

### Step 4: Check Persistent Storage (Important!)

⚠️ **Without persistent storage, files will be deleted on every deployment!**

To add persistent storage on Render:

1. In your service dashboard, go to **Disks** tab
2. Click **Add Disk**
3. Configure:
   - **Name:** `uploads`
   - **Mount Path:** `/var/data/files`
   - **Size:** 10 GB (or as needed)
4. Click **Add Disk**
5. Redeploy the service

## What Was Changed

### Backend Code Changes:
1. ✅ Added `SERVER_URL` configuration in `src/config/env.js`
2. ✅ Updated `src/services/upload.service.js` to return full URLs
3. ✅ Updated `src/config/fileStorage.js` to generate full URLs
4. ✅ Updated `src/controllers/enrollment.controller.js` for compatibility

### Impact:
- **Before:** URLs like `/uploads/temp/file-123.png` (relative)
- **After:** URLs like `https://class-crew.onrender.com/uploads/temp/file-123.png` (full)

### Frontend Integration:
No frontend changes needed! The full URLs will work automatically with:
- Regular `<img>` tags
- Next.js `<Image>` component with optimization
- Any other image loading method

## Troubleshooting

### Images still showing 404?

**Check 1: Is SERVER_URL set correctly?**
```bash
# SSH into your Render service or check logs
echo $SERVER_URL
# Should output: https://class-crew.onrender.com
```

**Check 2: Are files being saved?**
```bash
# Check if upload directory exists
ls -la /var/data/files/temp/
```

**Check 3: CORS Headers**
```bash
curl -I https://class-crew.onrender.com/uploads/temp/your-file.png
# Should include:
# Access-Control-Allow-Origin: *
# Cross-Origin-Resource-Policy: cross-origin
```

### Files disappearing after deploy?
→ You need to set up persistent disk (see Step 4 above)

### Getting CORS errors?
→ Already fixed in code, but verify:
1. Frontend is using the full URL from backend response
2. Not manually constructing URLs on frontend
3. Backend CORS middleware is working (check `src/app.js`)

## For Development

If testing locally, you can add to your `.env` file:

```env
SERVER_URL=http://localhost:5000
```

Or if using a different port:
```env
PORT=8000
SERVER_URL=http://localhost:8000
```

## Need Help?

- 📄 See detailed documentation: `IMAGE_URL_FIX.md`
- 🐛 Check backend logs on Render dashboard
- 🔍 Use browser DevTools Network tab to inspect failed requests

