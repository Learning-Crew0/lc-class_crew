# 📜 Scripts Directory

This directory contains utility scripts for ClassCrew backend.

---

## Available Scripts

### 1. `createDefaultAdmin.js` - Create Default Admin (Quick Setup) ⭐

**Purpose:** Quickly create the default admin user for initial system setup

**Usage:**
```bash
cd backend-dummy
node scripts/createDefaultAdmin.js
```

**Default Credentials:**
```
Username: classcrew_admin
Email:    admin@classcrew.com
Password: Admin@123456
```

**What it does:**
- Connects to MongoDB
- Creates default admin with predefined credentials
- Checks for existing admin to prevent duplicates
- Displays login credentials

**⚠️ Important:** Change the password after first login!

---

### 2. `createAdmin.js` - Create Admin User (Interactive)

**Purpose:** Interactively create an admin user with custom credentials

**Usage:**
```bash
cd backend-dummy
node scripts/createAdmin.js
```

**What it does:**
- Connects to MongoDB
- Prompts for admin details (username, email, password)
- Creates admin with specified credentials
- Validates email and username uniqueness
- Displays login credentials

**Before running:**
- Make sure MongoDB is running
- Ensure `.env.dev` file has correct `MONGO_URI`

**Interactive Prompts:**
```
Username (min 3 chars): admin1
Email: admin1@classcrew.com
Password (min 8 chars): Admin@123456
```

**⚠️ Important:** 
- All admins have full access to all ClassCrew features!
- Any admin can create, manage, and delete other admins!

---

## Adding New Scripts

When adding new scripts to this directory:

1. Create a descriptive filename (e.g., `seedDatabase.js`, `migrateUsers.js`)
2. Add proper documentation at the top of the file
3. Include usage instructions
4. Update this README with script details
5. Handle errors gracefully
6. Close database connections when done

---

## Common Issues

### "Cannot find module 'mongoose'"
**Solution:** Run `npm install` in the backend-dummy directory

### "MongoDB connection error"
**Solution:** 
- Check if MongoDB is running
- Verify `MONGO_URI` in `.env` file
- Ensure database name is correct

### "User already exists"
**Solution:** 
- Change email/username in the script
- Or delete existing user from database first

---

## Script Template

Use this template for new scripts:

```javascript
/**
 * Script Name: Your Script Name
 * 
 * Description: What this script does
 * 
 * Usage:
 * node scripts/yourScript.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/classcrew";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Main function
const main = async () => {
  try {
    // Your logic here
    console.log("✅ Script completed successfully");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  }
};

// Run the script
const run = async () => {
  console.log("🚀 Script starting...");
  await connectDB();
  await main();
  process.exit(0);
};

run();
```

---

**Note:** Always test scripts in development before running in production!

