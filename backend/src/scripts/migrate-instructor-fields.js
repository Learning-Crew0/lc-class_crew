/**
 * Migration Script: Update Instructor Fields
 * 
 * This script migrates existing instructor records to the new schema:
 * - Adds empty arrays for new fields: education, expertise, certificates, experience
 * - Maps attendanceHistory to experience if experience doesn't exist
 * 
 * Run: node src/scripts/migrate-instructor-fields.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Instructor = require("../models/instructor.model");

const migrateInstructorFields = async () => {
    try {
        console.log("🔄 Starting instructor fields migration...");

        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to database");

        // Find all instructors
        const instructors = await Instructor.find({});
        console.log(`📊 Found ${instructors.length} instructors to migrate`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const instructor of instructors) {
            let needsUpdate = false;
            const updates = {};

            // Initialize education if not exists
            if (!instructor.education || instructor.education.length === 0) {
                updates.education = [];
                needsUpdate = true;
            }

            // Initialize expertise if not exists
            if (!instructor.expertise) {
                updates.expertise = [];
                needsUpdate = true;
            }

            // Initialize certificates if not exists (keep existing if present)
            if (!instructor.certificates) {
                updates.certificates = [];
                needsUpdate = true;
            }

            // Map attendanceHistory to experience if experience doesn't exist
            if (!instructor.experience) {
                if (instructor.attendanceHistory && instructor.attendanceHistory.length > 0) {
                    updates.experience = instructor.attendanceHistory;
                    console.log(`  ↪️  Mapped attendanceHistory to experience for: ${instructor.name}`);
                } else {
                    updates.experience = [];
                }
                needsUpdate = true;
            }

            if (needsUpdate) {
                await Instructor.findByIdAndUpdate(instructor._id, updates);
                updatedCount++;
                console.log(`  ✅ Updated: ${instructor.name}`);
            } else {
                skippedCount++;
                console.log(`  ⏭️  Skipped (already migrated): ${instructor.name}`);
            }
        }

        console.log("\n📈 Migration Summary:");
        console.log(`  - Total instructors: ${instructors.length}`);
        console.log(`  - Updated: ${updatedCount}`);
        console.log(`  - Skipped: ${skippedCount}`);
        console.log("\n✅ Migration completed successfully!");

    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
    }
};

// Run migration
migrateInstructorFields();
