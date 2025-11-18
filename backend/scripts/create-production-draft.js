/**
 * Create a draft application on production for testing
 */

const axios = require("axios");

const BASE_URL = "https://class-crew.onrender.com/api/v1";

// User credentials (UPDATE THESE!)
const ISHANT_CREDENTIALS = {
    username: "Ishant@1001",
    password: "YOUR_PASSWORD_HERE", // UPDATE THIS!
};

const COURSE_ID = "6916cc33ec0d797bcaef685f"; // Update if needed

(async () => {
    console.log("\n🚀 Creating Production Draft Application\n");

    try {
        // Step 1: Login
        console.log("Step 1: Logging in as Ishant...");
        const loginResponse = await axios.post(
            `${BASE_URL}/auth/login`,
            ISHANT_CREDENTIALS
        );

        const token = loginResponse.data.token;
        console.log("✅ Login successful");
        console.log(`   Token: ${token.substring(0, 20)}...\n`);

        // Step 2: Get available courses
        console.log("Step 2: Checking available courses...");
        const coursesResponse = await axios.get(`${BASE_URL}/public/courses`);
        const availableCourse = coursesResponse.data.data.courses[0];

        console.log(`✅ Found course: ${availableCourse.name}`);
        console.log(`   ID: ${availableCourse._id}\n`);

        // Step 3: Create draft application
        console.log("Step 3: Creating draft application...");
        const draftResponse = await axios.post(
            `${BASE_URL}/class-applications/draft`,
            { courseIds: [availableCourse._id] },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const applicationId = draftResponse.data.data._id;

        console.log("✅ Draft created successfully!\n");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`Application ID: ${applicationId}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        console.log("🎯 Use this ID for testing:\n");
        console.log(`   Add Student URL:`);
        console.log(
            `   POST ${BASE_URL}/class-applications/${applicationId}/add-student\n`
        );
        console.log(`   Update Payment URL:`);
        console.log(
            `   PUT ${BASE_URL}/class-applications/${applicationId}/payment-info\n`
        );
        console.log(`   Submit Application URL:`);
        console.log(
            `   POST ${BASE_URL}/class-applications/${applicationId}/submit\n`
        );
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);

        if (error.message.includes("YOUR_PASSWORD_HERE")) {
            console.log(
                "\n⚠️  Please update ISHANT_CREDENTIALS.password in the script!"
            );
        }
    }
})();

