/**
 * Script to seed the 5 main course categories
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../src/models/category.model");
const { CATEGORIES } = require("../src/constants/categories");

const categoryData = [
    {
        title: "리더십/직급/계층",
        description: "Leadership, Position, and Level Development Programs",
        level: 1,
        order: 1,
        isActive: true,
    },
    {
        title: "비즈니스 스킬",
        description: "Business Skills and Professional Development",
        level: 1,
        order: 2,
        isActive: true,
    },
    {
        title: "DX",
        description: "Digital Transformation and Technology",
        level: 1,
        order: 3,
        isActive: true,
    },
    {
        title: "라이프/커리어",
        description: "Life Skills and Career Development",
        level: 1,
        order: 4,
        isActive: true,
    },
    {
        title: "스페셜",
        description: "Special Programs and Workshops",
        level: 1,
        order: 5,
        isActive: true,
    },
];

async function seedCategories() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        console.log("📋 Checking existing categories...");
        const existingCategories = await Category.find();
        console.log(
            `   Found ${existingCategories.length} existing categories\n`
        );

        if (existingCategories.length > 0) {
            console.log("   Existing categories:");
            existingCategories.forEach((cat) =>
                console.log(`     - ${cat.title} (${cat._id})`)
            );
            console.log("\n⚠️  Categories already exist. Skipping seed.");
            console.log("   To reseed, delete existing categories first.\n");
            return;
        }

        console.log("📝 Seeding 5 main categories...\n");

        for (const catData of categoryData) {
            const category = await Category.create(catData);
            console.log(`✅ Created: ${category.title}`);
            console.log(`   - ID: ${category._id}`);
            console.log(`   - Order: ${category.order}`);
            console.log(`   - Description: ${category.description}`);
            console.log("");
        }

        console.log("🎉 Successfully seeded 5 categories!");
        console.log("\n📋 Summary:");
        console.log("   1. 리더십/직급/계층");
        console.log("   2. 비즈니스 스킬");
        console.log("   3. DX");
        console.log("   4. 라이프/커리어");
        console.log("   5. 스페셜");
        console.log(
            "\n💡 You can now use these categories when creating courses!"
        );
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
        console.error(error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

seedCategories();
