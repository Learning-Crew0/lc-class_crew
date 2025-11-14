/**
 * Debug script to check cart contents
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Cart = require("../src/models/cart.model");
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const TrainingSchedule = require("../src/models/trainingSchedule.model");
const Product = require("../src/models/product.model");
const config = require("../src/config/env");

async function debugCart() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB\n");

        // Get test user
        const user = await User.findOne().select("email fullName");
        console.log(`👤 User: ${user.fullName} (${user.email})`);
        console.log(`   ID: ${user._id}\n`);

        // Get cart
        const cart = await Cart.findOne({ user: user._id })
            .populate("items.course")
            .populate("items.courseSchedule")
            .populate("items.product");

        if (!cart) {
            console.log("❌ No cart found for user");
            return;
        }

        console.log(`📦 Cart Details:`);
        console.log(`   Cart ID: ${cart._id}`);
        console.log(`   Total Items: ${cart.items.length}\n`);

        console.log(`📋 Cart Items:`);
        cart.items.forEach((item, index) => {
            console.log(`\n   ${index + 1}. Type: ${item.itemType}`);
            console.log(`      ID: ${item._id}`);
            
            if (item.itemType === "course") {
                console.log(`      Course: ${item.course ? item.course._id : 'NULL'}`);
                console.log(`      Course Name: ${item.course ? item.course.title : 'NULL'}`);
                console.log(`      Schedule: ${item.courseSchedule ? item.courseSchedule._id : 'NULL'}`);
            } else if (item.itemType === "product") {
                console.log(`      Product: ${item.product ? item.product._id : 'NULL'}`);
                console.log(`      Product Name: ${item.product ? item.product.name : 'NULL'}`);
                console.log(`      Quantity: ${item.quantity}`);
            }
        });

        // Check for null references
        const nullCourses = cart.items.filter(item => item.itemType === "course" && !item.course);
        const nullSchedules = cart.items.filter(item => item.itemType === "course" && !item.courseSchedule);
        
        if (nullCourses.length > 0) {
            console.log(`\n⚠️  WARNING: ${nullCourses.length} course items have NULL course reference`);
        }
        
        if (nullSchedules.length > 0) {
            console.log(`⚠️  WARNING: ${nullSchedules.length} course items have NULL schedule reference`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

debugCart();

