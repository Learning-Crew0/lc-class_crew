/**
 * Test script for FAQ API endpoints
 */

const axios = require("axios");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/v1`;

async function testFAQAPI() {
    console.log("🧪 FAQ API Test Suite\n");
    console.log(`📍 Testing against: ${BASE_URL}\n`);

    // Wait for server
    console.log("⏳ Waiting for server to be ready...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 1: Get all FAQs (no filters)
    console.log("=" .repeat(60));
    console.log("TEST 1: GET /api/v1/public/faqs (No filters)");
    console.log("=".repeat(60));
    
    try {
        const response = await axios.get(`${API_URL}/public/faqs`);
        console.log("✅ PASS - API returned data");
        console.log(`   Status: ${response.status}`);
        console.log(`   Total FAQs: ${response.data.data.length}`);
        console.log(`   Response structure:`, JSON.stringify(response.data, null, 2).substring(0, 500) + "...");
    } catch (error) {
        console.log("❌ FAIL - API request failed");
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 2: Get active FAQs only
    console.log("\n" + "=".repeat(60));
    console.log("TEST 2: GET /api/v1/public/faqs?isActive=true");
    console.log("=".repeat(60));
    
    try {
        const response = await axios.get(`${API_URL}/public/faqs`, {
            params: { isActive: true }
        });
        console.log("✅ PASS - API returned active FAQs");
        console.log(`   Status: ${response.status}`);
        console.log(`   Total FAQs: ${response.data.data.length}`);
        
        if (response.data.data.length > 0) {
            console.log(`\n   Sample FAQ:`);
            const sample = response.data.data[0];
            console.log(`   - Question: ${sample.question}`);
            console.log(`   - Category: ${sample.category}`);
            console.log(`   - Active: ${sample.isActive}`);
        }
    } catch (error) {
        console.log("❌ FAIL - API request failed");
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 3: Get active FAQs with limit
    console.log("\n" + "=".repeat(60));
    console.log("TEST 3: GET /api/v1/public/faqs?isActive=true&limit=100");
    console.log("=".repeat(60));
    
    try {
        const response = await axios.get(`${API_URL}/public/faqs`, {
            params: { isActive: true, limit: 100 }
        });
        console.log("✅ PASS - API returned FAQs with limit");
        console.log(`   Status: ${response.status}`);
        console.log(`   Total FAQs: ${response.data.data.length}`);
        console.log(`   Pagination:`, response.data.pagination || "No pagination info");
    } catch (error) {
        console.log("❌ FAIL - API request failed");
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 4: Get FAQs by category
    console.log("\n" + "=".repeat(60));
    console.log("TEST 4: GET /api/v1/public/faqs?category=signup/login");
    console.log("=".repeat(60));
    
    try {
        const response = await axios.get(`${API_URL}/public/faqs`, {
            params: { category: "signup/login" }
        });
        console.log("✅ PASS - API returned FAQs for category");
        console.log(`   Status: ${response.status}`);
        console.log(`   Total FAQs: ${response.data.data.length}`);
        
        if (response.data.data.length > 0) {
            console.log(`\n   FAQs in this category:`);
            response.data.data.forEach((faq, idx) => {
                console.log(`   ${idx + 1}. ${faq.question.substring(0, 60)}...`);
            });
        }
    } catch (error) {
        console.log("❌ FAIL - API request failed");
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 5: Get FAQ categories
    console.log("\n" + "=".repeat(60));
    console.log("TEST 5: GET /api/v1/public/faq-categories");
    console.log("=".repeat(60));
    
    try {
        const response = await axios.get(`${API_URL}/public/faq-categories`);
        console.log("✅ PASS - API returned categories");
        console.log(`   Status: ${response.status}`);
        console.log(`   Total Categories: ${response.data.data.length}`);
        
        if (response.data.data.length > 0) {
            console.log(`\n   Categories:`);
            response.data.data.forEach((cat, idx) => {
                console.log(`   ${idx + 1}. ${cat.name || cat.slug || 'Unnamed'}`);
            });
        }
    } catch (error) {
        console.log("❌ FAIL - API request failed");
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }

    // Test 6: Test with exact frontend params
    console.log("\n" + "=".repeat(60));
    console.log("TEST 6: Frontend Params - GET /api/v1/faqs?publicOnly=true&isActive=true&limit=100");
    console.log("=".repeat(60));
    
    try {
        const response = await axios.get(`${API_URL}/faqs`, {
            params: { publicOnly: true, isActive: true, limit: 100 }
        });
        console.log("✅ PASS - API returned FAQs with frontend params");
        console.log(`   Status: ${response.status}`);
        console.log(`   Total FAQs: ${response.data.data.length}`);
    } catch (error) {
        console.log("❌ FAIL - API request failed");
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS COMPLETED");
    console.log("=".repeat(60));
    console.log("\n💡 If tests passed, frontend can uncomment the API calls!");
    console.log("   File: class-crew/src/components/CustomerserviceCenter/Faq/page.tsx");
    console.log("   Lines: 110-143 (FAQ API call)");
    console.log("   Lines: 38-67 (Category API call)");
}

testFAQAPI().catch(console.error);

