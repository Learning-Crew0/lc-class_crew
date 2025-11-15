# 🛒 Cart API Field Name Fix

## 🐛 Issue

Frontend was sending:
```json
{
  "itemType": "course",
  "productId": "69159b0909172ef24f5798fc",
  "trainingSchedule": "6915a56c09172ef24f579b8b",  // ← Frontend sends this
  "quantity": 1
}
```

Backend was expecting:
```javascript
const { courseSchedule } = req.body;  // ← Backend expected this ❌
```

**Error:** `"Training schedule is required for courses"`

---

## ✅ Fix Applied

### **Updated:** `backend/src/controllers/cart.controller.js`

**Now accepts BOTH field names:**
```javascript
const { trainingSchedule, courseSchedule } = req.body;

// Support both field names for backward compatibility
const scheduleId = trainingSchedule || courseSchedule;
```

### **Updated:** `backend/src/routes/cart.routes.js`

Updated API documentation to reflect correct field name.

---

## 📝 API Usage

### **Add Course to Cart - POST `/api/v1/cart/add`**

**Request Body:**
```json
{
  "itemType": "course",
  "productId": "COURSE_ID",
  "trainingSchedule": "TRAINING_SCHEDULE_ID"
}
```

**OR (backward compatible):**
```json
{
  "itemType": "course",
  "productId": "COURSE_ID",
  "courseSchedule": "TRAINING_SCHEDULE_ID"
}
```

**Both work!** ✅

---

## 🎯 Frontend - No Changes Needed

Your existing frontend code will work as-is:
```javascript
const response = await fetch('/api/v1/cart/add', {
  method: 'POST',
  body: JSON.stringify({
    itemType: 'course',
    productId: courseId,
    trainingSchedule: scheduleId,  // ✅ This now works!
    quantity: 1
  })
});
```

---

## ✅ What Changed

| File | Change |
|------|--------|
| `controllers/cart.controller.js` | Now accepts both `trainingSchedule` and `courseSchedule` |
| `routes/cart.routes.js` | Updated API documentation |

**Internal model unchanged** - Still uses `courseSchedule` internally (correct) ✅

---

## 🧪 Testing

### **Test 1: With trainingSchedule (Frontend way)**
```bash
curl -X POST "https://class-crew.onrender.com/api/v1/cart/add" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "course",
    "productId": "69159b0909172ef24f5798fc",
    "trainingSchedule": "6915a56c09172ef24f579b8b"
  }'
```

**Expected:** ✅ `"Course added to cart successfully"`

### **Test 2: With courseSchedule (Old way - still works)**
```bash
curl -X POST "https://class-crew.onrender.com/api/v1/cart/add" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "course",
    "productId": "69159b0909172ef24f5798fc",
    "courseSchedule": "6915a56c09172ef24f579b8b"
  }'
```

**Expected:** ✅ `"Course added to cart successfully"`

---

## 📊 Summary

| Item | Status |
|------|--------|
| Bug identified | ✅ Field name mismatch |
| Fix applied | ✅ Accept both field names |
| Backward compatibility | ✅ Old code still works |
| Frontend changes needed | ✅ **NONE** |
| API documentation updated | ✅ Done |
| Ready to deploy | ✅ Yes |

---

## 🚀 Deployment

```bash
git add .
git commit -m "fix: accept both trainingSchedule and courseSchedule in cart API"
git push origin main
```

Render.com will auto-deploy ✅

---

**Frontend can now add courses to cart successfully!** 🎉




