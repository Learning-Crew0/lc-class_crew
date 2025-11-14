const mongoose = require("mongoose");
const config = require("../src/config/env");
const CourseReview = require("../src/models/courseReview.model");
const Course = require("../src/models/course.model");

/**
 * Check reviews and approve them all (or list unapproved ones)
 */

async function checkAndApproveReviews() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // Get all reviews
        const allReviews = await CourseReview.find()
            .populate("course", "title")
            .populate("user", "fullName email");
        
        console.log(`📊 Total reviews in database: ${allReviews.length}\n`);

        if (allReviews.length === 0) {
            console.log("⚠️  No reviews found in database!");
            console.log("\nTo add reviews:");
            console.log("1. Use the API: POST /api/v1/courses/{courseId}/reviews");
            console.log("2. Or use the populate-reviews.ps1 script");
            return;
        }

        // Separate approved and unapproved
        const approved = allReviews.filter(r => r.isApproved);
        const unapproved = allReviews.filter(r => !r.isApproved);

        console.log(`✅ Approved reviews: ${approved.length}`);
        console.log(`⏳ Unapproved reviews: ${unapproved.length}\n`);

        if (unapproved.length > 0) {
            console.log("📋 Unapproved Reviews:\n");
            
            unapproved.forEach((review, index) => {
                console.log(`${index + 1}. Course: ${review.course?.title || 'Unknown'}`);
                console.log(`   Reviewer: ${review.reviewerName}`);
                console.log(`   Rating: ${review.rating || 'N/A'} ⭐`);
                console.log(`   Text: ${review.text.substring(0, 80)}...`);
                console.log(`   ID: ${review._id}`);
                console.log();
            });

            // Ask to approve all
            console.log("🔧 Approving all unapproved reviews...\n");
            
            const result = await CourseReview.updateMany(
                { isApproved: false },
                { $set: { isApproved: true } }
            );

            console.log(`✅ Approved ${result.modifiedCount} reviews!`);
        } else {
            console.log("✨ All reviews are already approved!");
        }

        // Show summary by course
        console.log("\n\n📚 Reviews by Course:\n");
        const courses = await Course.find();
        
        for (const course of courses) {
            const courseReviews = await CourseReview.find({
                course: course._id,
                isApproved: true
            });
            
            if (courseReviews.length > 0) {
                console.log(`📘 ${course.title}`);
                console.log(`   Course ID: ${course._id}`);
                console.log(`   Approved Reviews: ${courseReviews.length}`);
                console.log(`   API Endpoint: /api/v1/courses/${course._id}/reviews`);
                console.log();
            }
        }

        console.log("\n💡 Note: Only approved reviews (isApproved: true) appear in the API");
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the check
console.log("🔍 Review Check & Approval Tool\n");
console.log("=".repeat(60));
checkAndApproveReviews();

