const mongoose = require("mongoose");
const config = require("../src/config/env");
const Banner = require("../src/models/banner.model");

/**
 * Fix URLs that point to localhost and update them to production URL
 */

async function fixProductionUrls() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        const serverUrl = config.serverUrl;
        console.log(`📝 Production Server URL: ${serverUrl}\n`);

        // Get all banners
        const banners = await Banner.find();
        console.log(`📋 Found ${banners.length} banners to check\n`);

        let updatedCount = 0;

        for (const banner of banners) {
            let needsUpdate = false;
            const updates = {};

            // Check and fix main image
            if (banner.image) {
                // If it has localhost, replace with production URL
                if (banner.image.includes("localhost")) {
                    updates.image = banner.image.replace(
                        /http:\/\/localhost:\d+/,
                        serverUrl
                    );
                    needsUpdate = true;
                    console.log(`📌 ${banner.title}`);
                    console.log(`   Old: ${banner.image}`);
                    console.log(`   New: ${updates.image}`);
                }
                // If it's relative, add production URL
                else if (!banner.image.startsWith("http")) {
                    updates.image = `${serverUrl}${banner.image}`;
                    needsUpdate = true;
                    console.log(`📌 ${banner.title}`);
                    console.log(`   Old: ${banner.image}`);
                    console.log(`   New: ${updates.image}`);
                }
            }

            // Check and fix mobile image
            if (banner.mobileImage) {
                // If it has localhost, replace with production URL
                if (banner.mobileImage.includes("localhost")) {
                    updates.mobileImage = banner.mobileImage.replace(
                        /http:\/\/localhost:\d+/,
                        serverUrl
                    );
                    needsUpdate = true;
                    console.log(`   Mobile Old: ${banner.mobileImage}`);
                    console.log(`   Mobile New: ${updates.mobileImage}`);
                }
                // If it's relative, add production URL
                else if (!banner.mobileImage.startsWith("http")) {
                    updates.mobileImage = `${serverUrl}${banner.mobileImage}`;
                    needsUpdate = true;
                    console.log(`   Mobile Old: ${banner.mobileImage}`);
                    console.log(`   Mobile New: ${updates.mobileImage}`);
                }
            }

            // Update if needed
            if (needsUpdate) {
                await Banner.findByIdAndUpdate(banner._id, updates);
                updatedCount++;
                console.log(`   ✅ Updated\n`);
            }
        }

        if (updatedCount === 0) {
            console.log("✨ All URLs are already correct!");
        } else {
            console.log(`\n✅ Successfully updated ${updatedCount} banner(s)!`);
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the fix
console.log("🔧 Production URL Fix Script\n");
console.log("=".repeat(60));
fixProductionUrls();
