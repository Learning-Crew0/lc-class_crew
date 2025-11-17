require("dotenv").config();
const mongoose = require("mongoose");
const ClassApplication = require("../src/models/classApplication.model");
const config = require("../src/config/env");

(async () => {
    await mongoose.connect(config.mongodb.uri);
    
    console.log("\n🧹 Cleaning up test data for Ishant & Karan...\n");

    const result = await ClassApplication.deleteMany({
        user: { $in: [
            "69129e85ee7874b97e63119b", // Karan
            "691aebe8962da064edc9cb18"  // Ishant
        ]},
        status: "draft"
    });

    console.log(`✅ Deleted ${result.deletedCount} test draft(s)\n`);

    await mongoose.disconnect();
})();

