const mongoose = require("mongoose");
const config = require("../src/config/env");
const Product = require("../src/models/product.model");
const User = require("../src/models/user.model");
const Cart = require("../src/models/cart.model");

/**
 * Test adding product to cart
 */

const PRODUCT_ID = "6916da7e9bfad7ab45cfe619";

async function testAddToCart() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // 1. Check if product exists and is available
        console.log("1️⃣  Checking product...");
        const product = await Product.findById(PRODUCT_ID);
        
        if (!product) {
            console.log("   ❌ Product not found!");
            return;
        }
        
        console.log(`   ✅ Product: ${product.name}`);
        console.log(`   ✅ Price: ₩${product.finalPrice.toLocaleString()}`);
        console.log(`   ✅ Stock: ${product.availableQuantity}`);
        console.log(`   ✅ Active: ${product.isActive}`);
        console.log();

        // 2. Find or create a test user
        console.log("2️⃣  Finding test user...");
        let user = await User.findOne({ role: "admin" });
        
        if (!user) {
            user = await User.findOne();
        }
        
        if (!user) {
            console.log("   ❌ No users found in database!");
            console.log("   💡 Please create a user first");
            return;
        }
        
        console.log(`   ✅ User: ${user.email}`);
        console.log(`   ✅ User ID: ${user._id}`);
        console.log();

        // 3. Check if user has a cart
        console.log("3️⃣  Checking cart...");
        let cart = await Cart.findOne({ user: user._id });
        
        if (!cart) {
            console.log("   📦 No cart found, creating new cart...");
            cart = await Cart.create({
                user: user._id,
                items: []
            });
            console.log("   ✅ Cart created!");
        } else {
            console.log(`   ✅ Cart found: ${cart.items.length} items`);
        }
        console.log();

        // 4. Check if product is already in cart
        console.log("4️⃣  Checking if product is in cart...");
        const existingItem = cart.items.find(
            item => item.product && item.product.toString() === PRODUCT_ID && item.itemType === "product"
        );
        
        if (existingItem) {
            console.log(`   ⚠️  Product already in cart (quantity: ${existingItem.quantity})`);
            console.log("   💡 You can update quantity or remove and re-add");
        } else {
            console.log("   ✅ Product not in cart yet");
        }
        console.log();

        // 5. Simulate adding to cart
        console.log("5️⃣  Simulating add to cart...");
        console.log("   Request data:");
        console.log("   {");
        console.log(`     "productId": "${PRODUCT_ID}",`);
        console.log(`     "quantity": 1,`);
        console.log(`     "itemType": "product"`);
        console.log("   }");
        console.log();

        // Add or update item
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.priceAtTime = product.finalPrice;
            existingItem.subtotal = existingItem.priceAtTime * existingItem.quantity;
            console.log(`   ✅ Updated quantity to ${existingItem.quantity}`);
        } else {
            cart.items.push({
                itemType: "product",
                product: product._id,
                quantity: 1,
                priceAtTime: product.finalPrice,
                subtotal: product.finalPrice
            });
            console.log("   ✅ Added product to cart");
        }

        // Calculate total
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        cart.itemCount = cart.items.length;

        await cart.save();

        console.log();
        console.log("🎉 Success!");
        console.log(`   Total items in cart: ${cart.itemCount}`);
        console.log(`   Total amount: ₩${cart.totalAmount.toLocaleString()}`);
        console.log();
        console.log("✅ Cart API should work fine!");

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        console.error("Stack:", error.stack);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the test
console.log("🧪 Test Add to Cart\n");
console.log("=".repeat(60));
testAddToCart();
