/**
 * Create test enrollment for a user
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Enrollment = require("../src/models/enrollment.model");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");
const config = require("../src/config/env");

// UPDATE THIS: Which user to create enrollment for?
const USER_EMAIL = "karan@gmail.com"; // or "ishant@gmail.com" or your test user

(async () => {
    console.log("\n🎯 Creating Test Enrollment...\n");
    
    await mongoose.connect(config.mongodb.uri);
    console.log("✅ Connected to database\n");

    // Find user
    const user = await User.findOne({ email: USER_EMAIL });
    if (!user) {
        console.log(`❌ User not found: ${USER_EMAIL}`);
        await mongoose.disconnect();
        return;
    }
    console.log(`✅ Found user: ${user.fullName} (${user.email})\n`);

    // Find a course
    const course = await Course.findOne();
    if (!course) {
        console.log("❌ No courses found in database");
        await mongoose.disconnect();
        return;
    }
    console.log(`✅ Found course: ${course.name}\n`);

    // Find or create schedule
    let schedule = await TrainingSchedule.findOne({ course: course._id });
    if (!schedule) {
        console.log("⚠️  No schedule found, creating one...");
        schedule = await TrainingSchedule.create({
            course: course._id,
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
            location: "테스트 교육장",
            maxParticipants: 30,
            currentParticipants: 1,
            status: "open"
        });
        console.log("✅ Schedule created\n");
    } else {
        console.log(`✅ Found schedule: ${schedule.startDate} - ${schedule.endDate}\n`);
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
        user: user._id,
        course: course._id
    });

    if (existingEnrollment) {
        console.log("⚠️  Enrollment already exists!");
        console.log(`   Status: ${existingEnrollment.status}`);
        console.log(`   ID: ${existingEnrollment._id}\n`);
        await mongoose.disconnect();
        return;
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
        user: user._id,
        course: course._id,
        schedule: schedule._id,
        enrollmentDate: new Date(),
        enrollmentNumber: `ENR-${Date.now()}`,
        paymentStatus: "completed",
        amountPaid: course.price || 300000, // Use course price or default
        status: "수강중", // 수강예정 | 수강중 | 미수료 | 수료
        progress: 0,
        certificateUrl: null
    });

    console.log("✅ Test enrollment created!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Enrollment ID: ${enrollment._id}`);
    console.log(`User: ${user.fullName}`);
    console.log(`Course: ${course.name}`);
    console.log(`Status: ${enrollment.status}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("🎉 Now refresh the learning status page!");
    console.log("   http://localhost:3000/mypage/learning-status\n");

    await mongoose.disconnect();
})();

