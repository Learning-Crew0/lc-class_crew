const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const config = require("../src/config/env");
const Banner = require("../src/models/banner.model");
const { BASE_UPLOAD_PATH } = require("../src/config/fileStorage");

/**
 * Check if banner image files actually exist on the server
 */

async function checkFilesExist() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        console.log(`📁 Upload Path: ${BASE_UPLOAD_PATH}\n`);

        // Check if uploads directory exists
        if (!fs.existsSync(BASE_UPLOAD_PATH)) {
            console.log("❌ Uploads directory does not exist!");
            console.log(`   Expected path: ${BASE_UPLOAD_PATH}`);
            return;
        }

        // List all files in uploads directory
        console.log("📋 Checking upload directories...\n");
        
        const tempPath = path.join(BASE_UPLOAD_PATH, "temp");
        console.log(`Temp folder: ${tempPath}`);
        
        if (fs.existsSync(tempPath)) {
            const files = fs.readdirSync(tempPath);
            console.log(`✅ Temp folder exists`);
            console.log(`   Files in temp: ${files.length}`);
            
            if (files.length > 0) {
                console.log("\n📄 Files found:");
                files.forEach(file => {
                    const filePath = path.join(tempPath, file);
                    const stats = fs.statSync(filePath);
                    console.log(`   - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
                });
            } else {
                console.log("   ⚠️  No files in temp folder");
            }
        } else {
            console.log("❌ Temp folder does not exist");
        }

        // Get all banners and check their images
        console.log("\n\n📋 Checking banner images...\n");
        const banners = await Banner.find();
        
        for (const banner of banners) {
            console.log(`\n📌 ${banner.title}`);
            console.log(`   URL: ${banner.image}`);
            
            // Extract filename from URL
            const urlPath = banner.image.replace(config.serverUrl, "");
            const localPath = path.join(BASE_UPLOAD_PATH, urlPath.replace("/uploads/", ""));
            
            console.log(`   Local path: ${localPath}`);
            
            if (fs.existsSync(localPath)) {
                const stats = fs.statSync(localPath);
                console.log(`   ✅ File exists (${(stats.size / 1024).toFixed(2)} KB)`);
            } else {
                console.log(`   ❌ File does NOT exist`);
            }
        }

        console.log("\n\n💡 Summary:");
        console.log("If files don't exist, you need to:");
        console.log("1. Re-upload images through admin panel, OR");
        console.log("2. Set up persistent disk on Render to prevent file loss");
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the check
console.log("🔍 File Existence Check\n");
console.log("=".repeat(60));
checkFilesExist();

