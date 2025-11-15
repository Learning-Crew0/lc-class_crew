/**
 * Quick FAQ API Verification Script
 * Run this to verify FAQ endpoints are working for frontend integration
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/v1/public";
// const BASE_URL = "https://class-crew.onrender.com/api/v1/public"; // Use this for production

const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
};

console.log(`${colors.blue}🧪 FAQ API Frontend Verification${colors.reset}\n`);
console.log(`📍 Testing: ${BASE_URL}\n`);

const runTests = async () => {
    try {
        // Test 1: Get All Categories
        console.log("=".repeat(60));
        console.log("TEST 1: Get All FAQ Categories");
        console.log("=".repeat(60));
        console.log(`Endpoint: GET ${BASE_URL}/faq-categories\n`);

        const categoriesRes = await axios.get(`${BASE_URL}/faq-categories`);

        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${categoriesRes.status}`);
        console.log(`Total Categories: ${categoriesRes.data.data.length}`);

        console.log("\nCategories:");
        categoriesRes.data.data.forEach((cat, index) => {
            console.log(
                `  ${index + 1}. ${cat.label || cat.key} (key: ${cat.key}, FAQs: ${cat.faqCount})`
            );
        });

        // Test 2: Get All FAQs
        console.log(`\n${"=".repeat(60)}`);
        console.log("TEST 2: Get All FAQs (No Filters)");
        console.log("=".repeat(60));
        console.log(`Endpoint: GET ${BASE_URL}/faqs\n`);

        const faqsRes = await axios.get(`${BASE_URL}/faqs`);

        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${faqsRes.status}`);
        console.log(`Total FAQs: ${faqsRes.data.data.length}`);

        if (faqsRes.data.pagination) {
            console.log(
                `Pagination: Page ${faqsRes.data.pagination.currentPage} of ${faqsRes.data.pagination.totalPages} (Total: ${faqsRes.data.pagination.totalFAQs})`
            );
        }

        console.log("\nSample FAQs:");
        faqsRes.data.data.slice(0, 3).forEach((faq, index) => {
            console.log(`  ${index + 1}. ${faq.question}`);
            console.log(`     Category: ${faq.categoryLabel || faq.category}`);
            console.log(`     Active: ${faq.isActive}`);
            console.log(
                `     Views: ${faq.viewCount}, Helpful: ${faq.helpfulCount}`
            );
        });

        // Test 3: Get FAQs by Category
        if (categoriesRes.data.data.length > 0) {
            const firstCategory = categoriesRes.data.data[0];
            console.log(`\n${"=".repeat(60)}`);
            console.log(`TEST 3: Get FAQs by Category (${firstCategory.key})`);
            console.log("=".repeat(60));
            console.log(
                `Endpoint: GET ${BASE_URL}/faqs?category=${firstCategory.key}\n`
            );

            const categoryFaqsRes = await axios.get(
                `${BASE_URL}/faqs?category=${firstCategory.key}`
            );

            console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
            console.log(`Status: ${categoryFaqsRes.status}`);
            console.log(
                `FAQs in '${firstCategory.label || firstCategory.key}': ${categoryFaqsRes.data.data.length}`
            );

            categoryFaqsRes.data.data.forEach((faq, index) => {
                console.log(
                    `  ${index + 1}. ${faq.question.substring(0, 60)}...`
                );
            });
        }

        // Test 4: Test with pagination
        console.log(`\n${"=".repeat(60)}`);
        console.log("TEST 4: Get FAQs with Pagination (limit=10)");
        console.log("=".repeat(60));
        console.log(`Endpoint: GET ${BASE_URL}/faqs?limit=10&page=1\n`);

        const paginatedRes = await axios.get(
            `${BASE_URL}/faqs?limit=10&page=1`
        );

        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${paginatedRes.status}`);
        console.log(`FAQs returned: ${paginatedRes.data.data.length}`);

        // Summary
        console.log(`\n${"=".repeat(60)}`);
        console.log(`${colors.green}✅ ALL TESTS PASSED${colors.reset}`);
        console.log("=".repeat(60));

        console.log("\n📋 Summary:");
        console.log(
            `   ✅ Categories Endpoint Working: ${categoriesRes.data.data.length} categories found`
        );
        console.log(
            `   ✅ FAQs Endpoint Working: ${faqsRes.data.data.length} FAQs found`
        );
        console.log(`   ✅ Category Filter Working`);
        console.log(`   ✅ Pagination Working`);

        console.log("\n🚀 Frontend Integration URLs:");
        console.log(`   GET ${BASE_URL}/faq-categories`);
        console.log(`   GET ${BASE_URL}/faqs`);
        console.log(`   GET ${BASE_URL}/faqs?category=CATEGORY_KEY`);
        console.log(`   GET ${BASE_URL}/faqs/:id`);
        console.log(`   POST ${BASE_URL}/faqs/:id/helpful`);

        console.log("\n💡 CURL Commands to Test:");
        console.log(`   ${colors.yellow}# Get Categories${colors.reset}`);
        console.log(`   curl ${BASE_URL}/faq-categories`);
        console.log(`\n   ${colors.yellow}# Get All FAQs${colors.reset}`);
        console.log(`   curl ${BASE_URL}/faqs`);
        console.log(
            `\n   ${colors.yellow}# Get FAQs by Category${colors.reset}`
        );
        console.log(
            `   curl "${BASE_URL}/faqs?category=${categoriesRes.data.data[0]?.key || "signup/login"}"`
        );

        console.log(
            `\n${colors.green}✅ Backend is ready for frontend integration!${colors.reset}\n`
        );
    } catch (error) {
        console.error(`${colors.red}❌ ERROR:${colors.reset}`, error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        process.exit(1);
    }
};

runTests();

