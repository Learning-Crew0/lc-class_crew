/**
 * Test script for GET /api/v1/user/inquiries endpoint
 * This endpoint is used for the 1:1 Inquiry History page
 */

require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Inquiry = require("../src/models/inquiry.model");
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

const testUserInquiries = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}🧪 USER INQUIRIES ENDPOINT TEST${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    try {
        // Connect to database
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Find a test user
        const testUser = await User.findOne({}).select("_id email fullName");

        if (!testUser) {
            console.log(
                `${colors.red}❌ No users found in database. Please create a user first.${colors.reset}\n`
            );
            return;
        }

        console.log(`${colors.blue}Found test user:${colors.reset}`);
        console.log(`  ID: ${testUser._id}`);
        console.log(`  Email: ${testUser.email}`);
        console.log(`  Name: ${testUser.fullName}\n`);

        // Check if user has inquiries
        const inquiryCount = await Inquiry.countDocuments({ user: testUser._id });
        console.log(
            `${colors.blue}User has ${inquiryCount} inquiries in database${colors.reset}\n`
        );

        if (inquiryCount === 0) {
            console.log(
                `${colors.yellow}⚠️  No inquiries found for this user. Creating a test inquiry...${colors.reset}\n`
            );

            // Create a test inquiry
            await Inquiry.create({
                user: testUser._id,
                name: testUser.fullName || "Test User",
                email: testUser.email,
                phone: "01012345678",
                type: "general",
                category: "Program Inquiry",
                subject: "테스트 문의입니다",
                message: "이것은 테스트 문의 내용입니다.",
                status: "pending",
                agreeToTerms: true,
            });

            console.log(`${colors.green}✅ Created test inquiry${colors.reset}\n`);
        }

        // Generate token
        const token = generateToken({ id: testUser._id, role: "user" });
        console.log(`${colors.green}✅ Generated auth token${colors.reset}\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

        // Test: Get user inquiries
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}Test: GET /api/v1/user/inquiries${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        console.log(`${colors.yellow}Sending request...${colors.reset}`);

        const response = await axios.get(`${BASE_URL}/user/inquiries`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(`${colors.green}✅ Status: ${response.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${response.data.message}${colors.reset}\n`);

        const { inquiries, pagination } = response.data.data;

        if (!inquiries || inquiries.length === 0) {
            console.log(`${colors.yellow}⚠️  No inquiries returned (but expected some)${colors.reset}\n`);
        } else {
            console.log(
                `${colors.blue}Found ${inquiries.length} inquiry/inquiries:${colors.reset}\n`
            );

            inquiries.forEach((inquiry, index) => {
                console.log(`${colors.cyan}Inquiry ${index + 1}:${colors.reset}`);
                console.log(`  ID: ${inquiry._id}`);
                console.log(`  Title: ${inquiry.title}`);
                console.log(`  Category: ${inquiry.category}`);
                console.log(`  Status: ${inquiry.status}`);
                console.log(
                    `  Created: ${new Date(inquiry.createdAt).toLocaleDateString("ko-KR")}`
                );
                if (inquiry.reply) {
                    console.log(`  Reply: ${inquiry.reply}`);
                    console.log(
                        `  Replied At: ${new Date(inquiry.repliedAt).toLocaleDateString("ko-KR")}`
                    );
                }
                console.log(``);
            });

            // Validate response structure
            console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
            console.log(`${colors.yellow}Validation Checks:${colors.reset}`);
            console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

            let allValid = true;

            inquiries.forEach((inquiry, index) => {
                const required = ["_id", "title", "content", "category", "status", "createdAt"];
                const missing = required.filter((field) => !inquiry[field]);

                if (missing.length > 0) {
                    console.log(
                        `${colors.red}❌ Inquiry ${index + 1} missing fields: ${missing.join(", ")}${colors.reset}`
                    );
                    allValid = false;
                } else {
                    console.log(
                        `${colors.green}✅ Inquiry ${index + 1} has all required fields${colors.reset}`
                    );
                }

                // Check status values
                if (!["미확인", "답변완료"].includes(inquiry.status)) {
                    console.log(
                        `${colors.red}❌ Inquiry ${index + 1} has invalid status: ${inquiry.status}${colors.reset}`
                    );
                    allValid = false;
                } else {
                    console.log(
                        `${colors.green}✅ Inquiry ${index + 1} has valid status: ${inquiry.status}${colors.reset}`
                    );
                }

                // Check reply for completed inquiries
                if (inquiry.status === "답변완료" && !inquiry.reply) {
                    console.log(
                        `${colors.yellow}⚠️  Inquiry ${index + 1} is completed but has no reply${colors.reset}`
                    );
                }
            });

            if (allValid) {
                console.log(`\n${colors.green}✅ All inquiries have valid structure${colors.reset}`);
            } else {
                console.log(
                    `\n${colors.red}❌ Some inquiries have validation issues${colors.reset}`
                );
            }

            // Check pagination
            if (pagination) {
                console.log(`\n${colors.blue}Pagination:${colors.reset}`);
                console.log(`  Page: ${pagination.page}`);
                console.log(`  Limit: ${pagination.limit}`);
                console.log(`  Total: ${pagination.total}`);
                console.log(`  Total Pages: ${pagination.totalPages}`);
            }
        }

        console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.green}✅ TEST COMPLETED SUCCESSFULLY${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        // Show expected response structure
        console.log(`${colors.blue}Expected Response Structure:${colors.reset}\n`);
        console.log(`{
  "success": true,
  "message": "문의 내역을 성공적으로 조회했습니다",
  "data": {
    "inquiries": [
      {
        "_id": "inquiry-id",
        "title": "문의 제목",
        "content": "문의 내용",
        "category": "프로그램",
        "status": "미확인" | "답변완료",
        "createdAt": "2025-01-15T00:00:00.000Z",
        "reply": "답변 내용", // Only if status is "답변완료"
        "repliedAt": "2025-01-16T00:00:00.000Z" // Only if status is "답변완료"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}\n`);
    } catch (error) {
        console.error(`${colors.red}❌ Test failed:${colors.reset}`, error.message);

        if (error.response) {
            console.log(`\n${colors.red}Response Status: ${error.response.status}${colors.reset}`);
            console.log(
                `${colors.red}Response Data:${colors.reset}`,
                JSON.stringify(error.response.data, null, 2)
            );
        }

        if (error.code === "ECONNREFUSED") {
            console.log(
                `\n${colors.yellow}⚠️  Make sure your backend server is running on port 5000${colors.reset}\n`
            );
        }
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
};

// Run test
console.log(`${colors.blue}📝 Starting User Inquiries Endpoint Test${colors.reset}`);
console.log(`${colors.yellow}⚠️  Make sure your backend server is running on port 5000${colors.reset}`);

testUserInquiries();

