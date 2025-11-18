/**
 * Diagnose product search issue
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../src/models/product.model");
const config = require("../src/config/env");

(async () => {
    console.log("\n🔍 Diagnosing Product Search Issue...\n");
    
    await mongoose.connect(config.mongodb.uri);
    console.log("✅ Connected to:", config.mongodb.uri.split("@")[1]?.split("/")[0] || "MongoDB");
    console.log();

    // Check total products
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    
    console.log(`📊 Total products: ${totalProducts}`);
    console.log(`📊 Active products: ${activeProducts}\n`);

    if (totalProducts === 0) {
        console.log("❌ NO PRODUCTS in database!\n");
        await mongoose.disconnect();
        return;
    }

    // Show some product names
    console.log("━━━ Sample Product Names ━━━\n");
    const sampleProducts = await Product.find()
        .select("name description isActive")
        .limit(10)
        .lean();
    
    sampleProducts.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (${p.isActive ? 'Active' : 'Inactive'})`);
        console.log(`   Description: ${p.description?.substring(0, 50)}...`);
    });
    console.log();

    // Test text search with different queries
    console.log("━━━ Testing Text Search ━━━\n");
    
    const searchQueries = ["course", "리더", "프로그램", "교육", "management"];
    
    for (const query of searchQueries) {
        // Test with text search
        const textResults = await Product.find({
            $text: { $search: query },
            isActive: true
        }).countDocuments();
        
        // Test with regex (case-insensitive)
        const regexResults = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ],
            isActive: true
        }).countDocuments();
        
        console.log(`Query: "${query}"`);
        console.log(`  Text search: ${textResults} results`);
        console.log(`  Regex search: ${regexResults} results`);
    }
    console.log();

    // Check indexes
    console.log("━━━ Checking Indexes ━━━\n");
    const indexes = await Product.collection.getIndexes();
    console.log("Indexes:");
    Object.keys(indexes).forEach(indexName => {
        console.log(`  - ${indexName}:`, JSON.stringify(indexes[indexName]));
    });
    console.log();

    // Check if products have the expected fields
    console.log("━━━ Field Analysis ━━━\n");
    const productsWithNoName = await Product.countDocuments({ 
        $or: [{ name: null }, { name: "" }, { name: { $exists: false } }]
    });
    const productsWithNoDesc = await Product.countDocuments({ 
        $or: [{ description: null }, { description: "" }, { description: { $exists: false } }]
    });
    
    console.log(`Products without name: ${productsWithNoName}`);
    console.log(`Products without description: ${productsWithNoDesc}\n`);

    // Try the exact query from the frontend
    console.log("━━━ Testing Frontend Query ━━━\n");
    console.log('Query: { $text: { $search: "course" }, isActive: true }\n');
    
    const frontendResults = await Product.find({
        $text: { $search: "course" },
        isActive: true
    }).lean();
    
    console.log(`Results: ${frontendResults.length} products\n`);
    
    if (frontendResults.length > 0) {
        console.log("Sample results:");
        frontendResults.slice(0, 3).forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name}`);
        });
    }

    await mongoose.disconnect();
    console.log("\n✅ Diagnosis complete!\n");
})();

