/**
 * Test script for Personal and Corporate Inquiry endpoints
 */

const axios = require("axios");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/v1`;

async function testInquiryEndpoints() {
    console.log("🧪 Inquiry API Test Suite\n");
    console.log(`📍 Testing against: ${BASE_URL}\n`);

    // Wait for server
    console.log("⏳ Waiting for server to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 1: Personal Inquiry - Success
    console.log("=".repeat(60));
    console.log("TEST 1: POST /api/v1/public/inquiries/personal (Success)");
    console.log("=".repeat(60));

    const personalInquiryData = {
        phone: {
            prefix: "010",
            middle: "1234",
            last: "5678",
        },
        email: {
            username: "hong",
            domain: "naver.com",
        },
        name: "홍길동",
    };

    console.log("Request Body:", JSON.stringify(personalInquiryData, null, 2));

    try {
        const response = await axios.post(
            `${API_URL}/public/inquiries/personal`,
            personalInquiryData
        );
        console.log("✅ PASS - Personal inquiry created");
        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log("❌ FAIL - Personal inquiry failed");
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(
                `   Error:`,
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 2: Corporate Inquiry - Success
    console.log("\n" + "=".repeat(60));
    console.log("TEST 2: POST /api/v1/public/inquiries/corporate (Success)");
    console.log("=".repeat(60));

    const corporateInquiryData = {
        phone: {
            prefix: "010",
            middle: "5678",
            last: "9012",
        },
        email: {
            username: "manager",
            domain: "company.co.kr",
        },
        name: "김담당",
    };

    console.log("Request Body:", JSON.stringify(corporateInquiryData, null, 2));

    try {
        const response = await axios.post(
            `${API_URL}/public/inquiries/corporate`,
            corporateInquiryData
        );
        console.log("✅ PASS - Corporate inquiry created");
        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log("❌ FAIL - Corporate inquiry failed");
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(
                `   Error:`,
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 3: Personal Inquiry - Missing required field
    console.log("\n" + "=".repeat(60));
    console.log(
        "TEST 3: POST /api/v1/public/inquiries/personal (Validation Error)"
    );
    console.log("=".repeat(60));

    const invalidPersonalData = {
        phone: {
            prefix: "010",
            middle: "1234",
            last: "5678",
        },
        email: {
            username: "test",
            domain: "gmail.com",
        },
        // Missing name
    };

    console.log(
        "Request Body (missing name):",
        JSON.stringify(invalidPersonalData, null, 2)
    );

    try {
        const response = await axios.post(
            `${API_URL}/public/inquiries/personal`,
            invalidPersonalData
        );
        console.log("❌ FAIL - Should have returned validation error");
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log("✅ PASS - Validation error returned correctly");
            console.log(`   Status: ${error.response.status}`);
            console.log(
                `   Error:`,
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.log("❌ FAIL - Unexpected error");
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 4: Corporate Inquiry - Missing required field
    console.log("\n" + "=".repeat(60));
    console.log(
        "TEST 4: POST /api/v1/public/inquiries/corporate (Validation Error)"
    );
    console.log("=".repeat(60));

    const invalidCorporateData = {
        phone: {
            prefix: "010",
            middle: "1234",
            last: "5678",
        },
        email: {
            username: "test",
            domain: "test.com",
        },
        // Missing name
    };

    console.log(
        "Request Body (missing name):",
        JSON.stringify(invalidCorporateData, null, 2)
    );

    try {
        const response = await axios.post(
            `${API_URL}/public/inquiries/corporate`,
            invalidCorporateData
        );
        console.log("❌ FAIL - Should have returned validation error");
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log("✅ PASS - Validation error returned correctly");
            console.log(`   Status: ${error.response.status}`);
            console.log(
                `   Error:`,
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.log("❌ FAIL - Unexpected error");
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 5: Invalid phone format
    console.log("\n" + "=".repeat(60));
    console.log(
        "TEST 5: POST /api/v1/public/inquiries/personal (Invalid Phone)"
    );
    console.log("=".repeat(60));

    const invalidPhoneData = {
        phone: {
            prefix: "010",
            middle: "12", // Too short
            last: "5678",
        },
        email: {
            username: "test",
            domain: "gmail.com",
        },
        name: "Test User",
    };

    console.log(
        "Request Body (invalid phone):",
        JSON.stringify(invalidPhoneData, null, 2)
    );

    try {
        const response = await axios.post(
            `${API_URL}/public/inquiries/personal`,
            invalidPhoneData
        );
        console.log("❌ FAIL - Should have returned validation error");
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log("✅ PASS - Phone validation error returned correctly");
            console.log(`   Status: ${error.response.status}`);
            console.log(
                `   Error:`,
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.log("❌ FAIL - Unexpected error");
            console.log(`   Error: ${error.message}`);
        }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS COMPLETED");
    console.log("=".repeat(60));
    console.log("\n📋 Endpoints tested:");
    console.log("   ✅ POST /api/v1/public/inquiries/personal");
    console.log("   ✅ POST /api/v1/public/inquiries/corporate");
    console.log("\n💡 Next steps:");
    console.log("   1. Check admin panel for new inquiries");
    console.log("   2. Verify inquiry IDs are generated correctly");
    console.log("   3. Check console logs for admin notifications");
    console.log("   4. Frontend can now integrate these endpoints!");
}

testInquiryEndpoints().catch(console.error);
