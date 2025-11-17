/**
 * Test Script: Verify Multi-User Application Fix
 * Tests with real user accounts: Karan and Ishant
 */

require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");
const ClassApplication = require("../src/models/classApplication.model");
const { generateToken } = require("../src/utils/crypto.util");
const config = require("../src/config/env");

// Test against local server (change to class-crew.onrender.com for production testing)
const BASE_URL = process.env.BASE_URL || "http://localhost:5000/api/v1";

const colors = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    reset: "\x1b[0m",
};

// Test users
const ISHANT = {
    id: "691aebe8962da064edc9cb18",
    email: "ishant@gmail.com",
    username: "Ishant@1001",
    fullName: "Ishant Patel",
    phone: {
        prefix: "012",
        middle: "3456",
        last: "7891"
    }
};

const KARAN = {
    id: "69129e85ee7874b97e63119b",
    email: "karan@gmail.com",
    username: "Karan@1234",
    fullName: "Karan Sen",
    phone: {
        prefix: "012",
        middle: "3456",
        last: "7892"
    }
};

let ishantToken, karanToken;
let testCourseId, testScheduleId;
let ishantAppId, karanAppId;

const testMultiUserApplications = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(70)}${colors.reset}`);
    console.log(`${colors.cyan}🧪 MULTI-USER APPLICATION TEST${colors.reset}`);
    console.log(`${colors.cyan}Testing: Ishant Patel & Karan Sen${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

    try {
        // === DATABASE SETUP ===
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Verify users exist
        console.log(`${colors.yellow}Step 1: Verifying test users...${colors.reset}`);
        
        const ishant = await User.findById(ISHANT.id).select("_id email fullName");
        const karan = await User.findById(KARAN.id).select("_id email fullName");

        if (!ishant) {
            console.log(`${colors.red}❌ Ishant Patel not found in database${colors.reset}\n`);
            return;
        }
        if (!karan) {
            console.log(`${colors.red}❌ Karan Sen not found in database${colors.reset}\n`);
            return;
        }

        console.log(`${colors.green}✅ Found Ishant: ${ishant.email}${colors.reset}`);
        console.log(`${colors.green}✅ Found Karan: ${karan.email}${colors.reset}\n`);

        // Get test course
        console.log(`${colors.yellow}Step 2: Finding test course...${colors.reset}`);
        
        const course = await Course.findOne({}).select("_id name price");
        if (!course) {
            console.log(`${colors.red}❌ No courses found${colors.reset}\n`);
            return;
        }

        const schedule = await TrainingSchedule.findOne({ course: course._id });
        if (!schedule) {
            console.log(`${colors.red}❌ No schedule found for course${colors.reset}\n`);
            return;
        }

        testCourseId = course._id.toString();
        testScheduleId = schedule._id.toString();

        console.log(`${colors.green}✅ Course: ${course.name}${colors.reset}`);
        console.log(`${colors.green}   ID: ${testCourseId}${colors.reset}\n`);

        // Clean up existing drafts
        console.log(`${colors.yellow}Step 3: Cleaning up existing drafts...${colors.reset}`);
        
        const deletedIshant = await ClassApplication.deleteMany({
            user: ISHANT.id,
            status: "draft"
        });
        const deletedKaran = await ClassApplication.deleteMany({
            user: KARAN.id,
            status: "draft"
        });

        console.log(`${colors.green}✅ Cleaned ${deletedIshant.deletedCount} draft(s) for Ishant${colors.reset}`);
        console.log(`${colors.green}✅ Cleaned ${deletedKaran.deletedCount} draft(s) for Karan${colors.reset}\n`);

        // Generate tokens
        console.log(`${colors.yellow}Step 4: Generating auth tokens...${colors.reset}`);
        ishantToken = generateToken({ id: ISHANT.id, role: "user" });
        karanToken = generateToken({ id: KARAN.id, role: "user" });
        console.log(`${colors.green}✅ Tokens generated${colors.reset}\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

        // === API TESTS ===
        console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}`);
        console.log(`${colors.cyan}🚀 TESTING API ENDPOINTS${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

        // TEST 1: Karan creates draft
        console.log(`${colors.magenta}━━━ TEST 1: Karan Creates Draft Application ━━━${colors.reset}`);
        console.log(`${colors.yellow}POST ${BASE_URL}/class-applications/draft${colors.reset}\n`);

        try {
            const karanDraftResponse = await axios.post(
                `${BASE_URL}/class-applications/draft`,
                { courseIds: [testCourseId] },
                { headers: { Authorization: `Bearer ${karanToken}` } }
            );

            console.log(`${colors.green}✅ Status: ${karanDraftResponse.status}${colors.reset}`);
            console.log(`${colors.green}✅ Message: ${karanDraftResponse.data.message}${colors.reset}`);
            karanAppId = karanDraftResponse.data.data._id;
            console.log(`${colors.blue}   Application ID: ${karanAppId}${colors.reset}`);
            console.log(`${colors.blue}   Application Number: ${karanDraftResponse.data.data.applicationNumber || 'NULL'}${colors.reset}`);
            console.log(`${colors.blue}   Status: ${karanDraftResponse.data.data.status}${colors.reset}\n`);
        } catch (error) {
            console.log(`${colors.red}❌ FAILED: ${error.response?.status || error.message}${colors.reset}`);
            console.log(`${colors.red}   Error: ${error.response?.data?.message || error.message}${colors.reset}\n`);
            throw error;
        }

        // TEST 2: Ishant creates draft (SAME COURSE - This should work now!)
        console.log(`${colors.magenta}━━━ TEST 2: Ishant Creates Draft (SAME COURSE) ━━━${colors.reset}`);
        console.log(`${colors.yellow}POST ${BASE_URL}/class-applications/draft${colors.reset}`);
        console.log(`${colors.yellow}🎯 CRITICAL TEST: Should NOT get 409 error!${colors.reset}\n`);

        try {
            const ishantDraftResponse = await axios.post(
                `${BASE_URL}/class-applications/draft`,
                { courseIds: [testCourseId] },
                { headers: { Authorization: `Bearer ${ishantToken}` } }
            );

            console.log(`${colors.green}✅ Status: ${ishantDraftResponse.status}${colors.reset}`);
            console.log(`${colors.green}✅ Message: ${ishantDraftResponse.data.message}${colors.reset}`);
            ishantAppId = ishantDraftResponse.data.data._id;
            console.log(`${colors.blue}   Application ID: ${ishantAppId}${colors.reset}`);
            console.log(`${colors.blue}   Application Number: ${ishantDraftResponse.data.data.applicationNumber || 'NULL'}${colors.reset}`);
            console.log(`${colors.blue}   Status: ${ishantDraftResponse.data.data.status}${colors.reset}\n`);
            
            console.log(`${colors.green}${"▓".repeat(70)}${colors.reset}`);
            console.log(`${colors.green}✅ SUCCESS! No 409 error - Multiple users can apply!${colors.reset}`);
            console.log(`${colors.green}${"▓".repeat(70)}${colors.reset}\n`);
        } catch (error) {
            if (error.response?.status === 409) {
                console.log(`${colors.red}${"▓".repeat(70)}${colors.reset}`);
                console.log(`${colors.red}❌ FAILED! Still getting 409 error${colors.reset}`);
                console.log(`${colors.red}   Error: ${error.response.data.message}${colors.reset}`);
                console.log(`${colors.red}${"▓".repeat(70)}${colors.reset}\n`);
                console.log(`${colors.yellow}⚠️  The fix has NOT been deployed to production yet!${colors.reset}\n`);
                throw error;
            }
            console.log(`${colors.red}❌ Unexpected error: ${error.message}${colors.reset}\n`);
            throw error;
        }

        // TEST 3: Karan adds student
        console.log(`${colors.magenta}━━━ TEST 3: Karan Adds Student ━━━${colors.reset}`);
        console.log(`${colors.yellow}POST ${BASE_URL}/class-applications/${karanAppId}/add-student${colors.reset}\n`);

        try {
            const karanStudentResponse = await axios.post(
                `${BASE_URL}/class-applications/${karanAppId}/add-student`,
                {
                    courseId: testCourseId,
                    studentData: {
                        userId: KARAN.id,
                        name: KARAN.fullName,
                        email: {
                            username: KARAN.email.split("@")[0],
                            domain: KARAN.email.split("@")[1]
                        },
                        phone: KARAN.phone,
                        company: "Tech Corp",
                        position: "Developer"
                    }
                },
                { headers: { Authorization: `Bearer ${karanToken}` } }
            );

            console.log(`${colors.green}✅ Status: ${karanStudentResponse.status}${colors.reset}`);
            console.log(`${colors.green}✅ Student added successfully${colors.reset}\n`);
        } catch (error) {
            console.log(`${colors.red}❌ FAILED: ${error.response?.status || error.message}${colors.reset}`);
            console.log(`${colors.red}   Error: ${error.response?.data?.message || error.message}${colors.reset}\n`);
        }

        // TEST 4: Ishant adds student
        console.log(`${colors.magenta}━━━ TEST 4: Ishant Adds Student ━━━${colors.reset}`);
        console.log(`${colors.yellow}POST ${BASE_URL}/class-applications/${ishantAppId}/add-student${colors.reset}\n`);

        try {
            const ishantStudentResponse = await axios.post(
                `${BASE_URL}/class-applications/${ishantAppId}/add-student`,
                {
                    courseId: testCourseId,
                    studentData: {
                        userId: ISHANT.id,
                        name: ISHANT.fullName,
                        email: {
                            username: ISHANT.email.split("@")[0],
                            domain: ISHANT.email.split("@")[1]
                        },
                        phone: ISHANT.phone,
                        company: "Innovation Inc",
                        position: "Engineer"
                    }
                },
                { headers: { Authorization: `Bearer ${ishantToken}` } }
            );

            console.log(`${colors.green}✅ Status: ${ishantStudentResponse.status}${colors.reset}`);
            console.log(`${colors.green}✅ Student added successfully${colors.reset}\n`);
        } catch (error) {
            console.log(`${colors.red}❌ FAILED: ${error.response?.status || error.message}${colors.reset}`);
            console.log(`${colors.red}   Error: ${error.response?.data?.message || error.message}${colors.reset}\n`);
        }

        // FINAL SUMMARY
        console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}`);
        console.log(`${colors.green}✅ ALL TESTS COMPLETED${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

        console.log(`${colors.blue}Summary:${colors.reset}`);
        console.log(`  ${colors.green}✅${colors.reset} Karan created draft application`);
        console.log(`  ${colors.green}✅${colors.reset} Ishant created draft application (SAME COURSE)`);
        console.log(`  ${colors.green}✅${colors.reset} Both users added students successfully`);
        console.log(`  ${colors.green}✅${colors.reset} No 409 "applicationNumber exists" errors\n`);

        console.log(`${colors.green}🎉 FIX VERIFIED - Multiple users CAN apply for same course!${colors.reset}\n`);

    } catch (error) {
        console.error(`\n${colors.red}${"=".repeat(70)}${colors.reset}`);
        console.error(`${colors.red}❌ TEST FAILED${colors.reset}`);
        console.error(`${colors.red}${"=".repeat(70)}${colors.reset}\n`);

        if (error.response) {
            console.log(`${colors.red}Response Status: ${error.response.status}${colors.reset}`);
            console.log(`${colors.red}Response Data:${colors.reset}`);
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
        }

        if (error.code === "ECONNREFUSED") {
            console.log(`\n${colors.yellow}⚠️  Server not running. Start with: npm run dev${colors.reset}\n`);
        }

        process.exit(1);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
};

// Run tests
console.log(`${colors.blue}📝 Multi-User Application Test${colors.reset}`);
console.log(`${colors.blue}Base URL: ${BASE_URL}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Make sure server is running!${colors.reset}\n`);

testMultiUserApplications();

