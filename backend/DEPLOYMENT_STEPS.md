# Deployment Steps - Image URL Fix

## 🚀 Quick Fix for Production

The image 404 errors have been fixed! Follow these steps to deploy:

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

1. **Test Upload API:**
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

2. **Verify Image is Accessible:**
   ```bash
   curl -I https://class-crew.onrender.com/uploads/temp/file-1234567890.png
   ```

   Expected: `HTTP/2 200`

3. **Test from Frontend:**
   - Upload an image through your admin panel
   - Verify it displays correctly on the frontend

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

