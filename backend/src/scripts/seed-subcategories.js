/**
 * Migration Script: Seed Subcategories
 *
 * This script populates the database with initial subcategories
 * for each main category.
 *
 * Run: node src/scripts/seed-subcategories.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/category.model");
const Subcategory = require("../models/subcategory.model");

const subcategoriesData = {
    "리더십/직급/계층": ["리더십/팔로워십", "코칭"],
    "비즈니스 스킬": [
        "커뮤니케이션/협업",
        "전략/기획",
        "업무 생산성",
        "문서작성/프레젠테이션",
        "전문 직무",
    ],
    DX: ["데이터 리터러시", "AI 리터러시"],
    "라이프/커리어": ["자기관리", "재테크"],
    스페셜: ["TRIP ON(필드트립)", "INSIGHT ON"],
};

async function seedSubcategories() {
    try {
        console.log("🔄 Starting subcategories seeding...");

        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to database");

        // Clear existing subcategories
        const deleteResult = await Subcategory.deleteMany({});
        console.log(
            `🗑️  Cleared ${deleteResult.deletedCount} existing subcategories`
        );

        let totalCreated = 0;
        const createdSubcategories = [];

        for (const [categoryName, subcategories] of Object.entries(
            subcategoriesData
        )) {
            // Find category by name
            const category = await Category.findOne({ title: categoryName });

            if (!category) {
                console.log(`⚠️  Category not found: ${categoryName}`);
                continue;
            }

            console.log(`\n📁 Creating subcategories for: ${categoryName}`);

            for (let i = 0; i < subcategories.length; i++) {
                const subcategoryName = subcategories[i];

                // Create slug from name
                const slug = subcategoryName
                    .toLowerCase()
                    .replace(/\//g, "-")
                    .replace(/\(/g, "")
                    .replace(/\)/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/[^\w\-가-힣]/g, "");

                const subcategory = await Subcategory.create({
                    name: subcategoryName,
                    slug: slug,
                    category: category._id,
                    order: i,
                    isActive: true,
                });

                console.log(`  ✅ Created: ${subcategoryName} (${slug})`);
                totalCreated++;
                createdSubcategories.push({
                    name: subcategoryName,
                    slug: slug,
                    category: categoryName,
                });
            }
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`📊 Total subcategories created: ${totalCreated}`);

        // Display summary
        console.log("\n📋 Summary by Category:");
        for (const [categoryName, subcategories] of Object.entries(
            subcategoriesData
        )) {
            console.log(`  ${categoryName}: ${subcategories.length} subcategories`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

seedSubcategories();
