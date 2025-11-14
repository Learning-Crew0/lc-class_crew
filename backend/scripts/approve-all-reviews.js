const mongoose = require("mongoose");
const config = require("../src/config/env");
const CourseReview = require("../src/models/courseReview.model");

/**
 * Approve all existing reviews in the database
 */

async function approveAllReviews() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // Get count of unapproved reviews
        const unapprovedCount = await CourseReview.countDocuments({ isApproved: false });
        const totalCount = await CourseReview.countDocuments();

        console.log(`📊 Total reviews: ${totalCount}`);
        console.log(`⏳ Unapproved reviews: ${unapprovedCount}\n`);

        if (unapprovedCount === 0) {
            console.log("✨ All reviews are already approved!");
            return;
        }

        // Approve all reviews
        console.log("🔧 Approving all reviews...");
        const result = await CourseReview.updateMany(
            { isApproved: false },
            { $set: { isApproved: true } }
        );

        console.log(`\n✅ Successfully approved ${result.modifiedCount} reviews!`);
        console.log("\n💡 From now on, all new reviews will be auto-approved.");

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the script
console.log("🚀 Approve All Reviews\n");
console.log("=".repeat(60));
approveAllReviews();

