require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/env");

(async () => {
    await mongoose.connect(config.mongodb.uri);
    
    const collection = mongoose.connection.collection("classapplications");

    console.log("\nTest 1: Insert with null...");
    try {
        await collection.insertOne({
            user: new mongoose.Types.ObjectId(),
            status: "draft",
            applicationNumber: null,  // Explicit null
            courses: [],
            paymentInfo: { totalAmount: 111 },
            createdAt: new Date()
        });
        console.log("✅ null insert succeeded");
    } catch (err) {
        console.log("❌ null insert failed:", err.message);
    }

    console.log("\nTest 2: Insert WITHOUT applicationNumber field...");
    try {
        await collection.insertOne({
            user: new mongoose.Types.ObjectId(),
            status: "draft",
            // applicationNumber: omitted entirely
            courses: [],
            paymentInfo: { totalAmount: 222 },
            createdAt: new Date()
        });
        console.log("✅ omitted field insert succeeded");
    } catch (err) {
        console.log("❌ omitted field insert failed:", err.message);
    }

    console.log("\nTest 3: Another insert WITHOUT applicationNumber field...");
    try {
        await collection.insertOne({
            user: new mongoose.Types.ObjectId(),
            status: "draft",
            // applicationNumber: omitted entirely
            courses: [],
            paymentInfo: { totalAmount: 333 },
            createdAt: new Date()
        });
        console.log("✅ second omitted field insert succeeded");
    } catch (err) {
        console.log("❌ second omitted field insert failed:", err.message);
    }

    // Cleanup
    console.log("\nCleaning up...");
    await collection.deleteMany({
        paymentInfo: { $in: [{ totalAmount: 111 }, { totalAmount: 222 }, { totalAmount: 333 }] }
    });
    console.log("✅ Cleaned up\n");

    await mongoose.disconnect();
})();

