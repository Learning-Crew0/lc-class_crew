/**
 * Test script to check FAQ data in database
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const FAQ = require("../src/models/faq.model");
const FAQCategory = require("../src/models/faqCategory.model");
const config = require("../src/config/env");

async function testFAQData() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // Test 1: Total FAQs
        console.log("=" .repeat(60));
        console.log("TEST 1: Total FAQs in Database");
        console.log("=".repeat(60));
        
        const totalFAQs = await FAQ.countDocuments();
        console.log(`📊 Total FAQs: ${totalFAQs}`);

        // Test 2: Active FAQs
        console.log("\n" + "=".repeat(60));
        console.log("TEST 2: Active FAQs");
        console.log("=".repeat(60));
        
        const activeFAQs = await FAQ.countDocuments({ isActive: true });
        console.log(`✅ Active FAQs: ${activeFAQs}`);
        console.log(`❌ Inactive FAQs: ${totalFAQs - activeFAQs}`);

        // Test 3: Categories
        console.log("\n" + "=".repeat(60));
        console.log("TEST 3: FAQ Categories");
        console.log("=".repeat(60));
        
        const categories = await FAQ.distinct("category");
        console.log(`📁 Unique categories (${categories.length}):`);
        categories.forEach((cat, idx) => {
            console.log(`   ${idx + 1}. ${cat}`);
        });

        // Test 4: Sample FAQs
        console.log("\n" + "=".repeat(60));
        console.log("TEST 4: Sample Active FAQs (First 5)");
        console.log("=".repeat(60));
        
        const sampleFAQs = await FAQ.find({ isActive: true })
            .limit(5)
            .select("question answer category order isActive")
            .sort({ order: 1, createdAt: -1 });

        if (sampleFAQs.length === 0) {
            console.log("⚠️  No active FAQs found!");
        } else {
            sampleFAQs.forEach((faq, idx) => {
                console.log(`\n${idx + 1}. ${faq.question}`);
                console.log(`   Category: ${faq.category}`);
                console.log(`   Order: ${faq.order}`);
                console.log(`   Active: ${faq.isActive}`);
                console.log(`   Answer: ${faq.answer.substring(0, 100)}...`);
            });
        }

        // Test 5: FAQ Categories Collection
        console.log("\n" + "=".repeat(60));
        console.log("TEST 5: FAQ Category Collection");
        console.log("=".repeat(60));
        
        const faqCategories = await FAQCategory.find({ isActive: true })
            .select("name slug description order isActive");

        console.log(`📂 Active FAQ Categories: ${faqCategories.length}`);
        if (faqCategories.length > 0) {
            faqCategories.forEach((cat, idx) => {
                console.log(`\n   ${idx + 1}. ${cat.name}`);
                console.log(`      Slug: ${cat.slug}`);
                console.log(`      Order: ${cat.order}`);
            });
        } else {
            console.log("⚠️  No FAQ categories found!");
        }

        // Test 6: FAQs per category
        console.log("\n" + "=".repeat(60));
        console.log("TEST 6: FAQs Count per Category");
        console.log("=".repeat(60));
        
        for (const category of categories) {
            const count = await FAQ.countDocuments({ 
                category: category, 
                isActive: true 
            });
            console.log(`   ${category}: ${count} FAQs`);
        }

        // Summary
        console.log("\n" + "=".repeat(60));
        console.log("SUMMARY");
        console.log("=".repeat(60));
        console.log(`✅ Total FAQs: ${totalFAQs}`);
        console.log(`✅ Active FAQs: ${activeFAQs}`);
        console.log(`✅ Categories: ${categories.length}`);
        console.log(`✅ FAQ Categories Collection: ${faqCategories.length}`);

        if (totalFAQs === 0) {
            console.log("\n⚠️  WARNING: No FAQs in database!");
            console.log("   Please create FAQs from admin panel first.");
        } else if (activeFAQs === 0) {
            console.log("\n⚠️  WARNING: No active FAQs!");
            console.log("   All FAQs are inactive. Please activate them from admin panel.");
        } else {
            console.log("\n✅ Database has FAQ data. Ready to test API endpoints.");
        }

    } catch (error) {
        console.error("\n❌ Error during testing:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

testFAQData();


