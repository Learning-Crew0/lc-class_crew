/**
 * Check enrollments in PRODUCTION database
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Enrollment = require("../src/models/enrollment.model");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");
const config = require("../src/config/env");

(async () => {
    console.log("\n🔍 Checking PRODUCTION Enrollments...\n");
    
    await mongoose.connect(config.mongodb.uri);
    console.log("✅ Connected to:", config.mongodb.uri.split("@")[1]?.split("/")[0] || "MongoDB");
    console.log();

    // Check total enrollments
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: { $ne: "cancelled" } });
    
    console.log(`Total enrollments: ${totalEnrollments}`);
    console.log(`Active enrollments: ${activeEnrollments}\n`);

    if (totalEnrollments === 0) {
        console.log("❌ NO ENROLLMENTS FOUND IN PRODUCTION!\n");
        console.log("💡 To create enrollments:");
        console.log("   1. Complete a class application submission");
        console.log("   2. Or run: node scripts/create-production-enrollment.js\n");
        await mongoose.disconnect();
        return;
    }

    // Show all enrollments
    console.log("━━━ All Enrollments ━━━\n");
    const enrollments = await Enrollment.find()
        .populate("user", "email fullName")
        .populate("course", "name")
        .select("user course status progress createdAt")
        .sort({ createdAt: -1 })
        .lean();

    enrollments.forEach((enrollment, i) => {
        console.log(`${i + 1}. ${enrollment.user?.email || 'Unknown'}`);
        console.log(`   Course: ${enrollment.course?.name || 'Unknown'}`);
        console.log(`   Status: ${enrollment.status}`);
        console.log(`   Progress: ${enrollment.progress || 0}%`);
        console.log(`   Created: ${enrollment.createdAt}\n`);
    });

    // Check for specific users who might be testing
    console.log("━━━ Checking Test Users ━━━\n");
    
    const testEmails = ["ishant@gmail.com", "karan@gmail.com"];
    
    for (const email of testEmails) {
        const user = await User.findOne({ email });
        if (user) {
            const userEnrollments = await Enrollment.countDocuments({ 
                user: user._id,
                status: { $ne: "cancelled" }
            });
            console.log(`${email}: ${userEnrollments} enrollments`);
        } else {
            console.log(`${email}: User not found`);
        }
    }

    console.log();
    await mongoose.disconnect();
})();


