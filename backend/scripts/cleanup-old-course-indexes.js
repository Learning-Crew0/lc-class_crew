/**
 * Clean up old indexes from courses collection
 * Run this to remove:
 * - title unique constraint (courses can have duplicate titles)
 * - isPublished index (field no longer exists in model)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../src/config/logger");

const cleanupIndexes = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/classcrew";
        
        logger.info("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        
        logger.info("Connected to MongoDB");
        
        const db = mongoose.connection.db;
        const coursesCollection = db.collection("courses");
        
        logger.info("Current indexes:");
        const indexes = await coursesCollection.indexes();
        console.log(JSON.stringify(indexes, null, 2));
        
        // Drop title unique constraint (allow duplicate titles)
        try {
            logger.info("\n⚠️  Dropping title unique index (to allow duplicate titles)...");
            await coursesCollection.dropIndex("title_1");
            logger.info("✅ Successfully dropped title unique index");
        } catch (err) {
            if (err.code === 27) {
                logger.info("❌ Title index not found");
            } else {
                logger.error("Error:", err.message);
            }
        }
        
        // Drop old isPublished index
        try {
            logger.info("\n🧹 Dropping old isPublished index...");
            await coursesCollection.dropIndex("isPublished_1");
            logger.info("✅ Successfully dropped isPublished index");
        } catch (err) {
            if (err.code === 27) {
                logger.info("❌ isPublished index not found");
            } else {
                logger.error("Error:", err.message);
            }
        }
        
        logger.info("\nFinal indexes:");
        const finalIndexes = await coursesCollection.indexes();
        console.log(JSON.stringify(finalIndexes, null, 2));
        
        logger.info("\n✅ Cleanup completed");
        
    } catch (error) {
        logger.error("Error during cleanup:", error);
        throw error;
    } finally {
        await mongoose.disconnect();
    }
};

cleanupIndexes()
    .then(() => {
        console.log("\n✅ Done!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Failed:", error);
        process.exit(1);
    });

