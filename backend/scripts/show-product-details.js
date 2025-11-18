/**
 * Show full product details
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../src/models/product.model");
const config = require("../src/config/env");

(async () => {
    await mongoose.connect(config.mongodb.uri);
    
    const products = await Product.find().lean();
    
    console.log("\n━━━ All Products in Production ━━━\n");
    
    products.forEach((p, i) => {
        console.log(`Product ${i + 1}:`);
        console.log(`  ID: ${p._id}`);
        console.log(`  Name: "${p.name}"`);
        console.log(`  Description: "${p.description}"`);
        console.log(`  Category: ${p.category?.title || 'N/A'}`);
        console.log(`  Price: ${p.finalPrice}`);
        console.log(`  Active: ${p.isActive}`);
        console.log();
    });
    
    console.log(`\n💡 To get results for "course", the product name or description needs to contain that word.\n`);
    console.log(`Suggested searches based on existing products:`);
    products.forEach(p => {
        const words = (p.name + ' ' + p.description)
            .toLowerCase()
            .split(/\s+/)
            .filter(w => w.length > 3);
        const uniqueWords = [...new Set(words)].slice(0, 5);
        console.log(`  - Try: ${uniqueWords.join(', ')}`);
    });
    console.log();
    
    await mongoose.disconnect();
})();

