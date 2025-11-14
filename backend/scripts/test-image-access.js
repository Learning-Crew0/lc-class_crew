const axios = require("axios");
const mongoose = require("mongoose");
const config = require("../src/config/env");
const Banner = require("../src/models/banner.model");

/**
 * Test script to verify image URLs are accessible
 */

async function testImageAccess() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // Get all banners
        console.log("📋 Fetching all banners...");
        const banners = await Banner.find();
        console.log(`Found ${banners.length} banners\n`);

        if (banners.length === 0) {
            console.log("⚠️  No banners found in database");
            return;
        }

        // Test each banner image
        for (const banner of banners) {
            console.log(`\n📌 Testing Banner: ${banner.title}`);
            console.log(`   ID: ${banner._id}`);
            console.log(`   Image URL: ${banner.image}`);

            // Test main image
            if (banner.image) {
                await testUrl(banner.image, "Main Image");
            }

            // Test mobile image
            if (banner.mobileImage) {
                console.log(`   Mobile Image URL: ${banner.mobileImage}`);
                await testUrl(banner.mobileImage, "Mobile Image");
            }
        }

        console.log("\n✅ Image access test completed!");
    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

async function testUrl(url, label) {
    try {
        // Try to fetch the image
        const response = await axios.head(url, {
            timeout: 5000,
            validateStatus: () => true, // Don't throw on any status
        });

        if (response.status === 200) {
            console.log(`   ✅ ${label}: Accessible (Status: ${response.status})`);
            console.log(
                `      Content-Type: ${response.headers["content-type"]}`
            );
            console.log(
                `      Content-Length: ${response.headers["content-length"]} bytes`
            );
            console.log(
                `      CORS: ${response.headers["access-control-allow-origin"] || "Not set"}`
            );
        } else if (response.status === 404) {
            console.log(`   ❌ ${label}: NOT FOUND (Status: 404)`);
            console.log(`      The file does not exist on the server`);
        } else {
            console.log(
                `   ⚠️  ${label}: Unexpected status (Status: ${response.status})`
            );
        }
    } catch (error) {
        console.log(`   ❌ ${label}: Error - ${error.message}`);
        if (error.code === "ECONNREFUSED") {
            console.log(`      Server is not running at this URL`);
        } else if (error.code === "ENOTFOUND") {
            console.log(`      Domain not found`);
        }
    }
}

// Run the test
console.log("🧪 Testing Image Access\n");
console.log("=" .repeat(60));
testImageAccess();

