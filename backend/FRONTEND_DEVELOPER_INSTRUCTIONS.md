# Instructions for Frontend Developer

## ✅ Backend Is Fixed - No API Changes

The backend now returns **full URLs** for all images. You don't need to construct URLs yourself.

## 🎯 What You Need to Do

### Option 1: Use Regular `<img>` Tags (Simplest)

**No configuration needed!** Just use the URLs directly:

```jsx
// ✅ This works immediately
<img src={banner.image} alt={banner.title} />
```

### Option 2: Use Next.js `<Image>` Component (Better Performance)

If you want Next.js image optimization, follow these steps:

#### Step 1: Update `next.config.js`

Add this to your Next.js config:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'class-crew.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
```

#### Step 2: Restart Your Dev Server

**This is critical!** Next.js only reads config on startup.

```bash
# Stop your dev server (Ctrl+C)
# Then start it again
npm run dev
```

#### Step 3: Clear Browser Cache

Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

#### Step 4: Use the Image Component

```jsx
import Image from 'next/image';

function Banner({ banner }) {
  return (
    <Image
      src={banner.image}  // Full URL from API
      width={1920}
      height={1080}
      alt={banner.title}
    />
  );
}
```

## 📝 API Response Format

The backend now returns full URLs:

```json
{
  "status": "success",
  "data": {
    "banners": [
      {
        "image": "https://class-crew.onrender.com/uploads/temp/file-123.png",
        "mobileImage": "https://class-crew.onrender.com/uploads/temp/file-456.jpg"
      }
    ]
  }
}
```

**Just use `banner.image` directly!**

## 🔍 Testing

### Test 1: Check if Image URL Works

Copy any image URL from the API response and paste it directly in your browser. It should load the image.

Example:
```
https://class-crew.onrender.com/uploads/temp/file-1763015294504-652599612.png
```

If it doesn't load → Backend issue (contact backend developer)
If it loads → Frontend configuration issue (follow steps above)

### Test 2: Check CORS Headers

Open browser DevTools → Network tab → Load the page → Click on an image request

Check the **Response Headers**:
- Should see: `access-control-allow-origin: *`
- Should see: `cross-origin-resource-policy: cross-origin`

If these headers are missing → Backend issue

### Test 3: Check Next.js Config

If using Next.js `<Image>`:

1. Verify `next.config.js` has the `remotePatterns` configuration
2. Verify you restarted the dev server after changing config
3. Check browser console for any Next.js image errors
4. If you see "Invalid src prop", it means the domain isn't allowed

## 🐛 Troubleshooting

### Error: "Invalid src prop" (Next.js)

**Cause:** Domain not allowed in Next.js config

**Solution:**
1. Add domain to `next.config.js` (see Step 1 above)
2. **Restart dev server** (critical!)
3. Clear browser cache

### Error: 404 Not Found

**Cause:** Image doesn't exist on backend server

**Solution:**
1. Test the URL directly in browser
2. If 404 → Re-upload the image through admin panel
3. The backend might have lost files (ephemeral storage issue)

### Error: CORS Policy

**Cause:** CORS headers not being sent correctly

**Solution:**
1. Verify backend has been deployed with latest code
2. Check response headers in DevTools
3. Contact backend developer if headers are missing

### Images Work in Browser but Not in Next.js

**Cause:** Next.js config not updated or dev server not restarted

**Solution:**
1. Double-check `next.config.js` configuration
2. **Restart dev server** (kill and restart, don't just save)
3. Try using regular `<img>` tag to confirm it's a Next.js issue

## 📞 Need Help?

**Before asking for help, check:**
1. ✅ Image URL works directly in browser
2. ✅ You added domain to `next.config.js` (if using Next.js Image)
3. ✅ You restarted your dev server
4. ✅ You cleared browser cache

**If still not working:**
- Share the exact error message
- Share a screenshot of the Network tab showing the failed request
- Share your `next.config.js` file

## 🎉 Summary

1. Backend returns full URLs → Use them directly
2. For `<img>` tags → No config needed
3. For Next.js `<Image>` → Add domain to config + restart server
4. Test URLs in browser first before debugging frontend code

**That's it!** Images should work now. 🚀

