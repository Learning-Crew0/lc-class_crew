const mongoose = require("mongoose");
require("dotenv").config();

const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

const seedTrainingSchedules = async () => {
    try {
        await connectDB();

        // Get all active courses
        const courses = await Course.find({ isActive: true });

        if (courses.length === 0) {
            console.log("❌ No courses found. Please create courses first.");
            process.exit(1);
        }

        console.log(`📚 Found ${courses.length} courses`);

        // Delete existing training schedules
        await TrainingSchedule.deleteMany({});
        console.log("🗑️  Deleted existing training schedules");

        const schedules = [];

        // Create 3-5 training schedules for each course
        for (const course of courses) {
            const numSchedules = Math.floor(Math.random() * 3) + 3; // 3-5 schedules

            for (let i = 0; i < numSchedules; i++) {
                // Generate dates in 2025
                const monthOffset = i + 1; // January, February, March, etc.
                const startDate = new Date(2025, monthOffset, 15); // 15th of each month
                const endDate = new Date(2025, monthOffset, 17); // 3-day courses

                // Randomize some schedules to be in 2026
                if (Math.random() > 0.7) {
                    startDate.setFullYear(2026);
                    endDate.setFullYear(2026);
                }

                const schedule = {
                    course: course._id,
                    scheduleName: `${startDate.getFullYear()}년 ${
                        monthOffset + 1
                    }월 정기과정`,
                    startDate: startDate,
                    endDate: endDate,
                    availableSeats: [20, 25, 30, 35, 40][
                        Math.floor(Math.random() * 5)
                    ],
                    enrolledCount: Math.floor(Math.random() * 10), // 0-9 enrolled
                    status: "upcoming",
                    isActive: true,
                };

                schedules.push(schedule);
            }
        }

        // Bulk insert all schedules
        await TrainingSchedule.insertMany(schedules);

        console.log(`✅ Created ${schedules.length} training schedules`);
        console.log(
            `📊 Average ${Math.round(schedules.length / courses.length)} schedules per course`
        );

        // Show sample data
        console.log("\n📋 Sample Training Schedules:");
        const samples = await TrainingSchedule.find()
            .limit(5)
            .populate("course", "title");
        samples.forEach((s, i) => {
            console.log(
                `${i + 1}. ${s.course.title} - ${s.scheduleName} (${s.startDate.toLocaleDateString()})`
            );
        });

        console.log(
            "\n✅ Training schedules seeded successfully! You can now fetch them from the calendar endpoint."
        );
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding training schedules:", error);
        process.exit(1);
    }
};

seedTrainingSchedules();
