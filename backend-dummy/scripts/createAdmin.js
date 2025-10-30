const mongoose = require("mongoose");
const dotenv = require("dotenv");
const readline = require("readline");
const Admin = require("../src/modules/admin/admin.model");

dotenv.config({ path: "./.env.dev" });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get admin details from user
    console.log("📝 Enter Admin Details:");
    console.log("─────────────────────────────\n");

    const username = await question("Username (min 3 chars): ");
    const email = await question("Email: ");
    const password = await question("Password (min 8 chars): ");

    // Validate inputs
    if (!username || username.length < 3) {
      console.log("❌ Username must be at least 3 characters");
      process.exit(1);
    }

    if (!email || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      console.log("❌ Please provide a valid email");
      process.exit(1);
    }

    if (!password || password.length < 8) {
      console.log("❌ Password must be at least 8 characters");
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      console.log("\n❌ Admin with this email or username already exists:");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      process.exit(1);
    }

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password,
      role: "admin",
      isActive: true,
    });

    console.log("\n🎉 Admin created successfully!");
    console.log("═══════════════════════════════════════");
    console.log(`Username: ${admin.username}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${admin.role}`);
    console.log("═══════════════════════════════════════");
    console.log("✅ Admin is now active and can login!");
    console.log("✅ Admin has full access to all ClassCrew features!");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

createAdmin();
