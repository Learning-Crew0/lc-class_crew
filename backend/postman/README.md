# 🧪 Postman Testing Guide - Customer Service Center API

## 📦 Available Collections

- **`Customer-Service-Center-API.postman_collection.json`** - Complete testing suite for all Customer Service Center APIs

---

## 🚀 Quick Start

### 1. Import Collection

1. Open Postman
2. Click **Import** button
3. Select `Customer-Service-Center-API.postman_collection.json`
4. Collection will be imported with all endpoints

---

### 2. Configure Environment Variables

The collection uses these variables (automatically managed):

| Variable | Description | Auto-set |
|----------|-------------|----------|
| `baseUrl` | Production API URL | ✅ Default: `https://class-crew.onrender.com/api/v1` |
| `localUrl` | Local development URL | ✅ Default: `http://localhost:5000/api/v1` |
| `authToken` | User authentication token | ✅ Set after user login |
| `adminToken` | Admin authentication token | ✅ Set after admin login |
| `enquiryId` | Last created enquiry ID | ✅ Set after enquiry creation |
| `enrollmentId` | Enrollment ID for testing | ⚠️ Manual |
| `faqId` | FAQ ID for testing | ✅ Set after FAQ fetch |

**To switch between production and local:**

1. Open collection settings
2. Change `{{baseUrl}}` to `{{localUrl}}` in any request
3. Or manually edit the `baseUrl` variable value

---

## 📁 Collection Structure

### **0. Authentication** (2 requests)
- User Login
- Admin Login

### **1. Course History Lookup** (2 requests)
- ✅ Verify & Get Course History (PUBLIC)
- ✅ Verify - Company Type (Error test)

### **2. Enrollment History** (2 requests)
- ✅ Get My Enrollment History (AUTH)
- ✅ Download Certificate (AUTH)

### **3. FAQ Management** (6 requests)
- ✅ Get All FAQs (PUBLIC)
- ✅ Get FAQs - Signup/Login Category (PUBLIC)
- ✅ Get Single FAQ (PUBLIC)
- ✅ Search FAQs (PUBLIC)
- ✅ Mark FAQ as Helpful (PUBLIC)
- ✅ Get FAQs by Category (PUBLIC)

### **4. Enquiry Management** (8 requests)
- ✅ Create Enquiry (Public)
- ✅ Create Enquiry (Authenticated)
- ✅ Create Enquiry - All Categories
- ✅ Create Enquiry - With Attachment
- ✅ Create Enquiry - Indian Phone
- ✅ Get My Enquiries (AUTH)
- ✅ Get Enquiry by ID (AUTH)

### **5. Admin - FAQ Management** (4 requests)
- ✅ Get All FAQs (ADMIN)
- ✅ Create FAQ (ADMIN)
- ✅ Update FAQ (ADMIN)
- ✅ Delete FAQ (ADMIN)

### **6. Admin - Enquiry Management** (5 requests)
- ✅ Get All Enquiries (ADMIN)
- ✅ Get Enquiry by ID (ADMIN)
- ✅ Update Enquiry Status (ADMIN)
- ✅ Respond to Enquiry (ADMIN)
- ✅ Assign Enquiry (ADMIN)

### **7. File Upload** (1 request)
- ✅ Upload Single File (ADMIN)

**Total: 30 endpoints**

---

## 🔑 Testing Workflow

### **Step 1: Authentication**

1. **Run "User Login"**
   - Uses default credentials: `testuser` / `Test123!@#`
   - Auto-saves `authToken` to collection variables
   - Required for: Enrollment history, My enquiries

2. **Run "Admin Login"**
   - Uses default credentials: `admin` / `Admin123!@#`
   - Auto-saves `adminToken` to collection variables
   - Required for: All admin endpoints

---

### **Step 2: Test Public Endpoints (No Auth)**

#### **Course History Lookup**
```
1. Run "Verify & Get Course History"
   - Tests user verification with phone/email/name
   - Returns enrollment history
   
2. Run "Verify - Company Type (Error)"
   - Tests error handling for company users
```

#### **FAQ Management**
```
1. Run "Get All FAQs"
   - Fetches all active FAQs
   
2. Run "Search FAQs"
   - Tests full-text search
   
3. Run "Mark FAQ as Helpful"
   - Increments helpful count
```

#### **Enquiry Submission**
```
1. Run "Create Enquiry (Public)"
   - Tests public enquiry submission
   - Auto-saves enquiryId
   
2. Run "Create Enquiry - Indian Phone"
   - Tests international phone format
```

---

### **Step 3: Test Authenticated Endpoints**

