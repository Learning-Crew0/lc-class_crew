/**
 * Complete test for verify-by-email functionality
 * Tests both the service layer and API endpoint
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const axios = require("axios");
const User = require("../src/models/user.model");
const userService = require("../src/services/user.service");
const config = require("../src/config/env");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/v1`;

async function runTests() {
    console.log("🧪 Complete Verify-By-Email Test Suite\n");
    console.log(`📍 Testing against: ${BASE_URL}\n`);

    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // Get test user
        const testUser = await User.findOne().select("fullName email phone username");
        if (!testUser) {
            console.log("❌ No users found in database. Please create a user first.");
            return;
        }

        console.log("👤 Test User Found:");
        console.log(`   Name: ${testUser.fullName || testUser.username}`);
        console.log(`   Email: ${testUser.email}\n`);

        // ==================== SERVICE LAYER TESTS ====================
        console.log("=" .repeat(60));
        console.log("SERVICE LAYER TESTS");
        console.log("=".repeat(60));

        // Test 1: Service - Existing user
        console.log("\n📋 Test 1: Service - Get existing user");
        const serviceResult1 = await userService.getUserByEmail(testUser.email);
        if (serviceResult1) {
            console.log("✅ PASS - User found by service");
            console.log(`   ID: ${serviceResult1._id}`);
            console.log(`   Email: ${serviceResult1.email}`);
        } else {
            console.log("❌ FAIL - Service returned null");
        }

        // Test 2: Service - Non-existent user
        console.log("\n📋 Test 2: Service - Get non-existent user");
        const serviceResult2 = await userService.getUserByEmail("fake@test.com");
        if (serviceResult2 === null) {
            console.log("✅ PASS - Service correctly returned null");
        } else {
            console.log("❌ FAIL - Service should return null");
        }

        // ==================== API ENDPOINT TESTS ====================
        console.log("\n" + "=".repeat(60));
        console.log("API ENDPOINT TESTS");
        console.log("=".repeat(60));

        // Test 3: API - Existing user
        console.log("\n📋 Test 3: API - Verify existing user");
        console.log(`   GET ${API_URL}/public/users/verify-by-email?email=${testUser.email}`);
        try {
            const response = await axios.get(
                `${API_URL}/public/users/verify-by-email`,
                { params: { email: testUser.email } }
            );
            console.log("✅ PASS - API returned success");
            console.log(`   Status: ${response.status}`);
            console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log("❌ FAIL - API request failed");
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.log(`   Error: ${error.message}`);
            }
        }

        // Test 4: API - Non-existent user
        console.log("\n📋 Test 4: API - Verify non-existent user");
        console.log(`   GET ${API_URL}/public/users/verify-by-email?email=fake@test.com`);
        try {
            const response = await axios.get(
                `${API_URL}/public/users/verify-by-email`,
                { params: { email: "fake@test.com" } }
            );
            console.log("❌ FAIL - Should have returned 404");
            console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("✅ PASS - API correctly returned 404");
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else if (error.code === 'ECONNREFUSED') {
                console.log("⚠️  SKIP - Server not running");
            } else {
                console.log("❌ FAIL - Unexpected error");
                console.log(`   Error: ${error.message}`);
            }
        }

        // Test 5: API - Missing email
        console.log("\n📋 Test 5: API - Missing email parameter");
        console.log(`   GET ${API_URL}/public/users/verify-by-email`);
        try {
            const response = await axios.get(
                `${API_URL}/public/users/verify-by-email`
            );
            console.log("❌ FAIL - Should have returned 400");
            console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log("✅ PASS - API correctly returned 400");
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else if (error.code === 'ECONNREFUSED') {
                console.log("⚠️  SKIP - Server not running");
            } else {
                console.log("❌ FAIL - Unexpected error");
                console.log(`   Error: ${error.message}`);
            }
        }

        // ==================== CURL COMMANDS ====================
        console.log("\n" + "=".repeat(60));
        console.log("CURL COMMANDS FOR MANUAL TESTING");
        console.log("=".repeat(60));

        console.log("\n✅ Test existing user:");
        console.log(`curl "${API_URL}/public/users/verify-by-email?email=${encodeURIComponent(testUser.email)}"`);

        console.log("\n❌ Test non-existent user:");
        console.log(`curl "${API_URL}/public/users/verify-by-email?email=fake@test.com"`);

        console.log("\n❌ Test missing email:");
        console.log(`curl "${API_URL}/public/users/verify-by-email"`);

        // ==================== PRODUCTION TEST ====================
        if (process.env.TEST_PRODUCTION) {
            console.log("\n" + "=".repeat(60));
            console.log("PRODUCTION TEST");
            console.log("=".repeat(60));

            const prodUrl = "https://class-crew.onrender.com/api/v1";
            console.log(`\n📋 Testing production: ${prodUrl}`);
            console.log(`   GET ${prodUrl}/public/users/verify-by-email?email=${testUser.email}`);
            
            try {
                const response = await axios.get(
                    `${prodUrl}/public/users/verify-by-email`,
                    { params: { email: testUser.email } }
                );
                console.log("✅ PRODUCTION - API works!");
                console.log(`   Status: ${response.status}`);
                console.log(`   Response:`, JSON.stringify(response.data, null, 2));
            } catch (error) {
                console.log("❌ PRODUCTION - API failed");
                if (error.response) {
                    console.log(`   Status: ${error.response.status}`);
                    console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
                } else {
                    console.log(`   Error: ${error.message}`);
                }
            }
        }

        console.log("\n" + "=".repeat(60));
        console.log("✅ ALL TESTS COMPLETED");
        console.log("=".repeat(60));

    } catch (error) {
        console.error("\n❌ Fatal Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

// Run the tests
runTests().catch(console.error);

