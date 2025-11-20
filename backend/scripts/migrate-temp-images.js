const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Course = require('../src/models/course.model.js');
const { BASE_UPLOAD_PATH, getFileUrl } = require('../src/config/fileStorage');

/**
 * Move file from temp to courses folder
 */
const moveTempFileToCourses = (tempUrl) => {
    if (!tempUrl || !tempUrl.includes("/uploads/temp/")) {
        return tempUrl; // Not a temp file, return as is
    }

    try {
        // Extract filename from URL
        const filename = path.basename(tempUrl);
        
        // Construct file paths
        const tempPath = path.join(BASE_UPLOAD_PATH, "temp", filename);
        const coursesPath = path.join(BASE_UPLOAD_PATH, "courses", filename);
        
        // Check if temp file exists
        if (fs.existsSync(tempPath)) {
            // Move (rename) the file
            fs.renameSync(tempPath, coursesPath);
            console.log(`  ✓ Moved: ${filename}`);
            
            // Return the new URL
            return getFileUrl("COURSES", filename);
        } else {
            console.log(`  ⚠️  Temp file not found: ${filename}`);
            return null; // File doesn't exist, return null to clear the field
        }
    } catch (error) {
        console.error(`  ❌ Error moving temp file: ${error.message}`);
        return null; // On error, return null
    }
};

async function migrateTempImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔍 Checking for courses with temp image URLs...\n');
        
        // Find all courses with temp URLs
        const coursesWithTempImages = await Course.find({
            $or: [
                { mainImage: { $regex: '/uploads/temp/' } },
                { image: { $regex: '/uploads/temp/' } },
                { hoverImage: { $regex: '/uploads/temp/' } }
            ]
        }).lean();
        
        console.log(`Found ${coursesWithTempImages.length} courses with temp images\n`);
        
        if (coursesWithTempImages.length === 0) {
            console.log('✅ No migration needed!');
            await mongoose.connection.close();
            return;
        }
        
        let migrated = 0;
        let failed = 0;
        let cleared = 0;
        
        for (const course of coursesWithTempImages) {
            console.log(`\n📚 ${course.title} (${course._id})`);
            const updates = {};
            let hadChanges = false;
            
            // Handle mainImage
            if (course.mainImage && course.mainImage.includes('/uploads/temp/')) {
                console.log(`  Processing mainImage: ${path.basename(course.mainImage)}`);
                const newUrl = moveTempFileToCourses(course.mainImage);
                if (newUrl) {
                    updates.mainImage = newUrl;
                    updates.image = newUrl; // Keep image field in sync
                    hadChanges = true;
                } else {
                    // File doesn't exist, clear the field
                    updates.$unset = updates.$unset || {};
                    updates.$unset.mainImage = "";
                    updates.$unset.image = "";
                    hadChanges = true;
                    cleared++;
                }
            }
            
            // Handle hoverImage
            if (course.hoverImage && course.hoverImage.includes('/uploads/temp/')) {
                console.log(`  Processing hoverImage: ${path.basename(course.hoverImage)}`);
                const newUrl = moveTempFileToCourses(course.hoverImage);
                if (newUrl) {
                    updates.hoverImage = newUrl;
                    hadChanges = true;
                } else {
                    // File doesn't exist, clear the field
                    updates.$unset = updates.$unset || {};
                    updates.$unset.hoverImage = "";
                    hadChanges = true;
                    cleared++;
                }
            }
            
            if (hadChanges) {
                try {
                    await Course.updateOne({ _id: course._id }, updates);
                    console.log(`  ✅ Updated course in database`);
                    migrated++;
                } catch (error) {
                    console.error(`  ❌ Failed to update course: ${error.message}`);
                    failed++;
                }
            }
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 Migration Summary:');
        console.log(`  ✅ Migrated: ${migrated} courses`);
        console.log(`  🗑️  Cleared: ${cleared} missing images`);
        console.log(`  ❌ Failed: ${failed} courses`);
        console.log('='.repeat(50));
        
        await mongoose.connection.close();
        console.log('\n✅ Migration complete!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

migrateTempImages();



