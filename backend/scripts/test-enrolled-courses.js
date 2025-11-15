/**
 * Test script for GET /api/v1/user/enrolled-courses endpoint
 * This endpoint is used for the learning status page
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

const testEnrolledCourses = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}🧪 ENROLLED COURSES ENDPOINT TEST${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    try {
        // Connect to database to get a real user
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Find a test user
        const testUser = await User.findOne({}).select("_id email fullName");

        if (!testUser) {
            console.log(`${colors.red}❌ No users found in database. Please create a user first.${colors.reset}\n`);
            return;
        }

        console.log(`${colors.blue}Found test user:${colors.reset}`);
        console.log(`  ID: ${testUser._id}`);
        console.log(`  Email: ${testUser.email}`);
        console.log(`  Name: ${testUser.fullName}\n`);

        // Generate token for the user
        const token = generateToken({ id: testUser._id, role: "user" });
        console.log(`${colors.green}✅ Generated auth token${colors.reset}\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

        // Test: Get enrolled courses
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test: GET /api/v1/user/enrolled-courses${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        console.log(`${colors.yellow}Sending request...${colors.reset}`);

        const response = await axios.get(`${BASE_URL}/user/enrolled-courses`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(`${colors.green}✅ Status: ${response.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${response.data.message}${colors.reset}\n`);

        const { courses } = response.data.data;

        if (!courses || courses.length === 0) {
            console.log(`${colors.yellow}⚠️  No enrolled courses found for this user${colors.reset}`);
            console.log(`${colors.yellow}   Create some enrollments to test the full response${colors.reset}\n`);
        } else {
            console.log(`${colors.blue}Found ${courses.length} enrolled course(s):${colors.reset}\n`);

            courses.forEach((course, index) => {
                console.log(`${colors.cyan}Course ${index + 1}:${colors.reset}`);
                console.log(`  Title: ${course.title}`);
                console.log(`  Type: ${course.type}`);
                console.log(`  Status: ${course.status}`);
                console.log(`  Start Date: ${course.startDate ? new Date(course.startDate).toLocaleDateString() : "N/A"}`);
                console.log(`  End Date: ${course.endDate ? new Date(course.endDate).toLocaleDateString() : "N/A"}`);
                console.log(`  Progress: ${course.progress}%`);
                if (course.certificateUrl) {
                    console.log(`  Certificate: ${course.certificateUrl}`);
                }
                console.log(``);
            });

            // Verify response structure
            console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
            console.log(`${colors.yellow}Validation Checks:${colors.reset}`);
            console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

            let allValid = true;

            courses.forEach((course, index) => {
                const required = ["_id", "title", "type", "status"];
                const missing = required.filter((field) => !course[field]);

                if (missing.length > 0) {
                    console.log(`${colors.red}❌ Course ${index + 1} missing fields: ${missing.join(", ")}${colors.reset}`);
                    allValid = false;
                } else {
                    console.log(`${colors.green}✅ Course ${index + 1} has all required fields${colors.reset}`);
                }

                // Check type values
                if (!["환급", "비환급"].includes(course.type)) {
                    console.log(`${colors.red}❌ Course ${index + 1} has invalid type: ${course.type}${colors.reset}`);
                    allValid = false;
                }

                // Check status values
                if (!["수강예정", "수강중", "미수료", "수료"].includes(course.status)) {
                    console.log(`${colors.red}❌ Course ${index + 1} has invalid status: ${course.status}${colors.reset}`);
                    allValid = false;
                }

                // Check certificate URL only for completed courses
                if (course.status === "수료" && !course.certificateUrl) {
                    console.log(`${colors.yellow}⚠️  Course ${index + 1} is completed but has no certificate URL${colors.reset}`);
                }
            });

            if (allValid) {
                console.log(`\n${colors.green}✅ All courses have valid structure${colors.reset}`);
            } else {
                console.log(`\n${colors.red}❌ Some courses have validation issues${colors.reset}`);
            }

            // Check sorting (status priority)
            console.log(`\n${colors.yellow}Checking sorting...${colors.reset}`);
            const statusPriority = { "수강예정": 1, "수강중": 2, "미수료": 3, "수료": 4 };
            let sortedCorrectly = true;

            for (let i = 0; i < courses.length - 1; i++) {
                const current = statusPriority[courses[i].status] || 5;
                const next = statusPriority[courses[i + 1].status] || 5;
                if (current > next) {
                    sortedCorrectly = false;
                    break;
                }
            }

            if (sortedCorrectly) {
                console.log(`${colors.green}✅ Courses are sorted correctly by status priority${colors.reset}`);
            } else {
                console.log(`${colors.yellow}⚠️  Courses may not be sorted correctly${colors.reset}`);
            }
        }

        console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.green}✅ TEST COMPLETED SUCCESSFULLY${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        // Show sample response structure
        console.log(`${colors.blue}Expected Response Structure:${colors.reset}\n`);
        console.log(`{
  "success": true,
  "message": "수강 중인 강의 목록을 성공적으로 조회했습니다",
  "data": {
    "courses": [
      {
        "_id": "course-id",
        "title": "강의 제목",
        "type": "환급" | "비환급",
        "startDate": "2025-01-20T00:00:00.000Z",
        "endDate": "2025-02-20T00:00:00.000Z",
        "status": "수강예정" | "수강중" | "미수료" | "수료",
        "enrolledAt": "2025-01-10T00:00:00.000Z",
        "progress": 0,
        "certificateUrl": "/uploads/certificates/cert.pdf" // Only for 수료 status
      }
    ]
  }
}\n`);

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

// Run test
console.log(`${colors.blue}📝 Starting Enrolled Courses Endpoint Test${colors.reset}`);
console.log(`${colors.yellow}⚠️  Make sure your backend server is running on port 5000${colors.reset}`);

testEnrolledCourses();

