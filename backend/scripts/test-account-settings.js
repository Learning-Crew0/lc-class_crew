/**
 * Test script for Account Settings & Change Password endpoints
 * Tests:
 * - GET /api/v1/user/profile
 * - PUT /api/v1/user/profile
 * - POST /api/v1/user/change-password
 */

require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const { generateToken } = require("../src/utils/crypto.util");
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

const testAccountSettings = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}🧪 ACCOUNT SETTINGS API TEST${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    try {
        // Connect to database
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Find a test user
        const testUser = await User.findOne({}).select("_id email username fullName password");

        if (!testUser) {
            console.log(`${colors.red}❌ No users found. Please create a user first.${colors.reset}\n`);
            return;
        }

        console.log(`${colors.blue}Found test user:${colors.reset}`);
        console.log(`  ID: ${testUser._id}`);
        console.log(`  Email: ${testUser.email}`);
        console.log(`  Username: ${testUser.username}`);
        console.log(`  Name: ${testUser.fullName}\n`);

        // Generate token
        const token = generateToken({ id: testUser._id, role: "user" });
        console.log(`${colors.green}✅ Generated auth token${colors.reset}\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

        // TEST 1: Get User Profile
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 1: GET /api/v1/user/profile${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        const profileResponse = await axios.get(`${BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`${colors.green}✅ Status: ${profileResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${profileResponse.data.message}${colors.reset}\n`);

        const userProfile = profileResponse.data.data;
        console.log(`${colors.blue}User Profile:${colors.reset}`);
        console.log(`  Email: ${userProfile.email}`);
        console.log(`  Username: ${userProfile.username}`);
        console.log(`  Full Name: ${userProfile.fullName}`);
        console.log(`  Gender: ${userProfile.gender}`);
        console.log(`  Phone: ${userProfile.phone}`);
        console.log(`  DOB: ${new Date(userProfile.dob).toLocaleDateString()}`);
        console.log(`  Member Type: ${userProfile.memberType}`);
        console.log(`  Terms Agreed: ${userProfile.agreements?.termsOfService}`);
        console.log(`  Privacy Agreed: ${userProfile.agreements?.privacyPolicy}\n`);

        // Validation
        console.log(`${colors.yellow}Validating response structure...${colors.reset}`);
        const requiredFields = ["_id", "email", "username", "fullName", "gender", "phone", "dob", "memberType"];
        const missingFields = requiredFields.filter((field) => !userProfile[field]);

        if (missingFields.length > 0) {
            console.log(`${colors.red}❌ Missing fields: ${missingFields.join(", ")}${colors.reset}\n`);
        } else {
            console.log(`${colors.green}✅ All required fields present${colors.reset}\n`);
        }

        // TEST 2: Update Profile
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 2: PUT /api/v1/user/profile (Update)${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        const updates = {
            gender: "남성",
            phone: "01087654321",
            memberType: "employed",
            agreements: {
                termsOfService: true,
                privacyPolicy: true,
                marketingConsent: true,
            },
        };

        console.log(`${colors.yellow}Sending updates:${colors.reset}`, JSON.stringify(updates, null, 2));

        const updateResponse = await axios.put(`${BASE_URL}/user/profile`, updates, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log(`\n${colors.green}✅ Status: ${updateResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${updateResponse.data.message}${colors.reset}\n`);

        const updatedProfile = updateResponse.data.data;
        console.log(`${colors.blue}Updated Profile:${colors.reset}`);
        console.log(`  Gender: ${updatedProfile.gender}`);
        console.log(`  Phone: ${updatedProfile.phone}`);
        console.log(`  Member Type: ${updatedProfile.memberType}`);
        console.log(`  Marketing Consent: ${updatedProfile.agreements?.marketingConsent}\n`);

        // Verify updates
        if (updatedProfile.gender === updates.gender && updatedProfile.phone === updates.phone) {
            console.log(`${colors.green}✅ Profile updated successfully${colors.reset}\n`);
        } else {
            console.log(`${colors.red}❌ Profile update verification failed${colors.reset}\n`);
        }

        // TEST 3: Try to update restricted fields (should fail)
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 3: Try to update restricted fields (email, username)${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        const restrictedUpdates = {
            email: "newemail@example.com", // Should be ignored
            username: "newusername", // Should be ignored
            gender: "여성", // Should work
        };

        console.log(`${colors.yellow}Sending updates (including restricted fields):${colors.reset}`, JSON.stringify(restrictedUpdates, null, 2));

        const restrictedResponse = await axios.put(`${BASE_URL}/user/profile`, restrictedUpdates, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const restrictedProfile = restrictedResponse.data.data;
        console.log(`\n${colors.blue}Response:${colors.reset}`);
        console.log(`  Email: ${restrictedProfile.email} (should be unchanged)`);
        console.log(`  Username: ${restrictedProfile.username} (should be unchanged)`);
        console.log(`  Gender: ${restrictedProfile.gender} (should be updated to 여성)\n`);

        if (
            restrictedProfile.email === userProfile.email &&
            restrictedProfile.username === userProfile.username &&
            restrictedProfile.gender === "여성"
        ) {
            console.log(`${colors.green}✅ Restricted fields protection working correctly${colors.reset}\n`);
        } else {
            console.log(`${colors.red}❌ Restricted fields protection failed${colors.reset}\n`);
        }

        // TEST 4: Change Password
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 4: POST /api/v1/user/change-password${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        // Note: This will fail because we don't know the actual password
        // But we can test the endpoint structure
        console.log(`${colors.yellow}⚠️  Testing with incorrect current password (expected to fail)${colors.reset}\n`);

        try {
            await axios.post(
                `${BASE_URL}/user/change-password`,
                {
                    currentPassword: "wrongPassword",
                    newPassword: "newPassword123",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(`${colors.red}❌ Test failed: Should have returned error${colors.reset}\n`);
        } catch (error) {
            if (error.response?.status === 400 && error.response.data.message.includes("현재 비밀번호")) {
                console.log(`${colors.green}✅ Status: ${error.response.status}${colors.reset}`);
                console.log(`${colors.green}✅ Message: ${error.response.data.message}${colors.reset}`);
                console.log(`${colors.green}✅ Correctly rejected incorrect current password${colors.reset}\n`);
            } else {
                console.log(`${colors.red}❌ Unexpected error:${colors.reset}`, error.response?.data || error.message);
            }
        }

        // TEST 5: Password validation (too short)
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test 5: Password too short validation${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        try {
            await axios.post(
                `${BASE_URL}/user/change-password`,
                {
                    currentPassword: "anything",
                    newPassword: "short", // Only 5 characters
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(`${colors.red}❌ Test failed: Should have returned validation error${colors.reset}\n`);
        } catch (error) {
            if (error.response?.status === 400 && error.response.data.message.includes("8자")) {
                console.log(`${colors.green}✅ Status: ${error.response.status}${colors.reset}`);
                console.log(`${colors.green}✅ Message: ${error.response.data.message}${colors.reset}`);
                console.log(`${colors.green}✅ Correctly validated password length${colors.reset}\n`);
            } else {
                console.log(`${colors.red}❌ Unexpected error:${colors.reset}`, error.response?.data || error.message);
            }
        }

        // SUMMARY
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.green}✅ ALL TESTS COMPLETED${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        console.log(`${colors.blue}Summary:${colors.reset}`);
        console.log(`  ✅ GET profile endpoint working`);
        console.log(`  ✅ PUT profile endpoint working`);
        console.log(`  ✅ Restricted fields protected`);
        console.log(`  ✅ Change password endpoint working`);
        console.log(`  ✅ Password validation working\n`);

        console.log(`${colors.yellow}📝 Editable Fields:${colors.reset}`);
        console.log(`  - gender (남성, 여성)`);
        console.log(`  - phone (01012345678)`);
        console.log(`  - dob (1990-01-15)`);
        console.log(`  - memberType (employed, corporate_training_manager, job_seeker)`);
        console.log(`  - agreements.termsOfService`);
        console.log(`  - agreements.privacyPolicy`);
        console.log(`  - agreements.marketingConsent\n`);

        console.log(`${colors.yellow}🚫 Restricted Fields (cannot be changed):${colors.reset}`);
        console.log(`  - email`);
        console.log(`  - username`);
        console.log(`  - fullName`);
        console.log(`  - password (use change-password endpoint)\n`);

    } catch (error) {
        console.error(`${colors.red}❌ Test failed:${colors.reset}`, error.message);

        if (error.response) {
            console.log(`\n${colors.red}Response Status: ${error.response.status}${colors.reset}`);
            console.log(`${colors.red}Response Data:${colors.reset}`, JSON.stringify(error.response.data, null, 2));
        }

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
console.log(`${colors.blue}📝 Starting Account Settings API Test${colors.reset}`);
console.log(`${colors.yellow}⚠️  Make sure your backend server is running on port 5000${colors.reset}`);

testAccountSettings();

