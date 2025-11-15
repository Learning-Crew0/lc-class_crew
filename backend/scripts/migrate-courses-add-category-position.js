/**
 * Migration Script: Add Category and Position to Existing Courses
 * 
 * This script updates all existing courses that don't have category/position fields
 * with default values so they can be properly filtered.
 * 
 * Usage:
 *   node scripts/migrate-courses-add-category-position.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../src/models/course.model");
const {
    getCategoryInfo,
    getPositionInfo,
} = require("../src/constants/categories");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/class-crew";

// Default values for courses missing category/position
const DEFAULT_CATEGORY = "other"; // Will map to "special" after checking
const DEFAULT_POSITION = "other";

const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
};

async function migrateCoursesForce() {
    try {
        console.log(`${colors.blue}🔄 Starting Course Migration...${colors.reset}\n`);

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Find all courses
        const allCourses = await Course.find({});
        console.log(`Found ${allCourses.length} total courses\n`);

        // Find courses missing category/position OR having old ObjectId format
        const coursesNeedingMigration = allCourses.filter((course) => {
            // Check if category is missing or is an ObjectId (old format)
            const needsCategoryUpdate = !course.category || 
                (typeof course.category === "object" && course.category._id);
            
            // Check if position is missing
            const needsPositionUpdate = !course.position;
            
            return needsCategoryUpdate || needsPositionUpdate;
        });

        if (coursesNeedingMigration.length === 0) {
            console.log(`${colors.green}✅ All courses already have category and position!${colors.reset}\n`);
            await mongoose.disconnect();
            return;
        }

        console.log(`${colors.yellow}⚠️  Found ${coursesNeedingMigration.length} courses needing migration${colors.reset}\n`);

        let updated = 0;
        let failed = 0;

        for (const course of coursesNeedingMigration) {
            try {
                const updates = {};
                let oldCategoryId = null;

                // Check if category needs update (missing or old ObjectId format)
                const needsCategoryUpdate = !course.category || 
                    (typeof course.category === "object" && course.category._id);

                if (needsCategoryUpdate) {
                    // Save old category ID if it exists
                    if (typeof course.category === "object" && course.category._id) {
                        oldCategoryId = course.category._id || course.category.toString();
                        updates.categoryLegacy = oldCategoryId;
                    }
                    
                    // Set default category to "special"
                    updates.category = "special";
                    const categoryInfo = getCategoryInfo("special");
                    if (categoryInfo) {
                        updates.categoryInfo = {
                            slug: categoryInfo.slug,
                            koreanName: categoryInfo.koreanName,
                            englishName: categoryInfo.englishName,
                        };
                    }
                    
                    console.log(`${colors.yellow}   Converting category from ObjectId${oldCategoryId ? ` (${oldCategoryId})` : ""} to slug: "special"${colors.reset}`);
                }

                // Add position if missing
                if (!course.position) {
                    updates.position = "other"; // Default to "other" position
                    const positionInfo = getPositionInfo("other");
                    if (positionInfo) {
                        updates.positionInfo = {
                            slug: positionInfo.slug,
                            koreanName: positionInfo.koreanName,
                            englishName: positionInfo.englishName,
                        };
                    }
                }

                if (Object.keys(updates).length > 0) {
                    await Course.findByIdAndUpdate(course._id, updates, {
                        runValidators: false, // Skip validation temporarily
                    });

                    console.log(`${colors.green}✅${colors.reset} Updated: ${course.title}`);
                    console.log(`   Category: ${updates.category || "unchanged"} (${updates.categoryInfo?.koreanName || course.categoryInfo?.koreanName || "N/A"})`);
                    console.log(`   Position: ${updates.position || "unchanged"} (${updates.positionInfo?.koreanName || course.positionInfo?.koreanName || "N/A"})`);
                    updated++;
                }
            } catch (error) {
                console.error(`${colors.red}❌${colors.reset} Failed to update: ${course.title}`);
                console.error(`   Error: ${error.message}`);
                failed++;
            }
        }

        console.log(`\n${"=".repeat(60)}`);
        console.log(`${colors.blue}📊 Migration Summary${colors.reset}`);
        console.log("=".repeat(60));
        console.log(`Total Courses: ${allCourses.length}`);
        console.log(`Needed Migration: ${coursesNeedingMigration.length}`);
        console.log(`${colors.green}✅ Successfully Updated: ${updated}${colors.reset}`);
        if (failed > 0) {
            console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
        }
        console.log("=".repeat(60));

        console.log(`\n${colors.green}✅ Migration completed!${colors.reset}\n`);

        // Disconnect
        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

    } catch (error) {
        console.error(`${colors.red}❌ Migration failed:${colors.reset}`, error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

// Run migration
migrateCoursesForce();

