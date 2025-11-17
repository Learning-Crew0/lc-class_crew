require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/env");

(async () => {
    await mongoose.connect(config.mongodb.uri);
    
    const collection = mongoose.connection.collection("classapplications");

    console.log("\n🧹 Cleaning up drafts with null applicationNumber...\n");

    // Delete drafts that have explicit null
    const result = await collection.deleteMany({
        status: "draft",
        applicationNumber: null
    });

    console.log(`✅ Deleted ${result.deletedCount} draft(s) with null applicationNumber\n`);

    await mongoose.disconnect();
})();

