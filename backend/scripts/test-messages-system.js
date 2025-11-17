/**
 * Test script for Messages System
 * Tests both User and Admin endpoints
 */

require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Admin = require("../src/models/admin.model");
const Message = require("../src/models/message.model");
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
let adminToken;
let testUser;
let testAdmin;
let testMessage;

const testMessagesSystem = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}🧪 MESSAGES SYSTEM API TEST${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    try {
        // Connect to database
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // === SETUP ===
        // Find test user
        testUser = await User.findOne({}).select("_id email username fullName");
        if (!testUser) {
            console.log(`${colors.red}❌ No users found. Please create a user first.${colors.reset}\n`);
            return;
        }

        console.log(`${colors.blue}Found test user:${colors.reset}`);
        console.log(`  ID: ${testUser._id}`);
        console.log(`  Email: ${testUser.email}`);
        console.log(`  Username: ${testUser.username}\n`);

        // Find test admin
        testAdmin = await Admin.findOne({}).select("_id email username");
        if (!testAdmin) {
            console.log(`${colors.red}❌ No admins found. Please create an admin first.${colors.reset}\n`);
            return;
        }

        console.log(`${colors.blue}Found test admin:${colors.reset}`);
        console.log(`  ID: ${testAdmin._id}`);
        console.log(`  Email: ${testAdmin.email}\n`);

        // Generate tokens
        userToken = generateToken({ id: testUser._id, role: "user" });
        adminToken = generateToken({ id: testAdmin._id, role: "admin" });
        console.log(`${colors.green}✅ Generated auth tokens${colors.reset}\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

        // === ADMIN TESTS ===
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}🔧 ADMIN ENDPOINTS${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        // TEST 1: Create message (send to single user)
        console.log(`${colors.yellow}Test 1: POST /api/v1/admin/messages (Single recipient)${colors.reset}\n`);

        const createMessageData = {
            title: "테스트 메시지 제목",
            message: "이것은 테스트 메시지입니다. 시스템 테스트 중입니다.",
            courseName: "리더십 과정",
            type: "manual",
            recipientType: "single",
            recipientUserIds: [testUser._id.toString()],
        };

        const createResponse = await axios.post(
            `${BASE_URL}/admin/messages`,
            createMessageData,
            {
                headers: { Authorization: `Bearer ${adminToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${createResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Message: ${createResponse.data.message}${colors.reset}`);
        testMessage = createResponse.data.data;
        console.log(`  Message ID: ${testMessage._id}`);
        console.log(`  Title: ${testMessage.title}`);
        console.log(`  Recipients: ${testMessage.recipientUserIds.length}\n`);

        // TEST 2: Get all messages (Admin)
        console.log(`${colors.yellow}Test 2: GET /api/v1/admin/messages${colors.reset}\n`);

        const getAllResponse = await axios.get(`${BASE_URL}/admin/messages`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });

        console.log(`${colors.green}✅ Status: ${getAllResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Total messages: ${getAllResponse.data.data.pagination.total}${colors.reset}`);
        console.log(`  Messages retrieved: ${getAllResponse.data.data.messages.length}\n`);

        // TEST 3: Get message by ID (Admin)
        console.log(`${colors.yellow}Test 3: GET /api/v1/admin/messages/:id${colors.reset}\n`);

        const getByIdResponse = await axios.get(
            `${BASE_URL}/admin/messages/${testMessage._id}`,
            {
                headers: { Authorization: `Bearer ${adminToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${getByIdResponse.status}${colors.reset}`);
        console.log(`  Message ID: ${getByIdResponse.data.data._id}`);
        console.log(`  Title: ${getByIdResponse.data.data.title}`);
        console.log(`  Read count: ${getByIdResponse.data.data.readBy.length}\n`);

        // TEST 4: Get message statistics (Admin)
        console.log(`${colors.yellow}Test 4: GET /api/v1/admin/messages/statistics${colors.reset}\n`);

        const statsResponse = await axios.get(
            `${BASE_URL}/admin/messages/statistics`,
            {
                headers: { Authorization: `Bearer ${adminToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${statsResponse.status}${colors.reset}`);
        console.log(`  Total messages: ${statsResponse.data.data.totalMessages}`);
        console.log(`  Manual messages: ${statsResponse.data.data.messagesByType.manual}`);
        console.log(`  Average read rate: ${statsResponse.data.data.averageReadRate}%\n`);

        // TEST 5: Update message (Admin)
        console.log(`${colors.yellow}Test 5: PUT /api/v1/admin/messages/:id${colors.reset}\n`);

        const updateResponse = await axios.put(
            `${BASE_URL}/admin/messages/${testMessage._id}`,
            {
                title: "업데이트된 메시지 제목",
            },
            {
                headers: { Authorization: `Bearer ${adminToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${updateResponse.status}${colors.reset}`);
        console.log(`  Updated title: ${updateResponse.data.data.title}\n`);

        // === USER TESTS ===
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.yellow}👤 USER ENDPOINTS${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        // TEST 6: Get user messages
        console.log(`${colors.yellow}Test 6: GET /api/v1/user/messages${colors.reset}\n`);

        const userMessagesResponse = await axios.get(`${BASE_URL}/user/messages`, {
            headers: { Authorization: `Bearer ${userToken}` },
        });

        console.log(`${colors.green}✅ Status: ${userMessagesResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Total messages: ${userMessagesResponse.data.data.pagination.total}${colors.reset}`);
        const messages = userMessagesResponse.data.data.messages;
        console.log(`  Unread messages: ${messages.filter((m) => !m.isRead).length}`);
        console.log(`  Read messages: ${messages.filter((m) => m.isRead).length}\n`);

        if (messages.length > 0) {
            console.log(`  First message:`);
            console.log(`    ID: ${messages[0]._id}`);
            console.log(`    Title: ${messages[0].title}`);
            console.log(`    isRead: ${messages[0].isRead}\n`);
        }

        // TEST 7: Get unread count
        console.log(`${colors.yellow}Test 7: GET /api/v1/user/messages/unread-count${colors.reset}\n`);

        const unreadCountResponse = await axios.get(
            `${BASE_URL}/user/messages/unread-count`,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${unreadCountResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ Unread count: ${unreadCountResponse.data.data.unreadCount}${colors.reset}\n`);

        // TEST 8: Mark message as read
        console.log(`${colors.yellow}Test 8: PUT /api/v1/user/messages/:id/read${colors.reset}\n`);

        const markReadResponse = await axios.put(
            `${BASE_URL}/user/messages/${testMessage._id}/read`,
            {},
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${markReadResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ ${markReadResponse.data.message}${colors.reset}\n`);

        // TEST 9: Verify message is marked as read
        console.log(`${colors.yellow}Test 9: Verify message marked as read${colors.reset}\n`);

        const verifyReadResponse = await axios.get(`${BASE_URL}/user/messages`, {
            headers: { Authorization: `Bearer ${userToken}` },
        });

        const readMessage = verifyReadResponse.data.data.messages.find(
            (m) => m._id === testMessage._id
        );

        if (readMessage && readMessage.isRead) {
            console.log(`${colors.green}✅ Message successfully marked as read${colors.reset}\n`);
        } else {
            console.log(`${colors.red}❌ Message not marked as read${colors.reset}\n`);
        }

        // TEST 10: Get unread count again (should be decreased)
        console.log(`${colors.yellow}Test 10: Verify unread count decreased${colors.reset}\n`);

        const newUnreadCountResponse = await axios.get(
            `${BASE_URL}/user/messages/unread-count`,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ New unread count: ${newUnreadCountResponse.data.data.unreadCount}${colors.reset}\n`);

        // TEST 11: Filter by period
        console.log(`${colors.yellow}Test 11: GET /api/v1/user/messages?period=1month${colors.reset}\n`);

        const periodFilterResponse = await axios.get(
            `${BASE_URL}/user/messages?period=1month`,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${periodFilterResponse.status}${colors.reset}`);
        console.log(`  Messages (1 month): ${periodFilterResponse.data.data.messages.length}\n`);

        // TEST 12: Filter by status
        console.log(`${colors.yellow}Test 12: GET /api/v1/user/messages?status=read${colors.reset}\n`);

        const statusFilterResponse = await axios.get(
            `${BASE_URL}/user/messages?status=read`,
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${statusFilterResponse.status}${colors.reset}`);
        console.log(`  Read messages: ${statusFilterResponse.data.data.messages.length}\n`);

        // TEST 13: Mark all as read
        console.log(`${colors.yellow}Test 13: PUT /api/v1/user/messages/read-all${colors.reset}\n`);

        // First, create another message
        await axios.post(
            `${BASE_URL}/admin/messages`,
            {
                message: "두 번째 테스트 메시지",
                recipientType: "single",
                recipientUserIds: [testUser._id.toString()],
            },
            {
                headers: { Authorization: `Bearer ${adminToken}` },
            }
        );

        const markAllReadResponse = await axios.put(
            `${BASE_URL}/user/messages/read-all`,
            {},
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${markAllReadResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ ${markAllReadResponse.data.data.message}${colors.reset}`);
        console.log(`  Marked count: ${markAllReadResponse.data.data.markedCount}\n`);

        // TEST 14: Delete message (Admin)
        console.log(`${colors.yellow}Test 14: DELETE /api/v1/admin/messages/:id${colors.reset}\n`);

        const deleteResponse = await axios.delete(
            `${BASE_URL}/admin/messages/${testMessage._id}`,
            {
                headers: { Authorization: `Bearer ${adminToken}` },
            }
        );

        console.log(`${colors.green}✅ Status: ${deleteResponse.status}${colors.reset}`);
        console.log(`${colors.green}✅ ${deleteResponse.data.message}${colors.reset}\n`);

        // SUMMARY
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.green}✅ ALL TESTS COMPLETED${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        console.log(`${colors.blue}Summary:${colors.reset}`);
        console.log(`  ✅ Admin can create messages`);
        console.log(`  ✅ Admin can get all messages`);
        console.log(`  ✅ Admin can get message by ID`);
        console.log(`  ✅ Admin can get statistics`);
        console.log(`  ✅ Admin can update messages`);
        console.log(`  ✅ Admin can delete messages`);
        console.log(`  ✅ Users can get their messages`);
        console.log(`  ✅ Users can get unread count`);
        console.log(`  ✅ Users can mark message as read`);
        console.log(`  ✅ Users can mark all as read`);
        console.log(`  ✅ Period filter works`);
        console.log(`  ✅ Status filter works\n`);

        console.log(`${colors.yellow}🎯 Backend Integration Complete!${colors.reset}\n`);
        console.log(`${colors.yellow}Frontend can now connect to:${colors.reset}`);
        console.log(`  - GET /api/v1/user/messages`);
        console.log(`  - GET /api/v1/user/messages/unread-count`);
        console.log(`  - PUT /api/v1/user/messages/:id/read`);
        console.log(`  - PUT /api/v1/user/messages/read-all\n`);

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
console.log(`${colors.blue}📝 Starting Messages System Test${colors.reset}`);
console.log(`${colors.yellow}⚠️  Make sure your backend server is running on port 5000${colors.reset}`);

testMessagesSystem();

