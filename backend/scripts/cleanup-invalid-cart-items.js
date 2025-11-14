/**
 * Script to clean up invalid cart items (NULL course/product references)
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Cart = require("../src/models/cart.model");
const Course = require("../src/models/course.model");
const Product = require("../src/models/product.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");
const config = require("../src/config/env");

async function cleanupInvalidCartItems() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        const carts = await Cart.find()
            .populate("items.course")
            .populate("items.product")
            .populate("user", "email fullName");

        console.log(`📦 Found ${carts.length} carts to check\n`);

        let totalItemsRemoved = 0;

        for (const cart of carts) {
            const originalCount = cart.items.length;
            let removedCount = 0;

            // Filter out invalid items
            const validItems = cart.items.filter(item => {
                if (item.itemType === "course") {
                    if (!item.course) {
                        console.log(`   ❌ Removing course item with NULL course (${item._id})`);
                        removedCount++;
                        return false;
                    }
                    return true;
                } else if (item.itemType === "product") {
                    if (!item.product) {
                        console.log(`   ❌ Removing product item with NULL product (${item._id})`);
                        removedCount++;
                        return false;
                    }
                    return true;
                }
                return true;
            });

            if (removedCount > 0) {
                console.log(`\n👤 User: ${cart.user.fullName || cart.user.email}`);
                console.log(`   Cart ID: ${cart._id}`);
                console.log(`   Removed ${removedCount} invalid items`);
                console.log(`   Items: ${originalCount} → ${validItems.length}\n`);

                cart.items = validItems;
                await cart.save();
                totalItemsRemoved += removedCount;
            }
        }

        console.log(`\n✅ Cleanup complete!`);
        console.log(`📊 Total invalid items removed: ${totalItemsRemoved}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

cleanupInvalidCartItems();

