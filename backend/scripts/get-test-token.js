/**
 * Helper script to generate a JWT token for testing
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const config = require("../src/config/env");

async function generateToken() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // Get first user
        const user = await User.findOne().select("_id email fullName username");
        
        if (!user) {
            console.log("❌ No users found in database");
            return;
        }

        console.log("👤 User found:");
        console.log(`   ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.fullName || user.username}`);

        // Generate token (auth middleware expects 'id' field)
        const token = jwt.sign(
            { id: user._id, role: "user" },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn || "7d" }
        );

        console.log(`\n🔑 Generated Token:`);
        console.log(token);

        console.log(`\n💡 To use this token in tests, run:`);
        console.log(`TEST_TOKEN="${token}" node scripts/test-class-application-flow.js`);

        console.log(`\n📋 Or test directly with curl:`);
        console.log(`curl "http://localhost:5000/api/v1/class-applications/draft" \\`);
        console.log(`  -H "Authorization: Bearer ${token}" \\`);
        console.log(`  -H "Content-Type: application/json" \\`);
        console.log(`  -d '{"courseIds":["COURSE_ID_HERE"]}'`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

generateToken();

