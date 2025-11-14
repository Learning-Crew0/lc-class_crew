/**
 * Test the verify-by-email API endpoint
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/v1";

async function testEndpoint() {
    console.log("🧪 Testing verify-by-email API endpoint\n");

    // Wait for server to be ready
    console.log("⏳ Waiting for server to be ready...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 1: Existing user
    console.log("\n📋 Test 1: Verify existing user");
    try {
        const response = await axios.get(
            `${BASE_URL}/public/users/verify-by-email`,
            {
                params: { email: "john.doe@example.com" }
            }
        );
        console.log("✅ Status:", response.status);
        console.log("✅ Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log("❌ Status:", error.response.status);
            console.log("❌ Error:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("❌ Error:", error.message);
        }
    }

    // Test 2: Non-existent user
    console.log("\n📋 Test 2: Verify non-existent user");
    try {
        const response = await axios.get(
            `${BASE_URL}/public/users/verify-by-email`,
            {
                params: { email: "nonexistent@test.com" }
            }
        );
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log("✅ Status:", error.response.status);
            console.log("✅ Expected Error:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("❌ Error:", error.message);
        }
    }

    // Test 3: Missing email
    console.log("\n📋 Test 3: Missing email parameter");
    try {
        const response = await axios.get(
            `${BASE_URL}/public/users/verify-by-email`
        );
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log("✅ Status:", error.response.status);
            console.log("✅ Expected Error:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("❌ Error:", error.message);
        }
    }

    // Test 4: Check if route exists
    console.log("\n📋 Test 4: Checking route registration...");
    try {
        const response = await axios.get(`${BASE_URL}/public/users/verify-by-email`);
        console.log("✅ Route exists and responds");
    } catch (error) {
        if (error.response && error.response.status !== 404) {
            console.log("✅ Route exists (got non-404 response)");
        } else if (error.response && error.response.status === 404) {
            console.log("❌ Route NOT found - check route registration");
            console.log("❌ Error:", error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.log("❌ Server is not running on http://localhost:5000");
        } else {
            console.log("❌ Error:", error.message);
        }
    }

    console.log("\n✅ All tests completed!");
}

testEndpoint().catch(console.error);

