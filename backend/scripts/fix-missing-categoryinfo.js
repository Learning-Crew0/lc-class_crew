/**
 * Fix Missing CategoryInfo Script
 * Updates courses that have a category ObjectId but missing categoryInfo
 * 
 * Usage: node backend/scripts/fix-missing-categoryinfo.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Course = require("../src/models/course.model");
const Category = require("../src/models/category.model");

const fixMissingCategoryInfo = async () => {
    try {
        console.log("🔧 Starting CategoryInfo Fix...\n");

        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log("✅ Connected to database\n");

        // Find courses with category but no categoryInfo
        const coursesNeedingFix = await Course.find({
            category: { $exists: true, $ne: null },
            $or: [
                { categoryInfo: { $exists: false } },
                { "categoryInfo.title": { $exists: false } },
            ]
        });

        console.log(`📊 Found ${coursesNeedingFix.length} courses needing categoryInfo fix\n`);

        if (coursesNeedingFix.length === 0) {
            console.log("✅ All courses already have categoryInfo!");
            await mongoose.connection.close();
            process.exit(0);
        }

        let fixed = 0;
        let skipped = 0;

        for (const course of coursesNeedingFix) {
            try {
                // Look up category from database
                const categoryDoc = await Category.findById(course.category).select('title');
                
                if (categoryDoc) {
                    course.categoryInfo = {
                        title: categoryDoc.title,
                        id: categoryDoc._id.toString(),
                    };
                    await course.save();
                    console.log(`✅ Fixed: ${course.title}`);
                    console.log(`   Category: ${categoryDoc.title}\n`);
                    fixed++;
                } else {
                    console.warn(`⚠️  Skipped: ${course.title}`);
                    console.warn(`   Category ${course.category} not found in database\n`);
                    skipped++;
                }
            } catch (error) {
                console.error(`❌ Error fixing ${course.title}:`, error.message);
                skipped++;
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log("📊 SUMMARY");
        console.log("=".repeat(50));
        console.log(`Total courses processed: ${coursesNeedingFix.length}`);
        console.log(`✅ Fixed: ${fixed}`);
        console.log(`⚠️  Skipped: ${skipped}`);

        await mongoose.connection.close();
        console.log("\n✅ Database connection closed");
        process.exit(0);

    } catch (error) {
        console.error("\n❌ Script failed:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

fixMissingCategoryInfo();

