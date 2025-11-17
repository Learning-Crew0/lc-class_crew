/**
 * Test production API directly
 */

const axios = require("axios");
const {generateToken} = require("../src/utils/crypto.util");

const BASE_URL = "https://class-crew.onrender.com/api/v1";

// Ishant's ID
const ISHANT_ID = "691aebe8962da064edc9cb18";

(async () => {
    console.log("\n🧪 Testing Production API Directly...\n");

    // Generate token
    const token = generateToken({ id: ISHANT_ID, role: "user" });
    console.log(`Generated token for Ishant (${ISHANT_ID})`);
    console.log(`Token: ${token.substring(0, 30)}...\n`);

    try {
        console.log("Calling: GET /api/v1/user/enrolled-courses\n");
        
        const response = await axios.get(
            `${BASE_URL}/user/enrolled-courses`,
            { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            }
        );

        console.log("✅ Response received!\n");
        console.log("Status:", response.status);
        console.log("Message:", response.data.message);
        console.log("Courses count:", response.data.data?.courses?.length || 0);
        console.log("\nFull response:");
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log("❌ Error occurred!\n");
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        } else {
            console.log("Error:", error.message);
        }
    }

    console.log();
})();

