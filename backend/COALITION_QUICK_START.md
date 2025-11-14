# 🚀 Coalition Backend - Quick Start Guide

Get the Coalition API up and running in 5 minutes!

---

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm run dev
```

Server should start at: `http://localhost:5000`

---

## 🧪 Test the API

### Option 1: Using Postman (Recommended)

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `backend/postman/Coalition_API.postman_collection.json`

2. **Set Variables:**
   - Collection variables are pre-configured
   - `baseUrl`: `http://localhost:5000/api/v1`

3. **Run Tests:**
   ```
   Auth → Admin Login           (saves token automatically)
   Public → Create Application  (saves coalition ID)
   Admin → Get All Applications
   Admin → Get Statistics
   Admin → Update Status
   Admin → Delete Application
   ```

### Option 2: Using cURL

**1. Create Application (Public)**
```bash
curl -X POST http://localhost:5000/api/v1/coalitions \
  -F "name=홍길동" \
  -F "affiliation=ABC Corporation" \
  -F "field=Education Technology" \
  -F "contact=01012345678" \
  -F "email=test@example.com" \
  -F "file=@sample.pdf"
```

**2. Admin Login**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lcclasscrew.com","password":"changeme123"}'
```

Copy the token from response.

**3. Get All Applications**
```bash
curl -X GET "http://localhost:5000/api/v1/coalitions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**4. Get Statistics**
```bash
curl -X GET http://localhost:5000/api/v1/coalitions/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3: Using the Frontend

1. **Start Frontend:**
   ```bash
   cd ..  # Back to project root
   npm run dev
   ```

2. **Open Browser:**
   - Public Form: `http://localhost:3000/coalition`
   - Admin View: `http://localhost:3000/admin/coalition/view-applications`
   - Admin Stats: `http://localhost:3000/admin/coalition/statistics`

---

## 📁 Test Files

Create a test PDF file to upload:

**Windows PowerShell:**
```powershell
"Test Coalition Application" | Out-File -FilePath test-coalition.pdf
```

**Linux/Mac:**
```bash
echo "Test Coalition Application" > test-coalition.pdf
```

---

## ✅ Verification Checklist

- [ ] Server starts without errors
- [ ] POST /coalitions creates application successfully
- [ ] File is saved in `backend/uploads/coalitions/`
- [ ] GET /coalitions returns list (with admin token)
- [ ] GET /coalitions/stats returns statistics
- [ ] PATCH /coalitions/:id/status updates status
- [ ] DELETE /coalitions/:id deletes application
- [ ] Validation errors work correctly
- [ ] Duplicate email is rejected

---

## 🔧 Troubleshooting

### Error: "Cannot connect to MongoDB"
```bash
# Make sure MongoDB is running
# Check connection string in .env file
MONGODB_URI=mongodb://localhost:27017/lc-class-crew
```

### Error: "File upload failed"
```bash
# Check if uploads directory exists
cd backend
mkdir -p uploads/coalitions
```

### Error: "Admin token invalid"
```bash
# Re-login to get a fresh token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lcclasscrew.com","password":"changeme123"}'
```

### Error: "Port 5000 already in use"
```bash
# Change port in .env file
PORT=5001

# Or kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

---

## 📊 Sample Data

Use this test data for quick testing:

```javascript
// Application 1
{
  "name": "김철수",
  "affiliation": "Tech Innovations Inc.",
  "field": "Artificial Intelligence",
  "contact": "01098765432",
  "email": "kim@techinnovations.com"
}

// Application 2
{
  "name": "박영희",
  "affiliation": "Global Marketing Solutions",
  "field": "Digital Marketing",
  "contact": "01087654321",
  "email": "park@globalmarketing.com"
}

// Application 3
{
  "name": "이민수",
  "affiliation": "Education Hub Korea",
  "field": "Education Technology",
  "contact": "01076543210",
  "email": "lee@eduhub.kr"
}
```

---

## 🎯 Next Steps

1. ✅ Test all endpoints
2. ✅ Verify frontend integration
3. ✅ Check file uploads
4. ✅ Test admin functions
5. 🔜 Deploy to production

---

## 📚 Full Documentation

For complete API documentation, see:
- `backend/COALITION_BACKEND_IMPLEMENTATION.md`

---

## 🆘 Need Help?

**Common Issues:**
- Check server logs for errors
- Verify MongoDB is running
- Ensure all dependencies are installed
- Check file permissions for uploads directory

**Still stuck?**
Contact the development team or refer to the main documentation.

---

**Happy Testing! 🎉**



