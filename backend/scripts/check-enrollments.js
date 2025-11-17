/**
 * Check enrollments in database
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Enrollment = require("../src/models/enrollment.model");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");
const config = require("../src/config/env");

(async () => {
    console.log("\n🔍 Checking Enrollments...\n");
    
    await mongoose.connect(config.mongodb.uri);
    console.log("✅ Connected to database\n");

    // Check total enrollments
    const totalEnrollments = await Enrollment.countDocuments();
    console.log(`Total enrollments: ${totalEnrollments}\n`);

    if (totalEnrollments === 0) {
        console.log("❌ No enrollments found in database!\n");
        console.log("💡 To create enrollments, you need to:");
        console.log("   1. Submit a class application");
        console.log("   2. The system will auto-create enrollments\n");
        await mongoose.disconnect();
        return;
    }

    // Show all enrollments
    console.log("━━━ All Enrollments ━━━\n");
    const enrollments = await Enrollment.find()
        .populate("user", "email fullName")
        .populate("course", "name")
        .populate("schedule", "startDate endDate")
        .select("user course schedule status certificateUrl createdAt")
        .lean();

    enrollments.forEach((enrollment, i) => {
        console.log(`Enrollment ${i + 1}:`);
        console.log(`  User: ${enrollment.user?.email || 'Unknown'} (${enrollment.user?.fullName || 'N/A'})`);
        console.log(`  Course: ${enrollment.course?.name || 'Unknown'}`);
        console.log(`  Status: ${enrollment.status}`);
        console.log(`  Certificate: ${enrollment.certificateUrl || 'None'}`);
        console.log(`  Created: ${enrollment.createdAt}`);
        console.log();
    });

    // Check for Ishant and Karan specifically
    console.log("━━━ Checking Ishant & Karan ━━━\n");
    
    const ishant = await User.findOne({ email: "ishant@gmail.com" });
    const karan = await User.findOne({ email: "karan@gmail.com" });

    if (ishant) {
        const ishantEnrollments = await Enrollment.countDocuments({ 
            user: ishant._id,
            status: { $ne: "cancelled" }
        });
        console.log(`Ishant's active enrollments: ${ishantEnrollments}`);
    }

    if (karan) {
        const karanEnrollments = await Enrollment.countDocuments({ 
            user: karan._id,
            status: { $ne: "cancelled" }
        });
        console.log(`Karan's active enrollments: ${karanEnrollments}`);
    }

    // Check for current logged-in user
    console.log("\n━━━ Recent Enrollments ━━━\n");
    const recent = await Enrollment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "email fullName")
        .populate("course", "name")
        .select("user course status createdAt")
        .lean();

    recent.forEach((enrollment, i) => {
        console.log(`${i + 1}. ${enrollment.user?.email || 'Unknown'} - ${enrollment.course?.name || 'Unknown'} (${enrollment.status})`);
    });

    console.log();
    await mongoose.disconnect();
})();

