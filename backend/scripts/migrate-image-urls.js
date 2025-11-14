const mongoose = require("mongoose");
const config = require("../src/config/env");
const Banner = require("../src/models/banner.model");

/**
 * Migration script to convert relative image URLs to full URLs
 */

async function migrateImageUrls() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        const serverUrl = config.serverUrl;
        console.log(`📝 Server URL: ${serverUrl}\n`);

        // Get all banners
        const banners = await Banner.find();
        console.log(`📋 Found ${banners.length} banners to check\n`);

        let updatedCount = 0;

        for (const banner of banners) {
            let needsUpdate = false;
            const updates = {};

            // Check and update main image
            if (banner.image && !banner.image.startsWith("http")) {
                updates.image = `${serverUrl}${banner.image}`;
                needsUpdate = true;
                console.log(`📌 ${banner.title}`);
                console.log(`   Old: ${banner.image}`);
                console.log(`   New: ${updates.image}`);
            }

            // Check and update mobile image
            if (banner.mobileImage && !banner.mobileImage.startsWith("http")) {
                updates.mobileImage = `${serverUrl}${banner.mobileImage}`;
                needsUpdate = true;
                console.log(`   Mobile Old: ${banner.mobileImage}`);
                console.log(`   Mobile New: ${updates.mobileImage}`);
            }

            // Update if needed
            if (needsUpdate) {
                await Banner.findByIdAndUpdate(banner._id, updates);
                updatedCount++;
                console.log(`   ✅ Updated\n`);
            }
        }

        if (updatedCount === 0) {
            console.log("✨ All URLs are already in full format!");
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

// Run the migration
console.log("🔧 Image URL Migration Script\n");
console.log("=" .repeat(60));
migrateImageUrls();

