/**
 * Diagnose why enrolled courses API returns empty
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Enrollment = require("../src/models/enrollment.model");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");
const config = require("../src/config/env");

(async () => {
    console.log("\n🔍 Diagnosing Enrollment Issue...\n");
    
    await mongoose.connect(config.mongodb.uri);
    console.log("✅ Connected to production database\n");

    // Find Ishant's enrollment (raw data)
    const ishant = await User.findOne({ email: "ishant@gmail.com" });
    if (!ishant) {
        console.log("❌ Ishant not found");
        await mongoose.disconnect();
        return;
    }

    console.log(`Found user: ${ishant.fullName} (${ishant._id})\n`);

    // Get raw enrollment
    const enrollment = await Enrollment.findOne({ user: ishant._id }).lean();
    
    console.log("━━━ Raw Enrollment Data ━━━\n");
    console.log(JSON.stringify(enrollment, null, 2));
    console.log();

    // Check if course exists
    if (enrollment.course) {
        console.log(`Checking course: ${enrollment.course}\n`);
        const course = await Course.findById(enrollment.course);
        
        if (!course) {
            console.log("❌ PROBLEM FOUND: Course does NOT exist in database!");
            console.log(`   Enrollment references course ID: ${enrollment.course}`);
            console.log("   But this course doesn't exist!\n");
            console.log("💡 FIX: Update enrollment to reference an existing course\n");
        } else {
            console.log("✅ Course exists:");
            console.log(`   Name: ${course.name}`);
            console.log(`   ID: ${course._id}\n`);
        }
    } else {
        console.log("❌ PROBLEM: Enrollment has NO course reference!\n");
    }

    // Check if schedule exists
    if (enrollment.schedule) {
        console.log(`Checking schedule: ${enrollment.schedule}\n`);
        const schedule = await TrainingSchedule.findById(enrollment.schedule);
        
        if (!schedule) {
            console.log("❌ PROBLEM FOUND: Schedule does NOT exist in database!");
            console.log(`   Enrollment references schedule ID: ${enrollment.schedule}`);
            console.log("   But this schedule doesn't exist!\n");
        } else {
            console.log("✅ Schedule exists:");
            console.log(`   Start: ${schedule.startDate}`);
            console.log(`   End: ${schedule.endDate}\n`);
        }
    } else {
        console.log("❌ PROBLEM: Enrollment has NO schedule reference!\n");
    }

    // Check what courses exist
    console.log("━━━ Available Courses in Database ━━━\n");
    const courses = await Course.find().select("_id name price").limit(5);
    
    if (courses.length === 0) {
        console.log("❌ NO COURSES FOUND in database!\n");
    } else {
        courses.forEach((c, i) => {
            console.log(`${i + 1}. ${c.name}`);
            console.log(`   ID: ${c._id}`);
            console.log(`   Price: ${c.price || 'N/A'}\n`);
        });
    }

    await mongoose.disconnect();
})();


