const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../src/modules/admin/admin.model");

dotenv.config({ path: "./.env.dev" });

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Default admin credentials
    const defaultAdmin = {
      username: "classcrew_admin",
      email: "admin@classcrew.com",
      password: "Admin@123456",
      role: "admin",
      isActive: true,
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email: defaultAdmin.email }, { username: defaultAdmin.username }],
    });

    if (existingAdmin) {
      console.log("⚠️  Admin already exists:");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create(defaultAdmin);

    console.log("🎉 Admin created successfully!");
    console.log("═══════════════════════════════════════");
    console.log(`Username: ${admin.username}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: ${defaultAdmin.password}`);
    console.log(`Role:     ${admin.role}`);
    console.log("═══════════════════════════════════════");
    console.log("✅ Admin is now active and can login!");
    console.log("✅ Admin has full access to all ClassCrew features!");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createDefaultAdmin();

