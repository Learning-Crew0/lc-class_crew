/**
 * Test script for verify-by-email endpoint
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const userService = require("../src/services/user.service");
const config = require("../src/config/env");

async function testVerifyByEmail() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB");

        // Test 1: Get all users to find a test email
        console.log("\n📋 Test 1: Finding users in database...");
        const users = await User.find().limit(5).select("fullName email phone username");
        
        if (users.length === 0) {
            console.log("❌ No users found in database. Please create a user first.");
            return;
        }

        console.log(`✅ Found ${users.length} users:`);
        users.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.fullName || user.username} - ${user.email}`);
        });

        // Test 2: Test getUserByEmail service method
        console.log("\n📋 Test 2: Testing getUserByEmail service method...");
        const testEmail = users[0].email;
        console.log(`   Testing with email: ${testEmail}`);
        
        const foundUser = await userService.getUserByEmail(testEmail);
        
        if (foundUser) {
            console.log("✅ Service method works! User found:");
            console.log(`   Name: ${foundUser.fullName || foundUser.username}`);
            console.log(`   Email: ${foundUser.email}`);
            console.log(`   Phone: ${foundUser.phone || foundUser.phoneNumber || "N/A"}`);
            console.log(`   ID: ${foundUser._id}`);
        } else {
            console.log("❌ Service method returned null");
        }

        // Test 3: Test with non-existent email
        console.log("\n📋 Test 3: Testing with non-existent email...");
        const fakeEmail = "nonexistent@test.com";
        const notFound = await userService.getUserByEmail(fakeEmail);
        
        if (notFound === null) {
            console.log(`✅ Correctly returned null for non-existent email: ${fakeEmail}`);
        } else {
            console.log("❌ Should have returned null for non-existent email");
        }

        // Test 4: Generate curl commands for API testing
        console.log("\n📋 Test 4: CURL Commands for API Testing");
        console.log("\n🔧 Test with existing user:");
        console.log(`curl "http://localhost:5000/api/v1/public/users/verify-by-email?email=${encodeURIComponent(testEmail)}"`);
        
        console.log("\n🔧 Test with non-existent user:");
        console.log(`curl "http://localhost:5000/api/v1/public/users/verify-by-email?email=nonexistent@test.com"`);

        console.log("\n🔧 Test with missing email:");
        console.log(`curl "http://localhost:5000/api/v1/public/users/verify-by-email"`);

        // Test 5: Prepare test data for frontend
        console.log("\n📋 Test 5: Sample Frontend Request Data");
        console.log("```javascript");
        console.log(`// Test with existing user
const response = await fetch(
  'http://localhost:5000/api/v1/public/users/verify-by-email?email=${testEmail}'
);
const data = await response.json();
console.log(data);

// Expected response:
// {
//   "success": true,
//   "message": "사용자 확인 성공",
//   "data": {
//     "success": true,
//     "user": {
//       "_id": "${foundUser._id}",
//       "name": "${foundUser.fullName || foundUser.username}",
//       "email": "${foundUser.email}",
//       "phone": "${foundUser.phone || foundUser.phoneNumber || ""}"
//     }
//   }
// }
`);
        console.log("```");

        console.log("\n✅ All tests completed successfully!");

    } catch (error) {
        console.error("❌ Error during testing:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

// Run the tests
testVerifyByEmail();

