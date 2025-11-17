/**
 * Force Fix: Remove applicationNumber from draft
 */

require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/env");

(async () => {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected");

        // Get the collection directly (bypass model validation)
        const collection = mongoose.connection.collection("classapplications");

        // Find all drafts
        const drafts = await collection.find({ status: "draft" }).toArray();
        console.log(`\nFound ${drafts.length} draft(s):`);
        drafts.forEach(draft => {
            console.log(`  ID: ${draft._id}, AppNum: ${draft.applicationNumber}`);
        });

        // Force set applicationNumber to null for ALL drafts
        const result = await collection.updateMany(
            { status: "draft" },
            { $set: { applicationNumber: null } }
        );

        console.log(`\n✅ Updated ${result.modifiedCount} draft(s)`);

        // Verify
        const afterFix = await collection.find({ status: "draft" }).toArray();
        console.log(`\nAfter fix:`);
        afterFix.forEach(draft => {
            console.log(`  ID: ${draft._id}, AppNum: ${draft.applicationNumber}`);
        });

        await mongoose.disconnect();
        console.log("\n✅ Done!\n");
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
})();

