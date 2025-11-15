/**
 * Quick Test for Member Verification Endpoint
 * This script tests the new POST /api/v1/auth/verify-member endpoint
 */

require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const config = require("../src/config/env");

const BASE_URL = "http://localhost:5000/api/v1";

const colors = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
};

const testVerifyMember = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}🧪 MEMBER VERIFICATION ENDPOINT TEST${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    let testUser = null;

    try {
        // Connect to database to get a real user
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Find a test user
        testUser = await User.findOne({}).select("phone phoneNumber email fullName username");

        if (!testUser) {
            console.log(`${colors.red}❌ No users found in database. Please create a user first.${colors.reset}\n`);
            return;
        }

        console.log(`${colors.blue}Found test user:${colors.reset}`);
        console.log(`  Email: ${testUser.email}`);
        console.log(`  Phone: ${testUser.phone || testUser.phoneNumber}`);
        console.log(`  Name: ${testUser.fullName || testUser.username}\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

        // Test 1: Valid member verification
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 1: Valid Member Verification${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);

        const validData = {
            phone: testUser.phone || testUser.phoneNumber,
            email: testUser.email,
            name: testUser.fullName || testUser.username,
        };

        console.log(`Request:`, JSON.stringify(validData, null, 2));

        try {
            const response1 = await axios.post(`${BASE_URL}/auth/verify-member`, validData);
            console.log(`${colors.green}✅ Status: ${response1.status}${colors.reset}`);
            console.log(`${colors.green}Response:${colors.reset}`, JSON.stringify(response1.data, null, 2));

            if (response1.data.success === true && response1.data.message === "Member verified") {
                console.log(`${colors.green}✅ Test 1 PASSED: Member verified successfully${colors.reset}\n`);
            } else {
                console.log(`${colors.red}❌ Test 1 FAILED: Unexpected response${colors.reset}\n`);
            }
        } catch (error) {
            console.log(`${colors.red}❌ Test 1 FAILED:${colors.reset}`, error.response?.data || error.message);
        }

        // Test 2: Non-existent member
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 2: Non-existent Member${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);

        const nonExistentData = {
            phone: "01099999999",
            email: "nonexistent@example.com",
            name: "Non Existent User",
        };

        console.log(`Request:`, JSON.stringify(nonExistentData, null, 2));

        try {
            await axios.post(`${BASE_URL}/auth/verify-member`, nonExistentData);
            console.log(`${colors.red}❌ Test 2 FAILED: Should have returned 404${colors.reset}\n`);
        } catch (error) {
            if (error.response?.status === 404 && error.response.data.message === "가입되어 있지 않습니다") {
                console.log(`${colors.green}✅ Status: ${error.response.status}${colors.reset}`);
                console.log(`${colors.green}Response:${colors.reset}`, JSON.stringify(error.response.data, null, 2));
                console.log(`${colors.green}✅ Test 2 PASSED: Correctly returned 404 for non-existent user${colors.reset}\n`);
            } else {
                console.log(`${colors.red}❌ Test 2 FAILED: Wrong error response${colors.reset}`);
                console.log(`Response:`, error.response?.data || error.message);
            }
        }

        // Test 3: Info mismatch (wrong email)
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 3: Info Mismatch (Wrong Email)${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);

        const mismatchData = {
            phone: testUser.phone || testUser.phoneNumber,
            email: "wrong@example.com", // Wrong email
            name: testUser.fullName || testUser.username,
        };

        console.log(`Request:`, JSON.stringify(mismatchData, null, 2));

        try {
            await axios.post(`${BASE_URL}/auth/verify-member`, mismatchData);
            console.log(`${colors.red}❌ Test 3 FAILED: Should have returned 400${colors.reset}\n`);
        } catch (error) {
            if (error.response?.status === 400 && error.response.data.message === "일치하지 않습니다") {
                console.log(`${colors.green}✅ Status: ${error.response.status}${colors.reset}`);
                console.log(`${colors.green}Response:${colors.reset}`, JSON.stringify(error.response.data, null, 2));
                console.log(`${colors.green}✅ Test 3 PASSED: Correctly returned 400 for mismatched info${colors.reset}\n`);
            } else {
                console.log(`${colors.red}❌ Test 3 FAILED: Wrong error response${colors.reset}`);
                console.log(`Response:`, error.response?.data || error.message);
            }
        }

        // Test 4: Missing fields
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 4: Missing Required Fields${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);

        const missingFieldsData = {
            phone: testUser.phone || testUser.phoneNumber,
            // Missing email and name
        };

        console.log(`Request:`, JSON.stringify(missingFieldsData, null, 2));

        try {
            await axios.post(`${BASE_URL}/auth/verify-member`, missingFieldsData);
            console.log(`${colors.red}❌ Test 4 FAILED: Should have returned 400${colors.reset}\n`);
        } catch (error) {
            if (error.response?.status === 400) {
                console.log(`${colors.green}✅ Status: ${error.response.status}${colors.reset}`);
                console.log(`${colors.green}Response:${colors.reset}`, JSON.stringify(error.response.data, null, 2));
                console.log(`${colors.green}✅ Test 4 PASSED: Correctly returned 400 for missing fields${colors.reset}\n`);
            } else {
                console.log(`${colors.red}❌ Test 4 FAILED: Wrong error response${colors.reset}`);
                console.log(`Response:`, error.response?.data || error.message);
            }
        }

        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.green}✅ ALL TESTS COMPLETED${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    } catch (error) {
        console.error(`${colors.red}❌ Test failed:${colors.reset}`, error.message);
        if (error.code === "ECONNREFUSED") {
            console.log(`\n${colors.yellow}⚠️  Make sure your backend server is running on port 5000${colors.reset}\n`);
        }
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
};

// Run tests
console.log(`${colors.blue}📝 Starting Member Verification Endpoint Test${colors.reset}`);
console.log(`${colors.yellow}⚠️  Make sure your backend server is running on port 5000${colors.reset}`);

testVerifyMember();

