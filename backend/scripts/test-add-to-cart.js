require("dotenv").config();
const mongoose = require("mongoose");
const cartService = require("../src/services/cart.service");
const User = require("../src/models/user.model");

const testAddToCart = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB\n");
        
        // Find a user
        const user = await User.findOne();
        if (!user) {
            console.log("❌ No users found. Create a user first.");
            return;
        }
        
        console.log(`Testing with user: ${user.email} (${user._id})\n`);
        
        const courseId = "69114efbf08d1ee3696f0ecc";
        const scheduleId = "691152b72f7eb75e6e6ef753";
        
        console.log(`Adding course ${courseId} with schedule ${scheduleId} to cart...\n`);
        
        try {
            const cart = await cartService.addCourseToCart(user._id.toString(), courseId, scheduleId);
            console.log("✅ SUCCESS! Course added to cart:");
            console.log(JSON.stringify(cart, null, 2));
        } catch (error) {
            console.log("❌ FAILED:");
            console.log(error.message);
            console.log(error.stack);
        }
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

testAddToCart();

