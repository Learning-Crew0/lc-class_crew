/**
 * Migration Script: Add New Fields to Courses
 *
 * This script updates existing courses with new fields:
 * - promotion (array)
 * - refundEligible (boolean)
 * - courseNameFormatted (string)
 * - thumbnailOrder (object)
 * - currentStatus (string)
 *
 * Usage: node backend/scripts/migrate-courses-new-fields.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Course = require("../src/models/course.model");

const migrateCourses = async () => {
    try {
        console.log("🔄 Starting course migration...");
        console.log(
            `📍 MongoDB URI: ${process.env.MONGODB_URI?.substring(0, 30)}...`
        );

        // Connect to database
        await mongoose.connect(
            process.env.MONGODB_URI || process.env.MONGO_URI
        );
        console.log("✅ Connected to database");

        // Find all courses
        const courses = await Course.find({});
        console.log(`📊 Found ${courses.length} courses to migrate`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const course of courses) {
            try {
                let needsUpdate = false;

                // Set promotion array if not exists
                if (!course.promotion) {
                    course.promotion = [];
                    needsUpdate = true;
                }

                // Set refundEligible if not exists
                if (course.refundEligible === undefined) {
                    course.refundEligible = true; // Default: refundable
                    needsUpdate = true;
                }

                // Set courseNameFormatted if not exists (use title as fallback)
                if (!course.courseNameFormatted) {
                    course.courseNameFormatted = course.title || "";
                    needsUpdate = true;
                }

                // Set thumbnailOrder if not exists
                if (!course.thumbnailOrder) {
                    course.thumbnailOrder = {
                        newest: 9999,
                        popular: 9999,
                        all: 9999,
                    };
                    needsUpdate = true;
                }

                // Set currentStatus if not exists
                if (!course.currentStatus) {
                    course.currentStatus = "upcoming"; // Default status
                    needsUpdate = true;
                }

                // Save if any updates were made
                if (needsUpdate) {
                    await course.save();
                    updatedCount++;
                    console.log(`✅ Updated: ${course.title} (${course._id})`);
                } else {
                    skippedCount++;
                    console.log(
                        `⏭️  Skipped: ${course.title} (already up to date)`
                    );
                }
            } catch (error) {
                console.error(
                    `❌ Error updating course ${course._id}:`,
                    error.message
                );
            }
        }

        console.log("\n📊 Migration Summary:");
        console.log(`   Total courses: ${courses.length}`);
        console.log(`   ✅ Updated: ${updatedCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}`);
        console.log("\n🎉 Migration completed successfully!");

        // Close database connection
        await mongoose.connection.close();
        console.log("✅ Database connection closed");

        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run migration
migrateCourses();

