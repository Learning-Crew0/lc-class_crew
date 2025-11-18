/**
 * Script to update existing courses with new category IDs
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../src/models/courseNew.model");
const Category = require("../src/models/category.model");

async function updateCourseCategories() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        // Fetch all categories
        console.log("📂 Fetching categories...");
        const categories = await Category.find().sort({ order: 1 });
        console.log(`✅ Found ${categories.length} categories\n`);

        if (categories.length === 0) {
            console.log(
                "❌ No categories found! Please run seed-categories.js first."
            );
            return;
        }

        console.log("   Available categories:");
        categories.forEach((cat) => {
            console.log(`     ${cat.order}. ${cat.title} (${cat._id})`);
        });

        // Use first category (리더십/직급/계층) as default for all courses
        const defaultCategory = categories[0];
        console.log(
            `\n💡 Using "${defaultCategory.title}" as default category\n`
        );

        // Find all courses
        console.log("📚 Fetching all courses...");
        const courses = await Course.find();
        console.log(`✅ Found ${courses.length} courses\n`);

        if (courses.length === 0) {
            console.log("   No courses to update.");
            return;
        }

        console.log("🔄 Updating courses...\n");

        let updatedCount = 0;
        for (const course of courses) {
            // Update course category
            await Course.findByIdAndUpdate(course._id, {
                category: defaultCategory._id,
            });

            console.log(`✅ Updated: ${course.title}`);
            console.log(`   - Old Category: ${course.category}`);
            console.log(
                `   - New Category: ${defaultCategory._id} (${defaultCategory.title})`
            );
            console.log("");

            updatedCount++;
        }

        console.log(`🎉 Successfully updated ${updatedCount} courses!`);
        console.log(`\n📋 All courses now use: ${defaultCategory.title}`);
        console.log(
            "\n💡 You can manually change categories via the admin panel if needed."
        );
    } catch (error) {
        console.error("❌ Error updating courses:", error);
        console.error(error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

updateCourseCategories();
