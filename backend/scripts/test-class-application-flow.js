/**
 * Test script for Class Application API
 * Tests the complete flow: create draft, verify student, add student
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const axios = require("axios");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const ClassApplication = require("../src/models/classApplication.model");
const config = require("../src/config/env");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/v1`;

let authToken = null;
let testUser = null;
let testStudent = null;
let testCourse = null;
let draftApplication = null;

async function login(email, password) {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        return response.data.data.token;
    } catch (error) {
        console.log("❌ Login failed:", error.response?.data?.message || error.message);
        console.log("\n💡 Available options:");
        console.log("   1. Set password via environment: TEST_PASSWORD=yourpassword node scripts/test-class-application-flow.js");
        console.log("   2. Use existing token: TEST_TOKEN=yourtoken node scripts/test-class-application-flow.js");
        console.log("   3. Reset user password in database to 'Test123!@#'");
        return null;
    }
}

async function runTests() {
    console.log("🧪 Class Application API Test Suite\n");
    console.log(`📍 Testing against: ${BASE_URL}\n`);

    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // ==================== SETUP ====================
        console.log("=" .repeat(60));
        console.log("SETUP - Getting Test Data");
        console.log("=".repeat(60));

        // Get test users
        const users = await User.find().limit(3).select("fullName email phone username");
        if (users.length < 2) {
            console.log("❌ Need at least 2 users in database. Please create users first.");
            return;
        }

        testUser = users[0]; // User who will create application
        testStudent = users[1]; // User who will be enrolled as student

        console.log("\n👤 Test User (Application Creator):");
        console.log(`   Name: ${testUser.fullName || testUser.username}`);
        console.log(`   Email: ${testUser.email}`);

        console.log("\n👤 Test Student (To be enrolled):");
        console.log(`   Name: ${testStudent.fullName || testStudent.username}`);
        console.log(`   Email: ${testStudent.email}`);

        // Get test course
        testCourse = await Course.findOne({ isActive: true })
            .select("title price discountedPrice");

        if (!testCourse) {
            console.log("❌ No active courses found. Please create a course first.");
            return;
        }

        console.log("\n📚 Test Course:");
        console.log(`   Title: ${testCourse.title}`);
        console.log(`   ID: ${testCourse._id}`);
        console.log(`   Price: ${testCourse.price || testCourse.discountedPrice}`);

        // Login or use provided token
        console.log("\n🔐 Authentication...");
        
        if (process.env.TEST_TOKEN) {
            authToken = process.env.TEST_TOKEN;
            console.log("✅ Using provided token from TEST_TOKEN environment variable");
            console.log(`   Token: ${authToken.substring(0, 20)}...`);
        } else {
            const password = process.env.TEST_PASSWORD || "Test123!@#";
            console.log(`   Attempting login with password from ${process.env.TEST_PASSWORD ? 'TEST_PASSWORD env var' : 'default'}...`);
            authToken = await login(testUser.email, password);
            
            if (!authToken) {
                console.log("\n❌ Failed to authenticate. Exiting tests.");
                return;
            }
            
            console.log("✅ Login successful");
            console.log(`   Token: ${authToken.substring(0, 20)}...`);
        }

        // ==================== TEST 0: ADD COURSE TO CART ====================
        console.log("\n" + "=".repeat(60));
        console.log("TEST 0: Add Course to Cart (Prerequisite)");
        console.log("=".repeat(60));

        console.log(`\n📋 POST ${API_URL}/cart/add`);
        console.log(`   Body: { itemType: "course", courseId: "${testCourse._id}", scheduleId: "..." }`);

        try {
            // First, get training schedules for the course
            const TrainingSchedule = require("../src/models/trainingSchedule.model");
            const schedule = await TrainingSchedule.findOne({ course: testCourse._id });
            
            if (!schedule) {
                console.log("⚠️  No training schedule found for course. Skipping cart add...");
                // You might need to create a schedule or skip this test
            } else {
                const addToCartResponse = await axios.post(
                    `${API_URL}/cart/add`,
                    { 
                        itemType: "course",
                        productId: testCourse._id.toString(),
                        trainingSchedule: schedule._id.toString()
                    },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                
                console.log("✅ PASS - Course added to cart");
                console.log(`   Status: ${addToCartResponse.status}`);
                console.log(`   Cart items: ${addToCartResponse.data.data.cart.items.length}`);
            }
        } catch (error) {
            console.log("⚠️  Warning - Failed to add course to cart");
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.log(`   Error: ${error.message}`);
            }
            console.log("   Continuing with test (cart might already have the course)...");
        }

        // ==================== TEST 1: CREATE DRAFT APPLICATION ====================
        console.log("\n" + "=".repeat(60));
        console.log("TEST 1: Create Draft Application");
        console.log("=".repeat(60));

        console.log(`\n📋 POST ${API_URL}/class-applications/draft`);
        console.log(`   Body: { courseIds: ["${testCourse._id}"] }`);

        try {
            const response = await axios.post(
                `${API_URL}/class-applications/draft`,
                { courseIds: [testCourse._id.toString()] },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            
            console.log("✅ PASS - Draft application created");
            console.log(`   Status: ${response.status}`);
            console.log(`   Application ID: ${response.data.data.application._id}`);
            console.log(`   Courses: ${response.data.data.application.courses.length}`);
            
            draftApplication = response.data.data.application;
            console.log(`   Full Response:`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log("❌ FAIL - Failed to create draft");
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.log(`   Error: ${error.message}`);
            }
            return;
        }

        // ==================== TEST 2: VERIFY STUDENT BY EMAIL ====================
        console.log("\n" + "=".repeat(60));
        console.log("TEST 2: Verify Student By Email");
        console.log("=".repeat(60));

        console.log(`\n📋 GET ${API_URL}/public/users/verify-by-email?email=${testStudent.email}`);

        try {
            const response = await axios.get(
                `${API_URL}/public/users/verify-by-email`,
                { params: { email: testStudent.email } }
            );
            
            console.log("✅ PASS - Student verified");
            console.log(`   Status: ${response.status}`);
            console.log(`   Student ID: ${response.data.data.user._id}`);
            console.log(`   Student Name: ${response.data.data.user.name}`);
            console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log("❌ FAIL - Failed to verify student");
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.log(`   Error: ${error.message}`);
            }
        }

        // ==================== TEST 3: ADD STUDENT TO COURSE ====================
        console.log("\n" + "=".repeat(60));
        console.log("TEST 3: Add Student to Course in Application");
        console.log("=".repeat(60));

        const studentData = {
            userId: testStudent._id.toString(),
            name: testStudent.fullName || testStudent.username,
            email: testStudent.email,
            phone: testStudent.phone || "01012345678",
            isSelf: false
        };

        console.log(`\n📋 POST ${API_URL}/class-applications/${draftApplication._id}/courses/${draftApplication.courses[0].course}/students`);
        console.log(`   Body:`, JSON.stringify(studentData, null, 2));

        try {
            const response = await axios.post(
                `${API_URL}/class-applications/${draftApplication._id}/courses/${draftApplication.courses[0].course}/students`,
                studentData,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            
            console.log("✅ PASS - Student added to course");
            console.log(`   Status: ${response.status}`);
            console.log(`   Students count: ${response.data.data.students.length}`);
            console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log("❌ FAIL - Failed to add student");
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.log(`   Error: ${error.message}`);
            }
        }

        // ==================== TEST 4: GET APPLICATION WITH STUDENTS ====================
        console.log("\n" + "=".repeat(60));
        console.log("TEST 4: Get Application Details");
        console.log("=".repeat(60));

        console.log(`\n📋 GET ${API_URL}/class-applications/${draftApplication._id}`);

        try {
            const response = await axios.get(
                `${API_URL}/class-applications/${draftApplication._id}`,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            
            console.log("✅ PASS - Application retrieved");
            console.log(`   Status: ${response.status}`);
            console.log(`   Application Status: ${response.data.data.application.status}`);
            console.log(`   Courses: ${response.data.data.application.courses.length}`);
            console.log(`   Students in first course: ${response.data.data.application.courses[0].students.length}`);
            
            if (response.data.data.application.courses[0].students.length > 0) {
                console.log(`\n   Student Details:`);
                response.data.data.application.courses[0].students.forEach((student, index) => {
                    console.log(`   ${index + 1}. ${student.name} (${student.email})`);
                });
            }
            
            console.log(`\n   Full Response:`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log("❌ FAIL - Failed to get application");
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.log(`   Error: ${error.message}`);
            }
        }

        // ==================== TEST 5: REMOVE STUDENT ====================
        console.log("\n" + "=".repeat(60));
        console.log("TEST 5: Remove Student from Course");
        console.log("=".repeat(60));

        console.log(`\n📋 DELETE ${API_URL}/class-applications/${draftApplication._id}/courses/${draftApplication.courses[0].course}/students/${testStudent._id}`);

        try {
            const response = await axios.delete(
                `${API_URL}/class-applications/${draftApplication._id}/courses/${draftApplication.courses[0].course}/students/${testStudent._id}`,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            
            console.log("✅ PASS - Student removed");
            console.log(`   Status: ${response.status}`);
            console.log(`   Students count: ${response.data.data.students.length}`);
            console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log("❌ FAIL - Failed to remove student");
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.log(`   Error: ${error.message}`);
            }
        }

        // ==================== CURL COMMANDS ====================
        console.log("\n" + "=".repeat(60));
        console.log("CURL COMMANDS FOR MANUAL TESTING");
        console.log("=".repeat(60));

        console.log("\n1️⃣ Create Draft Application:");
        console.log(`curl -X POST "${API_URL}/class-applications/draft" \\`);
        console.log(`  -H "Authorization: Bearer YOUR_TOKEN" \\`);
        console.log(`  -H "Content-Type: application/json" \\`);
        console.log(`  -d '{"courseIds":["${testCourse._id}"]}'`);

        console.log("\n2️⃣ Verify Student:");
        console.log(`curl "${API_URL}/public/users/verify-by-email?email=${testStudent.email}"`);

        console.log("\n3️⃣ Add Student to Course:");
        console.log(`curl -X POST "${API_URL}/class-applications/APPLICATION_ID/courses/COURSE_ID/students" \\`);
        console.log(`  -H "Authorization: Bearer YOUR_TOKEN" \\`);
        console.log(`  -H "Content-Type: application/json" \\`);
        console.log(`  -d '${JSON.stringify(studentData)}'`);

        console.log("\n4️⃣ Get Application:");
        console.log(`curl "${API_URL}/class-applications/APPLICATION_ID" \\`);
        console.log(`  -H "Authorization: Bearer YOUR_TOKEN"`);

        console.log("\n5️⃣ Remove Student:");
        console.log(`curl -X DELETE "${API_URL}/class-applications/APPLICATION_ID/courses/COURSE_ID/students/STUDENT_ID" \\`);
        console.log(`  -H "Authorization: Bearer YOUR_TOKEN"`);

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

