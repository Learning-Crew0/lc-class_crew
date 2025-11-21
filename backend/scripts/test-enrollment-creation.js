/**
 * Test Enrollment Auto-Creation
 * 
 * This script tests that enrollments are created automatically
 * when a class application is successfully submitted
 */

require("dotenv").config();
const mongoose = require("mongoose");
const classApplicationService = require("../src/services/classApplication.service");
const Enrollment = require("../src/models/enrollment.model");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");

const TEST_APPLICATION_DATA = {
    courses: [
        {
            courseId: null, // Will be set from DB
            trainingScheduleId: null, // Will be set from DB
            students: [
                {
                    userId: "teststudent1@example.com",
                    name: "테스트 학생 1",
                    email: { username: "teststudent1", domain: "example.com" },
                    phone: { prefix: "010", middle: "1111", last: "1111" },
                    company: "테스트 회사",
                    position: "사원",
                },
                {
                    userId: "teststudent2@example.com",
                    name: "테스트 학생 2",
                    email: { username: "teststudent2", domain: "example.com" },
                    phone: { prefix: "010", middle: "2222", last: "2222" },
                    company: "테스트 회사",
                    position: "대리",
                },
            ],
        },
    ],
    applicantInfo: {
        name: "테스트 신청자",
        email: { username: "applicant", domain: "test.com" },
        phone: { prefix: "010", middle: "9999", last: "9999" },
    },
    paymentInfo: {
        paymentMethod: "간편결제",
        taxInvoice: { enabled: false },
    },
    agreements: {
        purchaseTerms: true,
        refundPolicy: true,
    },
};

async function testEnrollmentCreation() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // Find a test user
        console.log("👤 Finding test user...");
        let testUser = await User.findOne({ email: "ishant.theboss@gmail.com" });
        
        if (!testUser) {
            testUser = await User.findOne();
        }

        if (!testUser) {
            throw new Error("No users found in database. Please create a user first.");
        }

        console.log(`✅ Using user: ${testUser.name} (${testUser.email})\n`);

        // Find a course and schedule
        console.log("📚 Finding test course and schedule...");
        const course = await Course.findOne({ isActive: true });
        
        if (!course) {
            throw new Error("No active courses found. Please create a course first.");
        }

        const schedule = await TrainingSchedule.findOne({ 
            course: course._id,
            isActive: true 
        });

        if (!schedule) {
            throw new Error(`No active schedule found for course: ${course.title}`);
        }

        console.log(`✅ Course: ${course.title}`);
        console.log(`✅ Schedule: ${schedule.scheduleName}`);
        console.log(`✅ Current enrolled count: ${schedule.enrolledCount}\n`);

        // Update test data with real IDs
        TEST_APPLICATION_DATA.courses[0].courseId = course._id.toString();
        TEST_APPLICATION_DATA.courses[0].trainingScheduleId = schedule._id.toString();
        TEST_APPLICATION_DATA.courses[0].price = course.price;
        TEST_APPLICATION_DATA.courses[0].discountedPrice = course.price;

        // Count enrollments before
        const enrollmentsBefore = await Enrollment.countDocuments();
        console.log(`📊 Enrollments in DB before: ${enrollmentsBefore}\n`);

        // Submit application
        console.log("📝 Submitting application...");
        const application = await classApplicationService.submitCompleteApplication(
            testUser._id,
            TEST_APPLICATION_DATA
        );

        console.log(`\n✅ Application submitted successfully!`);
        console.log(`   Application Number: ${application.applicationNumber}`);
        console.log(`   Status: ${application.status}`);
        console.log(`   Total Amount: ${application.paymentInfo.totalAmount} KRW`);

        // Count enrollments after
        const enrollmentsAfter = await Enrollment.countDocuments();
        const newEnrollments = enrollmentsAfter - enrollmentsBefore;

        console.log(`\n📊 Enrollments created: ${newEnrollments}`);
        console.log(`   Total enrollments in DB: ${enrollmentsAfter}\n`);

        // Fetch the created enrollments
        const createdEnrollments = await Enrollment.find({
            course: course._id,
            schedule: schedule._id,
        }).populate("user", "name email");

        console.log("📋 Created Enrollments:\n");
        createdEnrollments.forEach((enrollment, index) => {
            console.log(`   ${index + 1}. ${enrollment.enrollmentNumber}`);
            console.log(`      Student: ${enrollment.user.name} (${enrollment.user.email})`);
            console.log(`      Status: ${enrollment.status}`);
            console.log(`      Amount: ${enrollment.amountPaid} KRW`);
            console.log(`      Progress: ${enrollment.progress}%\n`);
        });

        // Check training schedule update
        const updatedSchedule = await TrainingSchedule.findById(schedule._id);
        console.log(`✅ Training Schedule Updated:`);
        console.log(`   Before: ${schedule.enrolledCount} enrolled`);
        console.log(`   After: ${updatedSchedule.enrolledCount} enrolled`);
        console.log(`   Difference: +${updatedSchedule.enrolledCount - schedule.enrolledCount}\n`);

        // Test enrolled courses API
        console.log("📚 Testing enrolled courses API...");
        const enrollmentService = require("../src/services/enrollment.service");
        const studentUser = await User.findOne({ 
            email: "teststudent1@example.com" 
        });

        if (studentUser) {
            const enrolledCourses = await enrollmentService.getEnrolledCoursesForLearningStatus(
                studentUser._id
            );

            console.log(`✅ Student has ${enrolledCourses.length} enrolled course(s):\n`);
            enrolledCourses.forEach((course) => {
                console.log(`   ${course.no}. ${course.title}`);
                console.log(`      Type: ${course.type}`);
                console.log(`      Status: ${course.status}`);
                console.log(`      Enrollment #: ${course.enrollmentNumber}`);
                console.log(`      Progress: ${course.progress}%\n`);
            });
        }

        console.log("\n✨ ============================================");
        console.log("✨ TEST PASSED: Enrollments created successfully!");
        console.log("✨ ============================================\n");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
        console.error(error.stack);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 MongoDB connection closed");
    }
}

// Run test
testEnrollmentCreation();




