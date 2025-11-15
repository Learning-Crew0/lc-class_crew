const axios = require("axios");
const colors = require("colors");

const BASE_URL = "http://localhost:5000/api/v1";

// Test data
const tests = [
    {
        name: "Member Found & Info Matches",
        data: {
            phone: "01012345678", // Update with real test user
            email: "test@example.com", // Update with real test user
            name: "Test User", // Update with real test user
        },
        expectedStatus: 200,
        expectedMessage: "Member verified",
    },
    {
        name: "Not a Member (Phone not found)",
        data: {
            phone: "01099999999", // Non-existent phone
            email: "nonexistent@example.com",
            name: "Non Existent",
        },
        expectedStatus: 404,
        expectedMessage: "가입되어 있지 않습니다",
    },
    {
        name: "Info Mismatch (Email wrong)",
        data: {
            phone: "01012345678", // Real phone
            email: "wrong@example.com", // Wrong email
            name: "Test User", // Correct name
        },
        expectedStatus: 400,
        expectedMessage: "일치하지 않습니다",
    },
    {
        name: "Info Mismatch (Name wrong)",
        data: {
            phone: "01012345678", // Real phone
            email: "test@example.com", // Correct email
            name: "Wrong Name", // Wrong name
        },
        expectedStatus: 400,
        expectedMessage: "일치하지 않습니다",
    },
    {
        name: "Missing Fields (Validation Error)",
        data: {
            phone: "01012345678",
            // Missing email and name
        },
        expectedStatus: 400,
        expectedMessage: "Phone, email, and name are required",
    },
];

const runTest = async (test) => {
    console.log(`\n${"=".repeat(60)}`.cyan);
    console.log(`Testing: ${test.name}`.yellow.bold);
    console.log("=".repeat(60).cyan);

    try {
        const response = await axios.post(`${BASE_URL}/auth/verify-member`, test.data);

        console.log(`Status: ${response.status}`.green);
        console.log(`Response:`, JSON.stringify(response.data, null, 2).green);

        // Verify expected response
        if (response.status === test.expectedStatus) {
            console.log(`✅ Status matches expected: ${test.expectedStatus}`.green);
        } else {
            console.log(
                `❌ Status mismatch! Expected: ${test.expectedStatus}, Got: ${response.status}`.red
            );
        }

        if (response.data.message === test.expectedMessage) {
            console.log(`✅ Message matches expected: "${test.expectedMessage}"`.green);
        } else {
            console.log(
                `⚠️  Message differs. Expected: "${test.expectedMessage}", Got: "${response.data.message}"`.yellow
            );
        }

        return true;
    } catch (error) {
        if (error.response) {
            console.log(`Status: ${error.response.status}`.red);
            console.log(`Response:`, JSON.stringify(error.response.data, null, 2).red);

            // Check if error status matches expected
            if (error.response.status === test.expectedStatus) {
                console.log(`✅ Error status matches expected: ${test.expectedStatus}`.green);
            } else {
                console.log(
                    `❌ Status mismatch! Expected: ${test.expectedStatus}, Got: ${error.response.status}`.red
                );
            }

            if (error.response.data.message === test.expectedMessage) {
                console.log(`✅ Message matches expected: "${test.expectedMessage}"`.green);
            } else {
                console.log(
                    `⚠️  Message differs. Expected: "${test.expectedMessage}", Got: "${error.response.data.message}"`.yellow
                );
            }
        } else {
            console.log(`❌ Error: ${error.message}`.red);
            return false;
        }
    }
};

const runAllTests = async () => {
    console.log("\n" + "=".repeat(60).cyan);
    console.log("🧪 MEMBER VERIFICATION ENDPOINT TEST SUITE".cyan.bold);
    console.log("=".repeat(60).cyan);
    console.log(`Base URL: ${BASE_URL}`.yellow);
    console.log(
        `\n⚠️  NOTE: Update test data with real user credentials from your database!`.yellow.bold
    );

    let passedTests = 0;
    let failedTests = 0;

    for (const test of tests) {
        const result = await runTest(test);
        if (result !== false) {
            passedTests++;
        } else {
            failedTests++;
        }
    }

    console.log("\n" + "=".repeat(60).cyan);
    console.log("📊 TEST SUMMARY".cyan.bold);
    console.log("=".repeat(60).cyan);
    console.log(`Total Tests: ${tests.length}`.yellow);
    console.log(`Passed: ${passedTests}`.green);
    console.log(`Failed: ${failedTests}`.red);
    console.log("=".repeat(60).cyan + "\n");
};

// Instructions for updating test data
console.log("\n" + "📝 SETUP INSTRUCTIONS".yellow.bold);
console.log("=".repeat(60));
console.log(`
1. Make sure your backend server is running on port 5000
2. Update the test data in this file with a real user from your database:
   - phone: User's actual phone number
   - email: User's actual email
   - name: User's actual fullName or username
3. Run this test script: node scripts/test-verify-member.js
`.gray);

runAllTests();

