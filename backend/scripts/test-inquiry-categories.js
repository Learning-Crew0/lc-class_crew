/**
 * Test Script for Updated Inquiry Categories
 * Tests all 7 new category options
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/v1/public";

const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
};

console.log(`${colors.blue}🧪 Testing Updated Inquiry Categories${colors.reset}\n`);
console.log(`📍 Testing: ${BASE_URL}\n`);

const NEW_CATEGORIES = [
    { korean: "프로그램", english: "Program Inquiry" },
    { korean: "교육신청/결제", english: "Registration/Payment" },
    { korean: "수료증", english: "Certificate" },
    { korean: "단체수강", english: "Group Registration" },
    { korean: "제휴/강사 신청", english: "Partnership/Instructor" },
    { korean: "대관", english: "Venue Rental" },
    { korean: "기타", english: "Other" },
];

const runTests = async () => {
    console.log("=".repeat(70));
    console.log("📋 NEW INQUIRY CATEGORIES");
    console.log("=".repeat(70));
    
    NEW_CATEGORIES.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${colors.yellow}${cat.korean}${colors.reset} → ${colors.green}${cat.english}${colors.reset}`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("TEST: Submit inquiry with each category");
    console.log("=".repeat(70) + "\n");

    let passedTests = 0;
    let failedTests = 0;

    for (const category of NEW_CATEGORIES) {
        try {
            const testData = {
                name: "테스트 사용자",
                email: "test@example.com",
                phone: "01012345678",
                company: "테스트 회사",
                category: category.english,
                subject: `${category.korean} 문의 테스트`,
                message: "테스트 문의 내용입니다. 최소 10자 이상 작성해야 합니다.",
                agreeToTerms: true,
                countryCode: "82",
            };

            console.log(`Testing: ${colors.yellow}${category.english}${colors.reset}`);
            
            const response = await axios.post(`${BASE_URL}/inquiries`, testData);

            if (response.data.status === "success") {
                console.log(`  ${colors.green}✅ PASS${colors.reset} - Category accepted: ${category.english}\n`);
                passedTests++;
            } else {
                console.log(`  ${colors.red}❌ FAIL${colors.reset} - Unexpected response\n`);
                failedTests++;
            }
        } catch (error) {
            if (error.response) {
                console.log(`  ${colors.red}❌ FAIL${colors.reset}`);
                console.log(`  Status: ${error.response.status}`);
                console.log(`  Message: ${error.response.data.message}`);
                console.log();
            } else {
                console.log(`  ${colors.red}❌ ERROR${colors.reset}: ${error.message}\n`);
            }
            failedTests++;
        }
    }

    // Summary
    console.log("=".repeat(70));
    console.log(`${colors.blue}📊 TEST SUMMARY${colors.reset}`);
    console.log("=".repeat(70));
    console.log(`Total Tests: ${NEW_CATEGORIES.length}`);
    console.log(`${colors.green}✅ Passed: ${passedTests}${colors.reset}`);
    if (failedTests > 0) {
        console.log(`${colors.red}❌ Failed: ${failedTests}${colors.reset}`);
    }
    console.log("=".repeat(70));

    if (passedTests === NEW_CATEGORIES.length) {
        console.log(`\n${colors.green}✅ ALL CATEGORIES WORKING CORRECTLY!${colors.reset}\n`);
        console.log("Frontend can now use these category mappings:");
        console.log("\nconst categoryMap = {");
        NEW_CATEGORIES.forEach((cat) => {
            console.log(`    "${cat.korean}": "${cat.english}",`);
        });
        console.log("};\n");
    } else {
        console.log(`\n${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`);
    }
};

// Wait for server to start
setTimeout(() => {
    runTests().catch((error) => {
        console.error(`${colors.red}❌ Test suite failed:${colors.reset}`, error.message);
        process.exit(1);
    });
}, 2000);

