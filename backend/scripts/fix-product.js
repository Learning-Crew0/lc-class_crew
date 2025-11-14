const mongoose = require("mongoose");
const config = require("../src/config/env");
const Product = require("../src/models/product.model");

/**
 * Check and fix specific product
 */

const PRODUCT_ID = "6916da7e9bfad7ab45cfe619";

async function fixProduct() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        console.log(`🔍 Checking product: ${PRODUCT_ID}\n`);

        // Find the product
        const product = await Product.findById(PRODUCT_ID);

        if (!product) {
            console.log("❌ Product not found!");
            console.log(`   Product ID: ${PRODUCT_ID}`);
            console.log("\n💡 This product doesn't exist in the database.");
            return;
        }

        console.log("📦 Product Found:");
        console.log(`   Name: ${product.name}`);
        console.log(`   Category: ${product.category.title}`);
        console.log(`   Base Cost: ${product.baseCost}`);
        console.log(`   Final Price: ${product.finalPrice}`);
        console.log(`   Is Active: ${product.isActive}`);
        console.log(`   Available Quantity: ${product.availableQuantity}`);
        console.log(`   Images: ${product.images.length}`);
        console.log();

        // Check if product has issues
        const issues = [];
        
        if (!product.isActive) {
            issues.push("❌ Product is NOT active (isActive: false)");
        }
        
        if (product.availableQuantity <= 0) {
            issues.push(`❌ Product out of stock (availableQuantity: ${product.availableQuantity})`);
        }

        if (issues.length === 0) {
            console.log("✅ Product is healthy!");
            console.log("   - isActive: true ✓");
            console.log("   - availableQuantity: " + product.availableQuantity + " ✓");
            console.log("\nNo fixes needed! Product is ready for cart.");
            return;
        }

        // Product has issues, show them
        console.log("⚠️  Issues Found:");
        issues.forEach(issue => console.log(`   ${issue}`));
        console.log();

        // Fix the product
        console.log("🔧 Fixing product...");
        
        const updates = {};
        
        if (!product.isActive) {
            updates.isActive = true;
            console.log("   → Setting isActive to true");
        }
        
        if (product.availableQuantity <= 0) {
            updates.availableQuantity = 10;
            console.log("   → Setting availableQuantity to 10");
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            PRODUCT_ID,
            { $set: updates },
            { new: true, runValidators: true }
        );

        console.log("\n✅ Product fixed successfully!");
        console.log(`   Is Active: ${updatedProduct.isActive}`);
        console.log(`   Available Quantity: ${updatedProduct.availableQuantity}`);
        console.log("\n🎉 Product is now ready to be added to cart!");

    } catch (error) {
        console.error("❌ Error:", error.message);
        if (error.name === "CastError") {
            console.log("\n💡 Invalid Product ID format. Please check the ID.");
        }
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the fix
console.log("🔧 Product Fix Tool\n");
console.log("=".repeat(60));
fixProduct();

