/**
 * Test the learning status API endpoint
 */

const axios = require("axios");
const { generateToken } = require("../src/utils/crypto.util");

const BASE_URL = "http://localhost:5000/api/v1";

// Test with Ishant's ID
const ISHANT_ID = "691aebe8962da064edc9cb18";
const KARAN_ID = "69129e85ee7874b97e63119b";

(async () => {
    console.log("\n🧪 Testing Learning Status API...\n");

    // Test Ishant
    console.log("━━━ Test 1: Ishant's Enrolled Courses ━━━\n");
    const ishantToken = generateToken({ id: ISHANT_ID, role: "user" });

    try {
        const ishantResponse = await axios.get(
            `${BASE_URL}/user/enrolled-courses`,
            { headers: { Authorization: `Bearer ${ishantToken}` } }
        );

        console.log("✅ Status:", ishantResponse.status);
        console.log("✅ Message:", ishantResponse.data.message);
        console.log("✅ Courses found:", ishantResponse.data.data.courses.length);
        console.log("\nCourse data:");
        console.log(JSON.stringify(ishantResponse.data.data.courses, null, 2));
    } catch (error) {
        console.log("❌ Error:", error.response?.data || error.message);
    }

    console.log("\n━━━ Test 2: Karan's Enrolled Courses ━━━\n");
    const karanToken = generateToken({ id: KARAN_ID, role: "user" });

    try {
        const karanResponse = await axios.get(
            `${BASE_URL}/user/enrolled-courses`,
            { headers: { Authorization: `Bearer ${karanToken}` } }
        );

        console.log("✅ Status:", karanResponse.status);
        console.log("✅ Message:", karanResponse.data.message);
        console.log("✅ Courses found:", karanResponse.data.data.courses.length);
        console.log("\nCourse data:");
        console.log(JSON.stringify(karanResponse.data.data.courses, null, 2));
    } catch (error) {
        console.log("❌ Error:", error.response?.data || error.message);
    }

    console.log();
})();


