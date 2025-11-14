/**
 * Script to clean up duplicate draft applications
 * Keeps only the most recent draft per user
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const ClassApplication = require("../src/models/classApplication.model");
const config = require("../src/config/env");

async function cleanupDuplicateDrafts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to MongoDB");

        // Find all users with multiple draft applications
        const duplicates = await ClassApplication.aggregate([
            {
                $match: { status: "draft" }
            },
            {
                $group: {
                    _id: "$user",
                    count: { $sum: 1 },
                    drafts: { $push: { id: "$_id", createdAt: "$createdAt" } }
                }
            },
            {
                $match: { count: { $gt: 1 } }
            }
        ]);

        console.log(`\n📊 Found ${duplicates.length} users with duplicate drafts`);

        let totalDeleted = 0;

        for (const user of duplicates) {
            console.log(`\n👤 User ${user._id} has ${user.count} drafts`);
            
            // Sort by createdAt descending to keep the most recent
            const sortedDrafts = user.drafts.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            // Keep the first (most recent), delete the rest
            const toDelete = sortedDrafts.slice(1).map(d => d.id);

            console.log(`  🗑️  Deleting ${toDelete.length} old drafts...`);

            const result = await ClassApplication.deleteMany({
                _id: { $in: toDelete }
            });

            totalDeleted += result.deletedCount;
            console.log(`  ✅ Deleted ${result.deletedCount} drafts`);
        }

        console.log(`\n✅ Cleanup complete!`);
        console.log(`📊 Total drafts deleted: ${totalDeleted}`);

    } catch (error) {
        console.error("❌ Error during cleanup:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

// Run the cleanup
cleanupDuplicateDrafts();

