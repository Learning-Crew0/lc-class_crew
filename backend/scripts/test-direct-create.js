require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/env");

(async () => {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected\n");

        const collection = mongoose.connection.collection("classapplications");

        // Try to insert 2 drafts with NULL applicationNumber
        console.log("Test 1: Insert first draft with null applicationNumber...");
        try {
            const doc1 = await collection.insertOne({
                user: new mongoose.Types.ObjectId("69129e85ee7874b97e63119b"), // Karan
                status: "draft",
                applicationNumber: null,
                courses: [],
                paymentInfo: { totalAmount: 0, paymentStatus: "pending" },
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log("✅ Success! ID:", doc1.insertedId, "\n");
        } catch (err) {
            console.log("❌ Failed:", err.message, "\n");
        }

        console.log("Test 2: Insert second draft with null applicationNumber...");
        try {
            const doc2 = await collection.insertOne({
                user: new mongoose.Types.ObjectId("691aebe8962da064edc9cb18"), // Ishant
                status: "draft",
                applicationNumber: null,
                courses: [],
                paymentInfo: { totalAmount: 0, paymentStatus: "pending" },
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log("✅ Success! ID:", doc2.insertedId, "\n");
        } catch (err) {
            console.log("❌ Failed:", err.message, "\n");
        }

        // Cleanup
        console.log("Cleaning up test documents...");
        await collection.deleteMany({
            user: { $in: [
                new mongoose.Types.ObjectId("69129e85ee7874b97e63119b"),
                new mongoose.Types.ObjectId("691aebe8962da064edc9cb18")
            ]},
            status: "draft"
        });
        console.log("✅ Cleaned up\n");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
})();


