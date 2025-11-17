/**
 * Test script for Class Application System
 * Tests all endpoints from frontend requirements
 */

require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");
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

let userToken;
let testUser;
let testCourse;
let testSchedule;
let applicationId;

const testClassApplicationSystem = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}🧪 CLASS APPLICATION SYSTEM TEST${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    try {
        // Connect to database
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // === SETUP ===
        // Find test user
        testUser = await User.findOne({}).select("_id email fullName");
        if (!testUser) {
            console.log(`${colors.red}❌ No users found. Please create a user first.${colors.reset}\n`);
            return;
        }

        console.log(`${colors.blue}Found test user:${colors.reset}`);
        console.log(`  ID: ${testUser._id}`);
        console.log(`  Email: ${testUser.email}`);
        console.log(`  Name: ${testUser.fullName}\n`);

        // Find test course with schedule
        testCourse = await Course.findOne({}).select("_id name price");
        if (!testCourse) {
            console.log(`${colors.red}❌ No courses found. Please create a course first.${colors.reset}\n`);
            return;
        }

        testSchedule = await TrainingSchedule.findOne({ course: testCourse._id });
        if (!testSchedule) {
            console.log(`${colors.red}❌ No training schedule found for course.${colors.reset}\n`);
            return;
        }

        console.log(`${colors.blue}Found test course:${colors.reset}`);
        console.log(`  ID: ${testCourse._id}`);
        console.log(`  Name: ${testCourse.name}`);
        console.log(`  Price: ${testCourse.price}\n`);

        // Clean up any existing drafts
        const ClassApplication = require("../src/models/classApplication.model");
        const deletedCount = await ClassApplication.deleteMany({
            status: "draft",
        });
        console.log(`${colors.yellow}🧹 Cleaned up ${deletedCount.deletedCount} existing draft(s)${colors.reset}\n`);

        // Generate token
        userToken = generateToken({ id: testUser._id, role: "user" });
        console.log(`${colors.green}✅ Generated auth token${colors.reset}\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

        // === FRONTEND REQUIREMENT TESTS ===
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}📋 TESTING FRONTEND REQUIREMENTS${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        // SETUP: Add course to cart
        console.log(`${colors.yellow}Setup: Adding course to cart${colors.reset}\n`);
        try {
            await axios.post(
                `${BASE_URL}/cart/add`,
                {
                    itemType: "course",
                    productId: testCourse._id.toString(),
                    courseSchedule: testSchedule._id.toString(),
                },
                {
                    headers: { Authorization: `Bearer ${userToken}` },
                }
            );
            console.log(`${colors.green}✅ Course added to cart${colors.reset}\n`);
        } catch (error) {
            if (error.response?.status === 409 || error.response?.status === 400) {
                console.log(`${colors.yellow}⚠️  Course already in cart${colors.reset}\n`);
            } else {
                throw error;
            }
        }

        // TEST 1: Create Draft Application
        console.log(`${colors.yellow}Test 1: POST /api/v1/class-applications/draft${colors.reset}`);
        console.log(`${colors.blue}Frontend Requirement: Create draft when user proceeds from cart${colors.reset}\n`);

        const draftData = {
            courseIds: [testCourse._id.toString()],
        };

        const draftResponse = await axios.post(
            `${BASE_URL}/class-applications/draft`,
            draftData,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${draftResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${draftResponse.data.message}${colors.reset}`);
        applicationId = draftResponse.data.data._id;
        console.log(`  Application ID: ${applicationId}`);
        console.log(`  Status: ${draftResponse.data.data.status}`);
        console.log(`  Courses: ${draftResponse.data.data.courses.length}\n`);

        // TEST 2: Add Student to Course
        console.log(`${colors.yellow}Test 2: POST /api/v1/class-applications/:id/add-student${colors.reset}`);
        console.log(`${colors.blue}Frontend Requirement: Add students (up to 5 per course)${colors.reset}\n`);

        const studentData = {
            courseId: testCourse._id.toString(),
            studentData: {
                userId: testUser._id.toString(),
                name: testUser.fullName,
                email: {
                    username: testUser.email.split("@")[0],
                    domain: testUser.email.split("@")[1],
                },
                phone: {
                    prefix: "010",
                    middle: "8765",
                    last: "4321",
                },
                company: "Test Company",
                position: "Developer",
            },
        };

        const addStudentResponse = await axios.post(
            `${BASE_URL}/class-applications/${applicationId}/add-student`,
            studentData,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${addStudentResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${addStudentResponse.data.message}${colors.reset}`);
        console.log(`  Application updated with student\n`);

        // TEST 3: Update Payment Information
        console.log(`${colors.yellow}Test 3: PUT /api/v1/class-applications/:id/payment${colors.reset}`);
        console.log(`${colors.blue}Frontend Requirement: Update payment info before submit${colors.reset}\n`);

        const paymentData = {
            paymentMethod: "간편결제",
            applicantInfo: {
                name: "김담당",
                phone: {
                    prefix: "010",
                    middle: "9876",
                    last: "5432",
                },
                email: {
                    username: "kim",
                    domain: "naver.com",
                },
            },
            taxInvoice: {
                enabled: true,
                businessName: "Test Company",
                businessNumber: "123-45-67890",
                email: "test@company.com",
            },
        };

        const paymentResponse = await axios.put(
            `${BASE_URL}/class-applications/${applicationId}/payment`,
            paymentData,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${paymentResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${paymentResponse.data.message}${colors.reset}`);
        console.log(`  Payment Method: ${paymentResponse.data.data?.paymentInfo?.paymentMethod || 'N/A'}`);
        console.log(`  Applicant: ${paymentResponse.data.data?.applicantInfo?.name || 'N/A'}\n`);

        // TEST 4: Get Application Details
        console.log(`${colors.yellow}Test 4: GET /api/v1/class-applications/:id${colors.reset}`);
        console.log(`${colors.blue}Frontend Requirement: Retrieve application data for payments page${colors.reset}\n`);

        console.log(`  Fetching application: ${applicationId}`);
        console.log(`  User ID in token: ${testUser._id}\n`);

        const getAppResponse = await axios.get(
            `${BASE_URL}/class-applications/${applicationId}`,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${getAppResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${getAppResponse.data.message}${colors.reset}`);
        const appData = getAppResponse.data.data;
        console.log(`  Application ID: ${appData._id}`);
        console.log(`  Status: ${appData.status}`);
        console.log(`  Total Courses: ${appData.courses?.length || 0}`);
        console.log(`  Total Amount: ${appData.paymentInfo?.totalAmount || 0}`);
        console.log(`  Payment Method: ${appData.paymentInfo?.paymentMethod || 'N/A'}`);
        console.log(`  Applicant: ${appData.applicantInfo?.name || 'N/A'}\n`);

        // TEST 5: Submit Application
        console.log(`${colors.yellow}Test 5: POST /api/v1/class-applications/:id/submit${colors.reset}`);
        console.log(`${colors.blue}Frontend Requirement: Submit application with agreements${colors.reset}\n`);

        const submitData = {
            agreements: {
                purchaseTerms: true,
                refundPolicy: true,
            },
        };

        const submitResponse = await axios.post(
            `${BASE_URL}/class-applications/${applicationId}/submit`,
            submitData,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${submitResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${submitResponse.data.message}${colors.reset}`);
        console.log(`  New Status: ${submitResponse.data.data?.status || 'N/A'}`);
        console.log(`  Submitted At: ${submitResponse.data.data?.submittedAt || 'N/A'}`);
        console.log(`  Total Amount: ${submitResponse.data.data?.totalAmount || 0}\n`);

        // SUMMARY
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.green}✅ ALL FRONTEND REQUIREMENTS TESTED${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        console.log(`${colors.blue}Summary:${colors.reset}`);
        console.log(`  ✅ Create draft application - WORKS`);
        console.log(`  ✅ Add students to course - WORKS`);
        console.log(`  ✅ Update payment information - WORKS`);
        console.log(`  ✅ Get application details - WORKS`);
        console.log(`  ✅ Submit application - WORKS\n`);

        console.log(`${colors.yellow}🎯 API Endpoints Ready for Frontend:${colors.reset}`);
        console.log(`  - POST /api/v1/class-applications/draft`);
        console.log(`  - POST /api/v1/class-applications/:id/add-student`);
        console.log(`  - PUT /api/v1/class-applications/:id/payment`);
        console.log(`  - GET /api/v1/class-applications/:id`);
        console.log(`  - POST /api/v1/class-applications/:id/submit\n`);

        console.log(`${colors.green}🎉 Backend is ready! Frontend can now integrate!${colors.reset}\n`);

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
console.log(`${colors.blue}📝 Starting Class Application System Test${colors.reset}`);
console.log(`${colors.yellow}⚠️  Make sure your backend server is running on port 5000${colors.reset}`);

testClassApplicationSystem();