**Prerequisites:** Must run "User Login" first

```
1. Run "Get My Enrollment History"
   - Fetches user's course history
   
2. Run "Get My Enquiries"
   - Fetches user's submitted enquiries
   
3. Run "Get Enquiry by ID"
   - Gets detailed enquiry info
```

---

### **Step 4: Test Admin Endpoints**

**Prerequisites:** Must run "Admin Login" first

#### **FAQ Management**
```
1. Run "Get All FAQs (Admin)"
   - Admin view (includes inactive FAQs)
   
2. Run "Create FAQ"
   - Creates new FAQ
   
3. Run "Update FAQ"
   - Modifies existing FAQ
```

#### **Enquiry Management**
```
1. Run "Get All Enquiries"
   - Lists all enquiries with filters
   
2. Run "Update Enquiry Status"
   - Changes enquiry status
   
3. Run "Respond to Enquiry"
   - Adds admin response
```

---

## 📝 Example Test Scenarios

### **Scenario 1: Complete User Journey**

```
1. Run "User Login"
2. Run "Get My Enrollment History"
3. Run "Create Enquiry (Authenticated)"
4. Run "Get My Enquiries"
5. Run "Get Enquiry by ID"
```

### **Scenario 2: Public User Enquiry**

```
1. Run "Create Enquiry (Public)"
   → Note the ticket number
2. No login required
3. Enquiry submitted successfully
```

### **Scenario 3: Admin Workflow**

```
1. Run "Admin Login"
2. Run "Get All Enquiries"
3. Run "Get Enquiry by ID (Admin)"
4. Run "Update Enquiry Status" (to "in_progress")
5. Run "Respond to Enquiry"
6. Run "Update Enquiry Status" (to "resolved")
```

### **Scenario 4: FAQ Management**

```
1. Run "Admin Login"
2. Run "Create FAQ"
3. Run "Get All FAQs (Admin)"
4. Run "Update FAQ"
5. Public: Run "Get All FAQs" (verify visibility)
6. Public: Run "Mark FAQ as Helpful"
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Cannot POST /api/v1/enquiries" (404)**
**Solution:**
- Ensure backend server is running
- Check `baseUrl` variable is correct
- Restart backend if needed

### **Issue 2: "no token provided" (401)**
**Solution:**
- Run "User Login" or "Admin Login" first
- Check `authToken` or `adminToken` is saved
- Look in Console (View → Show Postman Console)

### **Issue 3: "Validation error" (400)**
**Solution:**
- Check request body matches required format
- Ensure all required fields are present
- Verify enum values (category, status, etc.)

### **Issue 4: "Enquiry not found" (404)**
**Solution:**
- Ensure `enquiryId` variable is set
- Run "Create Enquiry" first to generate an ID
- Check Console for auto-saved IDs

---

## 📊 Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request body/params |
| 401 | Unauthorized | Login required or token expired |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend issue, check logs |

---

## 🔍 Debugging Tips

### **1. Enable Postman Console**
```
View → Show Postman Console
- See all request/response details
- View auto-saved variable values
- Check error messages
```

### **2. Check Collection Variables**
```
Right-click collection → Edit
→ Variables tab
- Verify tokens are saved
- Check baseUrl is correct
```

### **3. Test Scripts**
Each request has test scripts that:
- Auto-save IDs to variables
- Log important information
- Validate responses

---

## 🎯 Testing Checklist

### **Public Endpoints**
- [ ] Course history verification works
- [ ] FAQ search returns results
- [ ] Public enquiry submission works
- [ ] FAQ helpful voting increments

### **Authenticated Endpoints**
- [ ] User login returns token
- [ ] My enrollment history loads
- [ ] Authenticated enquiry links user
- [ ] My enquiries list loads

### **Admin Endpoints**
- [ ] Admin login works
- [ ] FAQ CRUD operations work
- [ ] Enquiry status updates
- [ ] Admin can respond to enquiries
- [ ] File upload works

---

## 📞 Support

**For testing issues:**
- Check backend logs: `npm run dev`
- Verify database connection
- Ensure all models are synced

**API Documentation:**
- See `CUSTOMER_SERVICE_CENTER_API.md`
- Check specific endpoint requirements

---

## 🆕 Recent Updates

**November 12, 2025:**
- ✅ Added all Customer Service Center endpoints
- ✅ Fixed enquiry creation route
- ✅ Added auto-save for IDs and tokens
- ✅ Added example requests for all categories
- ✅ Added Indian phone number test case
- ✅ Added file upload endpoint

---

**Happy Testing! 🚀**

